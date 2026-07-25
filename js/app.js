/* =====================================================
   SMART POINT
   APP.JS
===================================================== */

let jenisLaporan = "";

/* =====================================================
   ELEMENT
===================================================== */

const txtGuru = document.getElementById("guru");

const btnPelanggaran = document.getElementById("btnPelanggaran");
const btnPrestasi = document.getElementById("btnPrestasi");

const formContainer = document.getElementById("formContainer");

const judulForm = document.getElementById("judulForm");

const pelanggaranSection = document.getElementById("pelanggaranSection");
const prestasiSection = document.getElementById("prestasiSection");

/* =====================================================
   NAMA GURU
===================================================== */

function simpanNamaGuru(){

    localStorage.setItem(
        CONFIG.STORAGE_GURU,
        txtGuru.value
    );

    cekFormPelanggaran();

}

function loadNamaGuru(){

    const nama =
        localStorage.getItem(
            CONFIG.STORAGE_GURU
        );

    if(nama){

        txtGuru.value = nama;

    }

}

/* =====================================================
   MENU PELANGGARAN
===================================================== */

btnPelanggaran.onclick = function(){

    jenisLaporan = "pelanggaran";

    btnPelanggaran.classList.add("active");

    btnPrestasi.classList.remove("active");

    formContainer.style.display = "block";

    pelanggaranSection.style.display = "block";

    prestasiSection.style.display = "none";

    judulForm.innerHTML =
        "⚠️ Form Laporan Pelanggaran";

}

/* =====================================================
   MENU PRESTASI
===================================================== */

btnPrestasi.onclick = function(){

    jenisLaporan = "prestasi";

    btnPrestasi.classList.add("active");

    btnPelanggaran.classList.remove("active");

    formContainer.style.display = "block";

    pelanggaranSection.style.display = "none";

    prestasiSection.style.display = "block";

    judulForm.innerHTML =
        "🏆 Form Laporan Prestasi";

}

/* =====================================================
   DROPDOWN SISWA
===================================================== */

kelas.addEventListener(

    "change",

    function(){

        resetDataSiswa();

        isiDropdownSiswa(
            this.value
        );

        cekFormPelanggaran();

    }

);

nama_siswa.addEventListener(

    "change",

    function(){

        tampilkanDataSiswa(
            this.value
        );

        cekFormPelanggaran();

    }

);

txtGuru.addEventListener(

    "keyup",

    simpanNamaGuru

);

txtGuru.addEventListener(

    "change",

    simpanNamaGuru

);

/* =====================================================
   START
===================================================== */

window.onload = async function(){

    formContainer.style.display = "none";

    loadNamaGuru();

    await loadDataSiswa();

    await loadDataPelanggaran();

    await loadDataPrestasi();

}

/* =====================================================
   VALIDASI FORM AKTIF
===================================================== */

function refreshValidasi(){

    if(jenisLaporan==="pelanggaran"){

        cekFormPelanggaran();

    }

      if(jenisLaporan==="prestasi"){

        cekFormPrestasi();

    }

}

txtGuru.addEventListener(

    "input",

    refreshValidasi

);

kelas.addEventListener(

    "change",

    refreshValidasi

);

nama_siswa.addEventListener(

    "change",

    refreshValidasi

);
/* =====================================================
   TOMBOL LAPORKAN
===================================================== */

const btnLaporkan =
document.getElementById("btnLaporkan");

btnLaporkan.addEventListener(

    "click",

    function(){

        if(jenisLaporan==="pelanggaran"){

            kirimPelanggaran();

        }

    }

);

const btnLaporkanPrestasi =
document.getElementById("btnLaporkanPrestasi");

btnLaporkanPrestasi.addEventListener(

    "click",

    function(){

        if(jenisLaporan==="prestasi"){

            kirimPrestasi();

        }

    }

);

/* =====================================================
   DATA PELANGGARAN
===================================================== */

async function kirimPelanggaran(){

  try{

    // ===========================
    // Tampilkan Loading
    // ===========================

    document.getElementById("loadingOverlay").style.display = "flex";

    btnLaporkan.disabled = true;

    btnLaporkan.innerHTML = "⏳ Mengirim Laporan...";

        const siswa = dataSiswa.find(
            s => s.nis === document.getElementById("nis").value
        );

        if(!siswa){
            alert("Data siswa tidak ditemukan.");
            return;
        }

        const file = document.getElementById("foto").files[0];

        if(!file){
            alert("Silakan pilih foto.");
            return;
        }

        // ===========================
        // Ubah foto menjadi Base64
        // ===========================

        const image = await new Promise((resolve,reject)=>{

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;

            reader.readAsDataURL(file);

        });

        // ===========================
        // Nama File
        // ===========================

        const sekarang = new Date();

        const tanggal =
            sekarang.getFullYear() +
            String(sekarang.getMonth()+1).padStart(2,"0") +
            String(sekarang.getDate()).padStart(2,"0");

        const fileName =
            `${tanggal}_${kelas.value}_${siswa.nis}_${siswa.nama_siswa}.jpg`;

        // ===========================
        // Data yang dikirim
        // ===========================

        const data = {

            jenis : "pelanggaran",

            image : image,

            fileName : fileName,

            folder : "pelanggaran",

            guru_pelapor : txtGuru.value,

            kelas : kelas.value,

            nis : siswa.nis,

            nama_siswa : siswa.nama_siswa,

            nama_pelanggaran :
                document.getElementById("nama_pelanggaran").value,

            jumlah_poin :
                document.getElementById("jumlah_poin").value,

            pembinaan :
                document.getElementById("pembinaan").value

        };

        // ===========================
        // Kirim ke Apps Script
        // ===========================

        const response = await fetch(

            CONFIG.WEB_APP_URL,

            {

                method : "POST",

                body : JSON.stringify(data)

            }

        );

        const result = await response.json();

        console.log(result);

// ===========================
// Sembunyikan Loading
// ===========================

document.getElementById("loadingOverlay").style.display = "none";

btnLaporkan.disabled = false;

btnLaporkan.innerHTML = "LAPORKAN";

        if(result.status=="success"){

    // Simpan URL WA untuk tombol popup
    const nomor = siswa.nomor_wa
        .replace(/^0/,"62")
        .replace(/\D/g,"");

    const pesan = `Assalamu'alaikum warahmatullahi wabarakatuh.

Selamat pagi Bapak/Ibu Orang Tua/Wali dari *${siswa.nama_siswa}*.

Dengan hormat, kami sampaikan bahwa pada hari ini Ananda tercatat melakukan pelanggaran tata tertib sekolah, yaitu *${data.nama_pelanggaran}* dengan *akumulasi poin sebesar ${data.jumlah_poin}*.

Bapak/Ibu tidak perlu khawatir.

Menindaklanjuti kejadian tersebut, pihak sekolah melalui Tim Kesiswaan telah memberikan pembinaan kepada Ananda berupa:

*${data.pembinaan}*

Dokumentasi pembinaan dapat dilihat pada tautan berikut:

${result.foto_url}

Demikian laporan ini kami sampaikan.

Wassalamu'alaikum warahmatullahi wabarakatuh.

*Tim Kesiswaan SMA Negeri 15 Surabaya*`;

   window.waUrl =
    `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

console.log(window.waUrl);

document
    .getElementById("popupBerhasil")
    .classList.add("show");

}else{

    alert(result.message);

}

}

    catch(err){

    document.getElementById("loadingOverlay").style.display = "none";

    btnLaporkan.disabled = false;

    btnLaporkan.innerHTML = "LAPORKAN";

    console.error(err);

    alert("Terjadi kesalahan saat mengirim laporan.");

}

}

/* =====================================================
   KIRIM PRESTASI (Bagian 1)
===================================================== */

async function kirimPrestasi(){

    try{

        // ===========================
        // Loading
        // ===========================

        document.getElementById("loadingOverlay").style.display = "flex";

        btnLaporkanPrestasi.disabled = true;

        btnLaporkanPrestasi.innerHTML =
            "⏳ Mengirim Prestasi...";

        // ===========================
        // Ambil Data Siswa
        // ===========================

        const siswa = dataSiswa.find(
            s => s.nis === document.getElementById("nis").value
        );

        if(!siswa){

            document.getElementById("loadingOverlay").style.display = "none";

            btnLaporkanPrestasi.disabled = false;

            btnLaporkanPrestasi.innerHTML =
                "🏆 LAPORKAN PRESTASI";

            alert("Data siswa tidak ditemukan.");

            return;

        }

        // ===========================
        // Foto
        // ===========================

        const file =
            document.getElementById("foto_prestasi").files[0];

        if(!file){

            document.getElementById("loadingOverlay").style.display = "none";

            btnLaporkanPrestasi.disabled = false;

            btnLaporkanPrestasi.innerHTML =
                "🏆 LAPORKAN PRESTASI";

            alert("Silakan pilih foto prestasi.");

            return;

        }

        // ===========================
        // Base64
        // ===========================

        const image = await new Promise((resolve,reject)=>{

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;

            reader.readAsDataURL(file);

        });

        console.log("Foto Prestasi berhasil dibaca.");

// ===========================
// Nama File
// ===========================

const sekarang = new Date();

const tanggal =
    sekarang.getFullYear() +
    String(sekarang.getMonth()+1).padStart(2,"0") +
    String(sekarang.getDate()).padStart(2,"0");

const fileName =
    `${tanggal}_${kelas.value}_${siswa.nis}_${siswa.nama_siswa}.jpg`;

// ===========================
// Data yang dikirim
// ===========================

const data = {

    jenis : "prestasi",

    image : image,

    fileName : fileName,

    folder : "prestasi",

    guru_pelapor : txtGuru.value,

    kelas : kelas.value,

    nis : siswa.nis,

    nama_siswa : siswa.nama_siswa,

    nama_penghargaan :
        document.getElementById("nama_penghargaan").value,

    tingkat_penghargaan :
        document.getElementById("tingkat_penghargaan").value,

    jumlah_poin :
        document.getElementById("jumlah_poin_prestasi").value,

    kategori :
        document.getElementById("kategori").value,

    masa_berlaku :
        document.getElementById("masa_berlaku").value

};

console.log(data);

// ===========================
// Kirim ke Apps Script
// ===========================

const response = await fetch(

    CONFIG.WEB_APP_URL,

    {

        method : "POST",

        body : JSON.stringify(data)

    }

);

const result = await response.json();

console.log(result);

// ===========================
// Sembunyikan Loading
// ===========================

document.getElementById("loadingOverlay").style.display = "none";

btnLaporkanPrestasi.disabled = false;

btnLaporkanPrestasi.innerHTML =
    "🏆 LAPORKAN PRESTASI";

    if(result.status=="success"){

    const nomor = siswa.nomor_wa
        .replace(/^0/,"62")
        .replace(/\D/g,"");

    const pesan =
`Assalamu'alaikum warahmatullahi wabarakatuh.

Selamat Bapak/Ibu Orang Tua/Wali dari *${siswa.nama_siswa}*.

Dengan penuh rasa syukur kami menyampaikan bahwa Ananda telah meraih prestasi berupa *${data.tingkat_penghargaan}* pada kategori *${data.kategori}* sehingga memperoleh penghargaan dengan poin prestasi sebesar *${data.jumlah_poin}* sesuai dengan ketentuan yang berlaku di SMA Negeri 15 Surabaya.

Prestasi ini merupakan hasil dari kerja keras, semangat belajar, kedisiplinan, serta dukungan dan doa dari Bapak/Ibu di rumah.

Semoga pencapaian ini dapat menjadi motivasi bagi Ananda untuk terus mengembangkan potensi, mempertahankan prestasi, dan menjadi teladan bagi teman-temannya.

Sebagai bentuk apresiasi dan transparansi, dokumentasi penghargaan dapat Bapak/Ibu lihat melalui tautan berikut:

${result.foto_url}

Demikian laporan ini kami sampaikan sebagai bentuk komunikasi antara sekolah dan orang tua/wali dalam mengapresiasi setiap perkembangan positif Ananda.

Semoga sinergi yang baik antara sekolah dan keluarga terus terjalin demi mendukung lahirnya generasi yang berprestasi, berkarakter, dan berakhlak mulia.

Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.

Wassalamu'alaikum warahmatullahi wabarakatuh.

*Tim Kesiswaan SMA Negeri 15 Surabaya*`;

    window.waUrl =
        `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

    document
        .getElementById("popupBerhasil")
        .classList.add("show");

}else{

    alert(result.message);

}
    }

    catch(err){

        document.getElementById("loadingOverlay").style.display = "none";

        btnLaporkanPrestasi.disabled = false;

        btnLaporkanPrestasi.innerHTML =
            "🏆 LAPORKAN PRESTASI";

        console.error(err);

        alert("Terjadi kesalahan saat memproses prestasi.");

    }

}

/* =====================================
   POPUP BERHASIL
===================================== */
document.addEventListener("click", function (e) {

    if (e.target.id === "btnWA") {

    // Buka WhatsApp
    window.open(window.waUrl, "_blank");

    // Tutup popup
    document
        .getElementById("popupBerhasil")
        .classList.remove("show");

    // Reset Form
    kelas.selectedIndex = 0;

    nama_siswa.innerHTML = "";

    document.getElementById("nis").value = "";

    document.getElementById("nomor_wa").value = "";

    document.getElementById("nama_pelanggaran").selectedIndex = 0;

    document.getElementById("jumlah_poin").value = "";

    document.getElementById("pembinaan").value = "";

    document.getElementById("foto").value = "";

    document.getElementById("previewFoto").src = "";

    document.getElementById("previewFoto").style.display = "none";

    btnLaporkan.disabled = true;

}

    if (e.target.id === "btnInputLagi") {

        console.log("Tombol Input Lagi diklik");

        document
            .getElementById("popupBerhasil")
            .classList.remove("show");

        location.reload();

    }

});

/* =====================================================
   HERO SCROLL ANIMATION
===================================================== */

const hero = document.querySelector(".hero");

let heroShrink = false;

window.addEventListener("scroll", () => {

    if (!hero) return;

    const y = window.scrollY;

    // Masuk mode shrink jika scroll > 100px
    if (!heroShrink && y > 100) {

        hero.classList.add("shrink");

        heroShrink = true;

    }

    // Kembali normal jika scroll < 60px
    else if (heroShrink && y < 60) {

        hero.classList.remove("shrink");

        heroShrink = false;

    }

});