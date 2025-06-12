const bcrypt = require('bcrypt');
const pool = require('../database/db');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch both `beritaList` and `galleryList` to include in the render response
    const beritaResult = await pool.query('SELECT * FROM berita ORDER BY created_at DESC');
    const beritaList = beritaResult.rows;

    const galleryResult = await pool.query('SELECT * FROM galeri ORDER BY created_at DESC');
    const galleryList = galleryResult.rows;

    // Query the user from the database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      // Username not found, return error message to modal
      return res.render('index', { 
        error: 'Username tidak ditemukan.', 
        username: username || '', 
        beritaList, 
        galleryList, 
        showLoginModal: true 
      });
    }

    const user = result.rows[0];

    // Compare the entered password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Incorrect password, return error message to modal
      return res.render('index', { 
        error: 'Password salah.', 
        username: username || '', 
        beritaList, 
        galleryList, 
        showLoginModal: true 
      });
    }

    // Store user info in the session
    req.session.user = { 
      id: user.id, 
      role: user.role,
      username: user.username,
      name: user.name
    };
    console.log(req.session.user); // Check if the session contains user data

    // Redirect based on the user's role
    switch (user.role) {
      case 'admin':
      case 'employee': // Both roles share the same redirect
        return res.redirect('/administrationDashboard');
      default:
        console.error(`Unexpected role: ${user.role}`);
        return res.status(403).render('index', { 
          error: 'Role tidak valid. Silakan hubungi dukungan.', 
          username: username || '', 
          beritaList, 
          galleryList, 
          showLoginModal: true 
        });
    }
  } catch (err) {
    console.error('Error saat login:', err);

    // Fetch beritaList and galleryList for rendering on error
    const beritaResult = await pool.query('SELECT * FROM berita ORDER BY created_at DESC');
    const beritaList = beritaResult.rows;

    const galleryResult = await pool.query('SELECT * FROM galeri ORDER BY created_at DESC');
    const galleryList = galleryResult.rows;

    // Handle server errors
    return res.status(500).render('index', { 
      error: 'Server error. coba lagi nanti.', 
      username: username || '', 
      beritaList, 
      galleryList, 
      showLoginModal: true 
    });
  }
};

exports.logoutUser = (req, res) => {
  console.log('Logout route hit'); // Debugging line
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Kesalahan menghancurkan sesi', err);
      return res.status(500).send('Gagal untuk logout');
    }

    // Redirect to the home page after logout
    res.redirect('/');
  });
};


