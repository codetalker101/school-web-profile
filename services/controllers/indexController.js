const pool = require("../database/db");

exports.showLatestItems = async (req, res) => {
  const stripHTML = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  };

  try {
    // Fetch the latest 3 news and gallery items
    const berita = await pool.query("SELECT * FROM berita ORDER BY tanggal DESC LIMIT 3");

    const gallery = await pool.query("SELECT * FROM galeri ORDER BY created_at DESC LIMIT 3");
    const galleryList = gallery.rows;

    // Sanitize and shorten description
    const beritaList = berita.rows.map((item) => {
      const cleanText = stripHTML(item.keterangan || "");
      return {
        ...item,
        shortDesc: cleanText.length > 100 ? cleanText.slice(0, 100) + "..." : cleanText,
      };
    });
    
    // Check if there are no news or gallery items
    if ((!beritaList || beritaList.length === 0) && (!galleryList || galleryList.length === 0)) {
      return res.render("index", {
        message: "Tidak ditemukan aktivitas dari berita dan galeri.",
        beritaList: [],
        galleryList: [],
      });
    }

    // Format the dates for the news items
    const formattedBeritaList = beritaList.map((berita) => {
      const date = new Date(berita.tanggal); // Assuming 'tanggal' is the date column
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return {
        ...berita,
        formattedDate,
      };
    });

    // Render the index.ejs page with berita and gallery data
    res.render("index", {
      page: "showLatestItems",
      beritaList: formattedBeritaList,
      galleryList: galleryList
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil berita atau galeri:", error);

    // Pass an empty array for beritaList and galleryList on error
    res.status(500).render("index", {
      message: "Gagal memuat berita atau aktivitas galeri.",
      beritaList: [],
      galleryList: [],
    });
  }
};
