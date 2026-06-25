   const jewelryProducts = [
        { id: 1, name: "Ancient Egyptian Earrings", price: 1780, rating: 4.8, reviews: 32, category: "earrings", emoji: "💎", img: "https://i.postimg.cc/nVgfRtHd/Screenshot-2026-04-23-233713.png" },
        { id: 2, name: "Lotus Drop Earrings", price: 1200, rating: 4.9, reviews: 85, category: "earrings", emoji: "💎", img: "https://i.postimg.cc/28x3QjWw/download.jpg" },
        { id: 3, name: "Gold Cartouche Pendant", price: 2400, rating: 5.0, reviews: 32, category: "pendants", emoji: "🏅", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMSZYEn48Sc9_Uz68gasssSSPJLnx0XeCrqw&s" },
        { id: 4, name: "Turquoise Ankh Necklace", price: 3200, rating: 4.8, reviews: 56, category: "necklaces", emoji: "📿", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAxUo-5Cc25pjEO5_euxW_XeY7UNmgy4ajRw&s" },
        { id: 5, name: "Ancient Scarab Ring", price: 1800, rating: 4.7, reviews: 41, category: "earrings", emoji: "💍", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfb5uDXsCFE_Ne5tkL-Sg1Izr2M92xjzEmLw&s" },
        { id: 6, name: "Horus Eye Bracelet", price: 1500, rating: 4.9, reviews: 28, category: "bracelets", emoji: "⭕", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1VXdsoISKGyiDWQa810AYbYYIK8j2xT8kFQ&s" },
        { id: 7, name: "Nefertiti Pendant", price: 3500, rating: 5.0, reviews: 14, category: "pendants", emoji: "👑", img: "https://i.postimg.cc/CxP2fDLX/download-(2).jpg" },
        { id: 8, name: "Blue Lotus Choker", price: 2100, rating: 4.6, reviews: 37, category: "necklaces", emoji: "🔷", img: "https://i.postimg.cc/7ZWBLkK6/download-(3).jpg" },
        { id: 9, name: "Silver Pharaoh Cuff", price: 2800, rating: 4.8, reviews: 19, category: "bracelets", emoji: "🪬", img: "https://i.postimg.cc/9M3JGB3b/download-(4).jpg" },
        { id: 10, name: "Emerald Necklace Set", price: 4500, rating: 4.9, reviews: 22, category: "necklaces", emoji: "💚", img: "https://i.postimg.cc/zDF0gWxk/download-(5).jpg" }
    ];

    let currentFilter = 'all';
    let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
    let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
    let isLogin = true;

    function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateCartBadge(); }
    function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateWishBadge(); renderWishlistItems(); }

    function renderProducts(filter = currentFilter) {
        const filtered = filter === 'all' ? jewelryProducts : jewelryProducts.filter(p => p.category === filter);
        document.getElementById('productsGrid').innerHTML = filtered.map(p => {
            const cartItem = cart.find(i => i.name === p.name);
            const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
            const isLiked = wishlistIds.includes(p.id);
            return `
            <div class="product-card" data-id="${p.id}" onclick="handleProductClick(${p.id})">
                <div class="product-card-img">
                    ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                    <span style="${p.img ? 'display:none;' : 'display:flex;'} font-size:6rem;">${p.emoji}</span>
                </div>
                <div class="product-card-body">
                    <p class="category-tag">${p.category}</p>
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

    function handleProductClick(id) {
        const product = jewelryProducts.find(p => p.id === id);
        if (product) toast(`📄 "${product.name}" - More details coming soon!`);
    }

    function toggleHeart(e, id) {
        e.stopPropagation();
        const idx = wishlistIds.indexOf(id);
        const product = jewelryProducts.find(p => p.id === id);
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

    function filterCategory(category, el) {
        currentFilter = category;
        document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active'));
        if (el) el.classList.add('active');
        renderProducts();
    }

    function addToCart(event, productId) {
        event.stopPropagation();
        const product = jewelryProducts.find(p => p.id === productId);
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
        const wp = jewelryProducts.filter(p => wishlistIds.includes(p.id));
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
        const found = jewelryProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
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
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.style.border = '2px solid var(--primary)';
            setTimeout(() => { productCard.style.border = ''; }, 2000);
        } else {
            toast(`🔍 Product found - Navigate to the section`);
        }
    }

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
            t.style.transform = 'translateX(100px)'; 
            setTimeout(() => t.remove(), 300); 
        }, 2500); 
    }

    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }));
    renderProducts(); 
    updateCartBadge();
    updateWishBadge();