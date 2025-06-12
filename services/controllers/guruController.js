const pool = require("../database/db");

// ADMIN SIDE

exports.createGuru = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk meng akses halaman ini.",
      });
    }

    const { nama, pendidikan, jabatan } = req.body;
    const guruimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    if (!nama || !pendidikan || !jabatan) {
      return res.render("administration/guru/addGuru", {
        message: "Semua kolom harus terisi.",
        success: false,
        formData: { nama, pendidikan, jabatan },
      });
    }

    const query = `
      INSERT INTO guru (nama, pendidikan, jabatan, guruimg)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [nama, pendidikan, jabatan, guruimg];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return res.render("administration/guru/addGuru", {
        message: "Guru berhasil ditambahkan.",
        success: true,
        role,
      });
    } else {
      return res.render("administration/guru/addGuru", {
        message: "Guru gagal di tambahkan.",
        success: false,
        formData: { nama, pendidikan, jabatan },
        role,
      });
    }
  } catch (error) {
    console.error("Error adding guru:", error);

    return res.status(500).render("administration/guru/addGuru", {
      message: "Terjadi kesalahan saat menambahkan guru.",
      success: false,
      formData: req.body,
      role: req.session.user?.role,
    });
  }
};

exports.showGuru = async (req, res) => {
  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk meng akses halaman ini.",
      });
    }

    const role = req.session.user.role;
    const query = `
      SELECT 
          guru_id, 
          nama, 
          pendidikan,
          jabatan,
          guruimg, 
          created_at
      FROM guru
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    const guru = result.rows;

    return res.render("administration/guru/guru", { guru, role });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data guru:", error.message);

    return res.status(500).render("error", {
      message: "Terjadi kesalahan saat mengambil data guru. Coba lagi nanti.",
    });
  }
};

exports.showUpdateGuru = async (req, res) => {
  const guruId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM guru WHERE guru_id = $1", [guruId]);

    if (result.rows.length > 0) {
      const guru = result.rows[0];
      const role = req.session.user.role;

      res.render("administration/guru/updateGuru", { guru, role, message: null });
    } else {
      res.status(404).render("administration/guru/updateGuru", {
        guru: null,
        role: req.session.user.role,
        message: "Guru tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data guru:", error);

    res.status(500).render("administration/guru/updateGuru", {
      guru: null,
      role: req.session.user.role,
      message: "Terjadi kesalahan saat mengambil data guru.",
    });
  }
};

exports.updateGuru = async (req, res) => {
  const guruId = req.params.id;

  try {
    const { nama, pendidikan, jabatan } = req.body;
    const guruimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    const query = `
      UPDATE guru 
      SET guruimg = COALESCE($1, guruimg), 
          nama = $2, 
          pendidikan = $3,
          jabatan = $4
      WHERE guru_id = $5 
      RETURNING *`;
    const values = [guruimg, nama, pendidikan, jabatan, guruId];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.render("administration/guru/updateGuru", {
        guru: result.rows[0],
        role,
        message: "Guru berhasil diupdate",
        success: true,
      });
    } else {
      res.render("administration/guru/updateGuru", {
        guru: { guru_id: guruId, nama, pendidikan, jabatan, guruimg },
        role,
        message: "Guru gagal diupdate.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error updating guru:", error);

    res.status(500).render("administration/guru/updateGuru", {
      guru: { guru_id: guruId, nama, pendidikan, jabatan, guruimg },
      role,
      message: "Terjadi kesalahan saat memperbarui data guru.",
      success: false,
    });
  }
};

exports.deleteGuru = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM guru WHERE guru_id = $1", [id]);

    if (result.rowCount > 0) {
      return res.redirect("/guru");
    } else {
      return res.status(404).render("administration/guru/guru", {
        message: "Guru tidak ditemukan.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error deleting guru:", error);

    res.status(500).render("administration/guru/guru", {
      message: "Terjadi kesalahan saat menghapus data guru. Coba lagi nanti.",
      success: false,
    });
  }
};

exports.showAllTeachers = async (req, res) => {
  const GURU_PER_PAGE = 9;

  const currentPage = parseInt(req.query.page, 10) || 1;
  const offset = (currentPage - 1) * GURU_PER_PAGE;

  const stripHTML = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  };

  try {
    const totalRowsRes = await pool.query("SELECT COUNT(*) AS total FROM guru");
    const totalRows = parseInt(totalRowsRes.rows[0].total, 10);
    const totalPages = Math.ceil(totalRows / GURU_PER_PAGE);

    const result = await pool.query(
      "SELECT * FROM guru ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [GURU_PER_PAGE, offset]
    );
    const guruList = result.rows;

    if (!guruList || guruList.length === 0) {
      return res.render("insideTopbar/teacher", {
        message: "Guru tidak ditemukan.",
      });
    }
    
    res.render("insideTopbar/teacher", {
      page: "showAllTeachers",
      guruList,
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data guru:", error);

    res.status(500).render("errorPage", {
      message: "Gagal memuat data guru.",
    });
  }
};
