const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
    static async createSchema() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NULL,
            google_id VARCHAR(255) NULL,
            role ENUM('admin', 'coordinator', 'member') NOT NULL,
            status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
        
        try {
            await pool.query(query);
            console.log('Users table created successfully');
        } catch (error) {
            console.error('Error creating users table:', error);
            throw error;
        }
    }

    static async create(userData) {
        const { name, email, password, role = 'member', status = 'pending' } = userData;
        
        try {
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const [result] = await pool.query(
                `INSERT INTO users (name, email, password, role, status) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, role, status]
            );

            return { id: result.insertId, name, email, role, status };
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT id, name, email, role, status FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateRole(userId, newRole) {
        try {
            const [result] = await pool.query(
                'UPDATE users SET role = ? WHERE id = ?',
                [newRole, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(userId, status) {
        try {
            const [result] = await pool.query(
                'UPDATE users SET status = ? WHERE id = ?',
                [status, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getStats() {
        try {
            const [stats] = await pool.query(`
                SELECT 
                    COUNT(*) as total_members,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_members,
                    COUNT(CASE WHEN role = 'coordinator' THEN 1 END) as total_coordinators
                FROM users
            `);
            return stats[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByRole(role, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const [users] = await pool.query(
                `SELECT id, name, email, role, status, created_at 
                 FROM users 
                 WHERE role = ?
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?`,
                [role, limit, offset]
            );
            
            const [total] = await pool.query(
                'SELECT COUNT(*) as count FROM users WHERE role = ?',
                [role]
            );

            return {
                users,
                pagination: {
                    total: total[0].count,
                    page,
                    limit,
                    pages: Math.ceil(total[0].count / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            // Delete associated prayers first
            await connection.query('DELETE FROM prayers WHERE user_id = ?', [id]);
            
            // Delete user
            const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);

            // Delete associated events
            // await connection.query('DELETE FROM events WHERE user_id = ?', [id]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw error;
        } finally {
            connection.release();
        }
    }
}
module.exports = UserModel
