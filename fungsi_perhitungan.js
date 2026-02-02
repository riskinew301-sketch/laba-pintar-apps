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

    let hargaJualEl = document.getElementById('hargaJual');
    let profitEl = document.getElementById('profitBersih');
    let modalEl = document.getElementById('totalModal');
    let adminEl = document.getElementById('potonganAdmin');

    modalEl.innerText = formatRupiah(totalModal);
    adminEl.innerText = formatRupiah(potonganAsli);
    profitEl.innerText = formatRupiah(profitBersihNyata);
    profitEl.style.fontWeight = "bold";

    let isError = false;
    if (marginPersen < 0) {
        profitEl.style.color = "#e53e3e"; 
        profitEl.innerHTML += "<br><span style='font-size:0.9em; font-weight:800; color: #c53030;'>⛔ MARGIN JANGAN MINUS!</span>";
        isError = true;
    } else if (profitBersihNyata < 0) {
        profitEl.style.color = "#e53e3e"; 
        profitEl.innerHTML += "<br><span style='font-size:0.9em; font-weight:800; color: #c53030;'>⛔ ADMIN KETINGGIAN! (Rugi)</span>";
        isError = true;
    } else {
        profitEl.style.color = "#2f855a"; 
        profitEl.innerHTML += " ✅ (Aman)";
        isError = false;
    }

    if (isError) {
        hargaJualEl.innerText = "⛔ PERLU EVALUASI"; 
        hargaJualEl.style.color = "#c53030";
        hargaJualEl.style.fontSize = "24px";
    } else {
        hargaJualEl.innerText = formatRupiah(hargaJualFinal);
        hargaJualEl.style.color = "#2f855a";
        hargaJualEl.style.fontSize = "32px";
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
    // Deteksi icon error baru (⛔)
    if (profitText.includes("⛔")) {
        status = "rugi";
    }

    let profitClean = profitText.split("⛔")[0].split("✅")[0].split("<br>")[0].trim();

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
    
    if(status === "rugi") alert("Disimpan: Produk ini BERISIKO (Rugi). Harap evaluasi ulang.");
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
            let teksStatus = "Aman";
            
            if (item.status === "rugi") {
                warnaStatus = "#e53e3e";
                ikon = "⛔";
                teksStatus = "POTENSI RUGI!";
            }

            let btnHapus = `<button onclick="hapusSatu(${item.id})" style="background:#fff0f0; border:1px solid #feb2b2; color:red; border-radius:4px; cursor:pointer; padding:5px; margin-left:10px;">🗑️</button>`;

            wadah.innerHTML += `
                <div class="history-item" style="border-left: 5px solid ${warnaStatus}; margin-bottom: 10px; padding: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
                    <div style="flex-grow: 1;">
                        <strong>${item.nama}</strong><br>
                        <small style="color: #718096;">${item.tanggal}</small>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #2d3748; font-weight:bold; font-size:0.9em;">${item.harga}</span><br>
                        <small style="color: ${warnaStatus}; font-weight:bold;">
                            ${ikon} Laba: ${item.profit}<br>
                            <span style="font-size: 0.8em;">(${teksStatus})</span>
                        </small>
                    </div>
                    <div style="margin-left: 5px;">
                        ${btnHapus}
                    </div>
                </div>
            `;
        });
    } else {
        section.style.display = "none";
    }
}

function hapusSatu(id) {
    if(confirm("Hapus data ini?")) {
        let riwayat = JSON.parse(localStorage.getItem('labaPintarData')) || [];
        let riwayatBaru = riwayat.filter(item => item.id !== id);
        
        localStorage.setItem('labaPintarData', JSON.stringify(riwayatBaru));
        tampilkanRiwayat();
    }
}

function hapusSemua() {
    if(confirm("Hapus SEMUA riwayat pencatatan?")) {
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
    
    let hargaJualEl = document.getElementById('hargaJual');
    hargaJualEl.innerText = "Rp 0";
    hargaJualEl.style.color = "#2d3748";
    hargaJualEl.style.fontSize = "32px";
    
    document.getElementById('result').style.display = "none";
}

function formatRupiah(angka) {
    return "Rp " + Math.ceil(angka).toLocaleString('id-ID');
}
