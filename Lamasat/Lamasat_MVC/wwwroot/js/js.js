        // ==================== PRODUCTS DATA ====================
        const defaultProducts = [
            { id: 1, name: "Terracotta Vase", origin: "Upper Egypt", price: 450, originalPrice: 550, rating: 4.8, reviews: 120, onSale: true, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop", emoji: "🏺", category: "pottery" },
            { id: 2, name: "Lotus Earrings", origin: "Cairo", price: 1200, originalPrice: null, rating: 4.9, reviews: 85, onSale: false, image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop", emoji: "💎", category: "jewelry" },
            { id: 3, name: "Fayoum Portrait", origin: "Fayoum", price: 3500, originalPrice: null, rating: 5.0, reviews: 30, onSale: false, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop", emoji: "🖼️", category: "decor" },
            { id: 4, name: "Nubian Basket", origin: "Aswan", price: 600, originalPrice: null, rating: 4.7, reviews: 210, onSale: false, image: "https://i.postimg.cc/WpHwjcsg/Gemini-Generated-Image-8kyis68kyis68kyi.png", emoji: "🧺", category: "textiles" },
            { id: 5, name: "Brass Lantern", origin: "Old Cairo", price: 850, originalPrice: 1100, rating: 4.9, reviews: 64, onSale: true, image: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png", emoji: "🏮", category: "decor" },
            { id: 6, name: "Handwoven Rug", origin: "Siwa Oasis", price: 2800, originalPrice: null, rating: 4.6, reviews: 42, onSale: false, image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop", emoji: "🟫", category: "textiles" }
        ];

        let products = [];
        let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
        let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
        let isLogin = true;

        function loadProducts() {
            const stored = localStorage.getItem('lamsat_products');
            if (stored && JSON.parse(stored).length > 0) {
                products = JSON.parse(stored);
            } else {
                products = [...defaultProducts];
                localStorage.setItem('lamsat_products', JSON.stringify(products));
            }
            renderProducts();
        }

        function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateBadges(); }
        function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateBadges(); renderWishlistItems(); }

        function getStars(rating) {
            let full = Math.floor(rating);
            let half = rating % 1 >= 0.5 ? 1 : 0;
            let empty = 5 - full - half;
            return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
        }

        function renderProducts() {
            let grid = document.getElementById('productsGrid');
            if (!grid) return;
            grid.innerHTML = products.map(p => {
                const cartItem = cart.find(i => i.name === p.name);
                const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
                const isLiked = wishlistIds.includes(p.id);
                return `
                <div class="product-card" onclick="handleProductClick(${p.id})">
                    <div class="product-image">
                        <img src="${p.image}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <span class="product-emoji" style="display:none;">${p.emoji || '🏺'}</span>
                        ${p.onSale ? '<span class="sale-badge-tag">Sale</span>' : ''}
                        <button class="wishlist-btn ${isLiked ? 'liked' : ''}" onclick="toggleWishlist(event, ${p.id})"><i class="${isLiked ? 'fas' : 'far'} fa-heart"></i></button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-origin">📍 ${p.origin || 'Egypt'}</p>
                        <div class="price-row">
                            <span class="current-price">EGP ${p.price.toLocaleString()}</span>
                            ${p.originalPrice ? `<span class="original-price">EGP ${p.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        <div class="rating"><span class="stars">${getStars(p.rating)}</span><span>${p.rating}</span><span class="review-count">(${p.reviews})</span></div>
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">
                            ${qtyInCart > 0 ? `<span style="background:var(--primary); color:white; padding:2px 8px; border-radius:20px; font-size:0.7rem;">${qtyInCart}</span>` : ''}
                            <button class="add-to-cart-btn" onclick="addToCart(event, ${p.id})">${qtyInCart > 0 ? '➕ Add More' : 'Add to Cart'}</button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        function handleProductClick(id) {
            const product = products.find(p => p.id === id);
            if (product && (product.id === 5 || product.name.includes("Lantern"))) {
                window.location.href = '../pages/product.html';
            } else if (product && product.name.includes("Earrings")) {
                window.location.href = '../pages/jewelry.html';
            } else if (product && product.name.includes("Vase")) {
                window.location.href = '../pages/shop.html';
            } else {
                toast(`📄 "${product?.name}" - More details coming soon!`);
            }
        }

        function toggleWishlist(e, id) {
            e.stopPropagation();
            const idx = wishlistIds.indexOf(id);
            const product = products.find(p => p.id === id);
            if (idx > -1) {
                wishlistIds.splice(idx, 1);
                toast(`💔 "${product.name}" removed from wishlist`);
            } else {
                wishlistIds.push(id);
                toast(`❤️ "${product.name}" added to wishlist!`);
            }
            saveWishlist();
            renderProducts();
            updateWishIcon();
        }

        function addToCart(e, id) {
            e.stopPropagation();
            const product = products.find(p => p.id === id);
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
                    image: product.image,
                    quantity: 1
                });
            }
            saveCart();
            toast(`✅ ${product.name} added to cart!`);
            renderProducts();
            
            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = '✓';
            btn.classList.add('added');
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('added');
            }, 500);
        }

        function updateBadges() {
            const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const cartBadge = document.getElementById('cartBadge');
            if (cartBadge) { cartBadge.textContent = total; cartBadge.style.display = total > 0 ? 'flex' : 'none'; }
            const wishBadge = document.getElementById('wishlistBadge');
            if (wishBadge) { wishBadge.textContent = wishlistIds.length; wishBadge.style.display = wishlistIds.length > 0 ? 'flex' : 'none'; }
        }

        function updateWishIcon() {
            const wishIcon = document.getElementById('wishIcon');
            if (wishIcon && wishlistIds.length > 0) {
                wishIcon.className = 'fas fa-heart';
            } else if (wishIcon) {
                wishIcon.className = 'far fa-heart';
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
            const wp = products.filter(p => wishlistIds.includes(p.id));
            if (wp.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:40px;">Wishlist is empty</div>';
                return;
            }
            container.innerHTML = wp.map(p => `
                <div class="cart-item">
                    <div class="cart-item-img">
                        ${p.image ? `<img src="${p.image}" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji}';">` : `<span>${p.emoji}</span>`}
                    </div>
                    <div style="flex:1;">
                        <strong>${p.name}</strong><br>
                        EGP ${p.price.toLocaleString()}
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
            updateWishIcon();
            toast('Removed from wishlist');
        }

        // ==================== SEARCH FUNCTION - ممتازة ====================
        function openSearch() { 
            document.getElementById('searchOverlay').classList.add('active'); 
            document.getElementById('searchInput').focus(); 
        }
        function closeSearch() { document.getElementById('searchOverlay').classList.remove('active'); }
        
        function performSearch() { 
            let query = document.getElementById('searchInput').value.toLowerCase().trim(); 
            let resultsDiv = document.getElementById('searchResults'); 
            if(!query) { 
                resultsDiv.innerHTML = `<div class="no-results">
                    <i class="fas fa-search" style="font-size: 2rem; opacity: 0.5; display: block; margin-bottom: 10px;"></i>
                    <p>Start typing to find authentic Egyptian crafts...</p>
                </div>`; 
                return; 
            }
            let found = products.filter(p => p.name.toLowerCase().includes(query) || (p.origin && p.origin.toLowerCase().includes(query))); 
            if(found.length === 0) {
                resultsDiv.innerHTML = `<div class="no-results"><i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>No products found for "${query}"</div>`;
                return;
            }
            resultsDiv.innerHTML = found.map(p => `
                <div class="search-item" onclick="selectProduct(${p.id})">
                    <div class="search-item-img">
                        ${p.image ? `<img src="${p.image}" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji || '🏺'}';">` : `<span>${p.emoji || '🏺'}</span>`}
                    </div>
                    <div class="search-item-info">
                        <h4>${p.name}</h4>
                        <p>📍 ${p.origin || 'Egypt'} • ${p.category || 'Craft'}</p>
                    </div>
                    <div class="search-item-price">EGP ${p.price.toLocaleString()}</div>
                </div>
            `).join(''); 
        }

        function selectProduct(id) {
            closeSearch();
            const product = products.find(p => p.id === id);
            if (product && (product.id === 5 || product.name.includes("Lantern"))) {
                window.location.href = '../pages/product.html';
            } else if (product && product.name.includes("Earrings")) {
                window.location.href = '../pages/jewelry.html';
            } else if (product && product.name.includes("Vase")) {
                window.location.href = '../pages/shop.html';
            } else {
                toast(`📄 "${product?.name}" - More details coming soon!`);
            }
        }

        // ==================== AUTH ====================
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
        document.getElementById('hamburger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('active'));

        loadProducts();
        updateBadges();
        updateWishIcon();