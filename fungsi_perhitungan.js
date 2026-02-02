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
        alert("Mohon isi Harga Beli (HPP) barang!");
        return;
    }

    let totalModal = hpp + operasional;
    let targetProfit = totalModal * (marginPersen / 100); 
    let hargaDasar = totalModal + targetProfit; 
    
    let markupAdmin = hargaDasar * (adminPersen / 100);
    let hargaJualFinal = hargaDasar + markupAdmin;

    let potonganAsli = hargaJualFinal * (adminPersen / 100);
    let uangDiterima = hargaJualFinal - potonganAsli;
    let profitBersihNyata = uangDiterima - totalModal;

    document.getElementById('hargaJual').innerText = formatRupiah(hargaJualFinal);
    document.getElementById('totalModal').innerText = formatRupiah(totalModal);
    document.getElementById('potonganAdmin').innerText = formatRupiah(potonganAsli);

    let profitElement = document.getElementById('profitBersih');
    profitElement.innerText = formatRupiah(profitBersihNyata);
    profitElement.style.fontWeight = "bold";

    if (profitBersihNyata < 0) {
        profitElement.style.color = "#e53e3e"; 
        profitElement.innerHTML += "<br><span style='font-size:0.8em; background:#fee2e2; padding:2px 5px; border-radius:4px;'>⚠️ ADMIN TERLALU TINGGI! (Rugi)</span>";
    } else if (profitBersihNyata < targetProfit) {
        profitElement.style.color = "#d69e2e"; 
        profitElement.innerHTML += "<br><span style='font-size:0.8em; background:#fefcbf; padding:2px 5px; border-radius:4px;'>⚠️ UNTUNG TIPIS (Hati-hati)</span>";
    } else {
        profitElement.style.color = "#2f855a"; 
        profitElement.innerHTML += " ✅ (Aman)";
    }

    let resultSection = document.getElementById('result');
    resultSection.style.display = "block";
    resultSection.scrollIntoView({behavior: 'smooth'});
}

function simpanKeRiwayat() {
    let nama = document.getElementById('namaProduk').value || "Produk Tanpa Nama";
    let hargaJual = document.getElementById('hargaJual').innerText;
    let profitText = document.getElementById('profitBersih').innerText; 
    
    let status = "aman"; 
    if (profitText.includes("Rugi")) {
        status = "rugi";
    } else if (profitText.includes("Tergerus") || profitText.includes("MELESET")) {
        status = "meleset";
    }

    let profitClean = profitText.split("⚠️")[0].split("✅")[0].trim();

    let dataBaru = {
        id: Date.now(), 
        nama: nama,
        harga: hargaJual,
        profit: profitClean,
        status: status, 
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    riwayat.unshift(dataBaru);
    localStorage.setItem('labaPintarData', JSON.stringify(riwayat));
    
    tampilkanRiwayat();
    resetForm();
    
    if(status === "rugi") alert("Disimpan: Hati-hati, produk ini berpotensi RUGI!");
    else if(status === "meleset") alert("Disimpan: Perhatikan margin, keuntungan tergerus admin.");
    else alert("Data berhasil disimpan!");
}

function tampilkanRiwayat() {
    let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
    let wadah = document.getElementById('list-riwayat');
    let section = document.getElementById('riwayat-section');

    if (riwayat.length > 0) {
        section.style.display = "block";
        wadah.innerHTML = "";
        
        riwayat.forEach(item => {
            let warnaStatus = "#2f855a"; 
            let ikon = "✅";
            
            if (item.status === "rugi") {
                warnaStatus = "#e53e3e"; 
                ikon = "⚠️";
            } else if (item.status === "meleset") {
                warnaStatus = "#d69e2e"; 
                ikon = "🔸";
            }

            wadah.innerHTML += `
                <div class="history-item" style="border-left: 5px solid ${warnaStatus}; margin-bottom: 10px; padding: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
                    <div>
                        <strong>${item.nama}</strong><br>
                        <small style="color: #718096;">${item.tanggal}</small>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #2d3748; font-weight:bold;">${item.harga}</span><br>
                        <small style="color: ${warnaStatus}; font-weight:bold;">
                            ${ikon} Laba: ${item.profit}
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

