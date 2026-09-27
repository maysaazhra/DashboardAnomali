const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvPath = 'D:\\MAGANG BPS\\raw_anomali_usaha_1785728664285.csv';
const outputPath = path.join(__dirname, '..', 'src', 'data', 'realDataset.json');

console.log('Reading CSV from:', csvPath);
const csvContent = fs.readFileSync(csvPath, 'utf8');

function classifyEntity(namaUsaha, namaKeluarga, tipeAnomali) {
  const combined = `${namaUsaha || ''} ${namaKeluarga || ''}`.toLowerCase();

  if (
    combined.includes('rumah sakit') || 
    combined.includes('rs ') || 
    combined.includes('rsud') || 
    combined.includes('klinik') || 
    combined.includes('apotek') || 
    combined.includes('bidan') || 
    combined.includes('dokter') || 
    combined.includes('puskesmas') || 
    combined.includes('optik') || 
    combined.includes('laboratorium') || 
    combined.includes('fisioterapi')
  ) {
    return 'Fasilitas Kesehatan (RS/Klinik/Apotek)';
  }

  if (
    combined.includes('sekolah') || 
    combined.includes('sd ') || 
    combined.includes('sdn') || 
    combined.includes('smp') || 
    combined.includes('sma') || 
    combined.includes('smk') || 
    combined.includes('tk ') || 
    combined.includes('paud') || 
    combined.includes('madrasah') || 
    combined.includes('mi ') || 
    combined.includes('mts') || 
    combined.includes('ma ') || 
    combined.includes('universitas') || 
    combined.includes('kursus') || 
    combined.includes('bimbel')
  ) {
    return 'Pendidikan (Sekolah/Madrasah/PAUD)';
  }

  if (
    combined.includes('pondok') || 
    combined.includes('pesantren') || 
    combined.includes('yayasan') || 
    combined.includes('panti') || 
    combined.includes('masjid') || 
    combined.includes('mushola') || 
    combined.includes('gereja')
  ) {
    return 'Pondok Pesantren & Yayasan/Sosial';
  }

  if (
    combined.includes('rumah') || 
    tipeAnomali === 'Keluarga' || 
    combined.includes('keluarga') || 
    combined.includes('krt') || 
    combined.includes('kos') || 
    combined.includes('kontrakan')
  ) {
    return 'Tempat Tinggal / Usaha Rumahan';
  }

  if (
    combined.includes('toko') || 
    combined.includes('warung') || 
    combined.includes('kios') || 
    combined.includes('kelontong') || 
    combined.includes('mart') || 
    combined.includes('sembako') || 
    combined.includes('agen') || 
    combined.includes('distributor') || 
    combined.includes('pasar')
  ) {
    return 'Perdagangan & Toko/Warung';
  }

  if (
    combined.includes('pabrik') || 
    combined.includes('industri') || 
    combined.includes('konveksi') || 
    combined.includes('kerajinan') || 
    combined.includes('mebel') || 
    combined.includes('kayu') || 
    combined.includes('genteng') || 
    combined.includes('bata') || 
    combined.includes('produksi')
  ) {
    return 'Industri / Pabrik / Kerajinan';
  }

  if (
    combined.includes('bengkel') || 
    combined.includes('servis') || 
    combined.includes('laundry') || 
    combined.includes('salon') || 
    combined.includes('cukur') || 
    combined.includes('jahit') || 
    combined.includes('fotocopy') || 
    combined.includes('rental') || 
    combined.includes('cuci')
  ) {
    return 'Jasa & Bengkel/Servis';
  }

  if (
    combined.includes('warung makan') || 
    combined.includes('bakso') || 
    combined.includes('mie') || 
    combined.includes('resto') || 
    combined.includes('cafe') || 
    combined.includes('kedai') || 
    combined.includes('katering') || 
    combined.includes('soto') || 
    combined.includes('makan')
  ) {
    return 'Kuliner & Makanan/Minuman';
  }

  return 'Usaha Jasa & Niaga Lainnya';
}

Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    console.log('Parsed rows:', results.data.length);
    
    // Normalize and map to BpsFasihRecord
    const mapped = results.data.map((row, idx) => {
      const no = Number(row.No || idx + 1);
      const fasih = String(row.Fasih || `FASH-${idx + 1}`);
      const fasih_edit = String(row['Fasih Edit'] || '');
      const fasih_reject = String(row['Fasih Reject Jadul'] || row['Fasih Reject'] || '');
      const kode_kab = String(row['Kode Kab/Kota'] || '3302');
      const nama_kab = String(row['Nama Kab/Kota'] || 'Kabupaten Banyumas');
      const kode_kec = String(row['Kode Kec'] || '3302010');
      
      // Normalize Kecamatan to standard Title Case (e.g. SOMAGEDE -> Somagede)
      const rawKec = String(row['Nama Kecamatan'] || 'Purwokerto Timur').trim();
      const nama_kecamatan = rawKec.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      const kode_desa = String(row['Kode Desa'] || '');
      const rawDesa = String(row['Nama Desa/Kel'] || row['Nama Desa'] || '').trim();
      const nama_desa = rawDesa.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      const kode_sls = String(row['Kode SLS/SubSLS/NonSLS'] || row['Kode SLS'] || '');
      const nama_sls = String(row['Nama SLS/SubSLS/NonSLS'] || row['Nama SLS'] || '').trim();
      const assignment = String(row['Assignment ID'] || row.Assignment || '');
      const nama_usaha = String(row['Nama Usaha'] || 'Usaha Tanpa Nama').trim();
      const nama_keluarga = String(row['Nama Keluarga'] || 'Pemilik Belum Terdaftar').trim();
      const rawAnomali = String(row['Nama Anomali'] || 'Normal').trim();
      const rawTindakLanjut = String(row['Tindak Lanjut'] || 'Belum Ditindaklanjuti').trim();
      const petugas = String(row.Petugas || 'Petugas BPS Banyumas').trim();
      const pengunggah = String(row.Pengunggah || 'Admin FASIH BPS').trim();
      const link_fasih = String(row['Link Fasih'] || fasih).trim();
      const status_assignment = String(row['Status Assignment'] || 'Assigned').trim();
      const waktu_status_diambil = String(row['Waktu Status diambil'] || '').trim();

      // Format alamat SLS & Wilayah riil
      const alamat_lengkap = nama_sls && nama_desa 
        ? `${nama_sls}, ${nama_desa}, Kec. ${nama_kecamatan}, Kab. Banyumas` 
        : `${nama_desa || 'Desa'}, Kec. ${nama_kecamatan}, Kab. Banyumas`;

      // Determine Tipe Anomali (Usaha vs Keluarga) & Subkategori Deskriptif
      let tipe_anomali = 'Usaha';
      let kategori_deskripsi = 'Ketidakwajaran Usaha';

      if (rawAnomali.includes('Data 3') || rawAnomali.includes('modal korporasi')) {
        tipe_anomali = 'Keluarga';
        kategori_deskripsi = 'Modal Korporasi Non-Badan Usaha (Data 3)';
      } else if (rawAnomali.includes('Data 4') || rawAnomali.includes('MBG')) {
        tipe_anomali = 'Keluarga';
        kategori_deskripsi = 'Data Keuangan MBG / KRT (Data 4)';
      } else if (rawAnomali.includes('Data 1') || rawAnomali.includes('Biaya Produksi')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Biaya Produksi Dominan (Data 1)';
      } else if (rawAnomali.includes('Data 2') || rawAnomali.includes('Keuntungan Usaha')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Keuntungan Usaha (Data 2)';
      } else if (rawAnomali.includes('Data 5') || rawAnomali.includes('Konsistensi')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Konsistensi Aset, Pekerja & Produksi (Data 5)';
      } else if (rawAnomali.includes('Data 6') || rawAnomali.includes('internet')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Usaha Menengah/Besar Tanpa Internet (Data 6)';
      } else if (rawAnomali.includes('Data 7') || rawAnomali.includes('laporan keuangan')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Usaha Menengah/Besar Tanpa Lap. Keuangan (Data 7)';
      } else if (rawAnomali.includes('Data 8') || rawAnomali.includes('KBLI') || rawAnomali.includes('SBR')) {
        tipe_anomali = 'Usaha';
        kategori_deskripsi = 'Perbedaan KBLI 2 Digit & SBR (Data 8)';
      }

      // Normalize Tindak Lanjut
      let tindak_lanjut = rawTindakLanjut;
      const tlLower = rawTindakLanjut.toLowerCase();
      if (tlLower.includes('penjelasan')) {
        tindak_lanjut = 'Sudah Ditindaklanjuti (Dengan Penjelasan)';
      } else if (tlLower.includes('belum')) {
        tindak_lanjut = 'Belum Ditindaklanjuti';
      } else if (tlLower.includes('sudah')) {
        tindak_lanjut = 'Sudah Ditindaklanjuti';
      }

      const jenis_entitas = classifyEntity(nama_usaha, nama_keluarga, tipe_anomali);

      return {
        no,
        fasih,
        fasih_edit,
        fasih_reject,
        kode_kab,
        nama_kab,
        kode_kec,
        nama_kecamatan,
        kode_desa,
        nama_desa,
        kode_sls,
        nama_sls,
        alamat_lengkap,
        assignment,
        nama_usaha,
        nama_keluarga,
        tipe_anomali,
        kategori_deskripsi,
        nama_anomali: rawAnomali,
        tindak_lanjut,
        petugas,
        pengunggah,
        link_fasih,
        status_assignment,
        waktu_status_diambil,
        jenis_entitas,
        catatan_sistem: `Data FASIH BPS [${tipe_anomali}]: ${kategori_deskripsi} • Sektor: ${jenis_entitas}`
      };
    });

    fs.writeFileSync(outputPath, JSON.stringify(mapped, null, 2), 'utf8');
    console.log('Successfully written real dataset with entity classification to:', outputPath);
  }
});
