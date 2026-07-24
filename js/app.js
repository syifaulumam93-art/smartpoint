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

}

/* =====================================================
   VALIDASI FORM AKTIF
===================================================== */

function refreshValidasi(){

    if(jenisLaporan==="pelanggaran"){

        cekFormPelanggaran();

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

/* =====================================================
   DATA PELANGGARAN
===================================================== */

async function kirimPelanggaran(){

    try{

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

        console.error(err);

        alert(err);

    }

}

/* =====================================
   POPUP BERHASIL
===================================== */
document.addEventListener("click", function (e) {

    if (e.target.id === "btnWA") {

        console.log("Tombol WA diklik");

        window.location.href = window.waUrl;

    }

    if (e.target.id === "btnInputLagi") {

        console.log("Tombol Input Lagi diklik");

        document
            .getElementById("popupBerhasil")
            .classList.remove("show");

        location.reload();

    }

});