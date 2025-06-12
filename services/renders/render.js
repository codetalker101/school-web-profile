
// HOME ROUTE
exports.homeRoutes = (req, res) => {
  res.render("index", {page: "homeRoutes"})
};

// NAVBAR ITEMS
exports.about = (req, res) => {
  res.render("insideNavbar/about", {page: "about"})
};
exports.extracurricular = (req, res) => {
  res.render("insideNavbar/extracurricular", {page: "showAllEkskul"})
};
exports.gallery = (req, res) => {
  res.render("insideNavbar/gallery", {page: "showAllGallery"})
};
exports.news = (req, res) => {
  res.render("insideNavbar/news", {page: "news"})
};
exports.contact = (req, res) => {
  res.render("insideNavbar/contact", {page: "contact"})
};
exports.extracurricularSingle = (req, res) => {
  res.render("insideNavbar/extracurricular-single", {page: "extracurricularSingle"})
};
exports.gallerySingle = (req, res) => {
  res.render("insideNavbar/gallery-single.ejs", {page: "gallerySingle"})
};
exports.newsSingle = (req, res) => {
  res.render("insideNavbar/news-single.ejs", {page: "newsSingle"})
};


// TOPBAR ITEMS 
exports.announcements = (req, res) => {
  res.render("insideTopbar/announcements", {page: "announcements"})
};
exports.announcementSingle = (req, res) => {
  res.render("insideTopbar/announcement-single", {page: "announcementSingle"})
};
exports.teacher = (req, res) => {
  res.render("insideTopbar/teacher", {page: "teacher"})
};


// ADMINISTRATION DASHBOARD (admin)
exports.administrationDashboard = (req, res) => {
  res.render("administration/indexAdm", { message: null, success: null, role: req.session.user.role });
}
exports.addProfileSekolah = (req, res) => {
  res.render("administration/profileSekolah/addProfileSekolah", { message: null, success: null, role: req.session.user.role });
};
exports.addGaleri = (req, res) => {
  res.render("administration/galeri/addGaleri", { message: null, success: null, role: req.session.user.role });
};
exports.addBerita = (req, res) => {
  res.render("administration/berita/addBerita", { message: null, success: null, role: req.session.user.role });
};
exports.addPengumuman = (req, res) => {
  res.render("administration/pengumuman/addPengumuman", { message: null, success: null, role: req.session.user.role });
};
exports.addGuru = (req, res) => {
  res.render("administration/guru/addGuru", { message: null, success: null, role: req.session.user.role });
};
exports.addUser = (req, res) => {
  res.render("administration/users/addUser", { message: null, success: null, role: req.session.user.role })
}

