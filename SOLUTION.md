# SOLUTION.md

## Instructions for Building and Running the Application:
This document outlines the steps to set up and run the application, provides sample API calls for testing, and highlights the security measures taken to ensure the system's integrity and confidentiality.

### Prerequisites
Ensure you have Docker and Docker Compose installed.

It looks like the **required Node.js packages** and the instruction to run `npm install` to download the necessary dependencies were not explicitly mentioned in the `SOLUTION.md` file. You should include these details to ensure that users setting up the project are aware of the required packages.

Here’s a section you can add to the `SOLUTION.md` file:

-----------------------------------

### Dependencies and Setup

Before running the application, ensure you have all the required Node.js packages installed. These dependencies are necessary for the app to function properly:

**Required Packages**:
- `express`: For handling HTTP requests and routing.
- `body-parser`: Middleware to parse incoming request bodies.
- `dotenv`: For loading environment variables.
- `mysql2`: To handle MySQL database connections and queries.
- `joi`: For input validation.
- `helmet`: For securing HTTP headers.

**To install all dependencies**:

Run the following command in the project directory to install the required Node.js packages:

```bash
npm install
```
This will download and install all dependencies listed in the `package.json` file.


### Steps to Build and Run the Application:
1. **Clone the Repository**
   Clone this repository or download the project to your local machine.

2. **Set Up Secrets**
   Create the following secret files to store your MySQL root and user passwords:
   - `secrets/mysql_root_password.txt`: This file should contain the MySQL root password.
   - `secrets/mysql_password.txt`: This file should contain the password for the MySQL user (`app_user`).

3. **Build and Start Containers**
**(Option 1: To Operate on IDE)**
   Navigate to the root of your project and run:
   ```bash
   docker-compose up -d
   ```
   This will:
   - Build the Node.js app in a Docker container.
   - Start a MySQL container with an initialized database (`releases_db`).

   **Note:** The application will wait for MySQL to be fully initialized by introducing a 40-second delay. Here you can run your `powershell` commnads on the VSCODE terminal to use the application.

-----------------------------

**(Option 1: To Operate on IDE)**
   Navigate to the root of your project and run:
   ```bash
   docker-compose up
   ```
   This will:
   - Build the Node.js app in a Docker container.
   - Start a MySQL container with an initialized database (`releases_db`).

   **Note:** The application will wait for MySQL to be fully initialized by introducing a 40-second delay. In this option you may use `curl` commands on your `Docker-CLI` to use the applcation.

4. **Verify the Containers are Running**
   After the containers have started, check the status:
   ```bash
   docker ps
   ```
   Ensure both `node_app` and `mysql_db` are listed and running.

5. **Access the Application**
   The Node.js application will be accessible on port `3000`.

-----------------------------------

## Sample CURL Commands for Testing API Endpoints (For further information on the commands used please refer to the txt file named "os-commands.txt")

### 1. **Create a Release**
   You can create a new release by sending a POST request:
   ```bash
   curl -X POST http://localhost:3000/release      -H 'x-api-key: <API_KEY>'      -H 'Content-Type: application/json'      -d '{"name": "app_one", "version": "1.0.0", "account": "staging", "region": "primary"}'
   ```

### 2. **List Releases**
   Retrieve a list of releases with pagination:
   ```bash
   curl -X GET "http://localhost:3000/releases?limit=5&offset=0"      -H 'x-api-key: <API_KEY>'
   ```

### 3. **Detect Drift**
   Detect drift in application versions across environments:
   ```bash
   curl -X GET http://localhost:3000/drift      -H 'x-api-key: <API_KEY>'
   ```

-----------------------------------

## Security Measures Applied

### 1. **Docker Secrets**
   - The MySQL root password and MySQL user password are securely stored using Docker secrets. These secrets are referenced in the `docker-compose.yml` file to ensure that sensitive information is not hardcoded into the environment variables or source code.

   **Files:**
   - `secrets/mysql_root_password.txt`
   - `secrets/mysql_password.txt`

### 2. **Environment Variables**
   - The API key and database credentials are stored in environment variables and referenced securely in the `.env` file. This protects the application from accidental exposure of sensitive credentials.

   **File:**
   - `.env`

### 3. **MySQL User with Limited Privileges**
   - The `app_user` MySQL user has only `SELECT`, `INSERT`, and `UPDATE` permissions on the `releases_db.releases` table. This user cannot perform destructive operations like `DROP` or `DELETE`, ensuring minimal privileges for enhanced security.

   **File:**
   - `mysql/init.sql`

### 4. **SQL Injection Prevention**
   - All user inputs for the `/release` and `/releases` endpoints are validated using the `Joi` schema validation library. This ensures that inputs are properly sanitized and constrained, minimizing the risk of SQL injection attacks.
   - The MySQL queries are parameterized, which prevents SQL injection by avoiding dynamic query building.

   **Files:**
   - `src/models/CreateRelease.js`
   - `src/models/ListReleases.js`

### 5. **API Key Authentication**
   - API key-based authentication is implemented to secure the `/release`, `/releases`, and `/drift` routes. The API key is verified from the `x-api-key` header and is compared with the value stored in the `.env` file.

   **Files:**
   - `src/main.js`
   - `.env`

### 6. **Non-root Docker User**
   - The Node.js app is run under a non-root user within the Docker container to reduce the attack surface.

   **File:**
   - `Dockerfile`

### 7. **MySQL Container Security**
   - Root access is disabled for any host other than `localhost`, preventing remote root login.
   - The MySQL container runs with restricted network access, only allowing connections from the app via the Docker network.

   **File:**
   - `mysql/init.sql`

### 8. **Docker Image**
   - The Alpine image was selected due to its small attack surface making it harder for for malicious entities to abuse.
   - Due to the minimalist nature of the Alpine image, it reduces the potential attack vectors for security exploits.

   **Files:**
   - `Dockerfile`


