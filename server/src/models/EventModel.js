const pool = require('../config/database');
class EventModel {
    static async createSchema() {
        const query = `
            CREATE TABLE IF NOT EXISTS events (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_type ENUM('live_prayer', 'other') NOT NULL,
                coordinator_id INT NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (coordinator_id) REFERENCES users(id)
            )
        `;

        try {
            await pool.query(query);
            console.log('Events table created successfully');
        } catch (error) {
            console.error('Error creating events table:', error);
            throw error;
        }
    }

    static async create(eventData) {
        const { title, description, event_type, coordinator_id, start_time, end_time } = eventData;
        
        try {
            const [result] = await pool.query(
                `INSERT INTO events (
                    title, description, event_type, coordinator_id, start_time, end_time
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [title, description, event_type, coordinator_id, start_time, end_time]
            );

            return { id: result.insertId, ...eventData };
        } catch (error) {
            throw error;
        }
    }

    static async getAll(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            // Get events with coordinator names
            const [events] = await pool.query(`
                SELECT 
                    e.*,
                    u.name as coordinator_name
                FROM events e
                JOIN users u ON e.coordinator_id = u.id
                ORDER BY e.start_time DESC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
    
            // Get total count for pagination
            const [total] = await pool.query(
                'SELECT COUNT(*) as count FROM events'
            );
    
            return {
                events,
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

    static async findById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.*,
                    u.name as coordinator_name
                FROM events e
                JOIN users u ON e.coordinator_id = u.id
                WHERE e.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getUpcoming(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const [events] = await pool.query(`
                SELECT 
                    e.*,
                    u.name as coordinator_name
                FROM events e
                JOIN users u ON e.coordinator_id = u.id
                WHERE e.start_time > NOW()
                ORDER BY e.start_time ASC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            const [total] = await pool.query(
                'SELECT COUNT(*) as count FROM events WHERE start_time > NOW()'
            );

            return {
                events,
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

    static async update(id, eventData) {
        try {
            const [result] = await pool.query(
                'UPDATE events SET ? WHERE id = ?',
                [eventData, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM events WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports =  EventModel;