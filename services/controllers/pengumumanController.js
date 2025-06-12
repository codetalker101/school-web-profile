const fs = require('fs');
const path = require('path');
const pool = require("../database/db");

// ADMIN SIDE
exports.createPengumuman = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk mengakses sumber daya ini.",
      });
    }

    const { judul, keterangan, tanggal } = req.body;
    const pengumuman_file = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    if (!judul || !keterangan || !tanggal) {
      return res.render("administration/pengumuman/addPengumuman", {
        message: "Semua kolom harus terisi",
        success: false,
        formData: { judul, keterangan, tanggal },
      });
    }

    const query = `
      INSERT INTO pengumuman (judul, keterangan, tanggal, pengumuman_file, created_at)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
    const values = [judul, keterangan, tanggal, pengumuman_file];
    const result = await pool.query(query, values);

    return res.render("administration/pengumuman/addPengumuman", {
      message: "Pengumuman berhasil ditambahkan.",
      success: true,
      role,
    });
  } catch (error) {
    console.error("Error adding pengumuman:", error);
    return res.status(500).render("administration/pengumuman/addPengumuman", {
      message: "Terjadi kesalahan saat menambahkan pengumuman.",
      success: false,
      formData: req.body,
      role: req.session.user?.role,
    });
  }
};

exports.showPengumuman = async (req, res) => {
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
        pengumuman_id, judul, keterangan, tanggal, pengumuman_file, created_at
      FROM pengumuman
      ORDER BY created_at DESC`;
    const result = await pool.query(query);
    let pengumuman = result.rows;

    // Add shortDesc to each pengumuman item
    pengumuman = pengumuman.map((item) => {
      const cleanText = stripHTML(item.keterangan);
      const shortDesc = cleanText.length > 100 ? cleanText.substring(0, 100) + "..." : cleanText;
      return { ...item, shortDesc };
    });
    
    return res.render("administration/pengumuman/pengumuman", { pengumuman, role });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pengumuman:", error.message);
    return res.status(500).render("error", {
      message: "Terjadi kesalahan saat mengambil data pengumuman. Coba lagi nanti.",
    });
  }
};

exports.showUpdatePengumuman = async (req, res) => {
  const pengumumanId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM pengumuman WHERE pengumuman_id = $1", [pengumumanId]);

    if (result.rows.length > 0) {
      const pengumuman = result.rows[0];
      const role = req.session.user.role;

      return res.render("administration/pengumuman/updatePengumuman", { pengumuman, role, message: null });
    } else {
      return res.status(404).render("administration/pengumuman/updatePengumuman", {
        pengumuman: null,
        role: req.session.user.role,
        message: "Pengumuman tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
    return res.status(500).render("administration/pengumuman/updatePengumuman", {
      pengumuman: null,
      role: req.session.user.role,
      message: "Terjadi kesalahan saat mengambil data pengumuman.",
    });
  }
};

exports.updatePengumuman = async (req, res) => {
  const pengumumanId = req.params.id;

  try {
    const { judul, keterangan, tanggal } = req.body;
    const pengumuman_file = req.file ? req.file.filename : null;
    const { role } = req.session.user;

    const query = `
      UPDATE pengumuman 
      SET pengumuman_file = COALESCE($1, pengumuman_file),
          judul = $2,
          keterangan = $3,
          tanggal = $4,
          created_at = NOW()
      WHERE pengumuman_id = $5
      RETURNING *`;
    const values = [pengumuman_file, judul, keterangan, tanggal, pengumumanId];
    const result = await pool.query(query, values);

    return res.render("administration/pengumuman/updatePengumuman", {
      pengumuman: result.rows[0],
      role,
      message: "Pengumuman berhasil diupdate",
      success: true,
    });
  } catch (error) {
    console.error("Error saat update pengumuman:", error);
    return res.status(500).render("administration/pengumuman/updatePengumuman", {
      pengumuman: { pengumuman_id: pengumumanId, judul, keterangan, tanggal, pengumuman_file },
      role,
      message: "Terjadi kesalahan saat memperbarui pengumuman.",
      success: false,
    });
  }
};

exports.deletePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM pengumuman WHERE pengumuman_id = $1", [id]);

    if (result.rowCount > 0) {
      return res.redirect("/pengumuman");
    } else {
      return res.status(404).render("administration/pengumuman/pengumuman", {
        message: "Pengumuman tidak ditemukan.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error saat menghapus pengumuman:", error);
    return res.status(500).render("administration/pengumuman/pengumuman", {
      message: "Terjadi kesalahan saat menghapus pengumuman.",
      success: false,
    });
  }
};

// CLIENT SIDE
exports.showAllAnnouncements = async (req, res) => {
  const PENGUMUMAN_PER_PAGE = 9;

  const currentPage = parseInt(req.query.page, 10) || 1;
  const offset = (currentPage - 1) * PENGUMUMAN_PER_PAGE;

  const stripHTML = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  };

  try {
    const totalRowsRes = await pool.query("SELECT COUNT(*) AS total FROM pengumuman");
    const totalRows = parseInt(totalRowsRes.rows[0].total, 10);
    const totalPages = Math.ceil(totalRows / PENGUMUMAN_PER_PAGE);

    const result = await pool.query("SELECT * FROM pengumuman ORDER BY tanggal DESC");

    // Sanitize and shorten description
    const pengumumanList = result.rows.map((item) => {
      const cleanText = stripHTML(item.keterangan || "");
      return {
        ...item,
        shortDesc: cleanText.length > 250 ? cleanText.slice(0, 250) + "..." : cleanText,
      };
    });
    
    if (!pengumumanList.length) {
      return res.render("insideTopbar/announcements", {
        message: "pengumuman tidak ditemukan.",
      });
    }

    const formattedPengumumanList = pengumumanList.map((pengumuman) => {
      const date = new Date(pengumuman.created_at);
      return {
        ...pengumuman,
        formattedDate: date.toLocaleDateString("en-GB", { day: "2-digit" }),
        formattedMonthYear: date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      };
    });

    res.render("insideTopbar/announcements", {
      page: "showAllAnnouncements",
      pengumumanList: formattedPengumumanList,
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pengumuman", error);
    res.status(500).render("errorPage", { message: "gagal dalam memuat pengumuman." });
  }
};

exports.showSingleAnnouncement = async (req, res) => {
  const pengumumanId = req.params.id;

  // Helper function to remove HTML tags
  const stripHTML = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  try {
    const result = await pool.query("SELECT * FROM pengumuman WHERE pengumuman_id = $1", [pengumumanId]);

    if (result.rows.length > 0) {
      const pengumuman = result.rows[0];
      const date = new Date(pengumuman.created_at);

      res.render("insideTopbar/announcement-single", {
        page: "showSingleAnnouncement",
        pengumuman: {
          ...pengumuman,
          formattedDate: date.toLocaleDateString("en-GB", { day: "2-digit" }),
          formattedMonthYear: date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        },
      });
    } else {
      res.status(404).render("insideTopbar/announcement-single", { message: "Pengumuman not found" });
    }
  } catch (error) {
    console.error("Error fetching pengumuman data:", error);
    res.status(500).send("Kesalahan server saat mengambil data pengumuman");
  }
};

exports.downloadAnnouncementFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT pengumuman_file FROM pengumuman WHERE pengumuman_id = $1", [id]);

    if (result.rows.length === 0) return res.status(404).send("File tidak ditemukan");

    let fileName = result.rows[0].pengumuman_file;
    if (!fileName) return res.status(404).send("Jalur berkas tidak valid");

    const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
    if (!fs.existsSync(filePath)) return res.status(404).send("File tidak ditemukan diserver");

    res.download(filePath, (err) => {
      if (err) {
        console.error(`Error saat mengirim file: ${err.message}`);
        return res.status(500).send("file tidak bisa didownload.");
      }
    });
  } catch (error) {
    console.error(`Error saat mendownload file: ${error.message}`);
    res.status(500).send("Terjadi kesalahan saat mengunduh berkas.");
  }
};
