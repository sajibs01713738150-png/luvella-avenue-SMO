// =======================================================
// LUVELLA AVENUE - ULTRA FAST FIREBASE CLOUD SYNC
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

    // দুইটি স্ক্রিপ্ট একসাথে দ্রুত লোড করার জন্য
    const s1 = document.createElement('script');
    s1.src = "https://gstatic.com";
    s1.async = true;

    const s2 = document.createElement('script');
    s2.src = "https://gstatic.com";
    s2.async = true;

    s1.onload = function() {
        document.head.appendChild(s2);
    };

    s2.onload = function() {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // অফলাইন ক্যাশ চালু রাখা যাতে পরের বার ১ সেকেন্ডেরও কম সময়ে লোড হয়
        db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

        // ১. মেইন ওয়েবসাইটে (index.html) প্রোডাক্ট লোড
        if (document.getElementById('productGrid')) {
            db.collection("products").orderBy("id", "desc").onSnapshot((snapshot) => {
                const cloudProducts = [];
                snapshot.forEach((doc) => cloudProducts.push({ docId: doc.id, ...doc.data() }));
                localStorage.setItem('luvellaProducts', JSON.stringify(cloudProducts));
                if (typeof products !== 'undefined') products = cloudProducts;
                if (typeof renderProducts === 'function') renderProducts(cloudProducts);
            });
        }

        // ২. অ্যাডমিন প্যানেলে (admin.html) দ্রুত লোড ও সিঙ্ক
        if (document.getElementById('adminProductList')) {
            const pForm = document.getElementById('productForm') || document.querySelector('form');
            if (pForm) {
                pForm.addEventListener('submit', function() {
                    setTimeout(() => {
                        const localProds = JSON.parse(localStorage.getItem('luvellaProducts')) || [];
                        if (localProds.length > 0) {
                            const latest = localProds;
                            db.collection("products").doc(String(latest.id)).set(latest);
                        }
                    }, 150);
                });
            }

            db.collection("products").orderBy("id", "desc").onSnapshot((snap) => {
                const list = [];
                snap.forEach(d => list.push(d.data()));
                localStorage.setItem('luvellaProducts', JSON.stringify(list));
                if (typeof renderAdminList === 'function') renderAdminList();
            });

            db.collection("orders").orderBy("id", "desc").onSnapshot((snap) => {
                const ordList = [];
                snap.forEach(d => ordList.push(d.data()));
                localStorage.setItem('luvellaOrders', JSON.stringify(ordList));
                if (typeof renderOrdersList === 'function') renderOrdersList();
            });

            window.updateOrderStatus = function(idx, newStatus) {
                let orders = JSON.parse(localStorage.getItem('luvellaOrders')) || [];
                if (orders[idx]) {
                    orders[idx].status = newStatus;
                    localStorage.setItem('luvellaOrders', JSON.stringify(orders));
                    db.collection("orders").doc(String(orders[idx].id)).set(orders[idx]);
                    alert('✅ স্ট্যাটাস আপডেট হয়েছে: ' + newStatus);
                }
            };
        }
    };

    document.head.appendChild(s1);
})();
