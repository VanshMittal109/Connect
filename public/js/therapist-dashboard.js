// Sidebar toggle (enhanced)
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('open');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 600 && sidebar && !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Profile dropdown
const profileMenu = document.getElementById('profile-menu');
const profileDropdown = document.getElementById('profile-dropdown');
profileMenu && profileMenu.addEventListener('click', () => {
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
    if (!profileMenu.contains(e.target)) profileDropdown.style.display = 'none';
});

// Notifications
const toasts = document.getElementById('toasts');
function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toasts.appendChild(el);
    setTimeout(() => { el.remove(); }, 3000);
}

document.getElementById('notify-btn')?.addEventListener('click', () => {
    toast('You have 3 new notifications', 'info');
});

// Calendar with proper dates
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const bookedDates = new Set([2, 5, 12, 18, 21, 26]); // Example booked dates

function generateCalendar(month, year) {
    const calendarDates = document.getElementById('calendar-dates');
    const currentMonthSpan = document.getElementById('current-month');
    
    if (!calendarDates || !currentMonthSpan) return;
    
    calendarDates.innerHTML = '';
    currentMonthSpan.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendarDates.appendChild(emptyDiv);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        
        // Mark today
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayDiv.classList.add('today');
        }
        
        // Mark booked dates
        if (bookedDates.has(day)) {
            dayDiv.classList.add('booked');
        }
        
        // Add click event
        dayDiv.addEventListener('click', () => {
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');
            toast(`Selected ${monthNames[month]} ${day}, ${year}`, 'info');
        });
        
        calendarDates.appendChild(dayDiv);
    }
}

// Calendar navigation
document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// Initialize calendar
if (document.getElementById('calendar-dates')) {
    generateCalendar(currentMonth, currentYear);
}

// Modals + Appointment logic
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalAppt = document.getElementById('modal-appointment');
const modalDateTime = document.getElementById('modal-datetime');
const modalDate = document.getElementById('modal-date');
const modalTime = document.getElementById('modal-time');
const scheduleTable = document.getElementById('schedule-table');
let selectedRowId = null;

// populate select from table rows
function refreshAppointmentOptions() {
    if (!modalAppt) return;
    modalAppt.innerHTML = '';
    const rows = scheduleTable.querySelectorAll('tbody tr');
    rows.forEach(r => {
        const id = r.getAttribute('data-id');
        const patient = r.children[0].textContent;
        const time = r.children[1].textContent;
        const therapy = r.children[2].textContent;
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${patient} • ${time} • ${therapy}`;
        modalAppt.appendChild(opt);
    });
    if (selectedRowId) modalAppt.value = selectedRowId;
}
function openModal(title, mode = 'reschedule') {
    document.getElementById('modal-title').textContent = title;
    refreshAppointmentOptions();
    modalDateTime.hidden = mode !== 'reschedule';
    modalOverlay.classList.add('show');
    modal.classList.add('show');
}
function closeModal() {
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');
}
document.getElementById('btn-reschedule')?.addEventListener('click', () => openModal('Reschedule Appointment','reschedule'));
document.getElementById('btn-cancel')?.addEventListener('click', () => openModal('Cancel Appointment','cancel'));
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
document.getElementById('modal-save')?.addEventListener('click', () => {
    const action = modalDateTime.hidden ? 'Cancelled' : 'Rescheduled';
    const apptId = modalAppt.value;
    const reason = document.getElementById('modal-reason').value.trim() || (action === 'Cancelled' ? 'No reason provided' : '');
    if (!apptId) return closeModal();
    // simulate update in table UI
    const row = scheduleTable.querySelector(`tbody tr[data-id="${apptId}"]`);
    if (row) {
        if (action === 'Rescheduled') {
            const t = modalTime.value || row.children[1].textContent;
            row.children[1].textContent = t;
            row.children[3].innerHTML = '<span class="badge warn">Pending</span>';
            toast(`Appointment rescheduled to ${modalDate.value || 'same date'} ${t}`, 'success');
        } else {
            row.children[3].innerHTML = '<span class="badge danger">Cancelled</span>';
            toast('Appointment cancelled' + (reason ? `: ${reason}` : ''), 'error');
        }
    }
    closeModal();
});

// Select row in schedule table
scheduleTable?.addEventListener('click', (e) => {
    const tr = e.target.closest('tbody tr');
    if (!tr) return;
    scheduleTable.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
    tr.classList.add('selected');
    selectedRowId = tr.getAttribute('data-id');
});

// Patients search/filter (demo)
const patientSearch = document.getElementById('patient-search');
const patientsBody = document.getElementById('patients-body');
patientSearch?.addEventListener('input', () => {
    const q = patientSearch.value.toLowerCase();
    Array.from(patientsBody.querySelectorAll('tr')).forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
});

// Chat
const chatHistory = document.getElementById('chat-history');
const chatText = document.getElementById('chat-text');
const chatSend = document.getElementById('chat-send');
const chatList = document.getElementById('chat-list');
function addMsg(text, who = 'me') {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'me' ? 'me' : 'them');
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
chatSend?.addEventListener('click', () => {
    const txt = chatText.value.trim();
    if (!txt) return;
    addMsg(txt, 'me');
    chatText.value = '';
    setTimeout(() => addMsg('Noted. Thank you!', 'them'), 600);
});
document.querySelectorAll('.template').forEach(btn => btn.addEventListener('click', () => {
    addMsg(btn.textContent, 'me');
}));
chatList?.addEventListener('click', (e) => {
    const item = e.target.closest('.chat-item');
    if (!item) return;
    chatList.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    item.classList.add('active');
    chatHistory.innerHTML = '';
    addMsg(`Hello, this is ${item.dataset.user}.`, 'them');
});

// Earnings tabs
document.querySelectorAll('#earning-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('#earning-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const period = tab.dataset.period;
        const summary = document.getElementById('earning-summary');
        summary.textContent = period === 'weekly' ? '₹22,300 this week' : period === 'monthly' ? '₹84,200 this month' : '₹9,80,000 this year';
        toast('Switched to ' + period, 'info');
    });
});

// Resources upload
const upload = document.getElementById('resource-upload');
const resourceList = document.getElementById('resource-list');
upload?.addEventListener('change', () => {
    Array.from(upload.files).forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${file.name}</span><button class="mini">Share</button>`;
        resourceList.appendChild(li);
    });
});
document.getElementById('resource-share')?.addEventListener('click', () => toast('Shared with selected patients', 'success'));

// Therapies accordion
const accordion = document.getElementById('therapy-accordion');
accordion?.addEventListener('click', (e) => {
    const head = e.target.closest('.head');
    if (!head) return;
    accordion.querySelectorAll('.head').forEach(h => h.classList.remove('active'));
    accordion.querySelectorAll('.body').forEach(b => b.classList.remove('open'));
    head.classList.add('active');
    head.nextElementSibling.classList.add('open');
});

// Download invoice
document.getElementById('download-invoice')?.addEventListener('click', () => toast('Invoice downloaded', 'success'));

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

// Enhanced sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Make sure sidebar toggle works
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
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

// Patient management functions
function viewPatient(patientId) {
    toast(`Opening patient profile for ${patientId}`, 'info');
    // Here you would typically navigate to patient details page
    // window.location.href = `patient-details.html?id=${patientId}`;
}

function addNotes(patientId) {
    const notes = prompt(`Add notes for patient ${patientId}:`);
    if (notes && notes.trim()) {
        toast(`Notes added for ${patientId}`, 'success');
        // Here you would save the notes to your backend
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        toast('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
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

