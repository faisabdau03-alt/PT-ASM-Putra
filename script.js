/* =========================================================
   PO ALULA SADIDA MARYAM
   BUS PARIWISATA
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. NOMOR WHATSAPP ADMIN
   ========================================================= */

/*
   GANTI nomor ini dengan nomor WhatsApp admin PO.

   Format:
   628xxxxxxxxxx

   Contoh:
   081234567890
   menjadi:
   6281234567890

   Jangan menggunakan:
   +62
   08
   spasi
   tanda -
*/

const nomorAdmin = "62882005363151";


/* =========================================================
   2. DATA HARGA BUS
   ========================================================= */

/*
   HARGA DI BAWAH HANYA CONTOH.

   Nanti bisa disesuaikan dengan tarif asli
   PO Alula Sadida Maryam.
*/

const hargaBus = {

    medium: {
        nama: "Medium Bus",
        kapasitasMin: 30,
        kapasitasMax: 35,
        hargaDasar: 4500000
    },

    executive: {
        nama: "Executive Bus",
        kapasitasMin: 40,
        kapasitasMax: 45,
        hargaDasar: 5500000
    },

    big: {
        nama: "Big Bus",
        kapasitasMin: 50,
        kapasitasMax: 59,
        hargaDasar: 6500000
    },

    luxury: {
        nama: "Luxury Bus",
        kapasitasMin: 30,
        kapasitasMax: 40,
        hargaDasar: 8000000
    }

};


/* =========================================================
   3. DATA PERJALANAN SEMENTARA
   ========================================================= */

let dataPerjalanan = {

    kotaJemput: "",
    kotaTujuan: "",
    tanggalBerangkat: "",
    tanggalPulang: "",
    jamPenjemputan: "",
    jumlahPenumpang: 0,
    kelasBus: "",
    namaKelas: "",
    durasi: 0,
    hargaEstimasi: 0

};


/* =========================================================
   4. AMBIL ELEMENT HTML
   ========================================================= */

const priceForm =
    document.getElementById("priceForm");

const kotaJemput =
    document.getElementById("kotaJemput");

const kotaTujuan =
    document.getElementById("kotaTujuan");

const tanggalBerangkat =
    document.getElementById("tanggalBerangkat");

const tanggalPulang =
    document.getElementById("tanggalPulang");

const jamPenjemputan =
    document.getElementById("jamPenjemputan");

const jumlahPenumpang =
    document.getElementById("jumlahPenumpang");

const kelasBus =
    document.getElementById("kelasBus");


/* =========================================================
   HASIL ESTIMASI
   ========================================================= */

const hasilHarga =
    document.getElementById("hasilHarga");

const hasilRute =
    document.getElementById("hasilRute");

const hasilJamPenjemputan =
    document.getElementById("hasilJamPenjemputan");

const hasilPenumpang =
    document.getElementById("hasilPenumpang");

const hasilKelas =
    document.getElementById("hasilKelas");

const hasilDurasi =
    document.getElementById("hasilDurasi");

const harga =
    document.getElementById("harga");


/* =========================================================
   5. FORMAT RUPIAH
   ========================================================= */

function formatRupiah(angka) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0

    }).format(angka);

}


/* =========================================================
   6. HITUNG DURASI
   ========================================================= */

function hitungDurasi(
    tanggalMulai,
    tanggalSelesai
) {

    const mulai =
        new Date(tanggalMulai + "T00:00:00");

    const selesai =
        new Date(tanggalSelesai + "T00:00:00");

    const selisih =
        selesai - mulai;

    const satuHari =
        1000 * 60 * 60 * 24;

    const jumlahHari =
        Math.floor(selisih / satuHari) + 1;

    return jumlahHari;

}


/* =========================================================
   7. TAMBAHAN HARGA BERDASARKAN DURASI
   ========================================================= */

/*
   Contoh aturan:

   1 hari  = harga dasar
   2 hari  = +40%
   3 hari  = +80%
   4 hari  = +120%
   >4 hari = +40% setiap tambahan hari

   Ini masih contoh dan nanti bisa disesuaikan
   dengan sistem harga asli PO.
*/

function hitungHargaDurasi(
    hargaDasar,
    durasi
) {

    if (durasi <= 1) {

        return hargaDasar;

    }


    if (durasi === 2) {

        return hargaDasar * 1.40;

    }


    if (durasi === 3) {

        return hargaDasar * 1.80;

    }


    if (durasi === 4) {

        return hargaDasar * 2.20;

    }


    const tambahanHari =
        durasi - 4;

    return hargaDasar *
        (2.20 + (tambahanHari * 0.40));

}


/* =========================================================
   8. CEK KAPASITAS BUS
   ========================================================= */

function cekKapasitas(
    jumlah,
    bus
) {

    if (
        jumlah < bus.kapasitasMin ||
        jumlah > bus.kapasitasMax
    ) {

        return false;

    }

    return true;

}


/* =========================================================
   9. EVENT FORM CEK HARGA
   ========================================================= */

if (priceForm) {

    priceForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* =========================
               AMBIL DATA
               ========================= */

            const jemput =
                kotaJemput.value.trim();

            const tujuan =
                kotaTujuan.value.trim();

            const berangkat =
                tanggalBerangkat.value;

            const pulang =
                tanggalPulang.value;

            const jam =
                jamPenjemputan.value;

            const penumpang =
                parseInt(
                    jumlahPenumpang.value,
                    10
                );

            const kelas =
                kelasBus.value;


            /* =========================
               VALIDASI KOTA
               ========================= */

            if (!jemput || !tujuan) {

                alert(
                    "Silakan isi kota penjemputan dan kota tujuan."
                );

                return;

            }


            /* =========================
               VALIDASI TANGGAL
               ========================= */

            if (!berangkat || !pulang) {

                alert(
                    "Silakan pilih tanggal berangkat dan tanggal pulang."
                );

                return;

            }


            const tanggalMulai =
                new Date(berangkat + "T00:00:00");

            const tanggalSelesai =
                new Date(pulang + "T00:00:00");


            if (
                tanggalSelesai <
                tanggalMulai
            ) {

                alert(
                    "Tanggal pulang tidak boleh lebih awal dari tanggal berangkat."
                );

                return;

            }


            /* =========================
               VALIDASI JAM
               ========================= */

            if (!jam) {

                alert(
                    "Silakan pilih jam penjemputan."
                );

                return;

            }


            /* =========================
               VALIDASI PENUMPANG
               ========================= */

            if (
                !penumpang ||
                penumpang < 1
            ) {

                alert(
                    "Masukkan jumlah penumpang yang benar."
                );

                return;

            }


            /* =========================
               VALIDASI KELAS
               ========================= */

            if (!kelas) {

                alert(
                    "Silakan pilih kelas bus."
                );

                return;

            }


            /* =========================
               DATA BUS
               ========================= */

            const bus =
                hargaBus[kelas];


            if (!bus) {

                alert(
                    "Kelas bus tidak ditemukan."
                );

                return;

            }


            /* =========================
               CEK KAPASITAS
               ========================= */

            if (
                !cekKapasitas(
                    penumpang,
                    bus
                )
            ) {

                alert(

                    `Jumlah penumpang tidak sesuai dengan kapasitas ${bus.nama}.\n\n` +

                    `Kapasitas: ${bus.kapasitasMin} - ${bus.kapasitasMax} seat.\n\n` +

                    `Silakan pilih kelas bus lainnya.`

                );

                return;

            }


            /* =========================
               HITUNG DURASI
               ========================= */

            const durasi =
                hitungDurasi(
                    berangkat,
                    pulang
                );


            /* =========================
               HITUNG HARGA
               ========================= */

            const hargaEstimasi =
                hitungHargaDurasi(
                    bus.hargaDasar,
                    durasi
                );


            /* =========================
               SIMPAN DATA
               ========================= */

            dataPerjalanan = {

                kotaJemput:
                    jemput,

                kotaTujuan:
                    tujuan,

                tanggalBerangkat:
                    berangkat,

                tanggalPulang:
                    pulang,

                jamPenjemputan:
                    jam,

                jumlahPenumpang:
                    penumpang,

                kelasBus:
                    kelas,

                namaKelas:
                    bus.nama,

                durasi:
                    durasi,

                hargaEstimasi:
                    hargaEstimasi

            };


            /* =========================
               TAMPILKAN HASIL
               ========================= */

            hasilRute.textContent =
                `${jemput} → ${tujuan}`;

            hasilJamPenjemputan.textContent =
                jam;

            hasilPenumpang.textContent =
                `${penumpang} orang`;

            hasilKelas.textContent =
                bus.nama;

            hasilDurasi.textContent =
                `${durasi} hari`;

            harga.textContent =
                formatRupiah(
                    hargaEstimasi
                );


            if (hasilHarga) {

                hasilHarga.style.display =
                    "block";

            }


            /* =========================
               SCROLL KE HASIL
               ========================= */

            setTimeout(
                function() {

                    if (hasilHarga) {

                        hasilHarga.scrollIntoView({

                            behavior: "smooth",
                            block: "center"

                        });

                    }

                },
                100
            );

        }
    );

}


/* =========================================================
   10. VALIDASI TANGGAL PULANG
   ========================================================= */

if (tanggalBerangkat && tanggalPulang) {

    tanggalBerangkat.addEventListener(
        "change",
        function() {

            if (!tanggalBerangkat.value) {

                return;

            }


            tanggalPulang.min =
                tanggalBerangkat.value;


            if (
                tanggalPulang.value &&
                tanggalPulang.value <
                tanggalBerangkat.value
            ) {

                tanggalPulang.value = "";

            }

        }
    );

}


/* =========================================================
   11. SET MINIMUM TANGGAL BERANGKAT
   ========================================================= */

function setTanggalMinimum() {

    if (!tanggalBerangkat || !tanggalPulang) {

        return;

    }


    const hariIni =
        new Date();


    const tahun =
        hariIni.getFullYear();


    const bulan =
        String(
            hariIni.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const tanggal =
        String(
            hariIni.getDate()
        ).padStart(
            2,
            "0"
        );


    const tanggalSekarang =
        `${tahun}-${bulan}-${tanggal}`;


    tanggalBerangkat.min =
        tanggalSekarang;

    tanggalPulang.min =
        tanggalSekarang;

}


/* Jalankan saat halaman dibuka */

setTanggalMinimum();


/* =========================================================
   12. AJUKAN SEWA KE ADMIN
   ========================================================= */

function ajukanSewa() {

    /* =========================
       CEK DATA PERJALANAN
       ========================= */

    if (

        !dataPerjalanan.kotaJemput ||

        !dataPerjalanan.kotaTujuan ||

        !dataPerjalanan.tanggalBerangkat ||

        !dataPerjalanan.tanggalPulang ||

        !dataPerjalanan.jamPenjemputan ||

        !dataPerjalanan.jumlahPenumpang ||

        !dataPerjalanan.namaKelas

    ) {

        alert(
            "Silakan lakukan cek estimasi harga terlebih dahulu."
        );

        return;

    }


    /* =========================
       FORMAT TANGGAL
       ========================= */

    const tanggalBerangkatFormatted =
        formatTanggalIndonesia(
            dataPerjalanan.tanggalBerangkat
        );


    const tanggalPulangFormatted =
        formatTanggalIndonesia(
            dataPerjalanan.tanggalPulang
        );


    /* =========================
       PESAN WHATSAPP
       ========================= */

    const pesan = `Halo Admin PO Alula Sadida Maryam 👋

Saya ingin mengajukan sewa bus pariwisata.

📋 DATA PERJALANAN

📍 Kota Penjemputan:
${dataPerjalanan.kotaJemput}

📍 Kota Tujuan:
${dataPerjalanan.kotaTujuan}

📅 Tanggal Berangkat:
${tanggalBerangkatFormatted}

📅 Tanggal Pulang:
${tanggalPulangFormatted}

🕐 Jam Penjemputan:
${dataPerjalanan.jamPenjemputan}

⏱️ Durasi:
${dataPerjalanan.durasi} hari

👥 Jumlah Penumpang:
${dataPerjalanan.jumlahPenumpang} orang

🚌 Kelas Bus:
${dataPerjalanan.namaKelas}

💰 Estimasi Website:
${formatRupiah(dataPerjalanan.hargaEstimasi)}

⚠️ CATATAN:
Harga di atas hanya estimasi dari website dan belum merupakan harga final.

Mohon admin melakukan pengecekan:

✓ Ketersediaan armada
✓ Kesesuaian perjalanan
✓ Validasi data pemesan
✓ Harga final
✓ Ketentuan booking

Mohon admin memberikan konfirmasi mengenai ketersediaan armada dan persetujuan order.

Saya siap memberikan informasi tambahan apabila diperlukan.

Terima kasih 🙏`;


    /* =========================
       BUKA WHATSAPP
       ========================= */

    const url =
        `https://wa.me/${nomorAdmin}?text=` +
        encodeURIComponent(pesan);


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   13. FORMAT TANGGAL INDONESIA
   ========================================================= */

function formatTanggalIndonesia(
    tanggal
) {

    const date =
        new Date(tanggal + "T00:00:00");


    const namaBulan = [

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];


    return (

        date.getDate() +
        " " +
        namaBulan[
            date.getMonth()
        ] +
        " " +
        date.getFullYear()

    );

}


/* =========================================================
   14. DATA DETAIL UNIT BUS
   ========================================================= */

const dataUnit = {

    medium: {

        label: "Medium Bus",

        nama: "Medium Bus",

        gambar:
            "images/bus-medium.jpg",

        deskripsi:
            "Pilihan tepat untuk rombongan kecil hingga menengah. Cocok untuk perjalanan wisata keluarga, sekolah, komunitas, maupun kegiatan bersama.",

        spesifikasi: [

            {
                nama: "Kapasitas",
                nilai: "30–35 Seat"
            },

            {
                nama: "AC",
                nilai: "Full AC"
            },

            {
                nama: "Audio",
                nilai: "Audio System"
            },

            {
                nama: "Kenyamanan",
                nilai: "Nyaman untuk perjalanan"
            }

        ],

        fasilitas: [

            "Full AC",
            "USB Port",
            "Dispenser Air",
            "Audio System",
            "Bagasi Luas",
            "Kursi nyaman",
            "Sabuk keselamatan"

        ]

    },


    executive: {

        label: "Executive",

        nama: "Executive Bus",

        gambar:
            "images/bus-executive.jpg",

        deskripsi:
            "Unit Executive untuk perjalanan wisata yang mengutamakan kenyamanan. Cocok untuk keluarga, rombongan, perusahaan, maupun perjalanan antarkota.",

        spesifikasi: [

            {
                nama: "Kapasitas",
                nilai: "40–45 Seat"
            },

            {
                nama: "AC",
                nilai: "Full AC"
            },

            {
                nama: "Hiburan",
                nilai: "TV + Audio"
            },

            {
                nama: "Kenyamanan",
                nilai: "Executive Class"
            }

        ],

        fasilitas: [

            "Full AC",
            "USB Port",
            "Dispenser Air",
            "TV & Audio System",
            "Bagasi Luas",
            "Kursi nyaman & Reclining",
            "Interior premium"

        ]

    },


    big: {

        label: "Big Bus",

        nama: "Big Bus",

        gambar:
            "images/bus-big.jpg",

        deskripsi:
            "Kapasitas besar untuk rombongan wisata dalam jumlah banyak. Cocok untuk perjalanan sekolah, perusahaan, komunitas, dan rombongan wisata.",

        spesifikasi: [

            {
                nama: "Kapasitas",
                nilai: "50–59 Seat"
            },

            {
                nama: "AC",
                nilai: "Full AC"
            },

            {
                nama: "Hiburan",
                nilai: "TV + Audio"
            },

            {
                nama: "Kapasitas Bagasi",
                nilai: "Besar"
            }

        ],

        fasilitas: [

            "Full AC",
            "USB Port",
            "Dispenser Air",
            "TV & Audio (Karaoke)",
            "Bagasi Ekstra Luas",
            "Kursi nyaman",
            "Interior lapang"

        ]

    },


    luxury: {

        label: "Luxury",

        nama: "Luxury Bus",

        gambar:
            "images/bus-luxury.jpg",

        deskripsi:
            "Pilihan premium untuk pengalaman perjalanan yang lebih nyaman dan berkelas. Cocok untuk perjalanan wisata maupun kebutuhan rombongan khusus.",

        spesifikasi: [

            {
                nama: "Kapasitas",
                nilai: "30–40 Seat"
            },

            {
                nama: "AC",
                nilai: "Full AC"
            },

            {
                nama: "Kenyamanan",
                nilai: "Premium"
            },

            {
                nama: "Kursi",
                nilai: "Reclining Seat"
            }

        ],

        fasilitas: [

            "Full AC",
            "USB Port",
            "Dispenser Air",
            "Smart TV & Audio",
            "Bagasi Luas",
            "Reclining Seat Premium",
            "Kenyamanan ekstra"

        ]

    }

};


/* =========================================================
   15. FUNGSI BUKA DETAIL UNIT
   ========================================================= */

function cekUnit(jenisUnit) {

    const unit =
        dataUnit[jenisUnit];


    if (!unit) {

        alert(
            "Data unit tidak ditemukan."
        );

        return;

    }


    const modal =
        document.getElementById(
            "unitModal"
        );

    const gambar =
        document.getElementById(
            "unitModalImage"
        );

    const label =
        document.getElementById(
            "unitModalLabel"
        );

    const title =
        document.getElementById(
            "unitModalTitle"
        );

    const description =
        document.getElementById(
            "unitModalDescription"
        );

    const specs =
        document.getElementById(
            "unitModalSpecs"
        );

    const facilities =
        document.getElementById(
            "unitModalFacilities"
        );


    if (
        !modal ||
        !gambar ||
        !label ||
        !title ||
        !description ||
        !specs ||
        !facilities
    ) {

        console.error(
            "Elemen popup unit tidak ditemukan di HTML."
        );

        return;

    }


    /* =========================
       ISI DATA UNIT
       ========================= */

    gambar.src =
        unit.gambar;

    gambar.alt =
        unit.nama;

    label.textContent =
        unit.label;

    title.textContent =
        unit.nama;

    description.textContent =
        unit.deskripsi;


    /* =========================
       SPESIFIKASI
       ========================= */

    specs.innerHTML = "";


    unit.spesifikasi.forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "unit-spec-item";


            const strong =
                document.createElement(
                    "strong"
                );

            strong.textContent =
                item.nama;


            const span =
                document.createElement(
                    "span"
                );

            span.textContent =
                item.nilai;


            div.appendChild(
                strong
            );

            div.appendChild(
                span
            );


            specs.appendChild(
                div
            );

        }
    );


    /* =========================
       FASILITAS
       ========================= */

    facilities.innerHTML = "";


    unit.fasilitas.forEach(
        function(item) {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                item;


            facilities.appendChild(
                li
            );

        }
    );


    /* =========================
       TAMPILKAN POPUP
       ========================= */

    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   16. TUTUP DETAIL UNIT
   ========================================================= */

function tutupUnit() {

    const modal =
        document.getElementById(
            "unitModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   17. IMAGE LIGHTBOX
   ========================================================= */

function bukaGambar(gambar) {

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !gambar
    ) {

        return;

    }


    lightboxImage.src =
        gambar.src;

    lightboxImage.alt =
        gambar.alt;


    lightbox.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function tutupGambar() {

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   18. KLIK AREA GELAP UNTUK MENUTUP
   ========================================================= */

const imageLightbox =
    document.getElementById(
        "imageLightbox"
    );


if (imageLightbox) {

    imageLightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                this
            ) {

                tutupGambar();

            }

        }
    );

}


/* =========================================================
   19. KLIK AREA GELAP MODAL UNIT
   ========================================================= */

const unitModal =
    document.getElementById(
        "unitModal"
    );


if (unitModal) {

    unitModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                this
            ) {

                tutupUnit();

            }

        }
    );

}


/* =========================================================
   20. TOMBOL ESC UNTUK MENUTUP
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            const modal =
                document.getElementById(
                    "unitModal"
                );

            const lightbox =
                document.getElementById(
                    "imageLightbox"
                );


            if (
                modal &&
                modal.classList.contains(
                    "active"
                )
            ) {

                tutupUnit();

                return;

            }


            if (
                lightbox &&
                lightbox.classList.contains(
                    "active"
                )
            ) {

                tutupGambar();

            }

        }

    }
);


/* =========================================================
   21. CEK STATUS WEBSITE
   ========================================================= */

console.log(
    "PO Alula Sadida Maryam - Website aktif."
);

console.log(
    "Sistem estimasi harga siap digunakan."
);

console.log(
    "Sistem detail unit bus siap digunakan."
);