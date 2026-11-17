// =======================================================
// LUVELLA AVENUE - GOOGLE FIREBASE CLOUD SYNC ENGINE
// =======================================================
(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCpkfvE3nPJ_DWkTojW0UAu_WzOTBNSoJU",
        authDomain: "://firebaseapp.com",
        projectId: "luvella-avenue",
        storageBucket: "luvella-avenue.firebasestorage.app",
        messagingSenderId: "203225717248",
        appId: "1:203225717248:web:a5e93ca688c5f629a8d6e5",
        measurementId: "G-LBV3FP82R4"
    };

    function loadScript(src, callback) {
        const s = document.createElement('script');
        s.src = src;
        s.onload = callback;
        document.head.appendChild(s);
    }

    loadScript("https://gstatic.com", function() {
        loadScript("https://gstatic.com", function() {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();

            // ১. মেইন ওয়েবসাইটে (index.html) অনলাইন ডাটাবেস থেকে সব প্রোডাক্ট লোড করা
            if (document.getElementById('productGrid')) {
                db.collection("products").orderBy("id", "desc").onSnapshot((snapshot) => {
                    const cloudProducts = [];
                    snapshot.forEach((doc) => cloudProducts.push({ docId: doc.id, ...doc.data() }));
                    
                    localStorage.setItem('luvellaProducts', JSON.stringify(cloudProducts));
                    if (typeof products !== 'undefined') products = cloudProducts;
                    if (typeof renderProducts === 'function') renderProducts(cloudProducts);
                });
            }

            // ২. অ্যাডমিন প্যানেলে (admin.html) প্রোডাক্ট ও অর্ডার সিঙ্ক করা
            if (document.getElementById('adminProductList')) {
                // নতুন প্রোডাক্ট যোগ করলে ক্লাউডে সেভ হবে
                const pForm = document.getElementById('productForm') || document.querySelector('form');
                if (pForm) {
                    pForm.addEventListener('submit', function() {
                        setTimeout(() => {
                            const localProds = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
                            if (localProds.length > 0) {
                                const latest = localProds[0];
                                db.collection("products").doc(String(latest.id)).set(latest);
                            }
                        }, 200);
                    });
                }

                // ক্লাউড থেকে প্রোডাক্ট লিস্ট ও ডিলিট সিঙ্ক
                db.collection("products").orderBy("id", "desc").onSnapshot((snap) => {
                    const list = [];
                    snap.forEach(d => list.push(d.data()));
                    localStorage.setItem('luvellaProducts', JSON.stringify(list));
                    if (typeof renderAdminList === 'function') renderAdminList();
                });

                // ক্লাউড থেকে কাস্টমারদের অর্ডার লিস্ট লোড
                db.collection("orders").orderBy("id", "desc").onSnapshot((snap) => {
                    const ordList = [];
                    snap.forEach(d => ordList.push(d.data()));
                    localStorage.setItem('luvellaOrders', JSON.stringify(ordList));
                    if (typeof renderOrdersList === 'function') renderOrdersList();
                });

                // অ্যাডমিন থেকে অর্ডারের স্ট্যাটাস বদলালে ক্লাউডে আপডেট হবে
                window.updateOrderStatus = function(idx, newStatus) {
                    let orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
                    if (orders[idx]) {
                        orders[idx].status = newStatus;
                        localStorage.setItem('luvellaOrders', JSON.stringify(orders));
                        db.collection("orders").doc(String(orders[idx].id)).set(orders[idx]);
                        alert('✅ অনলাইন স্ট্যাটাস আপডেট হয়েছে: ' + newStatus);
                    }
                };
            }

            // ৩. কাস্টমার অর্ডার করলে সরাসরি ক্লাউডে সেভ হবে (যাতে যেকোনো ফোন থেকে ট্র্যাক করা যায়)
            document.addEventListener('click', function(e) {
                const btn = e.target.closest('button, a');
                if (!btn) return;
                const txt = btn.innerText || '';
                if (!txt.includes('Sajib-কে অর্ডার') && !txt.includes('Mitu (WhatsApp)') && !txt.includes('Ontora (WhatsApp)')) return;

                setTimeout(() => {
                    const orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
                    if (orders.length > 0) {
                        db.collection("orders").doc(String(orders[0].id)).set(orders[0]);
                    }
                }, 300);
            }, true);
        });
    });
})();
