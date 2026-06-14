     let cart = JSON.parse(localStorage.getItem('globalCart')) || [];

        // قاعدة بيانات شاملة لكل المنتجات (جولاري + بوتري + غيره)
        const defaultProducts = [
            // جولاري
            { id: 1, name: "Ancient Egyptian Earrings", price: 1780, emoji: "💎", image: "https://i.postimg.cc/nVgfRtHd/Screenshot-2026-04-23-233713.png" },
            { id: 2, name: "Lotus Drop Earrings", price: 1200, emoji: "💎", image: "https://i.postimg.cc/28x3QjWw/download.jpg" },
            { id: 3, name: "Gold Cartouche Pendant", price: 2400, emoji: "🏅", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMSZYEn48Sc9_Uz68gasssSSPJLnx0XeCrqw&s" },
            { id: 4, name: "Turquoise Ankh Necklace", price: 3200, emoji: "📿", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAxUo-5Cc25pjEO5_euxW_XeY7UNmgy4ajRw&s" },
            { id: 5, name: "Ancient Scarab Ring", price: 1800, emoji: "💍", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfb5uDXsCFE_Ne5tkL-Sg1Izr2M92xjzEmLw&s" },
            { id: 6, name: "Horus Eye Bracelet", price: 1500, emoji: "⭕", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1VXdsoISKGyiDWQa810AYbYYIK8j2xT8kFQ&s" },
            { id: 7, name: "Nefertiti Pendant", price: 3500, emoji: "👑", image: "https://i.postimg.cc/CxP2fDLX/download-(2).jpg" },
            { id: 8, name: "Blue Lotus Choker", price: 2100, emoji: "🔷", image: "https://i.postimg.cc/7ZWBLkK6/download-(3).jpg" },
            { id: 9, name: "Silver Pharaoh Cuff", price: 2800, emoji: "🪬", image: "https://i.postimg.cc/9M3JGB3b/download-(4).jpg" },
            { id: 10, name: "Emerald Necklace Set", price: 4500, emoji: "💚", image: "https://i.postimg.cc/zDF0gWxk/download-(5).jpg" },
            // بوتري / شوب
            { id: 11, name: "Terracotta Vase", price: 850, emoji: "🏺", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop" },
            { id: 12, name: "Lotus Pendant", price: 1200, emoji: "💎", image: "https://i.postimg.cc/SxJpxt11/Gemini-Generated-Image-60pvn60pvn60pvn6.png" },
            { id: 13, name: "Embroidered Textile", price: 450, emoji: "🧵", image: "https://i.postimg.cc/LXrDKDQL/Screenshot-2026-04-23-222219.png" },
            { id: 14, name: "Brass Lantern", price: 850, emoji: "🏮", image: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png" },
            { id: 15, name: "Blue Glaze Plate", price: 320, emoji: "🍽️", image: "https://i.postimg.cc/T3PrsnNX/Gemini-Generated-Image-4vjd0d4vjd0d4vjd.png" },
            { id: 16, name: "Golden Horizons", price: 3500, emoji: "🖼️", image: "https://i.postimg.cc/d0VZ3vcK/Gemini-Generated-Image-eihtr9eihtr9eiht.png" },
            { id: 17, name: "Lotus Earrings", price: 1200, emoji: "💎", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop" },
            { id: 18, name: "Fayoum Portrait", price: 3500, emoji: "🖼️", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop" },
            { id: 19, name: "Nubian Basket", price: 600, emoji: "🧺", image: "https://i.postimg.cc/WpHwjcsg/Gemini-Generated-Image-8kyis68kyis68kyi.png" },
            { id: 20, name: "Handwoven Rug", price: 2800, emoji: "🟫", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop" }
        ];

        function renderCart() {
            const container = document.getElementById('cartItemsList');
            
            if (!cart.length) {
                container.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>Your cart is empty</p>
                        <a href="jewelry.html" style="color: #c0956b;">Continue Shopping →</a>
                    </div>
                `;
                document.getElementById('summarySubtotal').innerText = 'EGP 0';
                document.getElementById('summaryTotal').innerText = 'EGP 0';
                return;
            }

            let subtotal = 0;
            let itemsHtml = '';

            cart.forEach((item, index) => {
                // البحث عن المنتج بالاسم أولاً، ثم بالـ id
                let product = defaultProducts.find(p => p.name === item.name);
                if (!product && item.id) {
                    product = defaultProducts.find(p => p.id === item.id);
                }
                if (!product) {
                    product = {
                        name: item.name,
                        price: item.price,
                        emoji: item.emoji || '🏺',
                        image: item.image || ''
                    };
                }
                const qty = item.quantity || 1;
                const itemTotal = product.price * qty;
                subtotal += itemTotal;

                // تحديد مصدر الصورة (من product أو من item نفسه)
                const imgSrc = product.image || item.image || '';
                const emojiChar = product.emoji || item.emoji || '🏺';

                itemsHtml += `
                    <div class="cart-item">
                        <div class="cart-item-img">
                            ${imgSrc ? `<img src="${imgSrc}" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\'font-size: 2rem;\'>${emojiChar}</span>';">` : `<span style="font-size: 2rem;">${emojiChar}</span>`}
                        </div>
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p>Quantity: ${qty}</p>
                            <div class="cart-item-price">EGP ${itemTotal.toLocaleString()}</div>
                            <div>
                                <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
                                <button class="cart-item-qty-btn" onclick="updateQuantity(${index}, ${qty - 1})">−</button>
                                <button class="cart-item-qty-btn" onclick="updateQuantity(${index}, ${qty + 1})">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = itemsHtml;
            document.getElementById('summarySubtotal').innerText = `EGP ${subtotal.toLocaleString()}`;
            document.getElementById('summaryTotal').innerText = `EGP ${subtotal.toLocaleString()}`;
        }

        function updateQuantity(index, newQty) {
            if (newQty <= 0) {
                removeFromCart(index);
            } else {
                cart[index].quantity = newQty;
                localStorage.setItem('globalCart', JSON.stringify(cart));
                renderCart();
                toast('Quantity updated');
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            localStorage.setItem('globalCart', JSON.stringify(cart));
            renderCart();
            toast('Item removed from cart');
        }

        function placeOrder() {
            const fullName = document.getElementById('fullName').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const postalCode = document.getElementById('postalCode').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

            if (!fullName || !address || !city) {
                toast('❌ Please fill in all delivery address fields');
                return;
            }

            if (cart.length === 0) {
                toast('❌ Your cart is empty');
                return;
            }

            const subtotal = cart.reduce((sum, item) => {
                let product = defaultProducts.find(p => p.name === item.name);
                if (!product && item.id) product = defaultProducts.find(p => p.id === item.id);
                const price = product ? product.price : item.price;
                const qty = item.quantity || 1;
                return sum + (price * qty);
            }, 0);

            const order = {
                orderId: 'ORD-' + Math.floor(Math.random() * 100000),
                date: new Date().toISOString(),
                customer: fullName,
                address: `${address}, ${city}, ${postalCode}`,
                paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
                items: [...cart],
                total: subtotal
            };

            const existingOrders = JSON.parse(localStorage.getItem('globalOrders')) || [];
            existingOrders.push(order);
            localStorage.setItem('globalOrders', JSON.stringify(existingOrders));

            cart = [];
            localStorage.setItem('globalCart', JSON.stringify(cart));
            
            toast(`🎉 Order placed successfully! Order ID: ${order.orderId}`);
            
            document.getElementById('fullName').value = '';
            document.getElementById('address').value = '';
            document.getElementById('city').value = '';
            document.getElementById('postalCode').value = '';
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2500);
            
            renderCart();
        }

        function toast(msg) {
            const container = document.getElementById('toastContainer');
            const t = document.createElement('div');
            t.className = 'toast';
            t.innerText = msg;
            container.appendChild(t);
            setTimeout(() => t.remove(), 2500);
        }

        renderCart();