function hitungHarga() {
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
    document.getElementById('profitBersih').innerText = formatRupiah(profitNominal);
    document.getElementById('potonganAdmin').innerText = formatRupiah(biayaAdmin);
    document.getElementById('result').style.display = "block";
}
function resetForm() {
    document.getElementById('hpp').value = '';
    document.getElementById('operasional').value = '';
    document.getElementById('margin').value = '';
    document.getElementById('adminFee').value = '';
    document.getElementById('result').style.display = "none";
}
function formatRupiah(angka) {
    return "Rp " + Math.ceil(angka).toLocaleString('id-ID');
}