const pool = require("../database/db");
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, name, notlp, role, password } = req.body;
     
    // Validate input fields
    if (!username || !name || !notlp || !role || !password) {
      return res.render('administration/users/addUser', {
        message: "Semua kolom harus terisi",
        success: false
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (username, name, notlp, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, name, notlp, role, hashedPassword]
    );

    // Check if user was successfully created and render accordingly
    if (newUser.rows.length > 0) {
      res.render('administration/users/addUser', {  // Adjust path if needed
        message: "User berhasil ditambahkan",
        success: true
      });
    } else {
      res.render('administration/users/addUser', {  // Adjust path if needed
        message: "User gagal ditambahkan",
        success: false
      });
    }
  } catch (error) {
    console.error("Error saat menambahkan data user:", error);

    // Handle server error during user creation
    res.status(500).render('administration/users/addUser', {  // Adjust path if needed
      message: "Terjadi kesalahan saat menambahkan pengguna.",
      success: false
    });
  }
};

exports.showUsers = async (req, res) => {
  try {
    // Query to retrieve all users from the database
    const result = await pool.query("SELECT * FROM users ORDER BY user_id");
    const users = result.rows; // Rename 'user' to 'users' to avoid conflicts

    // Render the EJS template and pass the users data
    res.render("administration/users/users", { users }); // Pass 'users', not 'user'
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pengguna:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil pengguna.");
  }
};

exports.showUpdateUser = async (req, res) => {
  const userId = req.params.id; // Get user ID from request parameters
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.render("administration/users/updateUser", { user, message: null }); // No error message on success
    } else {
      // Render `editUser` with an error message if user is not found
      res.status(404).render("administration/users/updateUser", { user: null, message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).render("administration/users/updateUser", { message: "Terjadi kesalahan saat mengambil data pengguna." });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, name, notlp, role, password } = req.body;

  try {
    if (!username || !name || !notlp || !role) {
      return res.render('administration/users/updateUser', {
        user: { user_id: userId, username, name, notlp, role },
        message: "Semua kolom harus terisi",
        success: false
      });
    }

    const values = [username, name, notlp, role];
    let updateQuery = `
      UPDATE users 
      SET username = $1, name = $2, notlp = $3, role = $4
    `;

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.push(hashedPassword);
      updateQuery += `, password = $${values.length}`; // Important: dynamic placeholder
    }

    values.push(userId);
    updateQuery += ` WHERE user_id = $${values.length}`;

    const result = await pool.query(updateQuery, values);

    if (result.rowCount > 0) {
      res.render('administration/users/updateUser', {
        user: { user_id: userId, username, name, notlp, role },
        message: "User berhasil diupdate",
        success: true
      });
    } else {
      res.render('administration/users/updateUser', {
        user: { user_id: userId, username, name, notlp, role },
        message: "User gagal diupdate",
        success: false
      });
    }
  } catch (error) {
    console.error("Error saat update data user:", error);
    res.status(500).render('administration/users/updateUser', {
      user: { user_id: userId, username, name, notlp, role },
      message: "Terjadi kesalahan saat memperbarui pengguna.",
      success: false
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    if (result.rowCount > 0) {
      res.redirect("/users"); // Success
    } else {
      // User not found
      const allUsers = await pool.query("SELECT * FROM users ORDER BY user_id");
      res.render("administration/users/users", {
        users: allUsers.rows,
        message: "User tidak ditemukan.",
        success: false
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    const allUsers = await pool.query("SELECT * FROM users ORDER BY user_id");
    res.status(500).render("administration/users/users", {
      users: allUsers.rows,
      message: "Terjadi kesalahan saat menghapus pengguna.",
      success: false
    });
  }
};
