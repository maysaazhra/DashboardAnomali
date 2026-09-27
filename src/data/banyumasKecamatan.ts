export interface BPSWilayah {
  kode: string;
  nama: string;
  lat: number;
  lng: number;
  jumlahPendudukEst?: number;
  estimasiUsaha: number;
  zonaWilayah: "Purwokerto Urban" | "Banyumas Barat" | "Banyumas Timur" | "Banyumas Selatan" | "Banyumas Utara";
  deskripsi: string;
}

export const BANYUMAS_KECAMATAN_LIST: BPSWilayah[] = [
  {
    kode: "33.02.01",
    nama: "Lumbir",
    lat: -7.5303,
    lng: 108.9714,
    estimasiUsaha: 1450,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "Kecamatan di wilayah barat batas Cilacap & Jabar, dominasi usaha perkebunan, perdagangan kecil, & kayu."
  },
  {
    kode: "33.02.02",
    nama: "Wangon",
    lat: -7.5147,
    lng: 109.0526,
    estimasiUsaha: 3820,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "Pusat persimpangan jalur lintas selatan Jawa, potensi perdagangan komersial, logistik, & rumah makan."
  },
  {
    kode: "33.02.03",
    nama: "Jatilawang",
    lat: -7.5458,
    lng: 109.1235,
    estimasiUsaha: 2940,
    zonaWilayah: "Banyumas Selatan",
    deskripsi: "Kecamatan perlintasan utama Wangon-Rawalo dengan aktivitas pasar tradisional & usaha pertanian."
  },
  {
    kode: "33.02.04",
    nama: "Rawalo",
    lat: -7.5312,
    lng: 109.1764,
    estimasiUsaha: 2650,
    zonaWilayah: "Banyumas Selatan",
    deskripsi: "Kecamatan tepi sungai Serayu dengan industri kecil kerajinan, kuliner khas, & pertambangan pasir."
  },
  {
    kode: "33.02.05",
    nama: "Kebasen",
    lat: -7.5489,
    lng: 109.2315,
    estimasiUsaha: 3100,
    zonaWilayah: "Banyumas Selatan",
    deskripsi: "Wilayah jalur kereta api & terowongan Kebasen, dominasi usaha olahan makanan & industri genteng/bata."
  },
  {
    kode: "33.02.06",
    nama: "Kemranjen",
    lat: -7.5812,
    lng: 109.3012,
    estimasiUsaha: 3420,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "Pusat sentra durian Bawor, agribisnis buah, toko kelontong, & peternakan unggas."
  },
  {
    kode: "33.02.07",
    nama: "Sumpiuh",
    lat: -7.6089,
    lng: 109.3567,
    estimasiUsaha: 4150,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "Kota kecamatan timur Banyumas dengan jaringan pertokoan padat, pasar kota, & pergudangan."
  },
  {
    kode: "33.02.08",
    nama: "Tambak",
    lat: -7.6102,
    lng: 109.4215,
    estimasiUsaha: 2300,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "Kecamatan batas Kebumen, terkenal sentra kuliner sate bebek & usaha olahan olahan makanan tradisional."
  },
  {
    kode: "33.02.09",
    nama: "Somagede",
    lat: -7.5234,
    lng: 109.3214,
    estimasiUsaha: 1890,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "Wilayah perbukitan timur dengan usaha penderes gula kelapa, kerajinan bambu, & warung desa."
  },
  {
    kode: "33.02.10",
    nama: "Kalibagor",
    lat: -7.4678,
    lng: 109.3089,
    estimasiUsaha: 2780,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "Kecamatan penyangga Purwokerto timur, bekas pabrik gula, usaha pembibitan & manufaktur sedang."
  },
  {
    kode: "33.02.11",
    nama: "Banyumas",
    lat: -7.5189,
    lng: 109.2945,
    estimasiUsaha: 3950,
    zonaWilayah: "Banyumas Timur",
    deskripsi: "KOTA LAMA BANYUMAS, pusat sejarah dan budaya, kaya usaha kuliner Nasi Nyangku, batik, & jasa perkantoran."
  },
  {
    kode: "33.02.12",
    nama: "Patikraja",
    lat: -7.4789,
    lng: 109.2145,
    estimasiUsaha: 3640,
    zonaWilayah: "Banyumas Selatan",
    deskripsi: "Kecamatan penyangga kota selatan, usaha konveksi, bengkel kendaraan, & pasar hewan."
  },
  {
    kode: "33.02.13",
    nama: "Purwojati",
    lat: -7.4912,
    lng: 109.1123,
    estimasiUsaha: 1720,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "Kecamatan agraris dengan industri mikro penderes penderes gula jawa & pertani karet/kayu."
  },
  {
    kode: "33.02.14",
    nama: "Ajibarang",
    lat: -7.4112,
    lng: 109.0745,
    estimasiUsaha: 5420,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "PUSAT EKONOMI BANYUMAS BARAT, keberadaan industri semen skala besar, pasar grosir, & jasa ekspedisi."
  },
  {
    kode: "33.02.15",
    nama: "Gumelar",
    lat: -7.3789,
    lng: 108.9890,
    estimasiUsaha: 1980,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "Kecamatan perbukitan barat dengan potensi pertambangan rakyat, perkebunan kapulaga & gula merah."
  },
  {
    kode: "33.02.16",
    nama: "Pekuncen",
    lat: -7.3389,
    lng: 109.0678,
    estimasiUsaha: 3120,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "Gerbang utara Banyumas dari arah Brebes, pusat pertenakan sapi perah & industri pengolahan susu/air."
  },
  {
    kode: "33.02.17",
    nama: "Cilongok",
    lat: -7.3789,
    lng: 109.1412,
    estimasiUsaha: 6250,
    zonaWilayah: "Banyumas Barat",
    deskripsi: "KECAMATAN TERLUAS & POPULASI TERBANYAK di Banyumas, sentra gula kelapa terbesar nasional & UMKM mikro."
  },
  {
    kode: "33.02.18",
    nama: "Karanglewas",
    lat: -7.4123,
    lng: 109.2012,
    estimasiUsaha: 4210,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "Wilayah sub-urban barat Purwokerto, bisnis grosir bahan bangunan, toko kelontong, & usaha pengolahan kayu."
  },
  {
    kode: "33.02.19",
    nama: "Kedungbanteng",
    lat: -7.3612,
    lng: 109.2156,
    estimasiUsaha: 3380,
    zonaWilayah: "Banyumas Utara",
    deskripsi: "Wilayah lereng Gunung Slamet, sentra budidaya perikanan air tawar & wisata alam curug."
  },
  {
    kode: "33.02.20",
    nama: "Baturraden",
    lat: -7.3112,
    lng: 109.2312,
    estimasiUsaha: 2980,
    zonaWilayah: "Banyumas Utara",
    deskripsi: "DESTINASI WISATA UTAMA BANYUMAS, padat bisnis perhotelan, villa, restoran, kafe, & suvenir khas."
  },
  {
    kode: "33.02.21",
    nama: "Sumbang",
    lat: -7.3489,
    lng: 109.2845,
    estimasiUsaha: 4650,
    zonaWilayah: "Banyumas Utara",
    deskripsi: "Wilayah berkembang utara Purwokerto, tumbuh pesat perumahan, usaha percetakan, & peternakan modern."
  },
  {
    kode: "33.02.22",
    nama: "Kembaran",
    lat: -7.4189,
    lng: 109.2912,
    estimasiUsaha: 4890,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "Kawasan pendidikan kampus Universitas Muhammadiyah Purwokerto (UMP), marak kos-kosan, kuliner, & laundry."
  },
  {
    kode: "33.02.23",
    nama: "Sokaraja",
    lat: -7.4389,
    lng: 109.2812,
    estimasiUsaha: 5740,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "SENTRA KULINER & BATIK BANYUMAS, terkenal Soto Sokaraja, Getuk Goreng, galeri batik, & industri pakaian."
  },
  {
    kode: "33.02.24",
    nama: "Purwokerto Selatan",
    lat: -7.4412,
    lng: 109.2412,
    estimasiUsaha: 6890,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "Pusat transportasi & komersial, lokasi Terminal Bulupitu, perhotelan bintang, & jaringan swalayan."
  },
  {
    kode: "33.02.25",
    nama: "Purwokerto Barat",
    lat: -7.4212,
    lng: 109.2189,
    estimasiUsaha: 5920,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "Pusat perkeretaapian (Stasiun Besar Purwokerto), Dipo Lokomotif, kawasan bisnis komersial & pergudangan."
  },
  {
    kode: "33.02.26",
    nama: "Purwokerto Timur",
    lat: -7.4289,
    lng: 109.2489,
    estimasiUsaha: 7850,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "PUSAT PEMBERDAYAAN EKONOMI UTAMA, Alun-Alun, pusat perbelanjaan Rita Supermall, perbankan, & perkantoran."
  },
  {
    kode: "33.02.27",
    nama: "Purwokerto Utara",
    lat: -7.3989,
    lng: 109.2412,
    estimasiUsaha: 6410,
    zonaWilayah: "Purwokerto Urban",
    deskripsi: "KAWASAN PENDIDIKAN TINGGI (Unsoed), ekonomi kreatif, cafe modern, bisnis perumahan, & jasa digital."
  }
];

export const KBLI_CATEGORIES = [
  "Perdagangan Eceran & Grosir",
  "Kuliner & Penyediaan Makanan/Minuman",
  "Industri Pengolahan & Kerajinan",
  "Jasa Persewaan & Perkantoran",
  "Pertanian, Perkebunan & Peternakan",
  "Akomodasi & Perhotelan",
  "Transportasi & Logistik",
  "Jasa Keuangan & Usaha Perorangan"
];
