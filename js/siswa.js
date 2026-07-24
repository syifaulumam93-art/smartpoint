/* =====================================================
   SMART POINT
   DATA SISWA
===================================================== */

let dataSiswa = [];

/* =====================================================
   LOAD DATA SISWA DARI TSV
===================================================== */

async function loadDataSiswa() {

    try {

        const response = await fetch(CONFIG.SISWA_TSV);

        const text = await response.text();

        const rows = text.trim().split("\n");

        rows.shift(); // hapus header

        dataSiswa = rows.map(row => {

            const col = row.split("\t");

            return {

                nis: col[0].trim(),

                nama_siswa: col[1].trim(),

                kelas: col[2].trim(),

                nomor_wa: col[3].trim()

            };

        });

        console.log("Jumlah siswa :", dataSiswa.length);

        isiDropdownKelas();

    }

    catch(err){

        console.error(err);

        alert("Gagal mengambil database siswa.");

    }

}

/* =====================================================
   DROPDOWN KELAS
===================================================== */

function isiDropdownKelas(){

    const kelas = [...new Set(

        dataSiswa.map(s=>s.kelas)

    )];

    kelas.sort((a,b)=>a.localeCompare(b,'id',{numeric:true}));

    const select = document.getElementById("kelas");

    select.innerHTML = "";

    const optionAwal = document.createElement("option");

    optionAwal.value = "";

    optionAwal.textContent = "-- Pilih Kelas --";

    select.appendChild(optionAwal);

    kelas.forEach(k=>{

        const option = document.createElement("option");

        option.value = k;

        option.textContent = k;

        select.appendChild(option);

    });

}

/* =====================================================
   DROPDOWN SISWA
===================================================== */

function isiDropdownSiswa(kelas){

    const select = document.getElementById("nama_siswa");

    select.innerHTML="";

    const optionAwal=document.createElement("option");

    optionAwal.value="";

    optionAwal.textContent="-- Pilih Nama Siswa --";

    select.appendChild(optionAwal);

    const hasil = dataSiswa.filter(

        s=>s.kelas===kelas

    );

    hasil.sort((a,b)=>

        a.nama_siswa.localeCompare(b.nama_siswa)

    );

    hasil.forEach(s=>{

        const option=document.createElement("option");

        option.value=s.nis;

        option.textContent=s.nama_siswa;

        select.appendChild(option);

    });

}

/* =====================================================
   TAMPILKAN DATA SISWA
===================================================== */

function tampilkanDataSiswa(nis){

    const siswa = dataSiswa.find(

        s=>s.nis===nis

    );

    if(!siswa){

        return;

    }

    document.getElementById("nis").value=siswa.nis;

    document.getElementById("nomor_wa").value=siswa.nomor_wa;

}

/* =====================================================
   RESET DATA SISWA
===================================================== */

function resetDataSiswa(){

    document.getElementById("nis").value="";

    document.getElementById("nomor_wa").value="";

}