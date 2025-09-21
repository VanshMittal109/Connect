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

// Modal Functions
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Set title based on type
    if (type === 'therapist') {
        modalTitle.textContent = 'Add New Therapist';
        modalBody.innerHTML = `
            <form class="modal-form" id="therapist-form">
                <div class="field">
                    <label for="therapist-name">Name *</label>
                    <input type="text" id="therapist-name" name="name" required placeholder="Enter therapist name">
                </div>
                <div class="field">
                    <label for="therapist-specialty">Specialty *</label>
                    <input type="text" id="therapist-specialty" name="specialty" required placeholder="Enter specialty">
                </div>
                <div class="field">
                    <label for="therapist-status">Status</label>
                    <select id="therapist-status" name="status">
                        <option value="Active" selected>Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>
            </form>
        `;
    } else if (type === 'admin') {
        modalTitle.textContent = 'Add New Admin';
        modalBody.innerHTML = `
            <form class="modal-form" id="admin-form">
                <div class="field">
                    <label for="admin-name">Name *</label>
                    <input type="text" id="admin-name" name="name" required placeholder="Enter admin name">
                </div>
                <div class="field">
                    <label for="admin-email">Email *</label>
                    <input type="email" id="admin-email" name="email" required placeholder="Enter email address">
                </div>
                <div class="field">
                    <label for="admin-role">Role</label>
                    <select id="admin-role" name="role">
                        <option value="Admin" selected>Admin</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                </div>
            </form>
        `;
    }
    
    // Show modal
    modalOverlay.classList.add('show');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        const firstInput = modalBody.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Clear form data
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
}

// Accordion toggle
document.querySelectorAll('.accordion .head').forEach(head => {
    head.addEventListener('click', () => {
        const item = head.parentElement;
        item.classList.toggle('active');
    });
});

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

// Therapist Table Actions
function addTherapist() {
    openModal('therapist');
}

function editTherapist(btn) {
    const row = btn.closest('tr');
    const currentName = row.cells[0].textContent;
    const currentSpecialty = row.cells[1].textContent;
    
    const newName = prompt('Edit Name:', currentName);
    if (newName && newName !== currentName) {
        row.cells[0].textContent = newName;
    }
    
    const newSpecialty = prompt('Edit Specialty:', currentSpecialty);
    if (newSpecialty && newSpecialty !== currentSpecialty) {
        row.cells[1].textContent = newSpecialty;
    }
    
    if (newName !== currentName || newSpecialty !== currentSpecialty) {
        showToast('Therapist updated successfully!', 'success');
    }
}

function deleteTherapist(btn) {
    if (confirm('Are you sure you want to delete this therapist?')) {
        btn.closest('tr').remove();
        showToast('Therapist deleted successfully!', 'success');
    }
}

// Admin Table Actions
function addAdmin() {
    openModal('admin');
}

function editAdmin(btn) {
    const row = btn.closest('tr');
    const currentName = row.cells[0].textContent;
    const currentEmail = row.cells[1].textContent;
    const currentRole = row.cells[2].textContent;
    
    const newName = prompt('Edit Name:', currentName);
    if (newName && newName !== currentName) {
        row.cells[0].textContent = newName;
    }
    
    const newEmail = prompt('Edit Email:', currentEmail);
    if (newEmail && newEmail !== currentEmail) {
        row.cells[1].textContent = newEmail;
    }
    
    const newRole = prompt('Edit Role:', currentRole);
    if (newRole && newRole !== currentRole) {
        row.cells[2].textContent = newRole;
    }
    
    if (newName !== currentName || newEmail !== currentEmail || newRole !== currentRole) {
        showToast('Admin updated successfully!', 'success');
    }
}

function deleteAdmin(btn) {
    if (confirm('Are you sure you want to delete this admin?')) {
        btn.closest('tr').remove();
        showToast('Admin deleted successfully!', 'success');
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toasts');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toasts';
        toastContainer.className = 'toasts';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize notifications
    initNotifications();
    
    // Modal event listeners
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');
    
    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on cancel button click
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    // Handle save button click
    if (modalSave) {
        modalSave.addEventListener('click', function() {
            const modalBody = document.getElementById('modal-body');
            const form = modalBody.querySelector('form');
            
            if (!form) return;
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#d1d5db';
                }
            });
            
            if (!isValid) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Determine which form we're dealing with
            if (form.id === 'therapist-form') {
                saveTherapist(data);
            } else if (form.id === 'admin-form') {
                saveAdmin(data);
            }
            
            closeModal();
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Save functions for modal forms
function saveTherapist(data) {
    const table = document.getElementById('therapistTable').querySelector('tbody');
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${data.name}</td>
        <td>${data.specialty}</td>
        <td><span class="badge ${data.status === 'Active' ? 'success' : 'warning'}">${data.status}</span></td>
        <td class="table-actions">
            <button class="btn btn-edit" onclick="editTherapist(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" onclick="deleteTherapist(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    showToast('Therapist added successfully!', 'success');
}

function saveAdmin(data) {
    const table = document.getElementById('adminTable').querySelector('tbody');
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.role}</td>
        <td>Just now</td>
        <td class="table-actions">
            <button class="btn btn-edit" onclick="editAdmin(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" onclick="deleteAdmin(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    showToast('Admin added successfully!', 'success');
}