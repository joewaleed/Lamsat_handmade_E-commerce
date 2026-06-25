  // ✅ تم تعديل الـ IDs عشان تكون فريدة ومتتعارضش مع الجولاري (1001 وطالع)
    const decorProducts = [
        { id: 1001, name: "Handcrafted Coffee Table", price: 4500, rating: 5.0, reviews: 15, category: "woodwork", emoji: "🪵", img: "https://i.postimg.cc/L4y2RdDY/Screenshot-2026-04-26-001810.png" },
        { id: 1002, name: "Wooden Wall Art Panel", price: 2100, rating: 4.9, reviews: 67, category: "woodwork", emoji: "🖼️", img: "https://i.postimg.cc/ncCZhdSW/Screenshot-2026-04-26-001711.png" },
        { id: 1003, name: "Olive Wood Cutting Board", price: 800, rating: 4.7, reviews: 89, category: "woodwork", emoji: "🔪", img: "https://i.postimg.cc/7Zzkg5kC/Screenshot-2026-04-26-001222.png" },
        { id: 1004, name: "Crystal Beaded Ceiling Light", price: 3200, rating: 4.9, reviews: 55, category: "chandeliers", emoji: "💎", img: "https://i.postimg.cc/GhdzHqhz/Screenshot-2026-04-28-201012.png" },
        { id: 1005, name: "Modern Gold Chandelier", price: 5500, rating: 5.0, reviews: 23, category: "chandeliers", emoji: "✨", img: "https://i.postimg.cc/CLcCd02p/Screenshot-2026-04-28-200941.png" },
        { id: 1006, name: "Moroccan Hanging Lantern", price: 1800, rating: 4.8, reviews: 41, category: "chandeliers", emoji: "🪔", img: "https://i.postimg.cc/0QsRjFWY/Screenshot-2026-04-28-200904.png" },
        { id: 1007, name: "Rustic Iron Candle Chandelier", price: 2800, rating: 4.7, reviews: 34, category: "chandeliers", emoji: "🕯️", img: "https://i.postimg.cc/cHX9WbVw/Screenshot-2026-04-28-200828.png" },
        { id: 1008, name: "Contemporary Ring Chandelier", price: 4100, rating: 4.9, reviews: 19, category: "chandeliers", emoji: "💡", img: "https://i.postimg.cc/3Nqt4Dr0/Screenshot-2026-04-28-200755.png" },
        { id: 1009, name: "Vintage Brass Chandelier", price: 3600, rating: 4.8, reviews: 62, category: "chandeliers", emoji: "🏮", img: "https://i.postimg.cc/cJdBJc7k/Screenshot-2026-04-28-200719.png" },
        { id: 1010, name: "Drum Shade Pendant Light", price: 1200, rating: 4.6, reviews: 88, category: "chandeliers", emoji: "🛋️", img: "https://i.postimg.cc/DfSHF2w4/Screenshot-2026-04-28-200651.png" },
        { id: 1011, name: "Classic Crystal Chandelier", price: 6800, rating: 5.0, reviews: 12, category: "chandeliers", emoji: "👑", img: "https://i.postimg.cc/nLLTkks7/Screenshot-2026-04-28-200528.png" },
        { id: 1012, name: "Boho Beaded Chandelier", price: 2400, rating: 4.7, reviews: 37, category: "chandeliers", emoji: "🌟", img: "https://i.postimg.cc/VkZXYcNH/Screenshot-2026-04-28-200424.png" },
        { id: 1013, name: "Decorative Vase Set", price: 950, rating: 4.9, reviews: 78, category: "accessories", emoji: "🏺", img: "https://i.postimg.cc/QthhNhv5/Screenshot-2026-04-26-002024.png" },
        { id: 1014, name: "Ceramic Table Bowl", price: 650, rating: 4.6, reviews: 45, category: "accessories", emoji: "🥣", img: "https://i.postimg.cc/Y9RkhTwd/Screenshot-2026-04-26-001949.png" },
        { id: 1015, name: "Silver Platter", price: 1500, rating: 4.8, reviews: 23, category: "accessories", emoji: "🍽️", img: "https://i.postimg.cc/Rh0mfGSN/Screenshot-2026-04-26-001850.png" }
    ];

    // ==================== STATE ====================
    let currentFilter = 'all';
    let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
    let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
    let isLogin = true;

    // ==================== SAVE FUNCTIONS ====================
    function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateCartBadge(); }
    function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateWishBadge(); renderWishlistItems(); }

    // ==================== RENDER PRODUCTS ====================
    function renderProducts(filter = currentFilter) {
        const filtered = filter === 'all' ? decorProducts : decorProducts.filter(p => p.category === filter);
        document.getElementById('productsGrid').innerHTML = filtered.map(p => {
            const cartItem = cart.find(i => i.name === p.name);
            const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
            const isLiked = wishlistIds.includes(p.id);
            const categoryLabel = p.category === 'woodwork' ? '🪵 WOODWORK' : (p.category === 'chandeliers' ? '💡 CHANDELIERS' : '🎁 ACCESSORIES');
            return `<div class="product-card" onclick="handleProductClick(${p.id})">
                <div class="product-card-img">
                    ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                    <span style="${p.img ? 'display:none;' : 'display:flex;'} font-size:6rem;">${p.emoji}</span>
                </div>
                <div class="product-card-body">
                    <p class="category-tag">${categoryLabel}</p>
                    <h3>${p.name}</h3>
                    <div class="stars-row">${'★'.repeat(Math.floor(p.rating))} ${p.rating} <span style="color:var(--text-light);">(${p.reviews})</span></div>
                    <div class="price-row">
                        <span class="price">EGP ${p.price.toLocaleString()}</span>
                        <div class="btn-row">
                            ${qtyInCart > 0 ? `<span style="background:var(--primary); color:white; padding:2px 8px; border-radius:20px; font-size:0.7rem;">${qtyInCart}</span>` : ''}
                            <button class="btn-heart ${isLiked ? 'liked' : ''}" onclick="toggleHeart(event, ${p.id})"><i class="${isLiked ? 'fas' : 'far'} fa-heart"></i></button>
                            <button class="btn-add" onclick="addToCart(event, ${p.id})">${qtyInCart > 0 ? '➕' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function toggleHeart(e, id) {
        e.stopPropagation();
        const idx = wishlistIds.indexOf(id);
        const product = decorProducts.find(p => p.id === id);
        if (idx > -1) {
            wishlistIds.splice(idx, 1);
            toast(`💔 "${product.name}" removed from wishlist`);
        } else {
            wishlistIds.push(id);
            toast(`❤️ "${product.name}" added to wishlist!`);
        }
        saveWishlist();
        renderProducts();
    }

    function handleProductClick(id) {
        const product = decorProducts.find(p => p.id === id);
        if (product) toast(`📄 "${product.name}" - More details coming soon!`);
    }

    function filterCategory(cat, el) {
        currentFilter = cat;
        document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active'));
        if (el) el.classList.add('active');
        renderProducts();
    }

    // ==================== CART FUNCTIONS ====================
    function addToCart(event, productId) {
        event.stopPropagation();
        const product = decorProducts.find(p => p.id === productId);
        if (!product) return;
        const existing = cart.find(i => i.name === product.name);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                image: product.img,
                quantity: 1
            });
        }
        saveCart();
        toast(`✅ ${product.name} added!`);
        renderProducts();
        
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('added');
        }, 500);
    }

    function updateCartBadge() {
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = total;
            badge.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    function goToCheckout() {
        localStorage.setItem('globalCart', JSON.stringify(cart));
        window.location.href = '../pages/checkout.html';
    }

    function openCartModal() { renderCartItems(); document.getElementById('cartOverlay').classList.add('active'); }
    function closeCartModal() { document.getElementById('cartOverlay').classList.remove('active'); }

    function renderCartItems() {
        const container = document.getElementById('cartItems');
        const totalRow = document.getElementById('cartTotalRow');
        const totalPriceSpan = document.getElementById('cartTotalPrice');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cart.length) {
            if (container) container.innerHTML = '<div style="text-align:center;padding:40px;">Your cart is empty</div>';
            if (totalRow) totalRow.style.display = 'none';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        container.innerHTML = cart.map((item, idx) => {
            const qty = item.quantity || 1;
            const imgSrc = item.image || '';
            const emojiChar = item.emoji || '🏺';
            return `
                <div class="cart-item">
                    <div class="cart-item-img">
                        ${imgSrc ? `<img src="${imgSrc}" onerror="this.style.display='none';this.parentElement.innerHTML='${emojiChar}';">` : `<span>${emojiChar}</span>`}
                    </div>
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <p>EGP ${item.price.toLocaleString()} × ${qty}</p>
                    </div>
                    <button onclick="removeFromCart(${idx})" style="background:none;border:none;cursor:pointer;color:#e74c3c;">🗑️</button>
                    <button onclick="updateCartQuantity(${idx}, ${qty + 1})" style="background:none;border:none;cursor:pointer;color:var(--primary);">➕</button>
                </div>
            `;
        }).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        totalPriceSpan.textContent = `EGP ${total.toLocaleString()}`;
        totalRow.style.display = 'flex';
        checkoutBtn.style.display = 'block';
    }

    function updateCartQuantity(idx, newQty) {
        if (newQty <= 0) {
            removeFromCart(idx);
        } else {
            cart[idx].quantity = newQty;
            saveCart();
            renderCartItems();
            renderProducts();
        }
    }

    function removeFromCart(idx) {
        cart.splice(idx, 1);
        saveCart();
        renderCartItems();
        renderProducts();
        toast('Item removed from cart');
    }

    // ==================== WISHLIST FUNCTIONS ====================
    function openWishlistModal() { renderWishlistItems(); document.getElementById('wishlistOverlay').classList.add('active'); }
    function closeWishlistModal() { document.getElementById('wishlistOverlay').classList.remove('active'); }

    function renderWishlistItems() {
        const container = document.getElementById('wishlistItems');
        if (!container) return;
        const wp = decorProducts.filter(p => wishlistIds.includes(p.id));
        if (wp.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px;">Wishlist is empty</div>';
            return;
        }
        container.innerHTML = wp.map(p => `
            <div class="wishlist-item">
                <div class="wishlist-item-img">
                    ${p.img ? `<img src="${p.img}" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji}';">` : `<span>${p.emoji}</span>`}
                </div>
                <div class="cart-item-info" style="flex:1;">
                    <strong>${p.name}</strong>
                    <p>EGP ${p.price.toLocaleString()}</p>
                </div>
                <button onclick="removeFromWishlistById(${p.id})" style="background:none;border:none;cursor:pointer;color:#e74c3c;">💔</button>
            </div>
        `).join('');
    }

    function removeFromWishlistById(id) {
        wishlistIds = wishlistIds.filter(pid => pid !== id);
        saveWishlist();
        renderWishlistItems();
        renderProducts();
        toast('Removed from wishlist');
    }

    function updateWishBadge() {
        const badge = document.getElementById('wishBadge');
        if (badge) {
            badge.textContent = wishlistIds.length;
            badge.style.display = wishlistIds.length > 0 ? 'flex' : 'none';
        }
        const wishIcon = document.getElementById('wishIcon');
        if (wishIcon && wishlistIds.length > 0) {
            wishIcon.className = 'fas fa-heart';
        } else if (wishIcon) {
            wishIcon.className = 'far fa-heart';
        }
    }

    // ==================== SEARCH FUNCTIONS ====================
    function openSearch() {
        document.getElementById('searchOverlay').classList.add('active');
        document.getElementById('searchInput').focus();
        document.getElementById('searchResults').innerHTML = '<p style="text-align:center;color:var(--text-muted);">Type to search...</p>';
    }
    function closeSearch() { document.getElementById('searchOverlay').classList.remove('active'); }
    function doSearch() {
        const q = document.getElementById('searchInput').value.toLowerCase().trim();
        const r = document.getElementById('searchResults');
        if (!q) { r.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Type to search...</p>'; return; }
        const found = decorProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        if (found.length === 0) { r.innerHTML = '<p style="text-align:center;">No results</p>'; return; }
        r.innerHTML = found.map(p => `<p style="padding:8px;cursor:pointer;border-radius:8px;margin:4px 0;background:var(--bg-cream);" onclick="closeSearch();addToCart(event, ${p.id})">🔍 ${p.name} - EGP ${p.price.toLocaleString()} <span style="color:var(--primary);">➕ Add</span></p>`).join('');
    }

    // ==================== AUTH FUNCTIONS ====================
    function openAuth() { document.getElementById('authOverlay').classList.add('active'); isLogin = true; updateAuthUI(); }
    function closeAuth() { document.getElementById('authOverlay').classList.remove('active'); }
    function toggleAuth() { isLogin = !isLogin; updateAuthUI(); }
    function updateAuthUI() {
        document.getElementById('authForm').reset();
        document.getElementById('authMessage').textContent = '';
        if (isLogin) {
            document.getElementById('authTitle').textContent = 'Welcome Back 👋';
            document.getElementById('authSubmit').textContent = 'Sign In';
            document.getElementById('nameGroup').style.display = 'none';
            document.getElementById('switchText').innerHTML = "Don't have an account? <a href='javascript:void(0)' onclick='toggleAuth()'>Create one</a>";
        } else {
            document.getElementById('authTitle').textContent = 'Create Account ✨';
            document.getElementById('authSubmit').textContent = 'Register';
            document.getElementById('nameGroup').style.display = 'block';
            document.getElementById('switchText').innerHTML = "Already have an account? <a href='javascript:void(0)' onclick='toggleAuth()'>Sign in</a>";
        }
    }
    function handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const name = document.getElementById('authName')?.value.trim();
        const msgDiv = document.getElementById('authMessage');
        if (!email.includes('@') || !email.includes('.')) { msgDiv.textContent = '❌ Valid email required!'; return false; }
        if (password.length < 4) { msgDiv.textContent = '❌ Password too short!'; return false; }
        if (!isLogin && !name) { msgDiv.textContent = '❌ Name required!'; return false; }
        let users = JSON.parse(localStorage.getItem('lamsat_users') || '[]');
        if (isLogin) {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) { localStorage.setItem('lamsat_current_user', JSON.stringify(user)); toast(`👋 Welcome back, ${user.name || email}!`); closeAuth(); }
            else { msgDiv.textContent = '❌ Wrong email or password!'; }
        } else {
            if (users.find(u => u.email === email)) { msgDiv.textContent = '❌ Email exists!'; return false; }
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('lamsat_users', JSON.stringify(users));
            localStorage.setItem('lamsat_current_user', JSON.stringify(newUser));
            toast(`🎉 Account created! Welcome, ${name || email}!`);
            closeAuth();
        }
        return false;
    }

    // ==================== TOAST ====================
    function toast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        container.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateX(100px)';
            setTimeout(() => t.remove(), 300);
        }, 2500);
    }

    // ==================== CLOSE MODALS ON OVERLAY CLICK ====================
    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }));

    // ==================== INITIALIZE ====================
    renderProducts();
    updateCartBadge();
    updateWishBadge();