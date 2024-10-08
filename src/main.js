const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const CreateRelease = require('./models/CreateRelease');
const ListReleases = require('./models/ListReleases');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// API key authentication middleware
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY; // Store API key in .env file

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
const detectDriftRoute = (db) => (req, res) => {
    const latestVersionsQuery = `
      SELECT name, MAX(version) AS latest_version 
      FROM releases 
      GROUP BY name;
    `;

    db.query(latestVersionsQuery, (err, latestVersions) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching latest versions.' });
        }

        const driftResults = [];

        latestVersions.forEach((app) => {
            const { name, latest_version } = app;

            const checkDriftQuery = `
              SELECT * FROM releases 
              WHERE name = ? AND version != ?
            `;

            db.query(checkDriftQuery, [name, latest_version], (err, driftRecords) => {
                if (err) {
                    return res.status(500).json({ error: 'Error checking for drift.' });
                }

                if (driftRecords.length > 0) {
                    driftResults.push({
                        [name]: {
                            latest: latest_version,
                            drift: driftRecords.reduce((acc, record) => {
                                if (!acc[record.account]) {
                                    acc[record.account] = {};
                                }
                                acc[record.account][record.region] = record.version;
                                return acc;
                            }, {}),
                        },
                    });
                }

                if (driftResults.length === latestVersions.length) {
                    return res.status(200).json(driftResults);
                }
            });
        });
    });
};

// Inject dependencies into routes
app.post('/release', apiKeyMiddleware, createReleaseRoute(db));
app.get('/releases', apiKeyMiddleware, listReleasesRoute(db));
app.get('/drift', apiKeyMiddleware, detectDriftRoute(db));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
