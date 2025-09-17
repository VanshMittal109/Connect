// Elements
const displayRole = document.getElementById('display-role');
const displayName = document.getElementById('display-name');

// Tabs
const tabs = document.querySelectorAll('.tab');
const panels = () => document.querySelectorAll('#panels .panel');

// Edit/Save
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const infoView = document.getElementById('info-view');
const infoEdit = document.getElementById('info-edit');

// Avatar upload
const avatarInput = document.getElementById('avatar-input');
const avatarImg = document.getElementById('avatar');

// Logout
const logoutBtn = document.getElementById('logout-btn');

// Role switching
displayRole.textContent = 'Member';

// Tabs handling
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.querySelectorAll('#panels .panel').forEach(p => p.classList.remove('active'));
        const toActivate = document.querySelector(`#panels [data-panel="${target}"]`);
        if (toActivate) toActivate.classList.add('active');
    });
});

// Edit / Save logic
editBtn.addEventListener('click', () => {
    infoView.hidden = true;
    infoEdit.hidden = false;
    editBtn.hidden = true;
    saveBtn.hidden = false;
});

saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Persist edited values into view
    document.getElementById('view-email').textContent = document.getElementById('edit-email').value;
    document.getElementById('view-phone').textContent = document.getElementById('edit-phone').value;
    document.getElementById('view-age').textContent = document.getElementById('edit-age').value;
    document.getElementById('view-gender').textContent = document.getElementById('edit-gender').value;
    document.getElementById('view-location').textContent = document.getElementById('edit-location').value;

    infoView.hidden = false;
    infoEdit.hidden = true;
    editBtn.hidden = false;
    saveBtn.hidden = true;
});

// Avatar upload
avatarInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { avatarImg.src = ev.target.result; };
    reader.readAsDataURL(file);
});

// Logout
logoutBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Init
document.getElementById('tab-one').click();


