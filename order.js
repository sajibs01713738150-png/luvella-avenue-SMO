// =======================================================
// LUVELLA AVENUE - 100% WORKING WHATSAPP ORDER & SYNC
// =======================================================
document.addEventListener('click', function (e) {
    const btn = e.target.closest('button, a');
    if (!btn) return;

    const btnText = (btn.innerText || '').trim();
    let targetPhone = '';

    if (btnText.includes('Sajib-কে অর্ডার')) {
        targetPhone = '8801346473166';
    } else if (btnText.includes('Mitu (WhatsApp)')) {
        targetPhone = '8801537233354';
    } else if (btnText.includes('Ontora (WhatsApp)')) {
        targetPhone = '8801306842947';
    } else {
        return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    const modal = document.querySelector('#checkoutModal.show') || document.getElementById('checkoutModal');
    const name = modal.querySelector('#custName')?.value.trim() || '';
    const phone = modal.querySelector('#custPhone')?.value.trim() || '';
    const address = modal.querySelector('#custAddress')?.value.trim() || '';

    if (!name || !phone || !address) {
        alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!');
        return;
    }

    const areaEl = modal.querySelector('#deliveryArea');
    const areaText = areaEl ? areaEl.options[areaEl.selectedIndex].text : '';
    const payMethod = modal.querySelector('#paymentMethod')?.value || 'Cash on Delivery';
    const senderNum = modal.querySelector('#senderNumber')?.value.trim() || '';
    const trxId = modal.querySelector('#trxId')?.value.trim() || '';
    const note = modal.querySelector('#orderNote')?.value.trim() || 'নেই';
    const totalBill = modal.querySelector('#finalPayable')?.innerText.trim() || '';

    let productInfo = '';
    const qtyBox = modal.querySelector('#directQtyBox');
    if (qtyBox && qtyBox.style.display !== 'none') {
        const pTitle = modal.querySelector('#directOrderTitle')?.innerText.trim() || '';
        const pQty = modal.querySelector('#directQtyNum')?.innerText.trim() || '1';
        productInfo = '• ' + pTitle + ' (' + pQty + ' পিস)';
    } else {
        document.querySelectorAll('#cartItemsContainer .cart-item').forEach(item => {
            const t = item.querySelector('h4')?.innerText.trim() || '';
            const q = item.querySelector('.qty-controls span')?.innerText.trim() || '1';
            productInfo += '• ' + t + ' (' + q + ' পিস)\n';
        });
    }

    let payDetails = '💳 পেমেন্ট: ' + payMethod;
    if (payMethod === 'bKash' || payMethod === 'Nagad') {
        payDetails += '\n📱 সেন্ডার নম্বর: ' + senderNum + '\n🧾 TrxID: ' + trxId;
    }

    // ১. ট্র্যাকিং ও অ্যাডমিন প্যানেলের জন্য অর্ডারটি সেভ করা
    let orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
    orders.unshift({
        id: Date.now(),
        name: name,
        phone: phone,
        address: address,
        total: totalBill,
        status: 'Pending',
        items: [{ title: productInfo.replace('• ', ''), qty: 1, price: 0 }],
        date: new Date().toLocaleString()
    });
    localStorage.setItem('luvellaOrders', JSON.stringify(orders));

    // ২. WhatsApp-এ পাঠানোর জন্য সাজানো মেসেজ তৈরি
    const waMessage =
        '🦋 *নতুন অর্ডার - Luvella Avenue*\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '👤 *নাম:* ' + name + '\n' +
        '📞 *মোবাইল:* ' + phone + '\n' +
        '📍 *ঠিকানা:* ' + address + '\n' +
        '🚚 *এলাকা:* ' + areaText + '\n\n' +
        '🛍️ *প্রোডাক্ট:*\n' + productInfo + '\n\n' +
        payDetails + '\n' +
        '📝 *নোট/সাইজ:* ' + note + '\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '💰 *সর্বমোট বিল:* ' + totalBill;

    const finalUrl = 'https://wa.me' + targetPhone + '?text=' + encodeURIComponent(waMessage);
    window.location.href = finalUrl;
}, true);
