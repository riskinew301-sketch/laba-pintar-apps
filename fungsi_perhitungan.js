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
    document.getElementById('hargaJual').innerText = formatRupiah(hargaJualFinal);
    document.getElementById('totalModal').innerText = formatRupiah(totalModal);
    document.getElementById('potonganAdmin').innerText = formatRupiah(biayaAdmin);
    let profitElement = document.getElementById('profitBersih');
    profitElement.innerText = formatRupiah(profitNominal);

    if (profitNominal < 0) {
        // KONDISI RUGI (Loss)
        profitElement.style.color = "#e53e3e"; // Merah Bahaya
        profitElement.style.fontWeight = "bold";
        profitElement.innerHTML += " <br><span style='font-size:0.8em'>⚠️ POTENSI RUGI!</span>";
    } else {
        profitElement.style.color = "#2f855a";
        profitElement.style.fontWeight = "bold";
    }

    document.getElementById('result').style.display = "block";
    document.getElementById('result').scrollIntoView({behavior: 'smooth'});
}

function simpanKeRiwayat() {
    let nama = document.getElementById('namaProduk').value || "Produk Tanpa Nama";
    let hargaJual = document.getElementById('hargaJual').innerText;
    let profitText = document.getElementById('profitBersih').innerText;
    let isRugi = profitText.includes("RUGI");
    
    let dataBaru = {
        id: Date.now(), 
        nama: nama,
        harga: hargaJual,
        profit: profitText,
        status: isRugi ? "rugi" : "untung",
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    
    riwayat.unshift(dataBaru);
    localStorage.setItem('labaPintarData', JSON.stringify(riwayat));
    
    tampilkanRiwayat();
    resetForm();
    
    if(isRugi) {
        alert("Data tersimpan dengan status: BERISIKO (Rugi). Harap evaluasi ulang nanti.");
    } else {
        alert("Data berhasil disimpan ke memori lokal!");
    }
}

function tampilkanRiwayat() {
    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    let wadah = document.getElementById('list-riwayat');
    let section = document.getElementById('riwayat-section');

    if (riwayat.length > 0) {
        section.style.display = "block";
        wadah.innerHTML = "";
        
        riwayat.forEach(item => {
            let warnaProfit = item.status === "rugi" ? "#e53e3e" : "#276749";
            let iconStatus = item.status === "rugi" ? "⚠️" : "✅";

            wadah.innerHTML += `
                <div class="history-item" style="border-left: 5px solid ${warnaProfit};">
                    <div>
                        <strong>${item.nama}</strong><br>
                        <small>${item.tanggal}</small>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #2d3748; font-weight:bold;">${item.harga}</span><br>
                        <small style="color: ${warnaProfit}; font-weight:bold;">
                            ${iconStatus} Laba: ${item.profit.replace("POTENSI RUGI!", "")}
                        </small>
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
    document.getElementById('namaProduk').value = ''; 
    document.getElementById('hpp').value = '';
    document.getElementById('operasional').value = '';
    document.getElementById('margin').value = '';
    document.getElementById('adminFee').value = '';
    document.getElementById('result').style.display = "none";
}

function formatRupiah(angka) {
    return "Rp " + Math.ceil(angka).toLocaleString('id-ID');
}
