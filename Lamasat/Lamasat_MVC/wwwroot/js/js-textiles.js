     // ==================== PRODUCTS DATA ====================
        const textilesProducts = [
            { id: 201, name: "Handwoven Wool Rug", price: 4200, rating: 4.8, reviews: 56, category: "rugs", emoji: "🟫", img: "https://i.postimg.cc/RhCSZK0d/download-(6).jpg" },
            { id: 202, name: "Bedouin Camel Saddle Rug", price: 5500, rating: 4.6, reviews: 15, category: "rugs", emoji: "🐪", img: "https://i.postimg.cc/KzvwKNnz/download-(10).jpg" },
            { id: 203, name: "Traditional Prayer Rug", price: 1600, rating: 5.0, reviews: 150, category: "rugs", emoji: "🕌", img: "https://i.postimg.cc/nc0yJNBJ/images-(4).jpg" },
            { id: 204, name: "Moroccan Berber Rug", price: 6800, rating: 4.9, reviews: 89, category: "rugs", emoji: "🔴", img: "https://i.postimg.cc/RhCSZK0d/download-(6).jpg" },
            { id: 205, name: "Siwa Oasis Kilim", price: 3500, rating: 5.0, reviews: 28, category: "kilims", emoji: "🟧", img: "https://i.postimg.cc/fLCspyvZ/download-(7).jpg" },
            { id: 206, name: "Children's Play Mat", price: 1200, rating: 4.7, reviews: 34, category: "kilims", emoji: "🎨", img: "https://i.postimg.cc/rFSBPKy7/images-(2).jpg" },
            { id: 207, name: "Colorful Table Runner", price: 750, rating: 4.4, reviews: 45, category: "kilims", emoji: "🍽️", img: "https://i.postimg.cc/cJrghqMs/images-(6).jpg" },
            { id: 208, name: "Kilim Cushion Cover", price: 550, rating: 4.7, reviews: 62, category: "kilims", emoji: "🛋️", img: "https://i.postimg.cc/fLCspyvZ/download-(7).jpg" },
            { id: 209, name: "Embroidered Wall Hanging", price: 1800, rating: 4.9, reviews: 42, category: "embroidery", emoji: "🧵", img: "https://i.postimg.cc/Y2yKWJnZ/download-(9).jpg" },
            { id: 210, name: "Fayoum Embroidered Shawl", price: 950, rating: 4.8, reviews: 67, category: "embroidery", emoji: "🧣", img: "https://i.postimg.cc/fRnP7Zx5/images.jpg" },
            { id: 211, name: "Luxury Cotton Bedspread", price: 2800, rating: 4.9, reviews: 89, category: "embroidery", emoji: "🛏️", img: "https://i.postimg.cc/Px1Gnxz2/images-(3).jpg" },
            { id: 212, name: "Embroidered Cushion Cover", price: 550, rating: 4.8, reviews: 78, category: "embroidery", emoji: "🪡", img: "https://i.postimg.cc/YSmZQ9P6/images-(5).jpg" }
        ];

        // ==================== STATE ====================
        let currentFilter = 'all';
        let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
        let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
        let isLogin = true;

        // ==================== SAVE FUNCTIONS ====================
        function saveCart() {
            localStorage.setItem('globalCart', JSON.stringify(cart));
            updateCartBadge();
        }

        function saveWishlist() {
            localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds));
            updateWishBadge();
            renderWishlistItems();
        }

        // ==================== RENDER PRODUCTS ====================
        function renderProducts(filter = currentFilter) {
            const filtered = filter === 'all' ? textilesProducts : textilesProducts.filter(p => p.category === filter);
            const grid = document.getElementById('productsGrid');
            if (!grid) return;

            grid.innerHTML = filtered.map(p => {
                const cartItem = cart.find(i => i.name === p.name);
                const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
                const isLiked = wishlistIds.includes(p.id);
                const categoryLabel = p.category === 'rugs' ? '🏺 HANDWOVEN RUG' :
                    p.category === 'kilims' ? '🎨 KILIM' : '🪡 EMBROIDERY';

                return `
                    <div class="product-card" onclick="handleProductClick(${p.id})">
                        <div class="product-card-img">
                            ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
                            <span style="${p.img ? 'display:none;' : 'display:flex;'} font-size:5rem;">${p.emoji}</span>
                        </div>
                        <div class="product-card-body">
                            <p class="category-tag">${categoryLabel}</p>
                            <h3>${p.name}</h3>
                            <div class="stars-row">
                                ${'★'.repeat(Math.floor(p.rating))} ${p.rating}
                                <span style="color:var(--text-light);">(${p.reviews})</span>
                            </div>
                            <div class="price-row">
                                <span class="price">EGP ${p.price.toLocaleString()}</span>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${qtyInCart > 0 ? `<span style="background:var(--primary); color:white; padding:2px 8px; border-radius:20px; font-size:0.7rem;">${qtyInCart}</span>` : ''}
                                    <button class="btn-heart ${isLiked ? 'liked' : ''}" onclick="toggleHeart(event, ${p.id})">
                                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                                    </button>
                                    <button class="btn-add" onclick="addToCart(event, ${p.id})">${qtyInCart > 0 ? '➕' : 'Add'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function toggleHeart(e, id) {
            e.stopPropagation();
            const idx = wishlistIds.indexOf(id);
            const product = textilesProducts.find(p => p.id === id);
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
            const product = textilesProducts.find(p => p.id === id);
            if (product) {
                toast(`📄 "${product.name}" - More details coming soon!`);
            }
        }

        function filterCategory(category, el) {
            currentFilter = category;
            document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active'));
            if (el) el.classList.add('active');
            renderProducts();
        }

        // ==================== CART FUNCTIONS ====================
        function addToCart(event, productId) {
            event.stopPropagation();
            const product = textilesProducts.find(p => p.id === productId);
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
            toast(`✅ ${product.name} added! (${existing ? existing.quantity : 1})`);
            renderProducts();
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

        function openCartModal() {
            renderCartItems();
            document.getElementById('cartOverlay').classList.add('active');
        }

        function closeCartModal() {
            document.getElementById('cartOverlay').classList.remove('active');
        }

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
        function openWishlistModal() {
            renderWishlistItems();
            document.getElementById('wishlistOverlay').classList.add('active');
        }

        function closeWishlistModal() {
            document.getElementById('wishlistOverlay').classList.remove('active');
        }

        function renderWishlistItems() {
            const container = document.getElementById('wishlistItems');
            if (!container) return;

            const wp = textilesProducts.filter(p => wishlistIds.includes(p.id));
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

        function closeSearch() {
            document.getElementById('searchOverlay').classList.remove('active');
        }

        function doSearch() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const resultsDiv = document.getElementById('searchResults');
            if (!query) {
                resultsDiv.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Type to search...</p>';
                return;
            }
            const found = textilesProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
            if (found.length === 0) {
                resultsDiv.innerHTML = '<p style="text-align:center;">No results found</p>';
                return;
            }
            resultsDiv.innerHTML = found.map(p => `
                <p style="padding:10px;cursor:pointer;border-radius:8px;margin:4px 0;background:var(--bg-cream);" onclick="closeSearch();addToCart(event, ${p.id})">
                    🔍 ${p.name} - EGP ${p.price.toLocaleString()} <span style="color:var(--primary);">➕ Add</span>
                </p>
            `).join('');
        }

        // ==================== AUTH FUNCTIONS ====================
        function openAuth() {
            document.getElementById('authOverlay').classList.add('active');
            resetAuthForm();
        }

        function closeAuth() {
            document.getElementById('authOverlay').classList.remove('active');
        }

        function toggleAuth() {
            isLogin = !isLogin;
            resetAuthForm();
        }

        function resetAuthForm() {
            const form = document.getElementById('authForm');
            if (form) form.reset();
            const msgDiv = document.getElementById('authMessage');
            if (msgDiv) msgDiv.textContent = '';

            if (isLogin) {
                document.getElementById('authTitle').textContent = 'Welcome Back 👋';
                document.getElementById('authSubmit').textContent = 'Sign In';
                document.getElementById('nameGroup').style.display = 'none';
                document.getElementById('switchText').innerHTML = "Don't have an account? <a onclick='toggleAuth()'>Create one</a>";
            } else {
                document.getElementById('authTitle').textContent = 'Create Account ✨';
                document.getElementById('authSubmit').textContent = 'Register';
                document.getElementById('nameGroup').style.display = 'block';
                document.getElementById('switchText').innerHTML = "Already have an account? <a onclick='toggleAuth()'>Sign in</a>";
            }
        }

        function handleAuth(e) {
            e.preventDefault();
            const email = document.getElementById('authEmail').value.trim();
            const password = document.getElementById('authPassword').value.trim();
            const name = document.getElementById('authName')?.value.trim();
            const msgDiv = document.getElementById('authMessage');

            if (!email.includes('@') || !email.includes('.')) {
                msgDiv.textContent = '❌ Please enter a valid email address!';
                return false;
            }
            if (password.length < 4) {
                msgDiv.textContent = '❌ Password must be at least 4 characters!';
                return false;
            }
            if (!isLogin && !name) {
                msgDiv.textContent = '❌ Please enter your full name!';
                return false;
            }

            const users = JSON.parse(localStorage.getItem('lamsat_users') || '[]');

            if (isLogin) {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('lamsat_current_user', JSON.stringify(user));
                    toast(`👋 Welcome back, ${user.name || email}!`);
                    closeAuth();
                } else {
                    msgDiv.textContent = '❌ Wrong email or password!';
                }
            } else {
                if (users.find(u => u.email === email)) {
                    msgDiv.textContent = '❌ Email already exists!';
                    return false;
                }
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
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) this.classList.remove('active');
            });
        });

        // ==================== INITIALIZE ====================
        renderProducts();
        updateCartBadge();
        updateWishBadge();