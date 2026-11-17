// =======================================================
// LUVELLA AVENUE - 100% VERIFIED ORDER & HELP WHATSAPP
// =======================================================
window.addEventListener('DOMContentLoaded', function () {
    // ১. Help Center পপআপ খোলা ও বন্ধ করা
    const openHelp = document.getElementById('openHelpBtn');
    const closeHelp = document.getElementById('closeHelpBtn');
    const helpPopup = document.getElementById('helpPopup');

    if (openHelp && helpPopup) {
        openHelp.addEventListener('click', () => helpPopup.classList.toggle('show'));
    }
    if (closeHelp && helpPopup) {
        closeHelp.addEventListener('click', () => helpPopup.classList.remove('show'));
    }

    // ২. Help Center-এর ৩টি WhatsApp আইকনে সঠিক নম্বর বসানো
    const waLinks = document.querySelectorAll('.help-team-list .btn-wa-icon');
    const supportPhones = ['8801352068869', '8801537233354', '8801306842947'];
    waLinks.forEach((link, idx) => {
        const num = supportPhones[idx] || '8801352068869';
    link.href = 'https://wa.me' + num + '?text=' + encodeURIComponent('আসসালামু আলাইকুম, আমি কিছু তথ্য জানতে চাচ্ছি।');

        link.target = '_blank';
    });
});

// ৩. অর্ডার ফর্মের ৩টি বাটনে (Sajib, Mitu, Ontora) ক্লিক করলে WhatsApp-এ অর্ডার পাঠানো
document.addEventListener('click', function (e) {
    const orderBtn = e.target.closest('.wa-order-btn');
    if (!orderBtn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const targetPhone = orderBtn.getAttribute('data-phone') || '8801346473166';
    const form = orderBtn.closest('form');

    const name = form.querySelector('#custName')?.value.trim() || '';
    const phone = form.querySelector('#custPhone')?.value.trim() || '';
    const address = form.querySelector('#custAddress')?.value.trim() || '';

    if (!name || !phone || !address) {
        alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!');
        return;
    }

    const areaEl = form.querySelector('#deliveryArea');
    const areaText = areaEl ? areaEl.options[areaEl.selectedIndex].text : '';
    const payMethod = form.querySelector('#paymentMethod')?.value || 'Cash on Delivery';
    const senderNum = form.querySelector('#senderNumber')?.value.trim() || '';
    const trxId = form.querySelector('#trxId')?.value.trim() || '';
    const note = form.querySelector('#orderNote')?.value.trim() || 'নেই';
    const total = form.querySelector('#finalPayable')?.innerText.trim() || '';

    let prodInfo = '';
    const qtyBox = form.querySelector('#directQtyBox');
    if (qtyBox && qtyBox.style.display !== 'none') {
        const pTitle = form.querySelector('#directOrderTitle')?.innerText.trim() || '';
        const pQty = form.querySelector('#directQtyNum')?.innerText.trim() || '1';
        prodInfo = '• ' + pTitle + ' (' + pQty + ' পিস)';
    } else {
        document.querySelectorAll('#cartItemsContainer .cart-item').forEach(item => {
            const t = item.querySelector('h4')?.innerText.trim() || '';
            const q = item.querySelector('.qty-controls span')?.innerText.trim() || '1';
            prodInfo += '• ' + t + ' (' + q + ' পিস)\n';
        });
    }

    let payDetails = '💳 পেমেন্ট: ' + payMethod;
    if (payMethod === 'bKash' || payMethod === 'Nagad') {
        payDetails += '\n📱 সেন্ডার নম্বর: ' + senderNum + '\n🧾 TrxID: ' + trxId;
    }

    const msg =
        '🦋 *নতুন অর্ডার - Luvella Avenue*\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '👤 *নাম:* ' + name + '\n' +
        '📞 *মোবাইল:* ' + phone + '\n' +
        '📍 *ঠিকানা:* ' + address + '\n' +
        '🚚 *এলাকা:* ' + areaText + '\n\n' +
        '🛍️ *প্রোডাক্ট:*\n' + prodInfo + '\n\n' +
        payDetails + '\n' +
        '📝 *নোট/সাইজ:* ' + note + '\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '💰 *সর্বমোট বিল:* ' + total;

    window.location.href = 'https://whatsapp.com' + targetPhone + '&text=' + encodeURIComponent(msg);
}, true);
