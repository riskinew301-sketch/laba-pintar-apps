// Load data saat aplikasi dibuka pertama kali
document.addEventListener("DOMContentLoaded", function() {
    tampilkanRiwayat();
});

function hitungHarga() {
    let nama = document.getElementById('namaProduk').value;
    let hpp = parseFloat(document.getElementById('hpp').value) || 0;
    let operasional = parseFloat(document.getElementById('operasional').value) || 0;
    let marginPersen = parseFloat(document.getElementById('margin').value) || 0;
    let adminPersen = parseFloat(document.getElementById('adminFee').value) || 0;

    if (hpp === 0) {
        alert("Mohon isi Harga Beli barang!");
        return;
    }

    let totalModal = hpp + operasional;
    let profitNominal = totalModal * (marginPersen / 100);
    let hargaSebelumAdmin = totalModal + profitNominal;
    let biayaAdmin = hargaSebelumAdmin * (adminPersen / 100);
    let hargaJualFinal = hargaSebelumAdmin + biayaAdmin;

    // Tampilkan Hasil
    document.getElementById('hargaJual').innerText = formatRupiah(hargaJualFinal);
    document.getElementById('totalModal').innerText = formatRupiah(totalModal);
    document.getElementById('profitBersih').innerText = formatRupiah(profitNominal);
    document.getElementById('potonganAdmin').innerText = formatRupiah(biayaAdmin);
    document.getElementById('result').style.display = "block";
    
    // Scroll ke hasil
    document.getElementById('result').scrollIntoView({behavior: 'smooth'});
}

function simpanKeRiwayat() {
    let nama = document.getElementById('namaProduk').value || "Produk Tanpa Nama";
    let hargaJual = document.getElementById('hargaJual').innerText;
    let profit = document.getElementById('profitBersih').innerText;
    
    // Buat Objek Data
    let dataBaru = {
        id: Date.now(), // ID unik berdasarkan waktu
        nama: nama,
        harga: hargaJual,
        profit: profit,
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    // Ambil data lama dari LocalStorage (Database Browser)
    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    
    // Tambah data baru ke atas (unshift)
    riwayat.unshift(dataBaru);
    
    // Simpan balik ke LocalStorage
    localStorage.setItem('labaPintarData', JSON.stringify(riwayat));
    
    // Refresh tampilan dan reset form
    tampilkanRiwayat();
    resetForm();
    alert("Data berhasil disimpan ke memori lokal!");
}

function tampilkanRiwayat() {
    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    let wadah = document.getElementById('list-riwayat');
    let section = document.getElementById('riwayat-section');

    if (riwayat.length > 0) {
        section.style.display = "block";
        wadah.innerHTML = ""; // Bersihkan dulu
        
        riwayat.forEach(item => {
            wadah.innerHTML += `
                <div class="history-item">
                    <div>
                        <strong>${item.nama}</strong><br>
                        <small>${item.tanggal}</small>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #22543d; font-weight:bold;">${item.harga}</span><br>
                        <small style="color: #276749;">Laba: ${item.profit}</small>
                    </div>
                </div>
            `;
        });
    } else {
        section.style.display = "none";
    }
}

function hapusSemua() {
    if(confirm("Hapus semua riwayat pencatatan?")) {
        localStorage.removeItem('labaPintarData');
        tampilkanRiwayat();
    }
}

function resetForm() {
    document.getElementById('namaProduk').value = ''; // Reset nama
    document.getElementById('hpp').value = '';
    document.getElementById('operasional').value = '';
    document.getElementById('margin').value = '';
    document.getElementById('adminFee').value = '';
    document.getElementById('result').style.display = "none";
}

function formatRupiah(angka) {
    return "Rp " + Math.ceil(angka).toLocaleString('id-ID');
}
