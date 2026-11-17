// =======================================================
// 100% WORKING WHATSAPP FOR MOBILE & PC (ALL BUTTONS)
// =======================================================
function openSmartWhatsApp(phone, textMessage) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const encoded = textMessage ? '&text=' + encodeURIComponent(textMessage) : '';
    
    // মোবাইলে সরাসরি অ্যাপ ওপেন করবে, আর কম্পিউটারে সরাসরি WhatsApp Web ওপেন করবে
    const waLink = isMobile
        ? 'https://whatsapp.com' + phone + encoded
        : 'https://whatsapp.com' + phone + encoded;

    window.open(waLink, '_blank');
}

document.addEventListener('click', function (e) {
    // ১. Help Center-এর সবুজ WhatsApp আইকনগুলোতে ক্লিক করলে
    const helpWaBtn = e.target.closest('.btn-wa-icon');
    if (helpWaBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const rawHref = helpWaBtn.getAttribute('href') || '';
        const phoneMatch = rawHref.match(/\d+/);
        const targetPhone = phoneMatch ? phoneMatch : '8801352068869';
        openSmartWhatsApp(targetPhone, 'আসসালামু আলাইকুম, Luvella Avenue থেকে একটি প্রোডাক্ট সম্পর্কে জানতে চাচ্ছি।');
        return;
    }

    // ২. অর্ডার ফর্মের ৩টি WhatsApp বাটনে ক্লিক করলে
    const orderBtn = e.target.closest('button, a');
    if (!orderBtn) return;

    const btnText = (orderBtn.innerText || '').trim();
    let orderPhone = '';

    if (btnText.includes('Sajib-কে অর্ডার')) orderPhone = '8801346473166';
    else if (btnText.includes('Mitu (WhatsApp)')) orderPhone = '8801537233354';
    else if (btnText.includes('Ontora (WhatsApp)')) orderPhone = '8801306842947';
    else return;

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

    // ট্র্যাকিং ও অ্যাডমিনের জন্য সেভ করা
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

    openSmartWhatsApp(orderPhone, waMessage);
}, true);
