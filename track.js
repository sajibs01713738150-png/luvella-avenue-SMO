// =======================================================
// REAL-TIME CUSTOMER ORDER TRACKING & AUTO SAVE
// =======================================================
window.addEventListener('DOMContentLoaded', function () {

    // ১. হেডারে শুধু "📦 ট্র্যাক অর্ডার" বাটন যোগ করা
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('realTrackBtn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'realTrackBtn';
        btn.innerHTML = '📦 ট্র্যাক অর্ডার';
        btn.style.cssText = 'background:#F5E1E6; color:#A8425B; border:1.5px solid rgba(168,66,91,0.3); padding:5px 12px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; margin-right:6px;';
        headerActions.prepend(btn);

        const modal = document.createElement('div');
        modal.id = 'realTrackModal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 430px;">
                <div class="modal-header">
                    <h3>📦 লাইভ অর্ডার ট্র্যাকিং</h3>
                    <button type="button" id="closeRealTrack">✕</button>
                </div>
                <p style="font-size:12px; color:#665E60; margin-bottom:10px;">অর্ডার করার সময় ব্যবহৃত মোবাইল নম্বরটি দিন:</p>
                <div style="display:flex; gap:6px; margin-bottom:14px;">
                    <input type="tel" id="liveTrackPhone" placeholder="যেমন: 017XXXXXXXX" style="flex:1; padding:9px 12px; border:1.5px solid rgba(168,66,91,0.3); border-radius:9px; font-size:13px;">
                    <button type="button" id="doLiveTrackBtn" class="btn-order-sm" style="padding:0 16px; font-size:12px;">ট্র্যাক করুন</button>
                </div>
                <div id="liveTrackOutput"></div>
            </div>
        `;
        document.body.appendChild(modal);

        btn.addEventListener('click', () => modal.classList.add('show'));
        document.getElementById('closeRealTrack').addEventListener('click', () => modal.classList.remove('show'));

        document.getElementById('doLiveTrackBtn').addEventListener('click', () => {
            const phoneQuery = document.getElementById('liveTrackPhone').value.trim();
            const outBox = document.getElementById('liveTrackOutput');

            if (!phoneQuery) {
                outBox.innerHTML = '<p style="color:#A8425B; font-size:12px;">অনুগ্রহ করে মোবাইল নম্বর লিখুন।</p>';
                return;
            }

            const orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
            const matched = orders.filter(o => (o.phone || '').includes(phoneQuery));

            if (matched.length === 0) {
                outBox.innerHTML = `
                    <div style="background:#FFF5F7; padding:12px; border-radius:10px; border:1px dashed #A8425B; text-align:center; font-size:12px;">
                        <p style="font-weight:700; color:#2D292A;">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।</p>
                        <span style="color:#665E60;">সঠিক নম্বর দিন অথবা নিচের Help বাটনে কথা বলুন।</span>
                    </div>`;
                return;
            }

            outBox.innerHTML = matched.map(o => {
                const st = o.status || 'Pending';
                let step1 = '✅', step2 = '⚪', step3 = '⚪', step4 = '⚪';
                let statusLabel = '⏳ আপনার অর্ডারটি গ্রহণ করা হয়েছে (Pending)';
                let badgeBg = '#FEF3C7', badgeColor = '#92400E';

                if (st === 'Confirmed') {
                    step2 = '✅';
                    statusLabel = '✅ আপনার অর্ডারটি কনফার্ম করা হয়েছে!';
                    badgeBg = '#DCFCE7'; badgeColor = '#166534';
                } else if (st === 'Courier') {
                    step2 = '✅'; step3 = '✅';
                    statusLabel = '🚚 পার্সেলটি কুরিয়ারে হস্তান্তর করা হয়েছে!';
                    badgeBg = '#DBEAFE'; badgeColor = '#1E40AF';
                } else if (st === 'Delivered') {
                    step2 = '✅'; step3 = '✅'; step4 = '✅';
                    statusLabel = '🎉 পার্সেলটি সফলভাবে ডেলিভারি হয়েছে!';
                    badgeBg = '#DCFCE7'; badgeColor = '#166534';
                }

                return `
                <div style="background:#FFFFFF; border:1.5px solid rgba(168,66,91,0.2); border-radius:12px; padding:12px; margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="font-size:13px;">👤 ${o.name}</strong>
                        <span style="background:${badgeBg}; color:${badgeColor}; padding:3px 9px; border-radius:12px; font-size:10.5px; font-weight:700;">${st}</span>
                    </div>
                    <p style="font-size:12px; font-weight:700; color:#8A2E44; margin-bottom:8px;">${statusLabel}</p>
                    <div style="background:#FDFBF7; padding:8px; border-radius:8px; font-size:11.5px; line-height:1.7; border:1px solid #eee;">
                        <div>${step1} অর্ডার রিসিভড</div>
                        <div>${step2} অর্ডার কনফার্মড</div>
                        <div>${step3} কুরিয়ারে পাঠানো হয়েছে (In Courier)</div>
                        <div>${step4} ডেলিভারি সম্পন্ন (Delivered)</div>
                    </div>
                    <div style="margin-top:8px; font-size:11.5px; color:#555;">
                        <strong>প্রোডাক্ট:</strong> ${(o.items || []).map(i => i.title + ' (' + i.qty + 'টি)').join(', ')}<br>
                        <strong>মোট বিল:</strong> ${o.total}
                    </div>
                </div>`;
            }).join('');
        });
    }

    // ২. WhatsApp-এ অর্ডার পাঠানোর সময় অটোমেটিক ট্র্যাকিং ডাটাবেসেও সেভ রাখা
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button, a');
        if (!btn) return;
        const txt = (btn.innerText || '');
        if (!txt.includes('Sajib-কে অর্ডার') && !txt.includes('Mitu (WhatsApp)') && !txt.includes('Ontora (WhatsApp)')) return;

        const modal = document.querySelector('#checkoutModal.show') || document.getElementById('checkoutModal');
        const name = modal.querySelector('#custName')?.value.trim();
        const phone = modal.querySelector('#custPhone')?.value.trim();
        const address = modal.querySelector('#custAddress')?.value.trim();
        if (!name || !phone || !address) return;

        const prod = modal.querySelector('#directOrderTitle')?.innerText.trim() || 'শপিং ব্যাগ আইটেম';
        const qty = Number(modal.querySelector('#directQtyNum')?.innerText.trim() || '1');
        const total = modal.querySelector('#finalPayable')?.innerText.trim() || '';

        let orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
        orders.unshift({
            id: Date.now(),
            name: name,
            phone: phone,
            address: address,
            total: total,
            status: 'Pending',
            items: [{ title: prod, qty: qty, price: 0 }],
            date: new Date().toLocaleString()
        });
        localStorage.setItem('luvellaOrders', JSON.stringify(orders));
    }, true);
});
