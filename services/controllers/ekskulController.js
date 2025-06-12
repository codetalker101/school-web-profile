const pool = require("../database/db");

// ADMIN SIDE
exports.showAddEkstrakurikulerForm = async (req, res) => {
  try {
    const { role } = req.session.user || {};

    const guruResult = await pool.query("SELECT guru_id, nama FROM guru");
    const guruList = guruResult.rows;

    res.render("administration/ekstrakurikuler/addEkstrakurikuler", {
      message: null,
      success: null,
      role,
      guruList,
      formData: {},
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat memuat formulir:", error);
    res.status(500).render("error", { message: "gagal memuat formulir." });
  }
};

exports.createEkstrakurikuler = async (req, res) => {
  try {
    // Fetch guru data table
    const guruResult = await pool.query("SELECT guru_id, nama FROM guru");
    const guruList = guruResult.rows;

    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk mengakses halaman ini.",
      });
    }

    const { judul, subjudul, keterangan, guru_id } = req.body;
    const ekskulimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    if (!judul || !subjudul || !keterangan) {
      return res.render("administration/ekstrakurikuler/addEkstrakurikuler", {
        message: "Semua kolom harus terisi",
        success: false,
        formData: { judul, subjudul, keterangan, guru_id },
        role,
        guruList,
      });
    }

    if (role !== "admin" && role !== "employee") {
      return res.status(403).render("error", {
        message: "Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.",
      });
    }

    const query = `
      INSERT INTO ekstrakurikuler (judul, subjudul, keterangan, ekskulimg, guru_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [judul, subjudul, keterangan, ekskulimg, guru_id];
    const result = await pool.query(query, values);

    return res.render("administration/ekstrakurikuler/addEkstrakurikuler", {
      message: "Ekstrakurikuler berhasil ditambahkan.",
      success: true,
      role,
      guruList,
      formData: req.body,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat menambahkan ekstrakurikuler:", error);

    // fallback in case guruList wasn't fetched before the error
    let guruList = [];
    try {
      const guruResult = await pool.query("SELECT guru_id, nama FROM guru");
      guruList = guruResult.rows;
    } catch (err) {
      console.error("Gagal mengambil daftar guru di blok tangkapan:", err);
    }

    return res.status(500).render("administration/ekstrakurikuler/addEkstrakurikuler", {
      message: "Terjadi kesalahan saat menambahkan ekstrakurikuler.",
      success: false,
      formData: req.body,
      role: req.session.user?.role || null,
      guruList,
    });
  }
};

exports.showEkstrakurikulers = async (req, res) => {
  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    if (!req.session.user || !req.session.user.role) {
      return res.status(401).render("error", {
        message: "Tidak sah: Anda harus masuk untuk mengakses halaman ini.",
      });
    }

    const role = req.session.user.role;

    const query = `
      SELECT 
          e.ekskul_id, 
          e.judul, 
          e.subjudul, 
          e.keterangan, 
          e.ekskulimg, 
          e.created_at,
          g.nama AS pembimbing
      FROM ekstrakurikuler e
      LEFT JOIN guru g ON e.guru_id = g.guru_id
      ORDER BY e.created_at DESC;
    `;

    const result = await pool.query(query);
    let ekskul = result.rows;

    // Add shortDesc to each ekskul item
    ekskul = ekskul.map((item) => {
      const cleanText = stripHTML(item.keterangan);
      const shortDesc = cleanText.length > 100 ? cleanText.substring(0, 100) + "..." : cleanText;
      return { ...item, shortDesc };
    });

    return res.render("administration/ekstrakurikuler/ekstrakurikuler", {
      ekskul,
      role,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil ekstrakurikuler:", error.message);
    return res.status(500).render("error", {
      message: "Terjadi kesalahan saat mengambil ekstrakurikuler. Coba lagi nanti.",
    });
  }
};

exports.showUpdateEkstrakurikuler = async (req, res) => {
  const ekskulId = req.params.id;

  try {
    const guruResult = await pool.query("SELECT guru_id, nama FROM guru");
    const guruList = guruResult.rows;

    const result = await pool.query(
      "SELECT * FROM ekstrakurikuler WHERE ekskul_id = $1",
      [ekskulId]
    );

    if (result.rows.length > 0) {
      return res.render("administration/ekstrakurikuler/updateEkstrakurikuler", {
        ekskul: result.rows[0],
        role: req.session.user.role,
        message: null,
        guruList
      });
    } else {
      return res.status(404).render("administration/ekstrakurikuler/updateEkstrakurikuler", {
        ekskul: null,
        role: req.session.user.role,
        message: "Ekstrakurikuler tidak ditemukan.",
        guruList
      });
    }
  } catch (error) {
    console.error("Error fetching ekstrakurikuler:", error);
    return res.status(500).render("administration/ekstrakurikuler/updateEkstrakurikuler", {
      ekskul: null,
      role: req.session.user.role,
      message: "Terjadi kesalahan saat mengambil data ekstrakurikuler.",
      guruList
    });
  }
};

exports.updateEkstrakurikuler = async (req, res) => {
  const ekskulId = req.params.id;

  try {
    if (!req.session.user || !req.session.user.role) {
      return res.status(401).render("error", {
        message: "Tidak sah: Anda harus masuk untuk mengakses halaman ini.",
      });
    }

    const guruResult = await pool.query("SELECT guru_id, nama FROM guru");
    const guruList = guruResult.rows;

    const { judul, subjudul, keterangan, guru_id } = req.body;
    const ekskulimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    const query = `
      UPDATE ekstrakurikuler 
      SET ekskulimg = COALESCE($1, ekskulimg),
          judul = $2,
          subjudul = $3,
          keterangan = $4,
          guru_id = $5
      WHERE ekskul_id = $6
      RETURNING *`;
    const values = [ekskulimg, judul, subjudul, keterangan, guru_id, ekskulId];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return res.render("administration/ekstrakurikuler/updateEkstrakurikuler", {
        ekskul: result.rows[0],
        role,
        guruList,
        message: "Ekstrakurikuler sukses diupdate",
        success: true,
      });
    } else {
      return res.render("administration/ekstrakurikuler/updateEkstrakurikuler", {
        ekskul: { ekskul_id: ekskulId, judul, subjudul, keterangan, ekskulimg },
        role,
        guruList,
        message: "Ekstrakurikuler gagal diupdate.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Ekstrakurikuler error saat diupdate:", error);
    return res.status(500).render("administration/ekstrakurikuler/updateEkstrakurikuler", {
      ekskul: { ekskul_id: ekskulId, judul, subjudul, keterangan, ekskulimg },
      role: req.session.user.role,
      guruList,
      message: "Terjadi kesalahan saat memperbarui ekstrakurikuler.",
      success: false,
    });
  }
};

exports.deleteEkstrakurikuler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM ekstrakurikuler WHERE ekskul_id = $1",
      [id]
    );

    if (result.rowCount > 0) {
      return res.redirect("/ekstrakurikuler");
    } else {
      return res.status(404).render("/ekstrakurikuler", {
        message: "Ekstrakurikuler tidak ditemukan.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error deleting ekstrakurikuler:", error);
    return res.status(500).render("/ekstrakurikuler", {
      message: "Terjadi kesalahan saat menghapus ekstrakurikuler. Silakan coba lagi nanti.",
      success: false,
      role: req.session.user.role,
    });
  }
};

// CLIENT SIDE

exports.showAllExtracurricular = async (req, res) => {
  const EKSKUL_PER_PAGE = 9;

  const currentPage = parseInt(req.query.page, 10) || 1;
  const offset = (currentPage - 1) * EKSKUL_PER_PAGE;

  const stripHTML = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  };

  try {
    const totalRowsRes = await pool.query("SELECT COUNT(*) AS total FROM ekstrakurikuler");
    const totalRows = parseInt(totalRowsRes.rows[0].total, 10);
    const totalPages = Math.ceil(totalRows / EKSKUL_PER_PAGE);

    const result = await pool.query(
      "SELECT * FROM ekstrakurikuler ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [EKSKUL_PER_PAGE, offset]
    );

    // Sanitize and shorten description
    const ekskulList = result.rows.map((item) => {
      const cleanText = stripHTML(item.keterangan || "");
      return {
        ...item,
        shortDesc: cleanText.length > 100 ? cleanText.slice(0, 100) + "..." : cleanText,
      };
    });

    if (!ekskulList.length) {
      return res.render("insideNavbar/extracurricular", {
        message: "Aktivitas ekstrakurikuler tidak ditemukan.",
      });
    }

    return res.render("insideNavbar/extracurricular", {
      page: "showAllEkskul",
      ekskulList,
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Error fetching ekskul:", error);
    return res.status(500).render("errorPage", {
      message: "Gagal memuat aktivitas.",
    });
  }
};

exports.showSingleExtracurricular = async (req, res) => {
  const ekskulId = req.params.id;

  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    const result = await pool.query(
      `SELECT e.*, 
              g.nama AS guru_nama, 
              g.pendidikan AS guru_pendidikan, 
              g.jabatan AS guru_jabatan, 
              g.guruimg AS guru_img
       FROM ekstrakurikuler e
       LEFT JOIN guru g ON e.guru_id = g.guru_id
       WHERE e.ekskul_id = $1`,
      [ekskulId]
    );

    if (result.rows.length > 0) {
      return res.render("insideNavbar/extracurricular-single", {
        page: "showSingleEkskul",
        ekskul: result.rows[0],
      });
    } else {
      return res.status(404).render("insideNavbar/extracurricular-single", {
        message: "Ekstrakurikuler tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error fetching ekstrakurikuler data:", error);
    return res.status(500).send("Server error saat mengambil data ekstrakurikuler");
  }
};
