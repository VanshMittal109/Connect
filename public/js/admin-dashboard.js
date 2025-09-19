// Accordion toggle
document.querySelectorAll('.accordion .head').forEach(head => {
    head.addEventListener('click', () => {
        const item = head.parentElement;
        item.classList.toggle('active');
    });
});

// Therapist Table Actions
function addTherapist() {
    const name = document.getElementById('therapistName').value;
    const email = document.getElementById('therapistEmail').value;
    if (!name || !email) return alert('Please fill name & email');

    const table = document.getElementById('therapistTable').querySelector('tbody');
    const newRow = table.insertRow();
    const id = table.rows.length;

    newRow.innerHTML = `<td>${id}</td><td>${name}</td><td>${email}</td>
    <td class="table-actions">
        <button class="btn-edit" onclick="editTherapist(this)">Edit</button>
        <button class="btn-delete" onclick="deleteTherapist(this)">Delete</button>
    </td>`;
    document.getElementById('therapistName').value = '';
    document.getElementById('therapistEmail').value = '';
}

function editTherapist(btn) {
    const row = btn.closest('tr');
    const name = prompt('Edit Name:', row.cells[1].innerText);
    const email = prompt('Edit Email:', row.cells[2].innerText);
    if (name) row.cells[1].innerText = name;
    if (email) row.cells[2].innerText = email;
}

function deleteTherapist(btn) {
    if (confirm('Are you sure to delete this therapist?')) {
        btn.closest('tr').remove();
    }
}

// Admin Table Actions
function addAdmin() {
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    if (!name || !email) return alert('Please fill name & email');

    const table = document.getElementById('adminTable').querySelector('tbody');
    const newRow = table.insertRow();
    const id = table.rows.length;

    newRow.innerHTML = `<td>${id}</td><td>${name}</td><td>${email}</td>`;
    document.getElementById('adminName').value = '';
    document.getElementById('adminEmail').value = '';
}
