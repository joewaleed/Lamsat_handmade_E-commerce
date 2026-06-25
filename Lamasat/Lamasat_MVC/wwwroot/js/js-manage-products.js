   // Default products
    let products = [
        { id: 1, name: "Terracotta Vase", category: "pottery", price: 450, originalPrice: 550, rating: 4.8, reviews: 120, origin: "Upper Egypt", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop", onSale: true },
        { id: 2, name: "Lotus Earrings", category: "jewelry", price: 1200, originalPrice: null, rating: 4.9, reviews: 85, origin: "Cairo", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop", onSale: false },
        { id: 3, name: "Fayoum Portrait", category: "decor", price: 3500, originalPrice: null, rating: 5.0, reviews: 30, origin: "Fayoum", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop", onSale: false },
        { id: 4, name: "Nubian Basket", category: "textiles", price: 600, originalPrice: null, rating: 4.7, reviews: 210, origin: "Aswan", image: "https://i.postimg.cc/WpHwjcsg/Gemini-Generated-Image-8kyis68kyis68kyi.png", onSale: false },
        { id: 5, name: "Brass Lantern", category: "decor", price: 850, originalPrice: 1100, rating: 4.9, reviews: 64, origin: "Old Cairo", image: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png", onSale: true },
        { id: 6, name: "Handwoven Rug", category: "textiles", price: 2800, originalPrice: null, rating: 4.6, reviews: 42, origin: "Siwa Oasis", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop", onSale: false }
    ];

    // Load from localStorage
    function loadProducts() {
        const stored = localStorage.getItem('lamsat_products');
        if (stored) {
            products = JSON.parse(stored);
        } else {
            saveToLocalStorage();
        }
        renderProductsTable();
        syncWithOtherPages();
    }

    function saveToLocalStorage() {
        localStorage.setItem('lamsat_products', JSON.stringify(products));
    }

    function syncWithOtherPages() {
        localStorage.setItem('globalProducts', JSON.stringify(products));
    }

    function renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price} EGP</td>
                <td>${p.rating} ⭐ (${p.reviews})</td>
                <td>${p.onSale ? '✅ Yes' : '❌ No'}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function openAddModal() {
        document.getElementById('modalTitle').innerText = 'Add Product';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productModal').classList.add('active');
    }

    function closeModal() {
        document.getElementById('productModal').classList.remove('active');
    }

    function editProduct(id) {
        const p = products.find(p => p.id === id);
        if (!p) return;
        document.getElementById('modalTitle').innerText = 'Edit Product';
        document.getElementById('productId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodOriginalPrice').value = p.originalPrice || '';
        document.getElementById('prodRating').value = p.rating;
        document.getElementById('prodReviews').value = p.reviews;
        document.getElementById('prodOrigin').value = p.origin || '';
        document.getElementById('prodImage').value = p.image;
        document.getElementById('prodOnSale').value = p.onSale ? 'true' : 'false';
        document.getElementById('productModal').classList.add('active');
    }

    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveToLocalStorage();
            renderProductsTable();
            syncWithOtherPages();
            toast('✅ Product deleted successfully!');
        }
    }

    function saveProduct(e) {
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const name = document.getElementById('prodName').value;
        const category = document.getElementById('prodCategory').value;
        const price = parseFloat(document.getElementById('prodPrice').value);
        const originalPrice = document.getElementById('prodOriginalPrice').value ? parseFloat(document.getElementById('prodOriginalPrice').value) : null;
        const rating = parseFloat(document.getElementById('prodRating').value);
        const reviews = parseInt(document.getElementById('prodReviews').value);
        const origin = document.getElementById('prodOrigin').value;
        const image = document.getElementById('prodImage').value;
        const onSale = document.getElementById('prodOnSale').value === 'true';

        if (id) {
            // Edit
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                products[index] = { ...products[index], name, category, price, originalPrice, rating, reviews, origin, image, onSale };
            }
            toast('✅ Product updated successfully!');
        } else {
            // Add new
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 7;
            products.push({ id: newId, name, category, price, originalPrice, rating, reviews, origin, image, onSale });
            toast('✅ New product added!');
        }
        saveToLocalStorage();
        renderProductsTable();
        syncWithOtherPages();
        closeModal();
    }

    function toast(msg) {
        let t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }

    loadProducts();