  // ==================== PRODUCTS DATA ====================
    const products = [
        {
            id: 1,
            name: "Terracotta Vase",
            origin: "Upper Egypt",
            price: 450,
            originalPrice: 550,
            rating: 4.8,
            reviews: 120,
            onSale: true,
            image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop",
            emoji: "🏺",
            category: "pottery"
        },
        {
            id: 2,
            name: "Lotus Earrings",
            origin: "Cairo",
            price: 1200,
            originalPrice: null,
            rating: 4.9,
            reviews: 85,
            onSale: false,
            image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop",
            emoji: "💎",
            category: "jewelry"
        },
        {
            id: 3,
            name: "Fayoum Portrait",
            origin: "Fayoum",
            price: 3500,
            originalPrice: null,
            rating: 5.0,
            reviews: 30,
            onSale: false,
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
            emoji: "🖼️",
            category: "decor"
        },
        {
            id: 4,
            name: "Nubian Basket",
            origin: "Aswan",
            price: 600,
            originalPrice: null,
            rating: 4.7,
            reviews: 210,
            onSale: false,
            image: "https://i.postimg.cc/WpHwjcsg/Gemini-Generated-Image-8kyis68kyis68kyi.png",
            emoji: "🧺",
            category: "textiles"
        },
        {
            id: 5,
            name: "Brass Lantern",
            origin: "Old Cairo",
            price: 850,
            originalPrice: 1100,
            rating: 4.9,
            reviews: 64,
            onSale: true,
            image: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png",
            emoji: "🏮",
            category: "decor"
        },
        {
            id: 6,
            name: "Handwoven Rug",
            origin: "Siwa Oasis",
            price: 2800,
            originalPrice: null,
            rating: 4.6,
            reviews: 42,
            onSale: false,
            image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop",
            emoji: "🟫",
            category: "textiles"
        }
    ];

    let cart = [];
    let wishlist = [];
    let isLoginMode = true;

    // ==================== RENDER PRODUCTS ====================
    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = products.map(p => {
            const isLiked = wishlist.includes(p.id);
            return `
            <div class="product-card" data-id="${p.id}" data-name="${p.name.toLowerCase()}">
                <div class="product-image">
                    <img src="${p.image}" 
                         alt="${p.name} - Authentic Egyptian Handcraft"
                         loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <span class="product-emoji" style="display:none;">${p.emoji}</span>
                    ${p.onSale ? '<span class="sale-badge-tag">Sale</span>' : ''}
                    <button class="wishlist-btn ${isLiked ? 'liked' : ''}" 
                            onclick="toggleWishlist(event, ${p.id})" 
                            title="${isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                        ${isLiked ? '♥' : '♡'}
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-origin">📍 ${p.origin}</p>
                    <div class="price-row">
                        <span class="current-price">EGP ${p.price.toLocaleString()}</span>
                        ${p.originalPrice ? `<span class="original-price">EGP ${p.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="rating">
                        <span class="stars">${getStars(p.rating)}</span>
                        <span>${p.rating}</span>
                        <span class="review-count">(${p.reviews} reviews)</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(event, ${p.id})">Add to Cart</button>
                </div>
            </div>`;
        }).join('');

        // ✅ إضافة حدث الضغط على كل كروت المنتجات بعد ما تترسم
        addProductClickEvents();
    }

    function addProductClickEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // لو المستخدم داس على زرار (Add to Cart أو Wishlist)، منعملش انتقال
                if (e.target.tagName === 'BUTTON') return;
                
                const productId = parseInt(this.dataset.id);
                if (productId === 5) {
                    window.location.href = '../pages/product.html';
                }
            });
        });
    }

    function getStars(rating) {
        if (rating >= 5) return '★★★★★';
        if (rating >= 4.5) return '★★★★☆';
        if (rating >= 4) return '★★★★☆';
        return '★★★☆☆';
    }

    // ==================== CART FUNCTIONS ====================
    function addToCart(event, productId) {
        event.stopPropagation();
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        updateBadges();
        showToast(`✅ "${product.name}" added to cart!`);
        
        const btn = event.target;
        btn.textContent = 'Added ✓';
        btn.style.backgroundColor = '#2d2a26';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#2d2a26';
        }, 1200);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateBadges();
        renderCartItems();
        showToast('Item removed from cart');
    }

    function updateBadges() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.getElementById('cartBadge');
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
        
        const wishlistBadge = document.getElementById('wishlistBadge');
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }

    function openCart() {
        document.getElementById('cartOverlay').classList.add('active');
        renderCartItems();
    }

    function closeCart() {
        document.getElementById('cartOverlay').classList.remove('active');
    }

    function renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const cartTotalRow = document.getElementById('cartTotalRow');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size:0.85rem; margin-top:8px;">Discover handcrafted treasures!</p>
                </div>`;
            cartTotalRow.style.display = 'none';
            checkoutBtn.style.display = 'none';
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="item-row">
                <img src="${item.image}" class="item-img" alt="${item.name}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="item-img-placeholder" style="display:none;">${item.emoji}</div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="price">EGP ${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
                <button class="item-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotalPrice').textContent = `EGP ${total.toLocaleString()}`;
        cartTotalRow.style.display = 'flex';
        checkoutBtn.style.display = 'block';
    }

    // ==================== WISHLIST FUNCTIONS ====================
    function toggleWishlist(event, productId) {
        event.stopPropagation();
        const index = wishlist.indexOf(productId);
        const product = products.find(p => p.id === productId);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            showToast(`💔 "${product.name}" removed from wishlist`);
        } else {
            wishlist.push(productId);
            showToast(`❤️ "${product.name}" added to wishlist!`);
        }
        updateBadges();
        renderProducts();
        renderWishlistItems();
    }

    function openWishlist() {
        document.getElementById('wishlistOverlay').classList.add('active');
        renderWishlistItems();
    }

    function closeWishlist() {
        document.getElementById('wishlistOverlay').classList.remove('active');
    }

    function renderWishlistItems() {
        const wishlistItems = document.getElementById('wishlistItems');
        
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-heart"></i>
                    <p>Your wishlist is empty</p>
                    <p style="font-size:0.85rem; margin-top:8px;">Tap the heart (♡) on any product to save it here!</p>
                </div>`;
            return;
        }
        
        const wishlistProducts = products.filter(p => wishlist.includes(p.id));
        wishlistItems.innerHTML = wishlistProducts.map(p => `
            <div class="item-row">
                <img src="${p.image}" class="item-img" alt="${p.name}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="item-img-placeholder" style="display:none;">${p.emoji}</div>
                <div class="item-info">
                    <h4>${p.name}</h4>
                    <p class="price">EGP ${p.price.toLocaleString()} • ${p.origin}</p>
                    <p style="font-size:0.8rem; color:var(--gold-star);">${getStars(p.rating)} ${p.rating}</p>
                </div>
                <button class="item-remove" onclick="removeFromWishlistFromModal(${p.id})" title="Remove">💔</button>
            </div>
        `).join('');
    }

    function removeFromWishlistFromModal(productId) {
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            updateBadges();
            renderProducts();
            renderWishlistItems();
            showToast('Removed from wishlist');
        }
    }

    // ==================== SEARCH FUNCTIONS ====================
    function openSearch() {
        document.getElementById('searchOverlay').classList.add('active');
        document.getElementById('searchInput').focus();
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '<p style="color: var(--text-muted); text-align: center;">🔍 Start typing to find authentic Egyptian crafts...</p>';
    }

    function closeSearch() {
        document.getElementById('searchOverlay').classList.remove('active');
    }

    function performSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('searchResults');
        
        if (query === '') {
            resultsDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center;">🔍 Start typing to find authentic Egyptian crafts...</p>';
            return;
        }
        
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.origin.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        
        if (results.length === 0) {
            resultsDiv.innerHTML = `<div class="search-no-results">
                <i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                No crafts found for "<strong>${query}</strong>"<br>
                <small>Try: pottery, jewelry, vase, lantern, basket...</small>
            </div>`;
            return;
        }
        
        resultsDiv.innerHTML = results.map(p => `
            <div class="search-result-item" onclick="closeSearch(); document.querySelector('[data-id=\\'${p.id}\\']')?.scrollIntoView({behavior:'smooth', block:'center'});">
                <img src="${p.image}" style="width:55px;height:55px;border-radius:10px;object-fit:cover;" alt="${p.name}"
                     onerror="this.style.display='none'">
                <div style="flex:1;">
                    <strong>${p.name}</strong>
                    <p style="font-size:0.8rem; color:var(--text-light);">${p.origin} • EGP ${p.price.toLocaleString()}</p>
                </div>
                <span style="color:var(--primary); font-size:1.2rem;">→</span>
            </div>
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

    function resetAuthForm() {
        document.getElementById('authForm').reset();
        if (isLoginMode) {
            document.getElementById('authTitle').textContent = 'Welcome Back 👋';
            document.getElementById('authSubmit').textContent = 'Sign In';
            document.getElementById('nameGroup').style.display = 'none';
            document.getElementById('switchText').innerHTML = 'Don\'t have an account? <a onclick="toggleAuth()">Create one</a>';
        } else {
            document.getElementById('authTitle').textContent = 'Create Account ✨';
            document.getElementById('authSubmit').textContent = 'Register';
            document.getElementById('nameGroup').style.display = 'block';
            document.getElementById('switchText').innerHTML = 'Already have an account? <a onclick="toggleAuth()">Sign in</a>';
        }
    }

    function toggleAuth() {
        isLoginMode = !isLoginMode;
        resetAuthForm();
    }

    function handleAuth(event) {
        event.preventDefault();
        const email = document.getElementById('authEmail').value;
        const name = document.getElementById('authName').value;
        
        if (isLoginMode) {
            showToast(`👋 Welcome back! Logged in as ${email}`);
        } else {
            showToast(`🎉 Account created! Welcome, ${name || email}!`);
        }
        closeAuth();
    }

    // ==================== TOAST ====================
    function showToast(message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ==================== MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });

    document.querySelector('.btn-primary').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        navbar.style.boxShadow = window.scrollY > 50 
            ? '0 4px 20px rgba(45, 42, 38, 0.12)' 
            : '0 2px 8px rgba(45, 42, 38, 0.06)';
    });

    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
            closeCart();
            closeWishlist();
            closeAuth();
        }
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });

    // Initialize
    renderProducts();
    updateBadges();

    console.log('✨ Lamsat - Authentic Egyptian Crafts ✨');
    console.log('🏺 Egyptian Pottery • 💎 Egyptian Jewelry • 🧵 Egyptian Textiles • 🏮 Egyptian Home Decor');
    console.log('🔍 Press Ctrl+K to search  |  🛒 Cart  |  ❤️ Wishlist  |  👤 Account');
    console.log('🖱️ Click on Brass Lantern → Goes to product.html');