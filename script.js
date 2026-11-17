// =======================================================
// 1. DIRECT WHATSAPP ORDER (Sajib, Mitu, Ontora) - TOP PRIORITY
// =======================================================
document.addEventListener('click', function(e) {
    const target = e.target.closest('button, a');
    if (!target) return;

    const label = target.innerText || '';
    let waPhone = '';

    if (label.includes('Sajib-কে অর্ডার')) waPhone = '8801346473166';
    else if (label.includes('Mitu (WhatsApp)')) waPhone = '8801537233354';
    else if (label.includes('Ontora (WhatsApp)')) waPhone = '8801306842947';
    else return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const modal = document.querySelector('#checkoutModal.show') || document.getElementById('checkoutModal');
    const name = modal.querySelector('#custName')?.value.trim();
    const phone = modal.querySelector('#custPhone')?.value.trim();
    const address = modal.querySelector('#custAddress')?.value.trim();

    if (!name || !phone || !address) {
        alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন!');
        return;
    }

    const prod = modal.querySelector('#directOrderTitle')?.innerText.trim() || 'শপিং ব্যাগ আইটেম';
    const qty = modal.querySelector('#directQtyNum')?.innerText.trim() || '1';
    const tot = modal.querySelector('#finalPayable')?.innerText.trim() || '';
    const pay = modal.querySelector('#paymentMethod')?.value || 'Cash on Delivery';
    const note = modal.querySelector('#orderNote')?.value.trim() || 'নেই';

    const msg =
        '🦋 *নতুন অর্ডার - Luvella Avenue*\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '👤 *নাম:* ' + name + '\n' +
        '📞 *মোবাইল:* ' + phone + '\n' +
        '📍 *ঠিকানা:* ' + address + '\n' +
        '🛍️ *প্রোডাক্ট:* ' + prod + ' (' + qty + ' পিস)\n' +
        '💳 *পেমেন্ট:* ' + pay + '\n' +
        '📝 *নোট:* ' + note + '\n' +
        '━━━━━━━━━━━━━━━━━━\n' +
        '💰 *সর্বমোট বিল:* ' + tot;

    const finalWaUrl = 'https://whatsapp.com' + waPhone + '&text=' + encodeURIComponent(msg);
    window.location.href = finalWaUrl;
}, true);

// =======================================================
// 2. PRODUCT SHARE LINK COPY & AUTO OPEN
// =======================================================
document.addEventListener('click', function(e) {
    const shareBtn = e.target.closest('.share-link-btn');
    if (!shareBtn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const card = shareBtn.closest('.product-card');
    const title = card.querySelector('.product-title').innerText.trim();

    const urlObj = new URL(window.location.href);
    urlObj.hash = '';
    urlObj.searchParams.set('item', title);

    window.prompt('প্রোডাক্ট লিংক কপি করুন (Ctrl + C চাপুন):', urlObj.toString());
}, true);

window.addEventListener('load', function() {
    const urlObj = new URL(window.location.href);
    const targetItem = urlObj.searchParams.get('item');
    if (!targetItem) return;

    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            const t = card.querySelector('.product-title')?.innerText.trim();
            if (t && t.toLowerCase() === targetItem.trim().toLowerCase()) {
                card.parentElement.prepend(card);
                card.style.border = '2.5px solid #A8425B';
                const img = card.querySelector('img');
                if (img) img.click();
            }
        });
    }, 300);
});

const menuBtn = document.getElementById('menuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDrawer = document.getElementById('closeDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function toggleDrawer() {
    mobileDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('show');
}

menuBtn.addEventListener('click', toggleDrawer);
closeDrawer.addEventListener('click', toggleDrawer);
drawerOverlay.addEventListener('click', closeAllDrawers);

let products = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
let cart = [];
let wishlist = JSON.parse(localStorage.getItem('luvellaWishlist')) || [];
let directOrderItem = null;

const productGrid = document.getElementById('productGrid');
const productCountText = document.getElementById('productCountText');

function renderProducts(list, labelText = '') {
    productCountText.innerText = labelText ? `${list.length}টি প্রোডাক্ট (${labelText})` : `${list.length}টি প্রোডাক্ট`;
    if (list.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 30px; color: var(--text-muted); font-size: 13px;">এখনো কোনো প্রোডাক্ট পাওয়া যায়নি।</p>`;
        return;
    }

    productGrid.innerHTML = list.map(p => {
        const isWished = wishlist.some(w => w.id === p.id);
        return `
        <div class="product-card">
            <div class="product-img-wrap">
                <span class="discount-tag">${p.discount || 'নতুন'}</span>
                <button class="wish-heart-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(${p.id})" title="Wishlist">
                    ${isWished ? '❤️' : '🤍'}
                </button>
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="product-info">
                <span class="product-cat">${p.catName}</span>
                <h3 class="product-title">${p.title}</h3>
                <div class="price-row">
                    <span class="current-price">৳${p.price}</span>
                    ${p.oldPrice ? `<span class="old-price">৳${p.oldPrice}</span>` : ''}
                </div>
                <div class="card-btn-group">
                    <button class="btn-cart-sm" onclick="addProductToBag(${p.id})">Add to Cart</button>
                    <button class="btn-order-sm" onclick="orderNowDirect(${p.id})">Order Now</button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Wishlist Logic
function toggleWishlist(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    const index = wishlist.findIndex(w => w.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(item);
    }
    localStorage.setItem('luvellaWishlist', JSON.stringify(wishlist));
    updateWishUI();
    renderProducts(products);
}

function updateWishUI() {
    document.getElementById('wishCount').innerText = wishlist.length;
    document.getElementById('modalWishCount').innerText = wishlist.length;

    const wishContainer = document.getElementById('wishItemsContainer');
    if (wishlist.length === 0) {
        wishContainer.innerHTML = `<p style="text-align:center; padding:30px 10px; color:var(--text-muted); font-size:13px;">আপনার উইশলিস্টে কোনো প্রোডাক্ট নেই!</p>`;
    } else {
        wishContainer.innerHTML = wishlist.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <span>৳${item.price}</span>
                    <div style="margin-top:6px; display:flex; gap:6px;">
                        <button class="btn-order-sm" style="padding:5px 10px;" onclick="document.getElementById('wishModal').classList.remove('show'); orderNowDirect(${item.id})">Order Now</button>
                        <button class="btn-cart-sm" style="padding:5px 10px;" onclick="toggleWishlist(${item.id})">মুছুন</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

document.getElementById('wishBtn').addEventListener('click', () => {
    updateWishUI();
    document.getElementById('wishModal').classList.add('show');
});

document.getElementById('closeWish').addEventListener('click', () => {
    document.getElementById('wishModal').classList.remove('show');
});

// Live Search & Category Filter
document.querySelectorAll('.search-box input').forEach(input => {
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) return renderProducts(products);
        const matched = products.filter(p =>
            p.title.toLowerCase().includes(query) || p.catName.toLowerCase().includes(query)
        );
        renderProducts(matched, e.target.value);
    });
});

document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
        const catTitle = card.querySelector('span').innerText.trim().toLowerCase();
        const matched = products.filter(p =>
            p.catName.toLowerCase().includes(catTitle) || catTitle.includes(p.catName.toLowerCase())
        );
        renderProducts(matched, card.querySelector('span').innerText);
    });
});

document.querySelector('.view-all').addEventListener('click', () => renderProducts(products));

// Add to Cart Logic
function addProductToBag(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    openCartDrawer();
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cartCount').innerText = totalQty;
    document.getElementById('drawerCartCount').innerText = totalQty;
    document.getElementById('cartSubtotal').innerText = `৳${subtotal}`;

    const container = document.getElementById('cartItemsContainer');
    const footer = document.getElementById('cartFooter');

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:40px 10px; color:var(--text-muted); font-size:13px;">আপনার শপিং ব্যাগটি এখন খালি!</p>`;
        footer.style.display = 'none';
    } else {
        footer.style.display = 'block';
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <span>৳${item.price * item.qty}</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    updateFinalPayable();
}

const cartDrawer = document.getElementById('cartDrawer');
function openCartDrawer() {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
}

function closeAllDrawers() {
    mobileDrawer.classList.remove('open');
    cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
}

document.getElementById('cartBtn').addEventListener('click', openCartDrawer);
document.getElementById('mobileCartBtn').addEventListener('click', openCartDrawer);
document.getElementById('closeCart').addEventListener('click', closeAllDrawers);

// Direct Order Now & Cart Checkout Logic
const checkoutModal = document.getElementById('checkoutModal');
const deliveryArea = document.getElementById('deliveryArea');

function orderNowDirect(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;
    directOrderItem = { ...item, qty: 1 };
    checkoutModal.classList.add('show');
    updateFinalPayable();
}

document.getElementById('openCheckoutBtn').addEventListener('click', () => {
    directOrderItem = null;
    closeAllDrawers();
    checkoutModal.classList.add('show');
    updateFinalPayable();
});

document.getElementById('closeCheckout').addEventListener('click', () => {
    directOrderItem = null;
    checkoutModal.classList.remove('show');
});

deliveryArea.addEventListener('change', updateFinalPayable);

function updateFinalPayable() {
    const subtotal = directOrderItem
        ? directOrderItem.price
        : cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const shipping = subtotal >= 2000 ? 0 : parseInt(deliveryArea.value);
    document.getElementById('finalPayable').innerText = `৳${subtotal + shipping} ${shipping === 0 ? '(ফ্রি ডেলিভারি!)' : ''}`;
}

document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const orderedItems = directOrderItem ? [directOrderItem] : cart;

    const orderData = {
        id: Date.now(),
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        address: document.getElementById('custAddress').value,
        total: document.getElementById('finalPayable').innerText,
        items: orderedItems,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
    orders.unshift(orderData);
    localStorage.setItem('luvellaOrders', JSON.stringify(orders));

    checkoutModal.classList.remove('show');
    if (!directOrderItem) {
        cart = [];
        updateCartUI();
    }
    directOrderItem = null;
    document.getElementById('orderForm').reset();
    alert(`ধন্যবাদ ${orderData.name}! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে 🎉`);
});

renderProducts(products);
updateCartUI();
updateWishUI();
// =========================================
// BKASH / NAGAD PAYMENT BOX & DETAILS SAVE
// =========================================
const paymentMethodSelect = document.getElementById('paymentMethod');
const mobilePayBox = document.getElementById('mobilePayBox');
const senderNumberInput = document.getElementById('senderNumber');
const trxIdInput = document.getElementById('trxId');

if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener('change', function () {
        if (this.value === 'bKash' || this.value === 'Nagad') {
            mobilePayBox.style.display = 'block';
            senderNumberInput.required = true;
            trxIdInput.required = true;
        } else {
            mobilePayBox.style.display = 'none';
            senderNumberInput.required = false;
            trxIdInput.required = false;
        }
    });
}
// =========================================
// CHECKOUT QUANTITY (+ / -) CONTROL
// =========================================
const directQtyBox = document.getElementById('directQtyBox');
const directOrderTitle = document.getElementById('directOrderTitle');
const directOrderUnitPrice = document.getElementById('directOrderUnitPrice');
const directQtyNum = document.getElementById('directQtyNum');

// Order Now বাটনে চাপলে প্রোডাক্টের নাম ও সংখ্যা দেখাবে
const originalOrderNowDirect = orderNowDirect;
orderNowDirect = function(id) {
    originalOrderNowDirect(id);
    if (directOrderItem) {
        directQtyBox.style.display = 'flex';
        directOrderTitle.innerText = directOrderItem.title;
        directOrderUnitPrice.innerText = `৳${directOrderItem.price} / পিস`;
        directQtyNum.innerText = directOrderItem.qty;
    }
};

// শপিং ব্যাগ থেকে চেকআউট করলে এই বক্স লুকানো থাকবে (কারণ ব্যাগে আগেই সংখ্যা ঠিক করা হয়েছে)
document.getElementById('openCheckoutBtn').addEventListener('click', () => {
    directQtyBox.style.display = 'none';
});

document.getElementById('incDirectQty').addEventListener('click', () => {
    if (directOrderItem) {
        directOrderItem.qty++;
        directQtyNum.innerText = directOrderItem.qty;
        updateDirectPayable();
    }
});

document.getElementById('decDirectQty').addEventListener('click', () => {
    if (directOrderItem && directOrderItem.qty > 1) {
        directOrderItem.qty--;
        directQtyNum.innerText = directOrderItem.qty;
        updateDirectPayable();
    }
});

function updateDirectPayable() {
    const subtotal = directOrderItem.price * directOrderItem.qty;
    const shipping = subtotal >= 2000 ? 0 : parseInt(deliveryArea.value);
    document.getElementById('finalPayable').innerText = `৳${subtotal + shipping} ${shipping === 0 ? '(ফ্রি ডেলিভারি!)' : ''}`;
}
// =========================================
// PRODUCT CLICK QUICK-VIEW & IMAGE ZOOM
// =========================================
const productZoomModal = document.getElementById('productZoomModal');
const zoomModalBody = document.getElementById('zoomModalBody');

document.getElementById('closeZoomModal').addEventListener('click', () => {
    productZoomModal.classList.remove('show');
});

// প্রোডাক্টের ছবি বা নামের ওপর ক্লিক করলে বড় হয়ে খুলবে
productGrid.addEventListener('click', (e) => {
    if (e.target.closest('button')) return; // বাটনে ক্লিক করলে পপআপ খুলবে না

    const card = e.target.closest('.product-card');
    if (!card) return;

    const title = card.querySelector('.product-title').innerText.trim();
    const item = products.find(p => p.title.trim() === title);
    if (!item) return;

    zoomModalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; align-items: center;">
            <div id="zoomImgContainer" style="overflow: hidden; border-radius: 12px; border: 1px solid rgba(168,66,91,0.2); height: 290px; cursor: zoom-in; position: relative; background: #F9ECEF;">
                <img id="zoomableImg" src="${item.img}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s ease;">
                <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.65); color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 12px;">🔍 মাউস বা ক্লিক করে জুম করুন</span>
            </div>
            <div>
                <span style="font-size: 11px; color: #A8425B; font-weight: 700;">${item.catName}</span>
                <h2 style="font-size: 19px; margin: 6px 0 10px; color: #2D292A;">${item.title}</h2>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 22px; font-weight: 800; color: #A8425B;">৳${item.price}</span>
                    ${item.oldPrice ? `<span style="font-size: 14px; color: #777; text-decoration: line-through;">৳${item.oldPrice}</span>` : ''}
                </div>
                <p style="font-size: 13px; color: #665E60; margin-bottom: 16px; line-height: 1.5;">
                    ✓ ১০০% অরিজিনাল প্রিমিয়াম কোয়ালিটি<br>
                    ✓ সারা বাংলাদেশে ক্যাশ অন ডেলিভারি<br>
                    ✓ ৭ দিনের সহজ রিটার্ন সুবিধা
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button class="btn-cart-sm" style="padding: 10px; font-size: 13px;" onclick="productZoomModal.classList.remove('show'); addProductToBag(${item.id});">Add to Cart</button>
                    <button class="btn-order-sm" style="padding: 10px; font-size: 13px;" onclick="productZoomModal.classList.remove('show'); orderNowDirect(${item.id});">Order Now</button>
                </div>
            </div>
        </div>
    `;

    productZoomModal.classList.add('show');

    // মাউস নাড়ালে ও মোবাইলে ট্যাপ করলে ইমেজ জুম হওয়ার লজিক
    const container = document.getElementById('zoomImgContainer');
    const img = document.getElementById('zoomableImg');
    let isZoomed = false;

    container.addEventListener('mousemove', (ev) => {
        const rect = container.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = ((ev.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = 'scale(1.45)';
    });

    container.addEventListener('mouseleave', () => {
        if (!isZoomed) {
            img.style.transform = 'scale(1)';
        }
    });

    container.addEventListener('click', () => {
        isZoomed = !isZoomed;
        img.style.transform = isZoomed ? 'scale(1.45)' : 'scale(1)';
        container.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    });
});
// =========================================
// CUSTOMER CARE & TEAM HELP CENTER TOGGLE
// =========================================
const openHelpBtn = document.getElementById('openHelpBtn');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const helpPopup = document.getElementById('helpPopup');

if (openHelpBtn && helpPopup) {
    openHelpBtn.addEventListener('click', () => {
        helpPopup.classList.toggle('show');
    });
}

if (closeHelpBtn && helpPopup) {
    closeHelpBtn.addEventListener('click', () => {
        helpPopup.classList.remove('show');
    });
}
// =========================================
// SMART SEARCH BAR (AUTO SCROLL & FILTER)
// =========================================
document.querySelectorAll('.search-box').forEach(box => {
    const input = box.querySelector('input');
    const searchBtn = box.querySelector('button');

    function runSmartSearch(shouldScroll = false) {
        const query = input.value.trim().toLowerCase();
        const latestProducts = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
        const sectionHeading = document.querySelector('#products .section-header h2');

        if (!query) {
            if (sectionHeading) sectionHeading.innerText = 'আমাদের সেরা কালেকশন';
            renderProducts(latestProducts);
            return;
        }

        const matched = latestProducts.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.catName.toLowerCase().includes(query)
        );

        if (sectionHeading) {
            sectionHeading.innerText = `"${input.value.trim()}" কালেকশন`;
        }
        renderProducts(matched, input.value.trim());

        if (shouldScroll) {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // টাইপ করার সাথে সাথে লাইভ ফিল্টার হবে
    input.addEventListener('input', () => runSmartSearch(false));

    // কিবোর্ডে Enter চাপলে সরাসরি প্রোডাক্ট কালেকশনে স্ক্রল করে নিয়ে যাবে
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSmartSearch(true);
        }
    });

    // সার্চ আইকন বাটনে ক্লিক করলেও প্রোডাক্ট কালেকশনে নিয়ে যাবে
    if (searchBtn) {
        searchBtn.addEventListener('click', () => runSmartSearch(true));
    }
});
// =========================================
// TOP MENU BAR CATEGORY CLICK FILTER
// =========================================
document.querySelectorAll('.nav-list a, .drawer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const text = link.innerText.replace(/🔥|🏠|👜|✨|⌚|💎|🪴/g, '').trim();
        const latestProducts = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
        const sectionHeading = document.querySelector('#products .section-header h2');

        if (text === 'হোম') {
            if (sectionHeading) sectionHeading.innerText = 'আমাদের সেরা কালেকশন';
            renderProducts(latestProducts);
            return;
        }

        if (text === 'স্পেশাল অফার') {
            const offers = latestProducts.filter(p => p.oldPrice && p.oldPrice > p.price);
            if (sectionHeading) sectionHeading.innerText = '🔥 স্পেশাল অফার কালেকশন';
            renderProducts(offers, 'স্পেশাল অফার');
            return;
        }

        const matched = latestProducts.filter(p =>
            p.catName.toLowerCase().includes(text.toLowerCase()) ||
            text.toLowerCase().includes(p.catName.toLowerCase())
        );

        if (sectionHeading) sectionHeading.innerText = `${text} কালেকশন`;
        renderProducts(matched, text);
    });
});
// =========================================
// AUTO RATING, DISCOUNT % & CUSTOMER REVIEWS
// =========================================
const baseRenderProducts = renderProducts;
renderProducts = function(list, labelText = '') {
    productCountText.innerText = labelText ? `${list.length}টি প্রোডাক্ট (${labelText})` : `${list.length}টি প্রোডাক্ট`;
    if (list.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 30px; color: var(--text-muted); font-size: 13px;">এখনো কোনো প্রোডাক্ট পাওয়া যায়নি।</p>`;
        return;
    }

    const allReviews = JSON.parse(localStorage.getItem('luvellaReviews')) || {};

    productGrid.innerHTML = list.map(p => {
        const isWished = wishlist.some(w => w.id === p.id);
        const prodReviews = allReviews[p.id] || [];
        const reviewCount = prodReviews.length > 0 ? prodReviews.length : 12;

        // আগের দাম ও বর্তমান দাম থাকলে অটো ডিসকাউন্ট % হিসাব করবে
        let badgeText = p.discount || 'নতুন';
        if (p.oldPrice && p.oldPrice > p.price && !p.discount) {
            const percent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
            badgeText = `${percent}% ছাড়`;
        }

        return `
        <div class="product-card">
            <div class="product-img-wrap">
                <span class="discount-tag">${badgeText}</span>
                <button class="wish-heart-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(${p.id})" title="Wishlist">
                    ${isWished ? '❤️' : '🤍'}
                </button>
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="product-info">
                <span class="product-cat">${p.catName}</span>
                <h3 class="product-title">${p.title}</h3>
                <div class="card-rating">★★★★★ <span>(৪.৯ • ${reviewCount} রিভিউ)</span></div>
                <div class="price-row">
                    <span class="current-price">৳${p.price}</span>
                    ${p.oldPrice ? `<span class="old-price">৳${p.oldPrice}</span>` : ''}
                </div>
                <div class="card-btn-group">
                    <button class="btn-cart-sm" onclick="addProductToBag(${p.id})">Add to Cart</button>
                    <button class="btn-order-sm" onclick="orderNowDirect(${p.id})">Order Now</button>
                </div>
            </div>
        </div>
    `}).join('');
};

// প্রোডাক্ট জুম পপ-আপের নিচে কাস্টমার রিভিউ যুক্ত করা
productGrid.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const card = e.target.closest('.product-card');
    if (!card) return;

    const title = card.querySelector('.product-title').innerText.trim();
    const item = products.find(p => p.title.trim() === title);
    if (!item) return;

    setTimeout(() => {
        const zoomBody = document.getElementById('zoomModalBody');
        if (!zoomBody || document.getElementById('productReviewBox')) return;

        const reviewBox = document.createElement('div');
        reviewBox.id = 'productReviewBox';
        reviewBox.className = 'review-section-box';
        zoomBody.appendChild(reviewBox);
        loadProductReviews(item.id);
    }, 30);
});

function loadProductReviews(productId) {
    const box = document.getElementById('productReviewBox');
    if (!box) return;

    const allReviews = JSON.parse(localStorage.getItem('luvellaReviews')) || {};
    const list = allReviews[productId] || [
        { name: "তানজিলা আক্তার", text: "প্রোডাক্টের কোয়ালিটি একদম ছবির মতোই সুন্দর, ধন্যবাদ Luvella Avenue!" }
    ];

    box.innerHTML = `
        <h4 style="font-size: 13px; color: #8A2E44; margin-bottom: 8px;">💬 কাস্টমার রিভিউ (${list.length})</h4>
        <div style="max-height: 120px; overflow-y: auto;">
            ${list.map(r => `
                <div class="review-item">
                    <strong style="color:#2D292A;">${r.name}</strong> <span style="color:#F59E0B;">★★★★★</span>
                    <p style="color:#665E60; margin-top:2px;">${r.text}</p>
                </div>
            `).join('')}
        </div>
        <div class="review-form-row">
            <input type="text" id="revName" placeholder="আপনার নাম" style="max-width: 110px;">
            <input type="text" id="revText" placeholder="আপনার মতামত লিখুন...">
            <button type="button" class="btn-order-sm" style="padding: 7px 12px;" onclick="submitReview(${productId})">পোস্ট</button>
        </div>
    `;
}

function submitReview(productId) {
    const name = document.getElementById('revName').value.trim();
    const text = document.getElementById('revText').value.trim();
    if (!name || !text) {
        alert("অনুগ্রহ করে আপনার নাম ও মতামত লিখুন।");
        return;
    }

    const allReviews = JSON.parse(localStorage.getItem('luvellaReviews')) || {};
    if (!allReviews[productId]) {
        allReviews[productId] = [
            { name: "তানজিলা আক্তার", text: "প্রোডাক্টের কোয়ালিটি একদম ছবির মতোই সুন্দর, ধন্যবাদ Luvella Avenue!" }
        ];
    }
    allReviews[productId].unshift({ name, text });
    localStorage.setItem('luvellaReviews', JSON.stringify(allReviews));

    loadProductReviews(productId);
    renderProducts(products);
}

// পেজ লোড হওয়ার সাথে সাথে রেটিংসহ কার্ড আপডেট করবে
renderProducts(products);
// =========================================
// FIX ORDER NOW PRODUCT NAME & PRICE IN MODAL
// =========================================
window.orderNowDirect = function(id) {
    const latestProducts = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
    const item = latestProducts.find(p => p.id === id);
    if (!item) return;

    directOrderItem = { ...item, qty: 1 };

    const qtyBox = document.getElementById('directQtyBox');
    if (qtyBox) {
        qtyBox.style.display = 'flex';
        document.getElementById('directOrderTitle').innerText = item.title;
        document.getElementById('directOrderUnitPrice').innerText = `৳${item.price} / পিস`;
        document.getElementById('directQtyNum').innerText = '1';
    }

    checkoutModal.classList.add('show');
    updateFinalPayable();
};
// =========================================
// DIRECT CAPTURE PRODUCT NAME & PRICE ON CLICK
// =========================================
document.addEventListener('click', function(e) {
    const orderBtn = e.target.closest('.btn-order-sm');
    if (!orderBtn) return;

    const card = orderBtn.closest('.product-card');
    if (!card) return;

    const realTitle = card.querySelector('.product-title').innerText.trim();
    const realPriceText = card.querySelector('.current-price').innerText.replace('৳', '').trim();
    const realPrice = Number(realPriceText);

    directOrderItem = {
        id: Date.now(),
        title: realTitle,
        price: realPrice,
        qty: 1
    };

    const qtyBox = document.getElementById('directQtyBox');
    if (qtyBox) {
        qtyBox.style.display = 'flex';
        document.getElementById('directOrderTitle').innerText = realTitle;
        document.getElementById('directOrderUnitPrice').innerText = `৳${realPrice} / পিস`;
        document.getElementById('directQtyNum').innerText = '1';
    }

    const areaCharge = Number(document.getElementById('deliveryArea').value) || 60;
    const shipping = realPrice >= 2000 ? 0 : areaCharge;
    document.getElementById('finalPayable').innerText = `৳${realPrice + shipping} ${shipping === 0 ? '(ফ্রি ডেলিভারি!)' : ''}`;
}, true);
// =========================================
// DIRECT PRODUCT SHARE LINK & AUTO FOCUS (JS)
// =========================================
function initShareButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        if (card.querySelector('.share-link-btn')) return;

        const title = card.querySelector('.product-title')?.innerText.trim() || '';
        const shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.className = 'share-link-btn';
        shareBtn.title = 'প্রোডাক্ট লিংক শেয়ার করুন';
        shareBtn.innerHTML = '🔗';

        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const baseUrl = window.location.href.split('?')[0].split('#')[0];
            const shareUrl = baseUrl + '?item=' + encodeURIComponent(title);

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('✅ প্রোডাক্টের লিংক কপি হয়েছে!\nএখন ফেসবুক বা মেসেঞ্জারে পেস্ট করে দিন:\n\n' + shareUrl);
                }).catch(() => {
                    window.prompt('এই লিংকটি কপি করে শেয়ার করুন:', shareUrl);
                });
            } else {
                window.prompt('এই লিংকটি কপি করে শেয়ার করুন:', shareUrl);
            }
        });

        const imgWrap = card.querySelector('.product-img-wrap');
        if (imgWrap) imgWrap.appendChild(shareBtn);
    });
}

// প্রোডাক্ট কার্ড লোড হওয়ার সাথে সাথে বাটন বসানো
setInterval(initShareButtons, 500);

// কেউ শেয়ার করা লিংকে ঢুকলে সরাসরি ওই প্রোডাক্টটিই সবার আগে দেখাবে
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const targetItem = params.get('item');
    if (!targetItem) return;

    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            const cardTitle = card.querySelector('.product-title')?.innerText.trim();
            if (cardTitle && cardTitle.toLowerCase() === targetItem.toLowerCase()) {
                card.parentElement.prepend(card);
                card.style.border = '2px solid #A8425B';
                const img = card.querySelector('img');
                if (img) img.click();
            }
        });
    }, 300);
});
// =========================================
// 100% WORKING PRODUCT SHARE LINK (NO BRACKETS)
// =========================================
document.addEventListener('click', function(e) {
    const shareBtn = e.target.closest('.share-link-btn');
    if (!shareBtn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const card = shareBtn.closest('.product-card');
    const title = card.querySelector('.product-title').innerText.trim();

    const urlObj = new URL(window.location.href);
    urlObj.hash = '';
    urlObj.searchParams.set('item', title);
    const finalShareLink = urlObj.toString();

    window.prompt('প্রোডাক্টটির লিংক তৈরি হয়েছে! Ctrl+C চেপে কপি করুন:', finalShareLink);
}, true);
// =========================================
// OPEN SHARED PRODUCT LINK AUTOMATICALLY
// =========================================
(function() {
    const currentUrl = new URL(window.location.href);
    const sharedItemName = currentUrl.searchParams.get('item');

    if (sharedItemName) {
        setTimeout(() => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const titleEl = card.querySelector('.product-title');
                if (titleEl && titleEl.innerText.trim().toLowerCase() === sharedItemName.trim().toLowerCase()) {
                    card.parentElement.prepend(card);
                    card.style.border = '2.5px solid #A8425B';
                    const img = card.querySelector('img');
                    if (img) img.click();
                }
            });
        }, 350);
    }
})();
