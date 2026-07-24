/* =====================================================
   SMART POINT
   PELANGGARAN.JS
===================================================== */

let dataPelanggaran = [];

/* =====================================================
   LOAD DATA PELANGGARAN
===================================================== */

async function loadDataPelanggaran() {

    try {

        const response = await fetch(CONFIG.PELANGGARAN_TSV);

        const text = await response.text();

        const rows = text.trim().split("\n");

        rows.shift(); // hapus header

        dataPelanggaran = rows.map(row => {

            const col = row.split("\t");

            return {

                nama_pelanggaran: col[0].trim(),

                jumlah_poin: col[1].trim()

            };

        });

        console.log(
            "Data Pelanggaran :",
            dataPelanggaran.length
        );

        isiDropdownPelanggaran();

    }

    catch(err){

        console.error(err);

        alert("Database pelanggaran gagal dimuat.");

    }

}

/* =====================================================
   DROPDOWN PELANGGARAN
===================================================== */

function isiDropdownPelanggaran(){

    const select =
        document.getElementById("nama_pelanggaran");

    if(!select) return;

    select.innerHTML = "";

    const awal =
        document.createElement("option");

    awal.value = "";

    awal.textContent =
        "-- Pilih Pelanggaran --";

    select.appendChild(awal);

    dataPelanggaran.forEach(item=>{

        const option =
            document.createElement("option");

        option.value =
            item.nama_pelanggaran;

        option.textContent =
            item.nama_pelanggaran;

        option.dataset.poin =
            item.jumlah_poin;

        select.appendChild(option);

    });

}

/* =====================================================
   TAMPILKAN POIN
===================================================== */

function tampilkanPoin(){

    const pelanggaran =
        document.getElementById(
            "nama_pelanggaran"
        );

    const poin =
        document.getElementById(
            "jumlah_poin"
        );

    if(
        !pelanggaran ||
        !poin
    ){
        return;
    }

    const index =
        pelanggaran.selectedIndex;

    if(index<=0){

        poin.value="";

        cekFormPelanggaran();

        return;

    }

    poin.value =
        pelanggaran.options[index]
        .dataset.poin;

    cekFormPelanggaran();

}

/* =====================================================
   PREVIEW FOTO
===================================================== */

function previewFotoPelanggaran() {

    const input = document.getElementById("foto");
    const preview = document.getElementById("previewFoto");

    if (!input || !preview) return;

    const file = input.files[0];

    if (!file) {

        preview.src = "";
        preview.style.display = "none";

        cekFormPelanggaran();

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        preview.src = e.target.result;

        preview.style.display = "block";

        cekFormPelanggaran();

    }

    reader.readAsDataURL(file);

}

/* =====================================================
   VALIDASI FORM
===================================================== */

function cekFormPelanggaran(){

    const guru =
        document.getElementById("guru").value.trim();

    const kelas =
        document.getElementById("kelas").value;

    const siswa =
        document.getElementById("nama_siswa").value;

    const pelanggaran =
        document.getElementById("nama_pelanggaran").value;

    const pembinaan =
        document.getElementById("pembinaan").value.trim();

    const foto =
        document.getElementById("foto").files.length;

    const tombol =
        document.getElementById("btnLaporkan");

    if(
        guru &&
        kelas &&
        siswa &&
        pelanggaran &&
        pembinaan &&
        foto
    ){

        tombol.disabled = false;

    }

    else{

        tombol.disabled = true;

    }

}

/* =====================================================
   RESET FORM
===================================================== */

function resetFormPelanggaran(){

    document.getElementById("nama_pelanggaran").selectedIndex = 0;

    document.getElementById("jumlah_poin").value = "";

    document.getElementById("pembinaan").value = "";

    document.getElementById("foto").value = "";

    const preview =
        document.getElementById("previewFoto");

    preview.src = "";

    preview.style.display = "none";

    cekFormPelanggaran();

}

/* =====================================================
   EVENT
===================================================== */

function initPelanggaran(){

    const pelanggaran =
        document.getElementById("nama_pelanggaran");

    const pembinaan =
        document.getElementById("pembinaan");

    const foto =
        document.getElementById("foto");

    if(pelanggaran){

        pelanggaran.addEventListener(
            "change",
            tampilkanPoin
        );

    }

    if(pembinaan){

        pembinaan.addEventListener(
            "keyup",
            cekFormPelanggaran
        );

    }

    if(foto){

        foto.addEventListener(
            "change",
            previewFotoPelanggaran
        );

    }

}

/* =====================================================
   START
===================================================== */

window.addEventListener(

    "load",

    async()=>{

        await loadDataPelanggaran();

        initPelanggaran();

    }

);