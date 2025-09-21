document.addEventListener('DOMContentLoaded', function() {
  // Helpers: toast
  const toasts = document.getElementById('toasts');
  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toasts.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // Navigation: close to dashboard
  document.getElementById('close-card')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
  // Modal controls
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalOk = document.getElementById('modal-ok');
  function openModal(text = 'Patient added successfully') {
    document.getElementById('modal-title').textContent = 'Success';
    modal.querySelector('.modal-body p').textContent = text;
    modalOverlay.classList.add('show');
    modal.classList.add('show');
  }
  function closeModal() {
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');
  }
  modalClose?.addEventListener('click', closeModal);
  modalOk?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  // Form validation
  const form = document.getElementById('patient-form');
  const fields = {
    name: document.getElementById('name'),
    contact: document.getElementById('contact'),
    email: document.getElementById('email'),
    gender: document.getElementById('gender'),
    join: document.getElementById('join'),
    dob: document.getElementById('dob')
  };

  function setError(el, msg) {
    const small = document.querySelector(`.error[data-for="${el.id}"]`);
    if (small) small.textContent = msg || '';
    el.classList.toggle('invalid', Boolean(msg));
  }
  function clearAllErrors() {
    Object.values(fields).forEach(el => setError(el, ''));
  }
  function onlyLettersSpaces(str) { return /^[A-Za-z ]+$/.test(str); }
  function isValidPhone(str) { return /^\d{10}$/.test(str); }
  function isValidEmail(str) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str); }

  function validate() {
    let ok = true;
    // Name
  const nameVal = fields.name.value.trim();
  if (!nameVal) { setError(fields.name, 'Name is required'); ok = false; }
  else if (!onlyLettersSpaces(nameVal)) { setError(fields.name, 'Only alphabets and spaces allowed'); ok = false; }
  else setError(fields.name, '');

  // Contact
  const contactVal = fields.contact.value.replace(/\D/g,'');
  if (!isValidPhone(contactVal)) { setError(fields.contact, 'Enter a valid 10-digit number'); ok = false; }
  else setError(fields.contact, '');

  // Email
  const emailVal = fields.email.value.trim();
  if (!isValidEmail(emailVal)) { setError(fields.email, 'Enter a valid email'); ok = false; }
  else setError(fields.email, '');

  // Gender
  if (!fields.gender.value) { setError(fields.gender, 'Please select gender'); ok = false; }
  else setError(fields.gender, '');

// Dates (optional)
const joinVal = fields.join.value;
const dobVal = fields.dob.value;



  return ok;
}

// Live validation on blur
Object.values(fields).forEach(el => el.addEventListener('blur', validate));

// Demo: patient table
const table = document.getElementById('patient-table').querySelector('tbody');
function genId() { return '#P-' + Math.floor(100 + Math.random()*900); }
function addRow(data) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${genId()}</td>
  <td>${data.name}</td>
  <td>${data.gender}</td>
  <td>${data.contact}</td>
  <td>${data.email}</td>
  <td>${data.join}</td>
  <td>${data.dob}</td>
    <td><button class="mini edit">Edit</button><button class="mini danger delete">Delete</button></td>
  `;
  table.prepend(tr);
}

// Submit handler
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();
  if (!validate()) {
    toast('Please fix the errors highlighted', 'error');
    return;
  }
  const data = {
    name: fields.name.value.trim(),
    contact: fields.contact.value.replace(/\D/g,''),
    email: fields.email.value.trim(),
    password: 'demo123', // Default password for demo
    dateOfBirth: fields.dob.value,
    gender: fields.gender.value,
    joining_date: fields.join.value
  };
  try {
  const res = await fetch('http://localhost:3001/api/auth/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add patient');
    const result = await res.json();
    addRow(data);
    openModal('Patient added successfully');
    form.reset();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
});

// Reset button toast
document.getElementById('reset-btn')?.addEventListener('click', () => {
  clearAllErrors();
  toast('Form cleared', 'info');
});

// Edit/Delete actions
document.getElementById('patient-table')?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const tr = btn.closest('tr');
  const tds = tr.querySelectorAll('td');
  if (btn.classList.contains('delete')) {
    tr.remove();
    toast('Patient removed', 'success');
  } else if (btn.classList.contains('edit')) {
    // Fill form with row data (skip id col)
  fields.name.value = tds[1].textContent;
  fields.gender.value = tds[3].textContent;
  fields.contact.value = tds[4].textContent;
  fields.email.value = tds[5].textContent;
  fields.join.value = tds[6].textContent;
  fields.dob.value = tds[7].textContent;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Loaded details for editing', 'info');
  }
});
});

// Global notification initialization
function initNotifications() {
    const notificationsMenu = document.getElementById('notifications-menu');
    if (notificationsMenu) {
        notificationsMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.notifications-dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }
}

// Notifications Functions
function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Update badge count
    const badge = document.getElementById('notify-badge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// Initialize notifications when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNotifications();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.notifications-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentElement.contains(e.target) && dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        });
    });
});

