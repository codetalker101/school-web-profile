// QUILL TOOLBAR SETTING
const quillToolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
];

// profile sekolah
const quillSejarah = new Quill('#editor-sejarah', {
  theme: 'snow',
  placeholder: 'Masukkan sejarah singkat sekolah...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

const quillTentangkepsek = new Quill('#editor-tentangkepsek', {
  theme: 'snow',
  placeholder: 'Masukkan tentang kepala sekolah...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

const quillVisimisi = new Quill('#editor-visimisi', {
  theme: 'snow',
  placeholder: 'Masukkan visi dan misi sekolah...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

const quillProgramkerja = new Quill('#editor-programkerja', {
  theme: 'snow',
  placeholder: 'Masukkan program kerja...',
  modules: {
    toolbar: quillToolbarOptions
  }
});
const quillKomitesekolah = new Quill('#editor-komitesekolah', {
  theme: 'snow',
  placeholder: 'Masukkan komite sekolah...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

const quillPrestasisiswa = new Quill('#editor-prestasisiswa', {
  theme: 'snow',
  placeholder: 'Masukkan prestasi siswa...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

// ekstrakurikuler
const quillEkstrakurikuler = new Quill('#editor-ekstrakurikuler', {
  theme: 'snow',
  placeholder: 'Masukkan ekstrakurikuler...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

// berita
const quillBerita = new Quill('#editor-berita', {
  theme: 'snow',
  placeholder: 'Masukkan keterangan tentang berita...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

// pengumuman
const quillPengumuman = new Quill('#editor-pengumuman', {
  theme: 'snow',
  placeholder: 'Masukkan keterangan dari pengumuman...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

// guru
const quillGuru = new Quill('#editor-guru', {
  theme: 'snow',
  placeholder: 'Masukkan jabatan guru...',
  modules: {
    toolbar: quillToolbarOptions
  }
});

// CALL FUNCTION BEFORE SUBMITTING THE FORM
// profile sekolah quill
function prepareProfileSekolahSubmit() {
  document.getElementById('sejarah').value = quillSejarah.root.innerHTML;
  document.getElementById('tentangkepsek').value = quillTentangkepsek.root.innerHTML;
  document.getElementById('visimisi').value = quillVisimisi.root.innerHTML;
  document.getElementById('programkerja').value = quillProgramkerja.root.innerHTML;
  document.getElementById('komitesekolah').value = quillKomitesekolah.root.innerHTML;
  document.getElementById('prestasisiswa').value = quillPrestasisiswa.root.innerHTML;
  return true;
}

// berita quill
function prepareBeritaSubmit() {
  document.getElementById('keteranganberita').value = quillBerita.root.innerHTML;
}

// ekstrakurikuler quill
function prepareEkstrakurikulerSubmit() {
  document.getElementById('keteranganekstrakurikuler').value = quillEkstrakurikuler.root.innerHTML
}

// pengumuman quill
function preparePengumumanSubmit() {
  document.getElementById('keteranganpengumuman').value = quillPengumuman.root.innerHTML
}

// guru quill
function prepareGuruSubmit() {
  document.getElementById('jabatanguru').value = quillGuru.root.innerHTML
}


document.addEventListener("DOMContentLoaded", function () {
  // updateProfileSekolah
  const updateProfileForm = document.querySelector("form[action^='/updateProfileSekolah']");
  if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", function () {
      prepareProfileSekolahSubmit();
    });
  }

// Add Ekstrakurikuler
  const addEkstrakurikulerForm = document.querySelector("form[action^='/addEkstrakurikuler']");
  if (addEkstrakurikulerForm) {
    addEkstrakurikulerForm.addEventListener("submit", function () {
      prepareEkstrakurikulerSubmit();
    });
  }

  // Update Ekstrakurikuler
  const ekskulHiddenInput = document.getElementById("keteranganekstrakurikuler");
  if (ekskulHiddenInput && ekskulHiddenInput.value && typeof quillEkstrakurikuler !== "undefined") {
    quillEkstrakurikuler.root.innerHTML = ekskulHiddenInput.value;
  }

  // Add Berita
  const addBeritaForm = document.querySelector("form[action^='/addBerita']");
  if (addBeritaForm) {
    addBeritaForm.addEventListener("submit", function () {
      prepareBeritaSubmit();
    });
  }

  // Update Berita
  const beritaHiddenInput = document.getElementById("keteranganberita");
  if (beritaHiddenInput && beritaHiddenInput.value && typeof quillBerita !== "undefined") {
    quillBerita.root.innerHTML = beritaHiddenInput.value;
  }

  // Add Pengumuman
  const addPengumumanForm = document.querySelector("form[action^='/addPengumuman']");
  if (addPengumumanForm) {
    addPengumumanForm.addEventListener("submit", function () {
      preparePengumumanSubmit();
    });
  }

  // Update Pengumuman
  const pengumumanHiddenInput = document.getElementById("keteranganpengumuman");
  if (pengumumanHiddenInput && pengumumanHiddenInput.value && typeof quillPengumuman !== "undefined") {
    quillPengumuman.root.innerHTML = pengumumanHiddenInput.value;
  }

  // Add Guru
  const addGuruForm = document.querySelector("form[action^='/addGuru']");
  if (addGuruForm) {
    addGuruForm.addEventListener("submit", function () {
      prepareGuruSubmit();
    });
  }

  // Update Guru 
  const GuruHiddenInput = document.getElementById("jabatanguru");
  if (guruHiddenInput && guruHiddenInput.value && typeof quillGuru !== "undefined") {
    quillGuru.root.innerHTML = guruHiddenInput.value;
  }

});
