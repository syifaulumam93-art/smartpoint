/* =====================================================
   SMART POINT
   PRESTASI.JS
===================================================== */

let dataPrestasi = [];

/* =====================================================
   LOAD DATA PRESTASI
===================================================== */

async function loadDataPrestasi(){

    try{

        const response = await fetch(CONFIG.PRESTASI_TSV);

        const text = await response.text();

        const rows = text.trim().split("\n");

        const header = rows.shift().split("\t");

        dataPrestasi = rows.map(row=>{

            const cols = row.split("\t");

            let obj = {};

            header.forEach((h,i)=>{

                obj[h.trim()] = cols[i]?.trim() || "";

            });

            return obj;

        });

        console.log(
            "Data Prestasi :",
            dataPrestasi.length
        );

        isiKategoriPrestasi();

    }

    catch(err){

        console.error(
            "Gagal memuat data prestasi",
            err
        );

    }

}

/* =====================================================
   DROPDOWN KATEGORI
===================================================== */

function isiKategoriPrestasi(){

    const kategori =
        document.getElementById("kategori");

    kategori.innerHTML =
        '<option value="">Pilih Kategori</option>';

    const daftarKategori = [
        ...new Set(
            dataPrestasi.map(
                item=>item.kategori
            )
        )
    ];

    daftarKategori.sort();

    daftarKategori.forEach(item=>{

        kategori.innerHTML +=
        `<option value="${item}">
            ${item}
        </option>`;

    });

}

/* =====================================================
   KATEGORI BERUBAH
===================================================== */

document
.getElementById("kategori")
.addEventListener("change",function(){

    const kategori = this.value;

    const tingkat =
        document.getElementById("tingkat_penghargaan");

    const masa =
        document.getElementById("masa_berlaku");

    const poin =
        document.getElementById("jumlah_poin_prestasi");

    // Reset
    tingkat.innerHTML =
        '<option value="">Pilih Tingkat Penghargaan</option>';

    masa.value = "";

    poin.value = "";

    if(kategori=="") return;

    // Filter data sesuai kategori
    const hasil =
        dataPrestasi.filter(
            item=>item.kategori===kategori
        );

    // Isi masa berlaku
    if(hasil.length>0){

        masa.value =
            hasil[0].masa_berlaku;

    }

    // Isi dropdown tingkat penghargaan
    hasil.forEach(item=>{

        tingkat.innerHTML +=
        `<option value="${item.tingkat_penghargaan}">
            ${item.tingkat_penghargaan}
        </option>`;

    });

});

/* =====================================================
   TINGKAT PENGHARGAAN BERUBAH
===================================================== */

document
.getElementById("tingkat_penghargaan")
.addEventListener("change",function(){

    const kategori =
        document.getElementById("kategori").value;

    const tingkat =
        this.value;

    const data =
        dataPrestasi.find(item=>

            item.kategori===kategori &&
            item.tingkat_penghargaan===tingkat

        );

    if(data){

        document
        .getElementById("jumlah_poin_prestasi")
        .value = data.jumlah_poin;

    }

});