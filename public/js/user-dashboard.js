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

// Toasts
const toasts = document.getElementById('toasts');
function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toasts.appendChild(el);
    setTimeout(() => { el.remove(); }, 3000);
}
document.getElementById('notify-btn')?.addEventListener('click', () => {
    toast('You have 4 new notifications', 'info');
});

// Calendar (simple)
const calendar = document.getElementById('calendar');
if (calendar) {
    const daysInMonth = 30;
    const booked = new Set([18, 21, 26]);
    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement('div');
        div.className = 'day' + (booked.has(d) ? ' booked' : '');
        div.textContent = d;
        calendar.appendChild(div);
    }
}

// Modal logic & appointments wiring
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalAppt = document.getElementById('modal-appointment');
const modalDateTime = document.getElementById('modal-datetime');
const modalDate = document.getElementById('modal-date');
const modalTime = document.getElementById('modal-time');
const apptTable = document.getElementById('appt-table');
let selectedRowId = null;

function refreshAppointmentOptions() {
    if (!modalAppt || !apptTable) return;
    modalAppt.innerHTML = '';
    const rows = apptTable.querySelectorAll('tbody tr');
    rows.forEach(r => {
        const id = r.getAttribute('data-id');
        const therapy = r.children[0].textContent;
        const date = r.children[1].textContent;
        const time = r.children[2].textContent;
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${therapy} • ${date} • ${time}`;
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
    const row = apptTable.querySelector(`tbody tr[data-id="${apptId}"]`);
    if (row) {
        if (action === 'Rescheduled') {
            const t = modalTime.value || row.children[2].textContent;
            row.children[2].textContent = t;
            row.children[4].innerHTML = '<span class="badge warn">Pending</span>';
            toast(`Appointment rescheduled to ${modalDate.value || 'same date'} ${t}`, 'success');
        } else {
            row.children[4].innerHTML = '<span class="badge danger">Cancelled</span>';
            toast('Appointment cancelled' + (reason ? `: ${reason}` : ''), 'error');
        }
    }
    closeModal();
});

// Select row in appointments table
apptTable?.addEventListener('click', (e) => {
    const tr = e.target.closest('tbody tr');
    if (!tr) return;
    apptTable.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
    tr.classList.add('selected');
    selectedRowId = tr.getAttribute('data-id');
});

// Therapies accordion (allow only one open)
const accordion = document.getElementById('therapy-accordion');
accordion?.addEventListener('click', (e) => {
    const head = e.target.closest('.head');
    if (!head) return;
    accordion.querySelectorAll('.head').forEach(h => h.classList.remove('active'));
    accordion.querySelectorAll('.body').forEach(b => b.classList.remove('open'));
    head.classList.add('active');
    head.nextElementSibling.classList.add('open');
});

// Progress animation on load
document.querySelectorAll('.progress .bar').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.transition = 'width .8s ease'; bar.style.width = width; }, 50);
});

// Download actions
document.getElementById('download-report')?.addEventListener('click', () => toast('Health report downloaded', 'success'));
document.getElementById('download-invoices')?.addEventListener('click', () => toast('Invoices downloaded', 'success'));

// Feedback stars and submit
const starWrap = document.getElementById('star-rating');
const reviewText = document.getElementById('review-text');
const pastReviews = document.getElementById('past-reviews');
let currentRating = 0;
starWrap?.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const val = +btn.dataset.val;
    starWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    starWrap.querySelectorAll('button').forEach(b => { if (+b.dataset.val <= val) b.classList.add('active'); });
});
starWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    currentRating = +btn.dataset.val;
});
starWrap?.addEventListener('mouseleave', () => {
    starWrap.querySelectorAll('button').forEach(b => b.classList.toggle('active', +b.dataset.val <= currentRating));
});
document.getElementById('submit-review')?.addEventListener('click', () => {
    if (!currentRating) return toast('Please select a star rating', 'error');
    const text = (reviewText.value || '').trim();
    const stars = '⭐'.repeat(currentRating) + '★'.repeat(5-currentRating);
    const now = new Date();
    const date = now.toLocaleString('en-GB', { day:'2-digit', month:'short' });
    const li = document.createElement('li');
    li.innerHTML = `<span class="stars">${'⭐'.repeat(currentRating)}</span> ${text || 'No comments.'} — Vansh (${date})`;
    pastReviews.prepend(li);
    reviewText.value = '';
    currentRating = 0;
    starWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    toast('Thanks for your feedback!', 'success');
});

// Settings save
document.getElementById('save-settings')?.addEventListener('click', () => toast('Settings saved', 'success'));


