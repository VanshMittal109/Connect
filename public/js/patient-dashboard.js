// Patient Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Patient Dashboard Initializing...');
    
    // Initialize all components
    initializeCalendar();
    initializeDropdowns();
    initializeModals();
    initializeAppointmentTable();
    
    console.log('Patient Dashboard Initialized Successfully!');
});

// ==================== CALENDAR FUNCTIONALITY ====================
function initializeCalendar() {
    console.log('Initializing Calendar...');
    
    const calendar = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (!calendar || !currentMonthEl) {
        console.log('Calendar elements not found');
        return;
    }
    
    let currentDate = new Date();
    const bookedDates = new Set(['2024-09-18', '2024-09-21', '2024-09-26']);
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        currentMonthEl.textContent = currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'day other-month';
            emptyDiv.textContent = new Date(year, month, i - startingDayOfWeek + 1).getDate();
            calendar.appendChild(emptyDiv);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement('div');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isBooked = bookedDates.has(dateStr);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            
            div.className = 'day' + (isBooked ? ' booked' : '') + (isToday ? ' today' : '');
            div.textContent = day;
            div.dataset.date = dateStr;
            
            if (isBooked) {
                div.title = 'You have an appointment on this day';
            }
            
            calendar.appendChild(div);
        }
    }
    
    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Initialize calendar
    renderCalendar();
    console.log('Calendar initialized successfully');
}

// ==================== DROPDOWN FUNCTIONALITY ====================
function initializeDropdowns() {
    console.log('Initializing Dropdowns...');
    
    // Profile Dropdown
    const profileMenu = document.getElementById('profile-menu');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileMenu && profileDropdown) {
        profileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(profileDropdown);
            closeDropdown(notificationDropdown);
        });
        console.log('Profile dropdown initialized');
    }
    
    // Notification Dropdown
    const notificationMenu = document.getElementById('notification-menu');
    const notificationDropdown = document.getElementById('notification-dropdown');
    
    if (notificationMenu && notificationDropdown) {
        notificationMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(notificationDropdown);
            closeDropdown(profileDropdown);
        });
        console.log('Notification dropdown initialized');
    }
    
    // Mark all notifications as read
    const markAllReadBtn = document.getElementById('mark-all-read');
    const notifyBadge = document.getElementById('notify-badge');
    
    if (markAllReadBtn && notificationDropdown && notifyBadge) {
        markAllReadBtn.addEventListener('click', () => {
            const unreadItems = notificationDropdown.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => item.classList.remove('unread'));
            notifyBadge.textContent = '0';
            notifyBadge.style.display = 'none';
            showToast('All notifications marked as read', 'success');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target)) {
            closeDropdown(profileDropdown);
        }
        if (notificationMenu && !notificationMenu.contains(e.target)) {
            closeDropdown(notificationDropdown);
        }
    });
    
    console.log('Dropdowns initialized successfully');
}

// ==================== MODAL FUNCTIONALITY ====================
function initializeModals() {
    console.log('Initializing Modals...');
    
    // Reschedule Modal
    const rescheduleBtn = document.getElementById('btn-reschedule');
    if (rescheduleBtn) {
        rescheduleBtn.addEventListener('click', openRescheduleModal);
        console.log('Reschedule button initialized');
    }
    
    // Cancel Modal
    const cancelBtn = document.getElementById('btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', openCancelModal);
        console.log('Cancel button initialized');
    }
    
    console.log('Modals initialized successfully');
}

// ==================== APPOINTMENT TABLE FUNCTIONALITY ====================
function initializeAppointmentTable() {
    console.log('Initializing Appointment Table...');
    
    const apptTable = document.getElementById('appt-table');
    if (apptTable) {
        apptTable.addEventListener('click', (e) => {
            const tr = e.target.closest('tbody tr');
            if (!tr) return;
            
            // Remove previous selection
            apptTable.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
            // Add selection to clicked row
            tr.classList.add('selected');
        });
        console.log('Appointment table initialized');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function toggleDropdown(dropdown) {
    if (!dropdown) return;
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    
    // Add animation
    if (!isVisible) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
    }
}

function closeDropdown(dropdown) {
    if (!dropdown) return;
    dropdown.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toasts = document.getElementById('toasts');
    if (!toasts) return;
    
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toasts.appendChild(el);
    
    // Add animation
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100%)';
        setTimeout(() => { el.remove(); }, 300);
    }, 3000);
}

// ==================== RESCHEDULE MODAL ====================
function openRescheduleModal() {
    console.log('Opening reschedule modal...');
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="reschedule-modal-overlay">
            <div class="modal" id="reschedule-modal">
                <div class="modal-header">
                    <h3>Reschedule Appointment</h3>
                    <button class="modal-close" id="reschedule-modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="reschedule-date">Select New Date</label>
                        <input type="date" id="reschedule-date" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="reschedule-time">Select New Time</label>
                        <select id="reschedule-time">
                            <option value="">Choose time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reschedule-reason">Reason for Rescheduling</label>
                        <textarea id="reschedule-reason" placeholder="Please provide a reason..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="reschedule-cancel">Cancel</button>
                    <button class="btn btn-primary" id="reschedule-confirm">Confirm Reschedule</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const overlay = document.getElementById('reschedule-modal-overlay');
    const modal = document.getElementById('reschedule-modal');
    const closeBtn = document.getElementById('reschedule-modal-close');
    const cancelBtn = document.getElementById('reschedule-cancel');
    const confirmBtn = document.getElementById('reschedule-confirm');
    
    // Show modal with animation
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
    
    // Event listeners
    function closeModal() {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    confirmBtn.addEventListener('click', () => {
        const date = document.getElementById('reschedule-date').value;
        const time = document.getElementById('reschedule-time').value;
        const reason = document.getElementById('reschedule-reason').value;
        
        if (!date || !time) {
            showToast('Please select both date and time', 'error');
            return;
        }
        
        const formattedDate = new Date(date).toLocaleDateString();
        const formattedTime = time;
        
        // Update appointment in table (find selected row)
        const selectedRow = document.querySelector('#appt-table tbody tr.selected');
        if (selectedRow) {
            selectedRow.children[1].textContent = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            selectedRow.children[2].textContent = formattedTime;
            selectedRow.children[4].innerHTML = '<span class="badge warn">Pending</span>';
        }
        
        showToast(`Appointment Rescheduled to ${formattedDate} at ${formattedTime}`, 'success');
        closeModal();
    });
}

// ==================== CANCEL MODAL ====================
function openCancelModal() {
    console.log('Opening cancel modal...');
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="cancel-modal-overlay">
            <div class="modal" id="cancel-modal">
                <div class="modal-header">
                    <h3>Cancel Appointment</h3>
                    <button class="modal-close" id="cancel-modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="cancel-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Are you sure you want to cancel this appointment?</p>
                        <small>This action cannot be undone.</small>
                    </div>
                    <div class="form-group">
                        <label for="cancel-reason">Reason for Cancellation (Optional)</label>
                        <textarea id="cancel-reason" placeholder="Please provide a reason..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancel-go-back">Go Back</button>
                    <button class="btn btn-danger" id="cancel-confirm">Yes, Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get modal elements
    const overlay = document.getElementById('cancel-modal-overlay');
    const modal = document.getElementById('cancel-modal');
    const closeBtn = document.getElementById('cancel-modal-close');
    const goBackBtn = document.getElementById('cancel-go-back');
    const confirmBtn = document.getElementById('cancel-confirm');
    
    // Show modal with animation
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
    
    // Event listeners
    function closeModal() {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    goBackBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    confirmBtn.addEventListener('click', () => {
        const reason = document.getElementById('cancel-reason').value;
        
        // Update appointment in table (find selected row)
        const selectedRow = document.querySelector('#appt-table tbody tr.selected');
        if (selectedRow) {
            selectedRow.children[4].innerHTML = '<span class="badge danger">Cancelled</span>';
        }
        
        showToast('Appointment Cancelled', 'success');
        closeModal();
    });
}

// ==================== SIDEBAR TOGGLE ====================
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}