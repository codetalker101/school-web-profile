const pool = require("../database/db");

exports.administrationDashboard = async (req, res) => {
  try {
    const result = await pool.query('SELECT total_visitors FROM visitor_stats WHERE id = 1');
    const visitorCount = result.rows[0]?.total_visitors || 0;

    res.render("administration/indexAdm", {
      message: null,
      success: null,
      role: req.session.user.role,
      visitorCount
    });
  } catch (err) {
    console.error('Error fetching visitor count:', err);
    res.render("administration/indexAdm", {
      message: "Gagal mengambil jumlah pengunjung",
      success: null,
      role: req.session.user.role,
      visitorCount: 0
    });
  }
};
