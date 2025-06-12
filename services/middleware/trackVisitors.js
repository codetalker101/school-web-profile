const pool = require('../database/db');

// middleware/trackVisitor.js
exports.trackVisitors = async (req, res, next) => {
  const ipAddress = req.ip; // Get the visitor's IP address

  if (!req.session.visited) {
    try {
      // Check if this IP has already been recorded
      const result = await pool.query('SELECT id FROM visitor_ips WHERE ip_address = $1', [ipAddress]);

      if (result.rows.length === 0) {
        // If the IP doesn't exist, add it to the database and increment the visitor count
        await pool.query('UPDATE visitor_stats SET total_visitors = total_visitors + 1 WHERE id = 1');
        
        // Store the IP in the visitor_ips table to track it
        await pool.query('INSERT INTO visitor_ips (ip_address) VALUES ($1)', [ipAddress]);
      }

      // Mark that the session has visited
      req.session.visited = true;
    } catch (err) {
      console.error('Error tracking visitor:', err);
    }
  }

  next(); // Move to the next middleware/route handler
};
