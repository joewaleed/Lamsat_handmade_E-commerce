   // ==================== DATA ====================
    let vendorProducts = [];
    let orders = [
        { id: "ORD-1001", customer: "Sarah Jenkins", product: "Terracotta Vase", amount: 450, date: "2024-05-01", status: "delivered" },
        { id: "ORD-1002", customer: "John Deer", product: "Lotus Earrings", amount: 1200, date: "2024-04-28", status: "shipped" },
        { id: "ORD-1003", customer: "Lina Moss", product: "Brass Lantern", amount: 850, date: "2024-04-25", status: "pending" },
        { id: "ORD-1004", customer: "Omar Farouk", product: "Handwoven Rug", amount: 2800, date: "2024-05-02", status: "pending" },
        { id: "ORD-1005", customer: "Nadia Khalil", product: "Fayoum Portrait", amount: 3500, date: "2024-04-30", status: "delivered" },
        { id: "ORD-1006", customer: "Youssef Gamal", product: "Nubian Basket", amount: 600, date: "2024-05-03", status: "shipped" }
    ];

    // Load products from localStorage
    function loadVendorProducts() {
        const stored = localStorage.getItem('lamsat_products');
        if (stored) {
            vendorProducts = JSON.parse(stored);
        } else {
            vendorProducts = [
                { id: 1, name: "Terracotta Vase", price: 450, stock: 15, category: "pottery", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop" },
                { id: 2, name: "Lotus Earrings", price: 1200, stock: 8, category: "jewelry", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop" },
                { id: 3, name: "Fayoum Portrait", price: 3500, stock: 3, category: "decor", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop" },
                { id: 4, name: "Nubian Basket", price: 600, stock: 20, category: "textiles", image: "https://i.postimg.cc/WpHwjcsg/Gemini-Generated-Image-8kyis68kyis68kyi.png" },
                { id: 5, name: "Brass Lantern", price: 850, stock: 12, category: "decor", image: "https://i.postimg.cc/qvzfqT3s/Gemini-Generated-Image-i4xnzvi4xnzvi4xn.png" },
                { id: 6, name: "Handwoven Rug", price: 2800, stock: 5, category: "textiles", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop" }
            ];
        }
        renderAllSections();
    }

    // Save products to localStorage
    function saveVendorProducts() {
        localStorage.setItem('lamsat_products', JSON.stringify(vendorProducts));
        localStorage.setItem('globalProducts', JSON.stringify(vendorProducts));
    }

    // Add product
    function addProduct() {
        let name = document.getElementById('productName').value;
        let price = parseFloat(document.getElementById('productPrice').value);
        let qty = parseInt(document.getElementById('productQty').value);
        let img = document.getElementById('productImage').value;
        let category = document.getElementById('productCategory').value;

        if (!name || !price || !qty) {
            toast('❌ Please fill all fields!');
            return;
        }

        const newId = vendorProducts.length > 0 ? Math.max(...vendorProducts.map(p => p.id)) + 1 : 7;
        vendorProducts.push({
            id: newId,
            name: name,
            price: price,
            stock: qty,
            category: category,
            image: img || "https://via.placeholder.com/400"
        });

        saveVendorProducts();
        renderAllSections();
        toast(`✅ "${name}" added successfully!`);
        
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productQty').value = '';
        document.getElementById('productImage').value = '';
    }

    // Delete product
    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            vendorProducts = vendorProducts.filter(p => p.id !== id);
            saveVendorProducts();
            renderAllSections();
            toast('✅ Product deleted!');
        }
    }

    // Update order status
    function updateOrderStatus(orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            renderAllSections();
            toast(`✅ Order ${orderId} status updated to ${newStatus}`);
        }
    }

    // Get status badge class
    function getStatusClass(status) {
        if (status === 'delivered') return 'status-delivered';
        if (status === 'shipped') return 'status-shipped';
        return 'status-pending';
    }

    // Render Dashboard
    function renderDashboard() {
        // Recent Orders Table
        const recentTable = document.querySelector('#recentOrdersTable tbody');
        const recentOrders = orders.slice(0, 4);
        recentTable.innerHTML = recentOrders.map(o => `
            <tr>
                <td>${o.id}</td><td>${o.customer}</td><td>$${o.amount}</td>
                <td class="${getStatusClass(o.status)}">${o.status}</td>
            </tr>
        `).join('');

        // My Products Table
        const productsTable = document.querySelector('#myProductsTable tbody');
        productsTable.innerHTML = vendorProducts.slice(0, 4).map(p => `
            <tr><td>${p.id}</td><td>${p.name}</td><td>EGP ${p.price}</td><td>${p.stock}</td></tr>
        `).join('');

        // Update pending orders count
        const pendingCount = orders.filter(o => o.status === 'pending').length;
        document.getElementById('pendingOrdersCount').innerText = pendingCount;
    }

    // Render Products Section
    function renderProductsSection() {
        const table = document.querySelector('#allProductsTable tbody');
        table.innerHTML = vendorProducts.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" width="40" height="40" style="object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/40'"></td>
                <td>${p.name}</td>
                <td>EGP ${p.price}</td>
                <td>${p.stock}</td>
                <td><button class="btn-submit" style="background:#ef4444; padding:6px 12px;" onclick="deleteProduct(${p.id})">Delete</button></td>
            </tr>
        `).join('');
    }

    // Render Orders Section
    function renderOrdersSection() {
        const table = document.querySelector('#allOrdersTable tbody');
        table.innerHTML = orders.map(o => `
            <tr>
                <td>${o.id}</td><td>${o.customer}</td><td>${o.product}</td><td>$${o.amount}</td><td>${o.date}</td>
                <td class="${getStatusClass(o.status)}">${o.status}</td>
                <td>
                    <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:5px; border-radius:12px;">
                        <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }

    // Render Analytics
    function renderAnalytics() {
        // Sales by category
        const categorySales = {};
        vendorProducts.forEach(p => {
            categorySales[p.category] = (categorySales[p.category] || 0) + p.price;
        });

        // Sales chart (last 6 months mock data)
        const ctx1 = document.getElementById('salesChart')?.getContext('2d');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{ label: 'Sales ($)', data: [1250, 1800, 2100, 2450, 2900, 3400], borderColor: '#c0956b', fill: true, backgroundColor: 'rgba(192,149,107,0.1)' }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }

        // Category chart
        const ctx2 = document.getElementById('categorySalesChart')?.getContext('2d');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categorySales),
                    datasets: [{ data: Object.values(categorySales), backgroundColor: ['#c0956b', '#a67c52', '#d4b896', '#f0e0b0'] }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }

        // Insights
        document.getElementById('totalOrdersValue').innerText = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
        document.getElementById('avgOrderValue').innerText = `$${Math.round(totalSales / orders.length)}`;
        // Find top product
        const productCount = {};
        orders.forEach(o => { productCount[o.product] = (productCount[o.product] || 0) + 1; });
        const topProduct = Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b, '');
        document.getElementById('topProductValue').innerText = topProduct;
    }

    // Section switching
    function showSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
        document.getElementById(section + 'Section').classList.add('active-section');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        event.target.closest('.nav-item').classList.add('active');
        
        if (section === 'products') renderProductsSection();
        if (section === 'orders') renderOrdersSection();
        if (section === 'analytics') renderAnalytics();
    }

    function renderAllSections() {
        renderDashboard();
        renderProductsSection();
        renderOrdersSection();
        renderAnalytics();
    }

    // Toast
    function toast(msg) {
        let t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }

    // Sidebar toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Initialize
    loadVendorProducts();
    document.querySelector('.nav-item').classList.add('active');