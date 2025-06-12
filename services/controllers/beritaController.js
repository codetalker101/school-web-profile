const pool = require("../database/db");

// ADMIN SIDE
exports.createBerita = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "anda harus login terlebih dahulu untuk meng-akses halaman ini!.",
      });
    }

    const { judul, keterangan, tanggal } = req.body;
    const beritaimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    if (!judul || !keterangan || !tanggal) {
      return res.render("administration/berita/addBerita", {
        message: "semua kolom harus terisi.",
        success: false,
        formData: { judul, keterangan, tanggal },
        role,
      });
    }

    const query = `
      INSERT INTO berita (judul, keterangan, tanggal, beritaimg)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [judul, keterangan, tanggal, beritaimg];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return res.render("administration/berita/addBerita", {
        message: "berita telah ditambahkan dengan sukses.",
        success: true,
        role,
      });
    } else {
      return res.render("administration/berita/addBerita", {
        message: "gagal menambahkan berita.",
        success: false,
        formData: { judul, keterangan, tanggal },
        role,
      });
    }
  } catch (error) {
    console.error("Error adding berita:", error);
    return res.status(500).render("administration/berita/addBerita", {
      message: "terjadi kesalahan saat menambahkan berita",
      success: false,
      formData: req.body,
      role: req.session.user.role,
    });
  }
};

exports.showBerita = async (req, res) => {
  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "anda harus login terlebih dahulu untuk meng-akses halaman ini!.",
      });
    }

    const role = req.session.user.role;
    const query = `
      SELECT 
        berita_id, 
        judul, 
        keterangan,
        tanggal,
        beritaimg, 
        created_at
      FROM berita
      ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    let berita = result.rows;

    // Add shortDesc to each berita item
    berita = berita.map((item) => {
      const cleanText = stripHTML(item.keterangan);
      const shortDesc = cleanText.length > 100 ? cleanText.substring(0, 100) + "..." : cleanText;
      return { ...item, shortDesc };
    });

    return res.render("administration/berita/berita", { berita, role });
  } catch (error) {
    console.error("Error fetching berita:", error.message);
    res.status(500).render("error", {
      message: "terjadi kesalahan saat menambahkan berita. mohon untuk dicoba lagi nanti.",
    });
  }
};

exports.showUpdateBerita = async (req, res) => {
  const beritaId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM berita WHERE berita_id = $1", [beritaId]);

    if (result.rows.length > 0) {
      const berita = result.rows[0];
      const role = req.session.user.role;

      res.render("administration/berita/updateBerita", { berita, role, message: null });
    } else {
      res.status(404).render("administration/berita/updateBerita", {
        berita: null,
        role: req.session.user.role,
        message: "berita tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("kesalahan saat menampilkan berita:", error);

    res.status(500).render("administration/berita/updateBerita", {
      berita: null,
      role: req.session.user.role,
      message: "terjadi kesalahan saat mengambil data berita.",
    });
  }
};

exports.updateBerita = async (req, res) => {
  const beritaId = req.params.id;

  try {
    const { judul, keterangan, tanggal } = req.body;
    const beritaimg = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    const query = `
      UPDATE berita 
      SET beritaimg = COALESCE($1, beritaimg), 
          judul = $2, 
          keterangan = $3, 
          tanggal = $4 
      WHERE berita_id = $5 
      RETURNING *`;

    const values = [beritaimg, judul, keterangan, tanggal, beritaId];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.render("administration/berita/updateBerita", {
        berita: result.rows[0],
        role,
        message: "berita sukses diupdate",
        success: true,
      });
    } else {
      res.render("administration/berita/updateBerita", {
        berita: { berita_id: beritaId, judul, keterangan, tanggal, beritaimg },
        role,
        message: "gagal update berita.",
        success: false,
      });
    }
  } catch (error) {
    console.error("berita gagal diupdate:", error);

    res.status(500).render("administration/berita/updateBerita", {
      berita: { berita_id: beritaId, judul, keterangan, tanggal, beritaimg },
      role,
      message: "Terjadi kesalahan saat mengambil data berita.",
      success: false,
    });
  }
};

exports.deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM berita WHERE berita_id = $1", [id]);

    if (result.rowCount > 0) {
      return res.redirect("/berita");
    } else {
      return res.status(404).render("/berita", {
        message: "berita gagal ditemukan.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error deleting berita:", error);

    res.status(500).render("/berita", {
      message: "Terjadi kesalahan saat mengambil data berita. Mohon untuk dicoba lagi nanti.",
      success: false,
    });
  }
};

// CLIENT SIDE
exports.showAllNews = async (req, res) => {
  const NEWS_PER_PAGE = 9;

  const currentPage = parseInt(req.query.page, 10) || 1;
  const offset = (currentPage - 1) * NEWS_PER_PAGE;

  const stripHTML = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  };

  try {
    const totalRowsRes = await pool.query("SELECT COUNT(*) AS total FROM berita");
    const totalRows = parseInt(totalRowsRes.rows[0].total, 10);
    const totalPages = Math.ceil(totalRows / NEWS_PER_PAGE);

    const result = await pool.query(
      `SELECT *, 
              TO_CHAR(tanggal, 'DD Mon YYYY') AS "formattedDate"
       FROM   berita 
       ORDER  BY tanggal DESC 
       LIMIT  $1 OFFSET $2`,
      [NEWS_PER_PAGE, offset]
    );

    // Sanitize and shorten description
    const beritaList = result.rows.map((item) => {
      const cleanText = stripHTML(item.keterangan || "");
      return {
        ...item,
        shortDesc: cleanText.length > 100 ? cleanText.slice(0, 100) + "..." : cleanText,
      };
    });

    res.render("insideNavbar/news", {
      page: "showAllNews",
      beritaList,
      currentPage,
      totalPages,
    });
  } catch (err) {
    console.error("Kesalahan saat mengambil berita yang diberi nomor halaman:", err);
    res.status(500).render("errorPage", { message: "gagal memuat aktivitas." });
  }
};

exports.showSingleNews = async (req, res) => {
  const beritaId = req.params.id;

  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    // Increment views
    await pool.query("UPDATE berita SET views = views + 1 WHERE berita_id = $1", [beritaId]);

    // Fetch the selected berita
    const result = await pool.query("SELECT * FROM berita WHERE berita_id = $1", [beritaId]);

    if (result.rows.length === 0) {
      return res.status(404).render("insideNavbar/news-single", {
        page: "showSingleNews",
        message: "berita tidak ditemukan",
      });
    }

    const selectedBerita = result.rows[0];

    const formattedDate = new Date(selectedBerita.tanggal).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Fetch 3 recommended berita
    const recommendedQuery = await pool.query(
      `SELECT berita_id, judul, keterangan, beritaimg, tanggal 
       FROM berita 
       WHERE berita_id != $1 
       ORDER BY tanggal DESC 
       LIMIT 3`,
      [beritaId]
    );

    const beritaList = recommendedQuery.rows.map((item) => {
      const cleanText = stripHTML(item.keterangan);
      const shortDesc = cleanText.length > 100 ? cleanText.substring(0, 100) + "..." : cleanText;

      return {
        ...item,
        formattedDate: new Date(item.tanggal).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        shortDesc,
      };
    });

    res.render("insideNavbar/news-single", {
      page: "showSingleNews",
      berita: { ...selectedBerita, formattedDate },
      beritaList,
    });
  } catch (error) {
    console.error("Error fetching berita data:", error);
    res.status(500).render("errorPage", {
      message: "gagal untuk memuat detail berita.",
    });
  }
};
