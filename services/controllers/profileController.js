const pool = require("../database/db");

// display data on update profile form
exports.showUpdateProfile = async (req, res) => {
  const id = req.params.id; // Get ekstrakurikular ID from request parameters

  try {
    const result = await pool.query("SELECT * FROM profile WHERE profile_id = $1", [id]);

    if (result.rows.length > 0) {
      const profile = result.rows[0];
      const role = req.session.user.role; // Get the user's role from the session
          
      res.render("administration/profileSekolah/updateProfileSekolah", { profile, role, message: null });
    } else {
      // Render with an error message if school profile data not found
       
      res.status(404).render("administration/profileSekolah/updateProfileSekolah", {
        profile: null,
        role: req.session.user.role,
        message: "data profile tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("Error fetching ekstrakurikular:", error);
          
    res.status(500).render("administration/profileSekolah/updateProfileSekolah", {
      profile: null,
      role: req.session.user.role,
      message: "Terjadi kesalahan saat mengambil data profil.",
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const profileId = req.params.id;

  try {
    const {
      sejarah,
      namakepsek,
      tentangkepsek,
      visimisi,
      programkerja,
      komitesekolah,
      prestasisiswa,
    } = req.body;

    const bannerimg = req.files?.bannerimg ? req.files.bannerimg[0].filename : null;
    const kepsekimg = req.files?.kepsekimg ? req.files.kepsekimg[0].filename : null;
    const { role } = req.session.user; // Get user_id and role from session

    // Check user permissions (if needed)
    if (role !== 'admin' && role !== 'employee') {
      return res.status(403).render("error", {
        message: "Anda tidak berwenang memperbarui profil ini.",
      });
    }

    // Update the profile in the database
    const query = `
      UPDATE profile
      SET 
        sejarah = $1,
        namakepsek = $2,
        tentangkepsek = $3,
        visimisi = $4,
        programkerja = $5,
        komitesekolah = $6,
        prestasisiswa = $7,
        bannerimg = COALESCE($8, bannerimg),
        kepsekimg = COALESCE($9, kepsekimg)
      WHERE profile_id = $10
      RETURNING *;
    `;
    const values = [
      sejarah,
      namakepsek,
      tentangkepsek,
      visimisi,
      programkerja,
      komitesekolah,
      prestasisiswa,
      bannerimg,
      kepsekimg,
      profileId, // Use profile_id to identify the correct record
    ];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      // Successfully updated
      res.render("administration/profileSekolah/updateProfileSekolah", {
        profile: result.rows[0], // Use the updated record from the database
        role,
        message: "profile data berhasil diupdate",
        success: true,
      });
    } else {
      // Update failed
      res.render("administration/profileSekolah/updateProfileSekolah", {
        profile: { profile_id: profileId, sejarah, namakepsek, tentangkepsek, visimisi, programkerja, komitesekolah,
                  prestasisiswa, bannerimg, kepsekimg },
        role,
        message: "profile data gagal diupdate.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui data profil:", error);

    res.status(500).render("administration/profileSekolah/updateProfileSekolah", {
        profile: { profile_id: profileId, sejarah, namakepsek, tentangkepsek, visimisi, programkerja, komitesekolah,
                  prestasisiswa, bannerimg, kepsekimg },
        role,
        message: "profile data gagal diupdate.",
        success: false,

    });
  }
};

// CLIENT/VISITOR SIDE

exports.showSingleProfile = async (req, res) => {
  const profileId = req.params.id; // Get specific profile ID from parameters

  try {
    const result = await pool.query("SELECT * FROM profile WHERE profile_id = $1", [profileId]);

    if (result.rows.length > 0) {
      const profile = result.rows[0];
      res.render("insideNavbar/about", { 
        page: "showSingleProfile",
        profile: profile // Pass profile data
      });
    } else {
      res.status(404).render("insideNavbar/about", { 
        page: "showSingleProfile",
        profile: null, // Pass null to handle no profile gracefully in the EJS template
        message: "Profile tidak ditemukan." // Pass an appropriate message
      });
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).render("insideNavbar/about", { 
      page: "showSingleProfile",
      profile: null, // Pass null to handle errors gracefully in the EJS template
      message: "Terjadi kesalahan server saat mengambil data profil." // Pass an appropriate error message
    });
  }
};



