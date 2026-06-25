   const allProducts = [
        { id: 1, name: "Terracotta Vase", price: 850, rating: 4.8, reviews: 12, category: "Pottery", location: "Upper Egypt", emoji: "🏺", img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300&h=300&fit=crop" },
        { id: 2, name: "Lotus Pendant", price: 1200, rating: 5.0, reviews: 32, category: "Jewelry", location: "Cairo", emoji: "💎", img: "https://i.postimg.cc/SxJpxt11/Gemini-Generated-Image-60pvn60pvn60pvn6.png" },
        { id: 3, name: "Embroidered Textile", price: 450, rating: 4.7, reviews: 8, category: "Textiles", location: "Aswan", emoji: "🧵", img: "https://i.postimg.cc/LXrDKDQL/Screenshot-2026-04-23-222219.png" },
        { id: 5, name: "Brass Lantern", price: 850, rating: 4.9, reviews: 64, category: "Home Decor", location: "Cairo", emoji: "🏮", img: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png", productPage: "product.html" },
        { id: 6, name: "Blue Glaze Plate", price: 320, rating: 4.6, reviews: 21, category: "Pottery", location: "Fayoum", emoji: "🍽️", img: "https://i.postimg.cc/T3PrsnNX/Gemini-Generated-Image-4vjd0d4vjd0d4vjd.png" },
        { id: 7, name: "Golden Horizons", price: 3500, rating: 5.0, reviews: 4, category: "Home Decor", location: "Cairo", emoji: "🖼️", img: "https://i.postimg.cc/d0VZ3vcK/Gemini-Generated-Image-eihtr9eihtr9eiht.png" }
    ];

    let cart = JSON.parse(localStorage.getItem('globalCart') || '[]');
    let wishlistIds = JSON.parse(localStorage.getItem('lamsat_wishlist') || '[]');
    let filteredProducts = [...allProducts];
    let isLogin = true;
    let currentSort = 'newest';

    function saveCart() { localStorage.setItem('globalCart', JSON.stringify(cart)); updateBadges(); }
    function saveWishlist() { localStorage.setItem('lamsat_wishlist', JSON.stringify(wishlistIds)); updateBadges(); renderWishlistItems(); }

    function renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        if (products.length === 0) { grid.innerHTML = '<p style="text-align:center;padding:40px;">No products found.</p>'; return; }
        grid.innerHTML = products.map(p => {
            const isLiked = wishlistIds.includes(p.id);
            const cartItem = cart.find(i => i.name === p.name);
            const qtyInCart = cartItem ? (cartItem.quantity || 1) : 0;
            return `<div class="product-card" onclick="handleProductClick(${p.id})">
                <div class="product-card-img">${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<span>${p.emoji}</span>';">` : `<span>${p.emoji}</span>`}</div>
                <div class="product-card-body">
                    <h3>${p.name}</h3>
                    <div class="stars-row"><span class="stars">${'★'.repeat(Math.floor(p.rating))}</span><span>${p.rating}</span><span class="review-text">(${p.reviews})</span></div>
                    <div class="price-row">
                        <span class="price">${p.price} EGP</span>
                        <div class="btn-row">
                            ${qtyInCart > 0 ? `<span style="background:var(--primary); color:white; padding:2px 8px; border-radius:20px; font-size:0.7rem;">${qtyInCart}</span>` : ''}
                            <button class="btn-heart ${isLiked?'liked':''}" onclick="toggleHeart(event,${p.id})"><i class="${isLiked?'fas':'far'} fa-heart"></i></button>
                            <button class="btn-add" onclick="addToCart(event,${p.id})">${qtyInCart > 0 ? '➕' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function toggleHeart(e, id) { 
        e.stopPropagation(); 
        const idx = wishlistIds.indexOf(id); 
        const p = allProducts.find(x => x.id === id); 
        if (idx > -1) { 
            wishlistIds.splice(idx, 1); 
            toast(`💔 "${p.name}" removed`); 
        } else { 
            wishlistIds.push(id); 
            toast(`❤️ "${p.name}" added to wishlist!`); 
        } 
        saveWishlist(); 
        renderProducts(filteredProducts);
    }
    
    function handleProductClick(id) { 
        const p = allProducts.find(p => p.id === id); 
        if(p && p.productPage) window.location.href = p.productPage; 
        else toast('📄 Coming soon!'); 
    }
    
    function addToCart(event, productId) { 
        event.stopPropagation(); 
        const product = allProducts.find(p => p.id === productId); 
        if (!product) return; 
        const existing = cart.find(i => i.name === product.name); 
        if (existing) { 
            existing.quantity = (existing.quantity || 1) + 1; 
        } else { 
            cart.push({ 
                name: product.name, 
                price: product.price, 
                emoji: product.emoji, 
                image: product.img,
                quantity: 1,
                id: productId
            }); 
        } 
        saveCart(); 
        toast(`✅ ${product.name} added!`);
        renderProducts(filteredProducts);
    }
    
    function updateBadges() { 
        const t = cart.reduce((s,i)=>s + (i.quantity || 1), 0); 
        const b = document.getElementById('cartBadge'); 
        if(b){ b.textContent=t; b.style.display=t>0?'flex':'none'; } 
        const w = document.getElementById('wishBadge'); 
        if(w){ w.textContent=wishlistIds.length; w.style.display=wishlistIds.length>0?'flex':'none'; } 
    }
    
    function goToCheckout() { 
        localStorage.setItem('globalCart', JSON.stringify(cart));
        window.location.href = '../pages/checkout.html'; 
    }
    
    function openCartModal() { 
        renderCartItems(); 
        document.getElementById('cartOverlay').classList.add('active'); 
    }
    function closeCartModal() { document.getElementById('cartOverlay').classList.remove('active'); }
    
    function renderCartItems() { 
        const c = document.getElementById('cartItems'); 
        if(!c) return; 
        if(cart.length===0){ 
            c.innerHTML='<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>'; 
            document.getElementById('cartTotalRow').style.display='none'; 
            document.getElementById('checkoutBtn').style.display='none'; 
            return; 
        } 
        c.innerHTML = cart.map((i,idx)=>`<div class="cart-item">
            <div class="cart-item-img">${i.image ? `<img src="${i.image}" onerror="this.style.display='none';this.parentElement.innerHTML='${i.emoji}';">` : `<span>${i.emoji}</span>`}</div>
            <div class="cart-item-info"><h4>${i.name}</h4><p>EGP ${i.price} × ${i.quantity || 1}</p></div>
            <button class="cart-remove" onclick="removeFromCart(${idx})">🗑️</button>
            <button class="cart-remove" onclick="updateCartQuantity(${idx}, ${(i.quantity||1)+1})" style="color:var(--primary);">➕</button>
        </div>`).join(''); 
        const total = cart.reduce((s,i)=>s + i.price * (i.quantity || 1), 0); 
        document.getElementById('cartTotalPrice').textContent = `EGP ${total.toLocaleString()}`; 
        document.getElementById('cartTotalRow').style.display = 'flex'; 
        document.getElementById('checkoutBtn').style.display = 'block'; 
    }
    
    function updateCartQuantity(idx, newQty) {
        if (newQty <= 0) {
            removeFromCart(idx);
        } else {
            cart[idx].quantity = newQty;
            saveCart();
            renderCartItems();
            renderProducts(filteredProducts);
        }
    }
    
    function removeFromCart(idx) { 
        cart.splice(idx,1); 
        saveCart(); 
        renderCartItems(); 
        renderProducts(filteredProducts);
        toast('Item removed'); 
    }

    function openWishlistModal() { renderWishlistItems(); document.getElementById('wishlistOverlay').classList.add('active'); }
    function closeWishlistModal() { document.getElementById('wishlistOverlay').classList.remove('active'); }
    
    function renderWishlistItems() { 
        const container = document.getElementById('wishlistItems'); 
        if(!container) return; 
        const wp = allProducts.filter(p=>wishlistIds.includes(p.id)); 
        if(wp.length===0){ 
            container.innerHTML='<div class="empty-cart"><i class="far fa-heart"></i><p>Your wishlist is empty</p></div>'; 
            return; 
        } 
        container.innerHTML = wp.map(p=>`<div class="wishlist-item">
            <div class="wishlist-item-img">${p.img ? `<img src="${p.img}" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji}';">` : `<span>${p.emoji}</span>`}</div>
            <div class="wishlist-item-info"><strong>${p.name}</strong><br><p>EGP ${p.price}</p></div>
            <button class="cart-remove" onclick="removeFromWishlist(${p.id})">💔</button>
        </div>`).join(''); 
    }
    
    function removeFromWishlist(id) { 
        wishlistIds = wishlistIds.filter(pid=>pid!==id); 
        saveWishlist(); 
        renderWishlistItems(); 
        renderProducts(filteredProducts); 
    }

    function updatePrice() { const val = document.getElementById('priceSlider').value; document.getElementById('priceDisplay').textContent = `Up to ${val}`; applyFilters(); }
    function filterByRating(minRating) { document.getElementById('r'+minRating).checked=true; applyFilters(); }
    function filterByLocation() { applyFilters(); }
    function applyFilters() { 
        const maxPrice = parseInt(document.getElementById('priceSlider').value); 
        const location = document.querySelector('.location-select').value; 
        const ratingRadio = document.querySelector('input[name="rating"]:checked'); 
        const minRating = ratingRadio ? parseInt(ratingRadio.id.replace('r','')) : 0; 
        filteredProducts = allProducts.filter(p => p.price <= maxPrice && (location === 'all' || p.location === location) && p.rating >= minRating); 
        sortProducts(currentSort);
    }
    function sortProducts(sortBy) { 
        currentSort = sortBy;
        let sorted = [...filteredProducts]; 
        if(sortBy==='low') sorted.sort((a,b)=>a.price-b.price); 
        if(sortBy==='high') sorted.sort((a,b)=>b.price-a.price); 
        if(sortBy==='rating') sorted.sort((a,b)=>b.rating-a.rating); 
        renderProducts(sorted); 
    }

    function openSearch() { document.getElementById('searchOverlay').classList.add('active'); document.getElementById('searchInput').focus(); }
    function closeSearch() { document.getElementById('searchOverlay').classList.remove('active'); }
    function doSearch() { const q = document.getElementById('searchInput').value.toLowerCase(); const r = document.getElementById('searchResults'); if(!q) { r.innerHTML=''; return; } const found = allProducts.filter(p=>p.name.toLowerCase().includes(q)); r.innerHTML = found.length ? found.map(p=>`<div class="search-result-item" onclick="closeSearch();handleProductClick(${p.id})">🔍 ${p.name} - ${p.price} EGP</div>`).join('') : '<p>No results</p>'; }
    document.addEventListener('keydown', function(e) { if(e.key==='Enter' && document.getElementById('searchOverlay')?.classList.contains('active')) { const q = document.getElementById('searchInput').value.toLowerCase().trim(); if(q) { const found = allProducts.filter(p=>p.name.toLowerCase().includes(q)); if(found.length>0) { closeSearch(); handleProductClick(found[0].id); } } } });

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
        if (!email.includes('@') || !email.includes('.')) { msgDiv.textContent = '❌ Please enter a valid email address!'; return false; } 
        if (password.length < 4) { msgDiv.textContent = '❌ Password must be at least 4 characters!'; return false; } 
        let users = JSON.parse(localStorage.getItem('lamsat_users') || '[]'); 
        if (isLogin) { 
            const user = users.find(u => u.email === email && u.password === password); 
            if (user) { 
                localStorage.setItem('lamsat_current_user', JSON.stringify(user)); 
                toast('👋 Welcome back, ' + (user.name || email) + '!'); 
                closeAuthModal(); 
            } else { 
                msgDiv.textContent = '❌ Wrong email or password!'; 
            } 
        } else { 
            if (!name) { msgDiv.textContent = '❌ Please enter your full name!'; return false; } 
            if (users.find(u => u.email === email)) { msgDiv.textContent = '❌ This email is already registered!'; return false; } 
            const newUser = { name, email, password }; 
            users.push(newUser); 
            localStorage.setItem('lamsat_users', JSON.stringify(users)); 
            localStorage.setItem('lamsat_current_user', JSON.stringify(newUser)); 
            toast('🎉 Account created successfully! Welcome, ' + (name || email) + '!'); 
            closeAuthModal(); 
        } 
        return false; 
    }
    function toast(msg) { const c = document.getElementById('toastContainer'); const t = document.createElement('div'); t.className='toast'; t.textContent=msg; c.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(100px)'; setTimeout(()=>t.remove(),300); },2500); }

    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); }));
    renderProducts(allProducts); 
    updateBadges();