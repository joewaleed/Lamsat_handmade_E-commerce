  // Charts
    const ctx1 = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], datasets: [{ label: 'Revenue (K$)', data: [32, 38, 42, 48, 52], borderColor: '#c0956b', fill: true }] }
    });

    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: { labels: ['Home Decor', 'Handmade', 'Jewelry', 'Textiles'], datasets: [{ data: [35, 28, 22, 15], backgroundColor: ['#c0956b', '#a67c52', '#d4b896', '#f0e0b0'] }] }
    });

    // Sidebar toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    function showSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
        document.getElementById(section + 'Section').classList.add('active-section');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        event.target.closest('.nav-item').classList.add('active');
    }

    function approveSeller(btn) {
        btn.closest('tr').remove();
        let remaining = document.querySelectorAll('#pendingSellersTable tr').length;
        let badge = document.querySelector('#sellersSection .badge:first-of-type');
        if (badge) badge.innerText = remaining + ' pending';
        toast('✅ Seller approved successfully!');
    }

    function resolveDispute(btn) {
        btn.closest('tr').remove();
        let remaining = document.querySelectorAll('#disputesTable tr').length;
        let badge = document.querySelector('#disputesSection .badge');
        if (badge) badge.innerText = remaining + ' open';
        toast('✅ Dispute resolved!');
    }

    function toast(msg) {
        let t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }