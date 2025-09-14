const modal = document.getElementById('signupModal');
const btn = document.getElementById('signupBtn');
const closeBtn = document.getElementById('closeModal');

if (btn) btn.onclick = () => modal.style.display = 'flex';
if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };

// Handle signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(signupForm).entries());
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert('Details Saved!');
        modal.style.display = 'none';
        signupForm.reset();
    });
}

// Load users for admin page
const usersTable = document.getElementById('usersTable')?.querySelector('tbody');
if (usersTable) {
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            usersTable.innerHTML = '';
            users.forEach(u => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${u.name}</td><td>${u.email}</td>`;
                usersTable.appendChild(row);
            });
        });
}
