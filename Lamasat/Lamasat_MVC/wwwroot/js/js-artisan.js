
  const artisanProducts = [
        { id: 101, name: "Hand-Hammered Copper Lantern", price: 2900, tag: "Ships in 2 days", emoji: "🏮", img: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png" },
        { id: 102, name: "Ancient Egyptian Earrings", price: 1780, tag: "Limited Edition", emoji: "💎", img: "https://i.postimg.cc/nVgfRtHd/Screenshot-2026-04-23-233713.png" },
        { id: 103, name: "Carved Copper Coffee Set", price: 4200, tag: "Bestseller", emoji: "☕", img: "https://i.postimg.cc/Dyh3kPXQ/Screenshot-2026-04-23-233927.png" },
        { id: 104, name: "Small Copper Trinket Box", price: 900, tag: "Gift wrapped", emoji: "🎁", img: "https://i.postimg.cc/tgKmd9dk/Screenshot-2026-04-23-234226.png" }
    ];

    // ✅ استخدام globalCart نفس باقي الصفحات
    let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
    let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
    let isLogin = true;
    let currentTab = 'products';

    function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateCartBadge(); }
    function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateWishBadge(); renderWishlistItems(); }

    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        grid.innerHTML = artisanProducts.map(p => {
            const cartItem = cart.find(i => i.name === p.name);
            const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
            const isLiked = wishlistIds.includes(p.id);
            return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-card-img">
                    ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.textContent='${p.emoji}';">` : `<span style="font-size:5rem;">${p.emoji}</span>`}
                </div>
                <div class="product-card-body">
                    <h3>${p.name}</h3>
                    <p class="tag">${p.tag}</p>
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
        const product = artisanProducts.find(p => p.id === id);
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

    function addToCart(event, productId) {
        event.stopPropagation();
        const product = artisanProducts.find(p => p.id === productId);
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
        toast(`✅ ${product.name} added to cart!`);
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

    function switchTab(tab) {
        currentTab = tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('productsTab').style.display = tab === 'products' ? 'block' : 'none';
        document.getElementById('reviewsTab').style.display = tab === 'reviews' ? 'block' : 'none';
        document.getElementById('aboutTab').style.display = tab === 'about' ? 'block' : 'none';
    }

    function updateCartBadge() {
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.getElementById('cartBadge');
        if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
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

    function openWishlistModal() { renderWishlistItems(); document.getElementById('wishlistOverlay').classList.add('active'); }
    function closeWishlistModal() { document.getElementById('wishlistOverlay').classList.remove('active'); }

    function renderWishlistItems() {
        const container = document.getElementById('wishlistItems');
        if (!container) return;
        const wp = artisanProducts.filter(p => wishlistIds.includes(p.id));
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
        if (badge) { badge.textContent = wishlistIds.length; badge.style.display = wishlistIds.length > 0 ? 'flex' : 'none'; }
        const wishIcon = document.getElementById('wishIcon');
        if (wishIcon && wishlistIds.length > 0) { wishIcon.className = 'fas fa-heart'; }
        else if (wishIcon) { wishIcon.className = 'far fa-heart'; }
    }

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
        const found = artisanProducts.filter(p => p.name.toLowerCase().includes(q));
        if (found.length === 0) { r.innerHTML = '<p style="text-align:center;">No results found</p>'; return; }
        r.innerHTML = found.map(p => `
            <p style="padding:10px;cursor:pointer;border-radius:8px;margin:4px 0;background:var(--bg-cream);" 
               onclick="closeSearch();scrollToProduct(${p.id})">
                🔍 ${p.name} - EGP ${p.price.toLocaleString()}
            </p>
        `).join('');
    }

    function scrollToProduct(productId) {
        const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (productCard) {
            if (currentTab !== 'products') {
                document.querySelector('.tab[onclick*="products"]').click();
            }
            setTimeout(() => {
                productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                productCard.style.border = '2px solid var(--primary)';
                setTimeout(() => { productCard.style.border = ''; }, 2000);
            }, 100);
        } else {
            toast(`🔍 Product found - Switch to Products tab`);
        }
    }

    function openAuthModal() { document.getElementById('authOverlay').classList.add('active'); isLogin = true; updateAuthUI(); }
    function closeAuthModal() { document.getElementById('authOverlay').classList.remove('active'); }
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
        msgDiv.textContent = '';
        if (!email.includes('@') || !email.includes('.')) { msgDiv.textContent = '❌ Valid email required!'; return false; }
        if (password.length < 4) { msgDiv.textContent = '❌ Password too short!'; return false; }
        if (!isLogin && !name) { msgDiv.textContent = '❌ Name required!'; return false; }
        let users = JSON.parse(localStorage.getItem('lamsat_users') || '[]');
        if (isLogin) {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) { localStorage.setItem('lamsat_current_user', JSON.stringify(user)); toast(`👋 Welcome back, ${user.name || email}!`); closeAuthModal(); }
            else { msgDiv.textContent = '❌ Wrong email or password!'; }
        } else {
            if (users.find(u => u.email === email)) { msgDiv.textContent = '❌ Email already exists!'; return false; }
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('lamsat_users', JSON.stringify(users));
            localStorage.setItem('lamsat_current_user', JSON.stringify(newUser));
            toast(`🎉 Account created! Welcome, ${name || email}!`);
            closeAuthModal();
        }
        return false;
    }

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

    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }));
    
    // Initialize
    renderProducts();
    updateCartBadge();
    updateWishBadge();
    
    // Set initial tab display
    document.getElementById('productsTab').style.display = 'block';
    document.getElementById('reviewsTab').style.display = 'none';
    document.getElementById('aboutTab').style.display = 'none';