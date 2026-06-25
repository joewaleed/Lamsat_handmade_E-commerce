  // Product data
    const product = {
        id: 1001,
        name: "Hand-Hammered Copper Lantern",
        price: 2900,
        emoji: "🏮",
        img: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png"
    };
    
    let currentQty = 1;
    let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
    let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
    let isLogin = true;
    let rating = 0;

    function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateCartBadge(); }
    function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateWishBadge(); renderWishlistItems(); }

    function changeQty(d) { currentQty = Math.max(1, currentQty + d); document.getElementById('qty').value = currentQty; }
    
    function setMain(src, el) { 
        document.getElementById('mainImg').src = src; 
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active')); 
        if(el) el.classList.add('active'); 
    }

    // ✅ ADD TO CART (يزيد الكمية)
    function addToCart() {
        const existing = cart.find(i => i.name === product.name);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + currentQty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                emoji: product.emoji,
                image: product.img,
                quantity: currentQty
            });
        }
        saveCart();
        toast(`✅ ${currentQty}x ${product.name} added to cart!`);
        
        const btn = document.getElementById('addBtn');
        btn.classList.add('added');
        btn.innerHTML = '✓ Added';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
        }, 2000);
        currentQty = 1;
        document.getElementById('qty').value = 1;
    }

    function buyNow() {
        addToCart();
        goToCheckout();
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
                    <div style="flex:1;">
                        <strong>${item.name}</strong><br>
                        EGP ${item.price.toLocaleString()} × ${qty}
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
        }
    }

    function removeFromCart(idx) {
        cart.splice(idx, 1);
        saveCart();
        renderCartItems();
        toast('Item removed from cart');
    }

    // ✅ WISHLIST
    function openWishlistModal() { renderWishlistItems(); document.getElementById('wishlistOverlay').classList.add('active'); }
    function closeWishlistModal() { document.getElementById('wishlistOverlay').classList.remove('active'); }

    function renderWishlistItems() {
        const container = document.getElementById('wishlistItems');
        if (!container) return;
        if (wishlistIds.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px;">Wishlist is empty</div>';
            return;
        }
        container.innerHTML = wishlistIds.map(id => {
            if (id === product.id) {
                return `
                    <div class="wishlist-item">
                        <div class="wishlist-item-img">
                            <img src="${product.img}" onerror="this.style.display='none';this.parentElement.innerHTML='${product.emoji}';">
                        </div>
                        <div style="flex:1;">
                            <strong>${product.name}</strong><br>
                            EGP ${product.price.toLocaleString()}
                        </div>
                        <button onclick="removeFromWishlistById(${product.id})">💔</button>
                    </div>
                `;
            }
            return '';
        }).join('');
    }

    function toggleWishlist() {
        const idx = wishlistIds.indexOf(product.id);
        if (idx > -1) {
            wishlistIds.splice(idx, 1);
            toast(`💔 "${product.name}" removed from wishlist`);
        } else {
            wishlistIds.push(product.id);
            toast(`❤️ "${product.name}" added to wishlist!`);
        }
        saveWishlist();
        renderWishlistItems();
        updateWishIcon();
    }

    function removeFromWishlistById(id) {
        wishlistIds = wishlistIds.filter(pid => pid !== id);
        saveWishlist();
        renderWishlistItems();
        updateWishIcon();
        toast('Removed from wishlist');
    }

    function updateWishBadge() {
        const badge = document.getElementById('wishBadge');
        if (badge) { badge.textContent = wishlistIds.length; badge.style.display = wishlistIds.length > 0 ? 'flex' : 'none'; }
    }

    function updateWishIcon() {
        const wishIcon = document.getElementById('wishIcon');
        if (wishIcon) {
            if (wishlistIds.includes(product.id)) {
                wishIcon.className = 'fas fa-heart';
            } else {
                wishIcon.className = 'far fa-heart';
            }
        }
    }

    // ✅ SEARCH
    function openSearch() { document.getElementById('searchOverlay').classList.add('active'); document.getElementById('searchInput').focus(); document.getElementById('searchResults').innerHTML = ''; }
    function closeSearch() { document.getElementById('searchOverlay').classList.remove('active'); }
    function doSearch() {
        let q = document.getElementById('searchInput').value.toLowerCase().trim();
        let res = document.getElementById('searchResults');
        if (!q) { res.innerHTML = ''; return; }
        let items = [
            { name: 'Copper Lantern', page: 'product.html' },
            { name: 'Handwoven Wool Rug', page: 'textiles.html' },
            { name: 'Lotus Drop Earrings', page: 'jewelry.html' },
            { name: 'Terracotta Vase', page: 'shop.html' },
            { name: 'Gold Cartouche Pendant', page: 'jewelry.html' },
            { name: 'Modern Gold Chandelier', page: 'homedecor.html' }
        ];
        let filtered = items.filter(i => i.name.toLowerCase().includes(q));
        if (filtered.length === 0) { res.innerHTML = '<p style="text-align:center;">No results found</p>'; return; }
        res.innerHTML = filtered.map(i => `<div class="search-item" onclick="closeSearch(); window.location.href='${i.page}'">🔍 ${i.name}</div>`).join('');
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.getElementById('searchOverlay')?.classList.contains('active')) {
            let q = document.getElementById('searchInput').value.toLowerCase().trim();
            if (q) {
                let items = [{ name: 'Copper Lantern', page: 'product.html' }, { name: 'Handwoven Wool Rug', page: 'textiles.html' }, { name: 'Lotus Drop Earrings', page: 'jewelry.html' }, { name: 'Terracotta Vase', page: 'shop.html' }];
                let found = items.filter(i => i.name.toLowerCase().includes(q));
                if (found.length > 0) { closeSearch(); window.location.href = found[0].page; }
            }
        }
    });

    // ✅ REVIEW
    function openReview() { document.getElementById('reviewOverlay').classList.add('active'); }
    function closeReview() { document.getElementById('reviewOverlay').classList.remove('active'); }
    function pickStar(n) { rating = n; document.getElementById('rvStars').value = n; document.querySelectorAll('#starPick span').forEach((s, i) => { s.textContent = i < n ? '★' : '☆'; s.className = i < n ? 'on' : ''; }); }
    function submitReview(e) { e.preventDefault(); let name = document.getElementById('rvName').value, title = document.getElementById('rvTitle').value, body = document.getElementById('rvBody').value; if (!rating) { toast('⚠️ Pick a star rating!'); return; } let circle = document.createElement('div'); circle.className = 'review-circle'; circle.innerHTML = `<div class="review-circle-avatar">${name[0].toUpperCase()}</div><div class="stars">${'★'.repeat(rating)}</div><p class="title">"${title}"</p><p class="body">${body}</p><p class="author">— ${name}</p>`; document.querySelector('.reviews-circles').appendChild(circle); toast('✅ Review posted!'); closeReview(); document.getElementById('reviewForm').reset(); rating = 0; document.querySelectorAll('#starPick span').forEach(s => { s.textContent = '☆'; s.className = ''; }); }

    // ✅ AUTH
    function openAuth() { document.getElementById('authOverlay').classList.add('active'); resetAuthForm(); }
    function closeAuth() { document.getElementById('authOverlay').classList.remove('active'); }
    function toggleAuth() { isLogin = !isLogin; resetAuthForm(); }
    function resetAuthForm() { 
        let title = document.getElementById('authTitle');
        if(title) title.textContent = isLogin ? 'Welcome Back 👋' : 'Create Account ✨';
        let submitBtn = document.getElementById('authSubmit');
        if(submitBtn) submitBtn.textContent = isLogin ? 'Sign In' : 'Register';
        let nameGroup = document.getElementById('nameGroup');
        if(nameGroup) nameGroup.style.display = isLogin ? 'none' : 'block';
        let switchText = document.getElementById('switchText');
        if(switchText) switchText.innerHTML = isLogin ? "Don't have an account? <a onclick='toggleAuth()'>Create one</a>" : "Already have an account? <a onclick='toggleAuth()'>Sign in</a>";
        let msg = document.getElementById('authMessage');
        if(msg) msg.textContent = '';
        let email = document.getElementById('authEmail');
        let password = document.getElementById('authPassword');
        let name = document.getElementById('authName');
        if(email) email.value = '';
        if(password) password.value = '';
        if(name) name.value = '';
    }
    function handleAuth(e) { 
        e.preventDefault(); 
        let email = document.getElementById('authEmail')?.value.trim(); 
        let password = document.getElementById('authPassword')?.value.trim(); 
        let name = document.getElementById('authName')?.value.trim(); 
        let msg = document.getElementById('authMessage'); 
        if (!email?.includes('@') || !email?.includes('.')) { if(msg) msg.textContent = '❌ Valid email required!'; return false; } 
        if (!password || password.length < 4) { if(msg) msg.textContent = '❌ Password too short!'; return false; } 
        if (!isLogin && !name) { if(msg) msg.textContent = '❌ Name required!'; return false; } 
        let users = JSON.parse(localStorage.getItem('lamsat_users') || '[]'); 
        if (isLogin) { 
            let user = users.find(u => u.email === email && u.password === password); 
            if (user) { 
                localStorage.setItem('lamsat_current_user', JSON.stringify(user)); 
                toast(`👋 Welcome back, ${user.name || email}!`); 
                closeAuth(); 
            } else { 
                if(msg) msg.textContent = '❌ Wrong email or password!'; 
            } 
        } else { 
            if (users.find(u => u.email === email)) { 
                if(msg) msg.textContent = '❌ Email already exists!'; 
                return false; 
            } 
            let newUser = { name, email, password }; 
            users.push(newUser); 
            localStorage.setItem('lamsat_users', JSON.stringify(users)); 
            localStorage.setItem('lamsat_current_user', JSON.stringify(newUser)); 
            toast(`🎉 Account created! Welcome, ${name || email}!`); 
            closeAuth(); 
        } 
        return false; 
    }

    function toast(msg) { 
        let c = document.getElementById('toastContainer'); 
        if(!c) return;
        let t = document.createElement('div'); 
        t.className = 'toast'; 
        t.textContent = msg; 
        c.appendChild(t); 
        setTimeout(() => { 
            t.style.opacity = '0'; 
            t.style.transform = 'translateX(80px)'; 
            t.style.transition = '0.3s'; 
            setTimeout(() => t.remove(), 300); 
        }, 2500); 
    }

    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }));
    
    // Initialize
    updateCartBadge();
    updateWishBadge();
    updateWishIcon();
    renderWishlistItems();