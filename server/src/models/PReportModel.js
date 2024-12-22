const pool = require('../config/database');

class PReportModel {
    static async createSchema() {
        const query = `
            CREATE TABLE IF NOT EXISTS prayer_reports (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255),
                prayer_id INT,
                email VARCHAR(255),
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (prayer_id) REFERENCES prayers(id)
            )
        `;

        try {
            await pool.query(query);
            console.log('Prayers report table created successfully');
        } catch (error) {
            console.error('Error creating prayers report table:', error);
            throw error;
        }
    }

    static async create(prayerReportData) {
        const { name, prayer_id, email, reason } = prayerReportData;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const [result] = await connection.query(
                'INSERT INTO prayer_reports (name, prayer_id, email, reason) VALUES (?, ?, ?, ?)',
                [name, prayer_id, email, reason]
            );
            const newReportId = result.insertId;

            await connection.query(
                'UPDATE prayers SET report_count = report_count + 1 WHERE id = ?',
                [prayer_id]
            );
            
            await connection.commit();

            return { 
                id: newReportId, 
                ...prayerReportData,
                prayer_id: prayer_id,
            };
        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw error;
        } finally {
            connection.release();
        }
    }
    static async findById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.*,
                    u.name as user_name,
                FROM prayer_reports p
                LEFT JOIN prayers u ON p.prayer_id = u.id
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
                FROM prayer_reports p
                LEFT JOIN prayers u ON p.prayer_id = u.id
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            const [total] = await pool.query('SELECT COUNT(*) as count FROM prayer_reports');

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

    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM prayer_reports WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = PReportModel;