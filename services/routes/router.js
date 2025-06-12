const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');

const renders = require('../renders/render');
const indexController = require("../controllers/indexController");
const admDashboard = require('../controllers/admDashboard');
const usersController = require('../controllers/usersController');
const ekskulController = require('../controllers/ekskulController');
const galeriController = require('../controllers/galeriController');
const beritaController = require('../controllers/beritaController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const pengumumanController = require('../controllers/pengumumanController');
const guruController = require('../controllers/guruController');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const { trackVisitors } = require('../middleware/trackVisitors');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set your desired upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file names
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size (2MB for example)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|csv|xlsx|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const uploadFields = upload.fields([
  { name: 'bannerimg', maxCount: 1 },
  { name: 'kepsekimg', maxCount: 1 },
]);



// HOME ROUTE
route.get("/", trackVisitors, indexController.showLatestItems);

// NAVBAR ITEMS ROUTES
  // school profile
route.get("/showSingleProfile/:id", profileController.showSingleProfile);
  // extracurricular 
route.get("/extracurricular", ekskulController.showAllExtracurricular);
route.get("/showSingleExtracurricular/:id", ekskulController.showSingleExtracurricular);
  // gallery 
route.get("/gallery", galeriController.showAllGallery);
  // news 
route.get("/news", beritaController.showAllNews);
route.get("/showSingleNews/:id", beritaController.showSingleNews);
  // contact
route.get("/contact", renders.contact)

// TOPBAR ROUTES 
  // teachers / guru-guru
route.get("/teacher", guruController.showAllTeachers);
  // announcements / pengumuman 
route.get("/announcements", pengumumanController.showAllAnnouncements);
route.get("/showSingleAnnouncement/:id", pengumumanController.showSingleAnnouncement);

// LOGIN/LOGOUT ROUTE
route.get("/login", loginController.loginUser);
route.post("/login", loginController.loginUser);
route.get("/logout", loginController.logoutUser)
route.post('/logout', loginController.logoutUser);

// TRACK VISITORS ROUTE
route.get("/extracurricular", trackVisitors, ekskulController.showAllExtracurricular);
route.get("/gallery", trackVisitors, galeriController.showAllGallery);
route.get("/news", trackVisitors, beritaController.showAllNews);
route.get("/contact", trackVisitors, renders.contact);
route.get("/teacher", trackVisitors, guruController.showAllTeachers);
route.get("/announcements", trackVisitors, pengumumanController.showAllAnnouncements);

// ADMINISTRATION DASHBOARD ROUTES (admin)
route.get('/administrationDashboard', isAuthenticated, authorizeRole('admin', 'employee'), admDashboard.administrationDashboard);

  // profile sekolah
route.get("/updateProfileSekolah/:id", isAuthenticated, authorizeRole('admin', 'employee'), profileController.showUpdateProfile);
route.post("/updateProfileSekolah/:id", uploadFields, isAuthenticated, authorizeRole('admin', 'employee'), profileController.updateProfile);
  // ekstrakurikuler 
route.get("/ekstrakurikuler", isAuthenticated, authorizeRole('admin', 'employee'), ekskulController.showEkstrakurikulers);
route.get("/addEkstrakurikuler", isAuthenticated, authorizeRole('admin', 'employee'), ekskulController.showAddEkstrakurikulerForm);
route.post("/createEkstrakurikuler", upload.single('image'), ekskulController.createEkstrakurikuler);
route.get("/updateEkstrakurikuler/:id", isAuthenticated, authorizeRole('admin', 'employee'), ekskulController.showUpdateEkstrakurikuler);
route.post("/updateEkstrakurikuler/:id", upload.single('image'), ekskulController.updateEkstrakurikuler);
route.post("/deleteEkstrakurikuler/:id", ekskulController.deleteEkstrakurikuler);
  // galeri 
route.get("/galeri", isAuthenticated, authorizeRole('admin', 'employee'), galeriController.showGaleri);
route.get("/addGaleri", isAuthenticated, authorizeRole('admin', 'employee'), renders.addGaleri);
route.post("/createGaleri",  upload.single('image'), galeriController.createGaleri);
route.get("/updateGaleri/:id", isAuthenticated, authorizeRole('admin', 'employee'), galeriController.showUpdateGaleri);
route.post("/updateGaleri/:id", upload.single('image'), galeriController.updateGaleri);
route.post("/deleteGaleri/:id", galeriController.deleteGaleri);
  // berita 
route.get("/berita", isAuthenticated, authorizeRole('admin', 'employee'), beritaController.showBerita);
route.get("/addBerita", isAuthenticated, authorizeRole('admin', 'employee'), renders.addBerita);
route.post("/createBerita", upload.single('image'), beritaController.createBerita);
route.get("/updateBerita/:id", isAuthenticated, authorizeRole('admin', 'employee'), beritaController.showUpdateBerita);
route.post("/updateBerita/:id", upload.single('image'), beritaController.updateBerita);
route.post("/deleteBerita/:id", beritaController.deleteBerita)
  // pengumuman 
route.get("/pengumuman", isAuthenticated, authorizeRole('admin', 'employee'), pengumumanController.showPengumuman);
route.get("/addPengumuman", isAuthenticated, authorizeRole('admin', 'employee'), renders.addPengumuman);
route.post("/createPengumuman", upload.single('pengumuman_file'), pengumumanController.createPengumuman);
route.get("/updatePengumuman/:id", isAuthenticated, authorizeRole('admin', 'employee'), pengumumanController.showUpdatePengumuman);
route.post("/updatePengumuman/:id", upload.single('pengumuman_file'), pengumumanController.updatePengumuman);
route.post("/deletePengumuman/:id", pengumumanController.deletePengumuman)
route.get("/downloadAnnouncementFile/:id", pengumumanController.downloadAnnouncementFile);
  // guru
route.get("/guru", isAuthenticated, authorizeRole('admin', 'employee'), guruController.showGuru);
route.get("/addGuru", isAuthenticated, authorizeRole('admin', 'employee'), renders.addGuru);
route.post("/createGuru", upload.single('image'), guruController.createGuru);
route.get("/updateGuru/:id", isAuthenticated, authorizeRole('admin', 'employee'), guruController.showUpdateGuru);
route.post("/updateGuru/:id", upload.single('image'), guruController.updateGuru);
route.post("/deleteGuru/:id", guruController.deleteGuru);
  // users
route.get("/users", isAuthenticated, authorizeRole('admin'), usersController.showUsers);
route.get("/addUser", isAuthenticated, authorizeRole('admin'), renders.addUser);
route.post("/createUser", usersController.createUser);
route.get("/updateUser/:id", isAuthenticated, authorizeRole('admin'), usersController.showUpdateUser);
route.post("/updateUser/:id", usersController.updateUser);
route.post("/deleteUser/:id", usersController.deleteUser);


module.exports = route;
