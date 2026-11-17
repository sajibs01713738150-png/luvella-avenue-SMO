document.addEventListener('click', function (event) {
    const btn = event.target.closest('button, a');
    if (!btn) return;

    const text = (btn.innerText || '').trim();
    let waNumber = '';

    if (text.includes('Sajib-কে অর্ডার')) {
        waNumber = '8801346473166';
    } else if (text.includes('Mitu (WhatsApp)')) {
        waNumber = '8801537233354';
    } else if (text.includes('Ontora (WhatsApp)')) {
        waNumber = '8801306842947';
    } else {
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const modal = document.querySelector('#checkoutModal.show') || document.getElementById('checkoutModal');
    const name = modal.querySelector('#custName')?.value.trim() || '';
    const phone = modal.querySelector('#custPhone')?.value.trim() || '';
    const address = modal.querySelector('#custAddress')?.value.trim() || '';

    if (!name || !phone || !address) {
        alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!');
        return;
    }

    const prod = modal.querySelector('#directOrderTitle')?.innerText.trim() || 'শপিং ব্যাগ আইটেম';
    const qty = modal.querySelector('#directQtyNum')?.innerText.trim() || '1';
    const total = modal.querySelector('#finalPayable')?.innerText.trim() || '';
    const pay = modal.querySelector('#paymentMethod')?.value || 'Cash on Delivery';
    const note = modal.querySelector('#orderNote')?.value.trim() || 'নেই';

    const message =
        '🦋 *নতুন অর্ডার - Luvella Avenue*\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '👤 *নাম:* ' + name + '\n' +
        '📞 *মোবাইল:* ' + phone + '\n' +
        '📍 *ঠিকানা:* ' + address + '\n' +
        '🛍️ *প্রোডাক্ট:* ' + prod + ' (' + qty + ' পিস)\n' +
        '💳 *পেমেন্ট:* ' + pay + '\n' +
        '📝 *নোট:* ' + note + '\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '💰 *সর্বমোট বিল:* ' + total;

    const whatsappUrl = 'https://whatsapp.com' + waNumber + '&text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
}, true);
