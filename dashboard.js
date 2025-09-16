// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle && sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
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

// Calendar (simple)
const calendar = document.getElementById('calendar');
if (calendar) {
    const daysInMonth = 30;
    const booked = new Set([2, 5, 12, 18, 21, 26]);
    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement('div');
        div.className = 'day' + (booked.has(d) ? ' booked' : '');
        div.textContent = d;
        calendar.appendChild(div);
    }
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


