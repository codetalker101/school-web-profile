const pool = require("../database/db");

// ADMIN SIDE
exports.createGaleri = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk mengakses halaman ini.",
      });
    }

    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { judul } = req.body;
    const galeriimg = req.file ? req.file.filename : null;
    const role = req.session.user.role;

    const query = `
      INSERT INTO galeri (judul, galeriimg)
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [judul, galeriimg];

    const result = await pool.query(query, values);

    res.render("administration/galeri/addGaleri", {
      message: result.rows.length > 0
        ? "Foto galeri berhasil ditambahkan."
        : "Foto galeri gagal ditambahkan.",
      success: result.rows.length > 0,
      role,
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);

    res.status(500).render("administration/galeri/addGaleri", {
      message: "Terjadi kesalahan saat menambahkan gambar galeri.",
      success: false,
      role: req.session.user.role,
    });
  }
};

exports.showGaleri = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.role) {
      return res.status(401).render("error", {
        message: "Tidak sah: Anda harus masuk untuk mengakses halaman ini.",
      });
    }

    const role = req.session.user.role;

    const query = `
      SELECT 
        galeri_id, 
        judul, 
        galeriimg, 
        created_at
      FROM galeri
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);
    const galeri = result.rows;

    res.render("administration/galeri/galeri", { galeri, role });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil gambar galeri:", error);

    res.status(500).render("error", {
      message: "Terjadi kesalahan saat mengambil gambar galeri.",
    });
  }
};

exports.showUpdateGaleri = async (req, res) => {
  const galeriId = req.params.id;

  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk mengakses halaman ini.",
      });
    }

    const { role } = req.session.user;

    const query = `
      SELECT 
        galeri_id, 
        judul, 
        galeriimg, 
        created_at
      FROM galeri
      WHERE galeri_id = $1;
    `;
    const result = await pool.query(query, [galeriId]);

    if (result.rows.length > 0) {
      const galeri = result.rows[0];
      return res.render("administration/galeri/updateGaleri", {
        galeri,
        message: null,
        role,
      });
    } else {
      return res.status(404).render("administration/galeri/updateGaleri", {
        galeri: null,
        message: "Item galeri tidak ditemukan.",
        role,
      });
    }
  } catch (error) {
    console.error("Error fetching gallery item:", error);

    return res.status(500).render("administration/galeri/updateGaleri", {
      message: "Terjadi kesalahan saat mengambil data galeri.",
      galeri: null,
      role,
    });
  }
};

exports.updateGaleri = async (req, res) => {
  const galeriId = req.params.id;

  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk mengakses halaman ini.",
      });
    }

    const { role } = req.session.user;
    const { judul } = req.body;
    const galeriimg = req.file ? req.file.filename : null;

    const query = `
      UPDATE galeri 
      SET 
        galeriimg = COALESCE($1, galeriimg), 
        judul = $2,
        created_at = CURRENT_TIMESTAMP
      WHERE galeri_id = $3 
      RETURNING *;
    `;
    const values = [galeriimg, judul, galeriId];

    const result = await pool.query(query, values);

    return res.render("administration/galeri/updateGaleri", {
      galeri: result.rows[0] || { galeri_id: galeriId, judul, galeriimg },
      message: result.rowCount > 0
        ? "Gallery berhasil diupdate."
        : "Gallery gagal diupdate.",
      success: result.rowCount > 0,
      role,
    });
  } catch (error) {
    console.error("error saat update galeri:", error);

    res.status(500).render("administration/galeri/updateGaleri", {
      galeri: { galeri_id: galeriId, judul, galeriimg },
      message: "Terjadi kesalahan saat memperbarui galeri.",
      success: false,
      role,
    });
  }
};

exports.deleteGaleri = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).render("error", {
        message: "Anda harus login untuk menghapus data.",
      });
    }

    const { role } = req.session.user;
    const { id } = req.params;

    const result = await pool.query("DELETE FROM galeri WHERE galeri_id = $1", [id]);

    if (result.rowCount > 0) {
      return res.redirect("/galeri");
    } else {
      return res.render("/galeri", {
        message: "Gallery tidak ditemukan.",
        success: false,
        role,
      });
    }
  } catch (error) {
    console.error("error saat menghapus galeri:", error);

    return res.status(500).render("/galeri", {
      message: "Terjadi kesalahan saat menghapus galeri.",
      success: false,
      role: req.session.user.role,
    });
  }
};

// CLIENT SIDE
exports.showAllGallery = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM galeri ORDER BY created_at DESC");
    const galleryList = result.rows;

    if (!galleryList || galleryList.length === 0) {
      return res.render("insideNavbar/gallery", {
        message: "Aktivitas galeri tidak ditemukan.",
      });
    }

    res.render("insideNavbar/gallery", {
      page: "showAllGallery",
      galleryList,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data galeri:", error);
    res.status(500).render("errorPage", { message: "gagal memuat aktivitas." });
  }
};
