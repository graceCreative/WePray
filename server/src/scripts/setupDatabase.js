// src/scripts/setupDatabase.js
const pool = require('../config/database');

async function createDatabase() {
    try {
        // Create database if not exists
        await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await pool.query(`USE ${process.env.DB_NAME}`);
        
        // Create tables in the correct order (handling foreign key dependencies)
        
        // 1. Users table first (as it's referenced by other tables)
        // await pool.query(`
        //     CREATE TABLE IF NOT EXISTS users (
        //         id INT PRIMARY KEY AUTO_INCREMENT,
        //         name VARCHAR(255) NOT NULL,
        //         email VARCHAR(255) UNIQUE NOT NULL,
        //         password VARCHAR(255),
        //         google_id VARCHAR(255),
        //         profile_image VARCHAR(255),
        //         role ENUM('admin', 'coordinator', 'moderator', 'member') NOT NULL,
        //         status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        //     )
        // `);
        // console.log('Users table created successfully');

        // // 2. Prayers table (references users)
        // await pool.query(`
        //     CREATE TABLE IF NOT EXISTS prayers (
        //         id INT PRIMARY KEY AUTO_INCREMENT,
        //         user_id INT NOT NULL,
        //         subject VARCHAR(255) NOT NULL,
        //         message TEXT NOT NULL,
        //         status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        //         reviewed_by INT,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        //         FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
        //     )
        // `);
        // console.log('Prayers table created successfully');

        // // 3. Events table (references users for coordinator)
        // await pool.query(`
        //     CREATE TABLE IF NOT EXISTS events (
        //         id INT PRIMARY KEY AUTO_INCREMENT,
        //         title VARCHAR(255) NOT NULL,
        //         description TEXT,
        //         event_type ENUM('live_prayer', 'other') NOT NULL,
        //         coordinator_id INT NOT NULL,
        //         start_time DATETIME NOT NULL,
        //         end_time DATETIME NOT NULL,
        //         status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //         FOREIGN KEY (coordinator_id) REFERENCES users(id) ON DELETE CASCADE
        //     )
        // `);
        // console.log('Events table created successfully');

        // // Insert default admin user if not exists
        // // const hashedPassword = require('bcryptjs').hashSync('admin123', 10);
        // // await pool.query(`
        // //     INSERT IGNORE INTO users (name, email, password, role, status) 
        // //     VALUES (?, ?, ?, ?, ?)
        // // `, ['Admin User', 'admin@wepray.com', hashedPassword, 'admin', 'active']);
        // // console.log('Default admin user created (if not exists)');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
}

// Function to check database connection
async function checkConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Drop all tables (useful for reset)
async function dropAllTables() {
    try {
        // Drop tables in reverse order of creation (due to foreign keys)
        await pool.query('DROP TABLE IF EXISTS events');
        await pool.query('DROP TABLE IF EXISTS prayers');
        await pool.query('DROP TABLE IF EXISTS users');
        console.log('All tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
}

// Main setup function with options
async function setupDatabase(options = { reset: false }) {
    try {
        console.log('Starting database setup...');
        
        // Check connection
        const isConnected = await checkConnection();
        if (!isConnected) {
            console.error('Unable to connect to database. Check your credentials.');
            process.exit(1);
        }

        // Reset if requested
        if (options.reset) {
            console.log('Resetting database...');
            await dropAllTables();
        }

        // Create database and tables
        await createDatabase();
        
        console.log('Database setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
const options = {
    reset: args.includes('--reset')
};

// Run setup
setupDatabase(options);