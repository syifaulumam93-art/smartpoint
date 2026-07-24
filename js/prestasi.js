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