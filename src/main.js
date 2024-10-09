const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');  // Import Helmet for security
const { exec } = require('child_process');  
const CreateRelease = require('./models/CreateRelease');
const ListReleases = require('./models/ListReleases');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Use Helmet to secure HTTP headers
app.use(helmet());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
};

const maxRetries = 10;  
let attempts = 0;
let errorCount = 0;  

// Function to restart the MySQL container
const restartMySQLContainer = () => {
    console.log('Restarting MySQL container...');
    exec('docker restart mysql_db', (err, stdout, stderr) => {
        if (err) {
            console.error('Failed to restart MySQL container:', err);
            return;
        }
        console.log('MySQL container restarted successfully:', stdout);
    });
};

// Function to connect with retry logic
const connectWithRetry = () => {
    const db = mysql.createConnection(dbConfig);
    db.connect((err) => {
        if (err) {
            attempts++;
            errorCount++;
            console.error(`Attempt ${attempts} failed. Retrying in 5 seconds...`, err);

            if (errorCount === 3) {
                console.error('Error occurred 3 times, restarting the MySQL container.');
                restartMySQLContainer();
                errorCount = 0;
            }

            if (attempts <= maxRetries) {
                setTimeout(connectWithRetry, 5000);  
            } else {
                console.error('Could not connect to the database after several attempts.');
                process.exit(1);  
            }
        } else {
            errorCount = 0;
            console.log('Connected to the MySQL database.');
            initializeRoutes(db);  
        }
    });

    return db;
};

const db = connectWithRetry();

// API key authentication middleware
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

// Route to create a new release
const createReleaseRoute = (db) => (req, res) => {
    let createRelease;

    try {
        createRelease = new CreateRelease(req.body);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    const query = 'INSERT INTO releases (name, version, account, region) VALUES (?, ?, ?, ?)';
    db.query(query, [createRelease.name, createRelease.version, createRelease.account, createRelease.region], (err, result) => {
        if (err) {
            console.error('Error inserting release:', err);
            return res.status(500).json({ error: 'Failed to create release.' });
        }
        res.status(201).json({ message: 'Release created successfully.', releaseId: result.insertId });
    });
};

// Route to get all releases with pagination
const listReleasesRoute = (db) => (req, res) => {
    let listReleases;

    try {
        listReleases = new ListReleases(req.query);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    const query = 'SELECT * FROM releases ORDER BY created_at DESC LIMIT ? OFFSET ?';
    db.query(query, [listReleases.limit, listReleases.offset], (err, results) => {
        if (err) {
            console.error('Error fetching releases:', err);
            return res.status(500).json({ error: 'Failed to fetch releases.' });
        }
        res.status(200).json(results);
    });
};

// Route to detect drift in application versions across environments
const detectDriftRoute = (db) => async (req, res) => {
    try {
        const [latestVersions] = await db.promise().query(`
            SELECT name, MAX(version) AS latest_version 
            FROM releases 
            GROUP BY name;
        `);

        const driftResults = await Promise.all(latestVersions.map(async (app) => {
            const [driftRecords] = await db.promise().query(`
                SELECT * FROM releases 
                WHERE name = ? AND version != ?
            `, [app.name, app.latest_version]);

            if (driftRecords.length > 0) {
                return {
                    [app.name]: {
                        latest: app.latest_version,
                        drift: driftRecords.reduce((acc, record) => {
                            if (!acc[record.account]) {
                                acc[record.account] = {};
                            }
                            acc[record.account][record.region] = record.version;
                            return acc;
                        }, {}),
                    }
                };
            }

            return null;
        }));

        res.status(200).json(driftResults.filter(result => result !== null));
    } catch (err) {
        console.error('Error detecting drift:', err);
        res.status(500).json({ error: 'Error detecting drift.' });
    }
};

// Initialize routes only after the database connection is established
const initializeRoutes = (db) => {
    // Inject dependencies into routes
    app.post('/release', apiKeyMiddleware, createReleaseRoute(db));
    app.get('/releases', apiKeyMiddleware, listReleasesRoute(db));
    app.get('/drift', apiKeyMiddleware, detectDriftRoute(db));
};

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
