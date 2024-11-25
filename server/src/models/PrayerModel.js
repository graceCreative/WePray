const pool = require('../config/database');

class PrayerModel {
    static async createSchema() {
        const query = `
            CREATE TABLE IF NOT EXISTS prayers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                reviewed_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (reviewed_by) REFERENCES users(id)
            )
        `;

        try {
            await pool.query(query);
            console.log('Prayers table created successfully');
        } catch (error) {
            console.error('Error creating prayers table:', error);
            throw error;
        }
    }

    static async create(prayerData) {
        const { user_id, subject, message } = prayerData;
        
        try {
            const [result] = await pool.query(
                'INSERT INTO prayers (user_id, subject, message) VALUES (?, ?, ?)',
                [user_id, subject, message]
            );

            return { id: result.insertId, ...prayerData };
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.*,
                    u.name as user_name,
                    r.name as reviewer_name
                FROM prayers p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN users r ON p.reviewed_by = r.id
                WHERE p.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAll(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const [prayers] = await pool.query(`
                SELECT 
                    p.*,
                    u.name as user_name,
                    r.name as reviewer_name
                FROM prayers p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN users r ON p.reviewed_by = r.id
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            const [total] = await pool.query('SELECT COUNT(*) as count FROM prayers');

            return {
                prayers,
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

    static async getAllApproved(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const [prayers] = await pool.query(`
                SELECT 
                    p.*,
                    u.name as user_name,
                    r.name as reviewer_name
                FROM prayers p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN users r ON p.reviewed_by = r.id
                WHERE p.status = 'approved'
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
    
            const [total] = await pool.query(
                'SELECT COUNT(*) as count FROM prayers WHERE status = "approved"'
            );
    
            return {
                prayers,
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

    static async updateStatus(id, status, reviewerId) {
        try {
            if (status === 'rejected') {
                // Delete the prayer if the status is 'rejected'
                const [deleteResult] = await pool.query('DELETE FROM prayers WHERE id = ?', [id]);
                return deleteResult.affectedRows > 0;
            } else {
                // Update the prayer status and reviewer if not rejected
                const [updateResult] = await pool.query(
                    'UPDATE prayers SET status = ?, reviewed_by = ? WHERE id = ?',
                    [status, reviewerId, id]
                );
                return updateResult.affectedRows > 0;
            }
        } catch (error) {
            throw error;
        }
    }

    static async getStats() {
        try {
            const [stats] = await pool.query(`
                SELECT 
                    COUNT(*) as total_prayers,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_prayers,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_prayers,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_prayers,
                    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as last_24h
                FROM prayers`
            );
            return stats[0];
        } catch (error) {
            throw error;
        }
    }


    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM prayers WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = PrayerModel;