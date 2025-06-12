--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: berita; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.berita (
    berita_id integer NOT NULL,
    judul character varying(255),
    keterangan text,
    tanggal date,
    beritaimg bytea,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    views integer DEFAULT 0
);


ALTER TABLE public.berita OWNER TO janghyun;

--
-- Name: berita_berita_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.berita_berita_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.berita_berita_id_seq OWNER TO janghyun;

--
-- Name: berita_berita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.berita_berita_id_seq OWNED BY public.berita.berita_id;


--
-- Name: ekstrakurikuler; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.ekstrakurikuler (
    ekskul_id integer NOT NULL,
    judul character varying(255) NOT NULL,
    subjudul character varying(255),
    keterangan text,
    ekskulimg character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    guru_id integer
);


ALTER TABLE public.ekstrakurikuler OWNER TO janghyun;

--
-- Name: ekstrakurikular_ekskul_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.ekstrakurikular_ekskul_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ekstrakurikular_ekskul_id_seq OWNER TO janghyun;

--
-- Name: ekstrakurikular_ekskul_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.ekstrakurikular_ekskul_id_seq OWNED BY public.ekstrakurikuler.ekskul_id;


--
-- Name: galeri; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.galeri (
    galeri_id integer NOT NULL,
    judul character varying(255) NOT NULL,
    galeriimg bytea NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.galeri OWNER TO janghyun;

--
-- Name: galeri_galeri_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.galeri_galeri_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galeri_galeri_id_seq OWNER TO janghyun;

--
-- Name: galeri_galeri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.galeri_galeri_id_seq OWNED BY public.galeri.galeri_id;


--
-- Name: guru; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.guru (
    guru_id integer NOT NULL,
    nama character varying(50),
    pendidikan character varying(50),
    jabatan text,
    guruimg bytea,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.guru OWNER TO janghyun;

--
-- Name: guru_guru_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.guru_guru_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.guru_guru_id_seq OWNER TO janghyun;

--
-- Name: guru_guru_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.guru_guru_id_seq OWNED BY public.guru.guru_id;


--
-- Name: pengumuman; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.pengumuman (
    pengumuman_id integer NOT NULL,
    judul character varying(255),
    keterangan text,
    tanggal date,
    pengumuman_file bytea,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pengumuman OWNER TO janghyun;

--
-- Name: pengumuman_pengumuman_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.pengumuman_pengumuman_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pengumuman_pengumuman_id_seq OWNER TO janghyun;

--
-- Name: pengumuman_pengumuman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.pengumuman_pengumuman_id_seq OWNED BY public.pengumuman.pengumuman_id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.profile (
    profile_id integer NOT NULL,
    sejarah text,
    namakepsek character varying(255),
    tentangkepsek text,
    visimisi text,
    programkerja text,
    komitesekolah text,
    prestasisiswa text,
    bannerimg bytea,
    kepsekimg bytea,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.profile OWNER TO janghyun;

--
-- Name: profile_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.profile_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profile_profile_id_seq OWNER TO janghyun;

--
-- Name: profile_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.profile_profile_id_seq OWNED BY public.profile.profile_id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO janghyun;

--
-- Name: users; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    notlp character varying(15),
    role character varying(20) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'employee'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO janghyun;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO janghyun;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: visitor_ips; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.visitor_ips (
    id integer NOT NULL,
    ip_address character varying(255) NOT NULL,
    visited_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.visitor_ips OWNER TO janghyun;

--
-- Name: visitor_ips_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.visitor_ips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.visitor_ips_id_seq OWNER TO janghyun;

--
-- Name: visitor_ips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.visitor_ips_id_seq OWNED BY public.visitor_ips.id;


--
-- Name: visitor_stats; Type: TABLE; Schema: public; Owner: janghyun
--

CREATE TABLE public.visitor_stats (
    id integer NOT NULL,
    total_visitors integer DEFAULT 0
);


ALTER TABLE public.visitor_stats OWNER TO janghyun;

--
-- Name: visitor_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: janghyun
--

CREATE SEQUENCE public.visitor_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.visitor_stats_id_seq OWNER TO janghyun;

--
-- Name: visitor_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: janghyun
--

ALTER SEQUENCE public.visitor_stats_id_seq OWNED BY public.visitor_stats.id;


--
-- Name: berita berita_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.berita ALTER COLUMN berita_id SET DEFAULT nextval('public.berita_berita_id_seq'::regclass);


--
-- Name: ekstrakurikuler ekskul_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.ekstrakurikuler ALTER COLUMN ekskul_id SET DEFAULT nextval('public.ekstrakurikular_ekskul_id_seq'::regclass);


--
-- Name: galeri galeri_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.galeri ALTER COLUMN galeri_id SET DEFAULT nextval('public.galeri_galeri_id_seq'::regclass);


--
-- Name: guru guru_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.guru ALTER COLUMN guru_id SET DEFAULT nextval('public.guru_guru_id_seq'::regclass);


--
-- Name: pengumuman pengumuman_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.pengumuman ALTER COLUMN pengumuman_id SET DEFAULT nextval('public.pengumuman_pengumuman_id_seq'::regclass);


--
-- Name: profile profile_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.profile ALTER COLUMN profile_id SET DEFAULT nextval('public.profile_profile_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: visitor_ips id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.visitor_ips ALTER COLUMN id SET DEFAULT nextval('public.visitor_ips_id_seq'::regclass);


--
-- Name: visitor_stats id; Type: DEFAULT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.visitor_stats ALTER COLUMN id SET DEFAULT nextval('public.visitor_stats_id_seq'::regclass);


--
-- Data for Name: berita; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.berita (berita_id, judul, keterangan, tanggal, beritaimg, created_at, views) FROM stdin;
28	MI Al Ikhlas Karangpucung Raih Prestasi di Ajang Lomba Cerdas Cermat Kecamatan	<p>Siswa-siswi MI Al Ikhlas Karangpucung kembali menorehkan prestasi membanggakan dalam ajang lomba tingkat kecamatan. Dalam Lomba Cerdas Cermat Agama (LCCA) tingkat kecamatan, tim perwakilan MI Al Ikhlas berhasil meraih <strong>Juara 3</strong>, menunjukkan kemampuan luar biasa dalam pemahaman materi keislaman dan kerja sama tim yang solid.</p><p>Tak hanya itu, dalam Lomba Cerdas Cermat Umum (LCCU) tingkat kecamatan, tim dari MI Al Ikhlas juga berhasil meraih <strong>Juara Harapan 1</strong>, sebuah pencapaian yang membuktikan semangat juang dan daya saing siswa dalam berbagai bidang pengetahuan.</p><p>Prestasi ini menjadi bukti nyata dari komitmen MI Al Ikhlas Karangpucung dalam membina generasi muda yang cerdas, terampil, dan berakhlak mulia. Seluruh keluarga besar sekolah mengucapkan selamat dan apresiasi setinggi-tingginya kepada para siswa serta para guru pembimbing yang telah berkontribusi dalam meraih hasil terbaik.</p><p>Semoga prestasi ini menjadi motivasi bagi seluruh siswa untuk terus belajar dan berprestasi di berbagai bidang.</p><p><br></p><p><br></p><p>Admin</p>	2024-10-06	\\x313734393730323238363838372e706e67	2025-05-28 01:01:03.80924	3
27	Penerimaan Peserta Didik Baru (PPDB) MI Al Ikhlas Karangpucung Tahun Ajaran 2025/2026 Resmi Dibuka	<p><strong>MI Al Ikhlas Karangpucung</strong> secara resmi membuka Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026. Pendaftaran dibuka dalam tiga gelombang, <strong>dimulai dari tanggal 2 Januari hingga 13 Juli 2025</strong>. Adapun jadwal pendaftaran setiap gelombangnya adalah sebagai berikut:</p><p><br></p><ul><li><strong>Gelombang 1</strong>: 2 Januari – 28 Februari 2025</li><li><strong>Gelombang 2</strong>: 1 Maret – 30 April 2025</li><li><strong>Gelombang 3</strong>: 2 Mei – 13 Juli 2025</li></ul><p><br></p><p>PPDB tahun ini terbuka untuk masyarakat umum, khususnya bagi orang tua yang ingin memberikan pendidikan dasar terbaik bagi putra-putrinya. MI Al Ikhlas Karangpucung mengintegrasikan kurikulum nasional dengan pendidikan keislaman yang kuat, serta ditunjang dengan tenaga pendidik profesional dan lingkungan belajar yang nyaman dan islami.</p><p>Proses pendaftaran dapat dilakukan langsung di sekolah setiap hari kerja pukul 08.00–12.00 WIB atau melalui layanan pendaftaran online yang tersedia di situs resmi MI Al Ikhlas Karangpucung. Calon peserta didik diharapkan memenuhi persyaratan administrasi yang telah ditentukan, seperti fotokopi akta kelahiran, Kartu Keluarga, dan pas foto terbaru.</p><p>Jangan lewatkan kesempatan emas ini. Mari bergabung bersama MI Al Ikhlas Karangpucung dan wujudkan masa depan cerah bagi generasi Islami yang cerdas, santun, dan berprestasi.</p><p><br></p><p><br></p><p>Admin</p>	2025-01-01	\\x313734393730323430363432302e706e67	2025-05-28 00:52:47.725462	5
\.


--
-- Data for Name: ekstrakurikuler; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.ekstrakurikuler (ekskul_id, judul, subjudul, keterangan, ekskulimg, created_at, guru_id) FROM stdin;
9	Ekstrakurikuler Komputer	Mengenal dan memahami fungsi-fungsi komputer	<p>Dalam menghadapi era digital, MI Al Ikhlas Karangpucung menghadirkan <strong>ekstrakurikuler komputer</strong> sebagai salah satu program pengembangan keterampilan siswa di bidang teknologi informasi. Kegiatan ini bertujuan membekali siswa sejak dini dengan pengetahuan dasar tentang dunia komputer dan teknologi digital secara islami dan edukatif.</p><p>Melalui ekstrakurikuler ini, siswa dikenalkan pada:</p><p><br></p><ul><li><strong>Pengenalan perangkat komputer</strong> (hardware &amp; software)</li><li><strong>Dasar-dasar pengoperasian komputer</strong> (menggunakan mouse, keyboard, dan antarmuka desktop)</li><li><strong>Belajar mengetik 10 jari</strong> secara bertahap</li><li><strong>Penggunaan aplikasi dasar</strong> seperti Microsoft Word, Paint, dan PowerPoint</li><li><strong>Pengenalan internet sehat dan edukatif</strong></li><li><strong>Pembuatan media sederhana</strong> seperti poster atau presentasi menggunakan komputer</li></ul><p><br></p><p>Kegiatan dilaksanakan secara praktis di laboratorium komputer sekolah dengan bimbingan guru yang berkompeten. Dengan suasana belajar yang menyenangkan, siswa tidak hanya belajar teori tetapi langsung praktik menggunakan perangkat yang tersedia.</p><p>Ekstrakurikuler komputer diharapkan dapat menumbuhkan <strong>minat teknologi, logika berpikir, dan keterampilan digital</strong> siswa sebagai bekal menghadapi dunia yang semakin berbasis teknologi.</p>	1749702318169.jpeg	2025-01-23 22:46:57.014519	4
6	Ekstrakurikuler Hizbul Wathan	Mengenal apa itu Hizbul Wathan	<p><strong>Hizbul Wathan (HW)</strong> adalah salah satu ekstrakurikuler wajib di MI Al Ikhlas Karangpucung yang bergerak di bidang kepanduan Islam. Kegiatan ini merupakan bagian dari gerakan kepanduan Muhammadiyah yang bertujuan membentuk karakter siswa yang <strong>disiplin, mandiri, bertanggung jawab, dan berakhlak mulia</strong>.</p><p>Kata <em>Hizbul Wathan</em> berarti "Pasukan Tanah Air", dan semangat ini tercermin dalam setiap kegiatan yang menanamkan rasa cinta kepada agama, bangsa, dan lingkungan.</p><h4><strong>Tujuan Kegiatan Hizbul Wathan:</strong></h4><p><br></p><ul><li>Menumbuhkan jiwa kepemimpinan dan tanggung jawab sejak dini.</li><li>Melatih kedisiplinan, kemandirian, dan kerjasama tim.</li><li>Membina mental spiritual siswa melalui kegiatan yang menyenangkan dan edukatif.</li><li>Mempersiapkan siswa menjadi kader umat dan bangsa yang tangguh dan beriman.</li></ul><p><br></p><h4><strong>Kegiatan Rutin Hizbul Wathan:</strong></h4><p><br></p><ul><li>Latihan baris-berbaris (PBB)</li><li>Tali-temali dan pertolongan pertama</li><li>Penjelajahan dan outbound ringan</li><li>Latihan yel-yel dan kekompakan regu</li><li>Kegiatan keagamaan seperti tadarus dan kultum</li><li>Kemah ceria dan jambore tingkat sekolah atau kecamatan</li></ul><p><br></p><p>Hizbul Wathan di MI Al Ikhlas Karangpucung dilaksanakan secara berkala dan dipandu oleh pembina terlatih yang berpengalaman dalam kegiatan kepanduan. Kegiatan ini tidak hanya melatih fisik dan mental, tetapi juga menjadi sarana menyenangkan bagi siswa untuk belajar nilai-nilai Islam secara praktis.</p><p>Dengan mengikuti ekstrakurikuler Hizbul Wathan, siswa diharapkan tumbuh menjadi pribadi yang <strong>tangguh, berjiwa pemimpin, dan memiliki kepedulian sosial tinggi</strong>.</p>	1749702329110.jpg	2024-12-09 20:22:37.450884	6
\.


--
-- Data for Name: galeri; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.galeri (galeri_id, judul, galeriimg, created_at) FROM stdin;
16	Kegiatan Ekstrakurikuler Komputer	\\x313734393730323334333137332e6a706567	2025-06-12 11:25:43.177699
13	Kegiatan Ekstrakurikuler Hizbul Wathan	\\x313734393730323335353636322e6a7067	2025-06-12 11:25:55.664549
9	Belajar Menyenangkan	\\x313734393730323337313131322e6a7067	2025-06-12 11:26:11.113262
\.


--
-- Data for Name: guru; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.guru (guru_id, nama, pendidikan, jabatan, guruimg, created_at) FROM stdin;
6	Yoyon Suwastiono Subari, S.Ag	Sarjana Agama	<p>Kepala Madrasah</p>	\\x313734383336393734343130342e6a7067	2025-05-22 23:21:37.355104
4	Siti Musklihah, M.Pd.I	Magister Pendidikan	<p>Guru PAI</p>	\\x313734383336393834353531392e6a7067	2025-01-23 21:01:06.853908
3	Muammarot Uzzakiyyah, S.Pd.I	Sarjana Pendidikan	<p>Wali Kelas I</p>	\\x313734383336393931363830372e6a7067	2025-01-23 01:53:43.579152
1	Lili Sri Robikah, S.Pd.I	Sarjana Pendidikan	<p>Wali Kelas II</p>	\\x313734383336393938333939332e6a7067	2024-12-27 17:37:02.05002
7	Dewi Sulastri, S.Pd.	Sarjana Pendidikan	<p>Bendahara</p>	\\x313734393538333134393738382e6a7067	2025-06-11 02:19:09.7954
8	Dewinta Sera Saputri S.Pd	Sarjana Pendidikan	<p>Operator Madrasah</p>	\\x313734393538333139353638332e6a7067	2025-06-11 02:19:55.685575
9	Yuli Istiqomah S.Ag	Sarjana Agama	<p>Bidang Sarana Prasarana</p>	\\x313734393538333238313937302e6a7067	2025-06-11 02:21:21.973654
10	Heri Purnomo S.E	Sarjana Ekonomi	<ol><li class="ql-align-justify">Bidang Humas</li><li class="ql-align-justify">Pembimbing Ekstrakurikuler Hizbul Wathan</li></ol><p><br></p>	\\x313734393538333639323837382e6a7067	2025-06-11 02:28:12.880532
\.


--
-- Data for Name: pengumuman; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.pengumuman (pengumuman_id, judul, keterangan, tanggal, pengumuman_file, created_at) FROM stdin;
5	Libur Idul Adha	<p>Assalamu’alaikum warahmatullahi wabarakatuh,</p><p><br></p><p>MI Al Ikhlas Karangpucung mengucapkan:</p><p> <strong>Selamat Hari Raya Idul Adha 1446 H / 2025 M</strong></p><p> <em>Semoga semangat qurban menumbuhkan keikhlasan dan kepedulian dalam diri kita semua.</em></p><p>📅 <strong>Hari Raya Idul Adha</strong>: Senin, 8 Juni 2025</p><p> 📌 <strong>Libur Sekolah</strong>: 6–10 Juni 2025</p><p> 🕋 <strong>KBM Aktif Kembali</strong>: Rabu, 11 Juni 2025</p><p><br></p><p>InsyaAllah akan dilaksanakan kegiatan penyembelihan hewan qurban dan edukasi makna qurban bagi siswa.</p><p><br></p><p>Wassalamu’alaikum warahmatullahi wabarakatuh.</p>	2025-05-28	\\x313734373835383637363639342e6a7067	2025-05-28 03:08:29.023751
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.profile (profile_id, sejarah, namakepsek, tentangkepsek, visimisi, programkerja, komitesekolah, prestasisiswa, bannerimg, kepsekimg, created_at) FROM stdin;
13	<p>Kondisi awal <strong>MI Al Ikhlas Karangpucung</strong> sangat sederhana dengan tanah wakaf dari <strong>Bapak H. Yasum</strong> seluas 385 m2. Atas inisiatif <strong>Bp. H Soediro, B.A</strong> ( alm ) dibuatlah madrasah selanjutnya atas kerjasama yang baik antara pengurus, komite, kepala madrasah, tenaga pendidik dan kependidikan, para donatur, serta partisipasi masyarakat yang sangat tinggi, maka dari tahun ke tahun senantiasa mengalami kemajuan baik di segi fisik atau gedung tempat pembelajaran maupun sarana dan prasarana yang dimilikinya. Seiring dengan perkembangan waktu dapat meluaskan bangunan dan memenuhi kebutuhan ruang belajar dengan cara mandiri. Saat ini luas tanah yang dimiliki MI Al Ikhlas Karangpucung 385 m². Luas gedung yang dimiliki MI Al Ikhlas Karangpucung 350 m². <strong>MI Al Ikhlas Karangpucung</strong> mengalami beberapa pergantian kepemimpinan, mulai dari Ibu Sumiyatun, Ama, Bapak Daryono, S.Ag, dan Ibu Amin Suntari, S.PdI, (1985-2019). Ketiga orang tersebut pegawai negeri.Sipil yang diperbantukan Pada tahun 1985 diangkatlah Ibu Hayyinah, A.Ma sebagai kepala MI Al Ikhlas Karangpucung oleh pihak yayasan. Sejak bulan Juli 1985 . Pada tahun 2020 diangkatlah bapak Yoyon Suwastiono Subari, S.Ag sebagai kepala madrasah sampai sekarang.</p>	Yoyon Suwastiono Subari, S.Ag	<p>Assalamu’alaikum Warahmatullahi Wabarakatuh,</p><p><br></p><p>Puji syukur kita panjatkan ke hadirat Allah SWT atas segala rahmat-Nya. Saya, <strong>Yoyon Suwastiono Subari, S.Ag</strong>, selaku Kepala Madrasah <strong>MI Al Ikhlas Karangpucung</strong>, mengajak seluruh orang tua dan masyarakat untuk bersama-sama membina generasi yang cerdas, beriman, dan berakhlakul karimah.</p><p>Melalui pendidikan yang terpadu antara ilmu umum dan ilmu agama, kami berkomitmen menciptakan lingkungan belajar yang Islami, nyaman, dan berkualitas.</p><p><br></p><p>Mari kita bergandengan tangan demi masa depan anak-anak kita yang lebih baik.</p><p><br></p><p>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p><p><br></p><p>Hormat saya,</p><p><strong>Yoyon Suwastiono Subari, S.Ag</strong></p><p>Kepala Madrasah MI Al Ikhlas Karangpucung</p>	<p class="ql-align-justify"><strong>VISI</strong></p><p class="ql-align-justify">“ Mewujudkan Peserta didik yang Beriman, Bertaqwa, Unggul dalam berilmu Pengetahuan Islam, teknologi informasi dan Olah raga serta berkarakter Pancasila. “</p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><strong>MISI</strong></p><ol><li class="ql-align-justify">Optimalisasi Pengenalan Ilmu Pengetahuan Islam sesuai kurikulum yang telah ditetapkan ( KMA 184 ) dan implementasinya disertai penanaman nilai nilai karakter Islami melalui kegiatan belajar mengajar yang efektif efisien.</li><li class="ql-align-justify">Berupaya aktif mengikuti berbagai kompetisi di bidang akademik dan non akedemik ( aksioma, Kompetisi Sains Madrasah, )</li><li class="ql-align-justify">Optimalisasi pelaksanaan ibadah dan kegiatan pembiasaan sehari hari sesuai kurikulum yang telah ditetapkan ( KMA 184 )</li><li class="ql-align-justify">Pengenalan dan implementasi ilmu pengetahuan dan teknologi informasi komputer pada kelas tinggi melalui kegiatan ekstra kurikuler sebagai pendukung pelaksanaan ANBK, dan KSM</li><li class="ql-align-justify">Optimalisasi Pengenalan Ilmu Pengetahuan Islam sesuai kurikulum yang telah ditetapkan ( KMA 184 ) dan implementasinya disertai penanaman nilai nilai karakter Islami melalui kegiatan belajar mengajar yang efektif efisien.</li><li class="ql-align-justify">Berupaya aktif mengikuti berbagai kompetisi di bidang akademik dan non akedemik ( aksioma, Kompetisi Sains Madrasah, )</li><li class="ql-align-justify">Optimalisasi pelaksanaan ibadah dan kegiatan pembiasaan sehari hari sesuai kurikulum yang telah ditetapkan ( KMA 184 )</li><li class="ql-align-justify">Pengenalan dan implementasi ilmu pengetahuan dan teknologi informasi komputer pada kelas tinggi melalui kegiatan ekstra kurikuler sebagai pendukung pelaksanaan ANBK, dan KSM</li><li class="ql-align-justify">Internalisasi nilai nilai Alquran dan hadits serta nilai Pancasila pada berbagai mata pelajaran yang dikembangkan melalui Proyek Penguatan Profil Pelajar Pancasila dan Profil Pelajar Rahmatan lil ‘alaamiin.</li></ol>	<p class="ql-align-justify">MI Al Ikhlas Karangpucung berkomitmen untuk mencetak generasi yang cerdas secara intelektual, kuat secara spiritual, dan tangguh dalam menghadapi tantangan zaman. Untuk mewujudkan hal tersebut, sekolah menghadirkan berbagai <strong>program unggulan</strong> yang dirancang secara sistematis dan terintegrasi dengan nilai-nilai Islam. Berikut beberapa program unggulan kami:</p><ol><li class="ql-align-justify">Tahfidzul Qur'an</li><li class="ql-align-justify">Program pembinaan hafalan Al-Qur’an yang dilaksanakan secara bertahap sesuai kemampuan siswa. Diharapkan lulusan MI Al Ikhlas memiliki hafalan minimal 1–2 juz dengan bacaan yang baik dan tartil.</li><li class="ql-align-justify">Shalat Dhuha &amp; Dzikir Pagi Rutin</li><li class="ql-align-justify">Setiap pagi siswa dibiasakan memulai hari dengan shalat dhuha berjamaah dan dzikir pagi untuk membentuk karakter spiritual dan akhlak mulia sejak dini.</li><li class="ql-align-justify">Pembelajaran Bahasa Arab dan Inggris</li><li class="ql-align-justify">Pengenalan dan penguatan bahasa asing sebagai bekal siswa menghadapi era globalisasi. Pembelajaran dilakukan secara kontekstual dan menyenangkan.</li><li class="ql-align-justify">Ekstrakurikuler Islami dan Kreatif</li><li class="ql-align-justify">Mulai dari Hizbul Wathan, hadroh, marawis, hingga seni kaligrafi, untuk menggali potensi dan bakat siswa dalam nuansa islami.</li><li class="ql-align-justify">Literasi dan Numerasi Terpadu</li><li class="ql-align-justify">Program pembiasaan membaca dan peningkatan kemampuan numerasi melalui kegiatan harian, pojok literasi, dan lomba-lomba edukatif.</li><li class="ql-align-justify">Bimbingan Karakter dan Akhlak</li><li class="ql-align-justify">Melalui kegiatan keagamaan, pembiasaan harian, serta keteladanan guru, siswa dibina untuk menjadi pribadi yang jujur, sopan, dan bertanggung jawab.</li><li class="ql-align-justify">Kegiatan Kewirausahaan Siswa (Student Entrepreneurship)</li><li class="ql-align-justify">Diperkenalkan melalui kegiatan mini market sekolah, bazar, atau proyek kecil, guna menumbuhkan jiwa mandiri dan kreatif.</li></ol><p><br></p>	<p><strong>Ketua Komite&nbsp;</strong>:&nbsp;H. Komar, S.Pd</p>	<ol><li>&nbsp;Juara 3 - Lomba Cerdas Cermat Agama (LCCA) tingkat kecamatan.</li><li>&nbsp;Juara harapan 1 - Lomba Cerdas Cermat Umum (LCCU) tingkat kecamatan.</li></ol>	\\x313734393730323033303837332e6a706567	\\x313734393730323134393936392e6a7067	2024-12-23 01:10:05.69323
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.session (sid, sess, expire) FROM stdin;
aB5FfxC5Web060LsfRrVpNp_AWlAUsDC	{"cookie":{"originalMaxAge":3600000,"expires":"2025-06-12T18:06:21.075Z","httpOnly":true,"path":"/"},"visited":true}	2025-06-13 01:13:44
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.users (user_id, username, name, notlp, role, password, created_at) FROM stdin;
2	pegawai	pegawai	082153676453	employee	$2b$10$.iLscSOkNpAHsgSfW1IkL.HKTli.wH1lfr9pYIPXHTwMKQrKuP9Q6	2024-12-08 23:13:33.252342
1	admin	admin	081254637281	admin	$2b$10$NN44Efa6/ilKHVsbhQZ2Te8LIaCwTxZRQ71l4Qy8j8lwoFptE39ze	2024-12-08 23:13:05.760442
\.


--
-- Data for Name: visitor_ips; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.visitor_ips (id, ip_address, visited_at) FROM stdin;
1	::1	2025-06-13 00:05:17.819762
\.


--
-- Data for Name: visitor_stats; Type: TABLE DATA; Schema: public; Owner: janghyun
--

COPY public.visitor_stats (id, total_visitors) FROM stdin;
1	1
\.


--
-- Name: berita_berita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.berita_berita_id_seq', 28, true);


--
-- Name: ekstrakurikular_ekskul_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.ekstrakurikular_ekskul_id_seq', 19, true);


--
-- Name: galeri_galeri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.galeri_galeri_id_seq', 16, true);


--
-- Name: guru_guru_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.guru_guru_id_seq', 10, true);


--
-- Name: pengumuman_pengumuman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.pengumuman_pengumuman_id_seq', 5, true);


--
-- Name: profile_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.profile_profile_id_seq', 14, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: visitor_ips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.visitor_ips_id_seq', 1, true);


--
-- Name: visitor_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: janghyun
--

SELECT pg_catalog.setval('public.visitor_stats_id_seq', 1, true);


--
-- Name: berita berita_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.berita
    ADD CONSTRAINT berita_pkey PRIMARY KEY (berita_id);


--
-- Name: ekstrakurikuler ekstrakurikular_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.ekstrakurikuler
    ADD CONSTRAINT ekstrakurikular_pkey PRIMARY KEY (ekskul_id);


--
-- Name: galeri galeri_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.galeri
    ADD CONSTRAINT galeri_pkey PRIMARY KEY (galeri_id);


--
-- Name: guru guru_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.guru
    ADD CONSTRAINT guru_pkey PRIMARY KEY (guru_id);


--
-- Name: pengumuman pengumuman_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.pengumuman
    ADD CONSTRAINT pengumuman_pkey PRIMARY KEY (pengumuman_id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (profile_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: visitor_ips visitor_ips_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.visitor_ips
    ADD CONSTRAINT visitor_ips_pkey PRIMARY KEY (id);


--
-- Name: visitor_stats visitor_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.visitor_stats
    ADD CONSTRAINT visitor_stats_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: janghyun
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: ekstrakurikuler ekstrakurikuler_guru_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: janghyun
--

ALTER TABLE ONLY public.ekstrakurikuler
    ADD CONSTRAINT ekstrakurikuler_guru_id_fkey FOREIGN KEY (guru_id) REFERENCES public.guru(guru_id);


--
-- PostgreSQL database dump complete
--

