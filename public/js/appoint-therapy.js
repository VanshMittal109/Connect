document.addEventListener('DOMContentLoaded', function() {
    // --- Therapy Options Fetching ---
    let therapyOptions = [];
    const addTherapyBtn = document.getElementById('addTherapyBtn');
    const therapyList = document.getElementById('therapyList');
    addTherapyBtn.disabled = true;
    async function fetchTherapyOptions() {
        try {
            const response = await fetch('/api/auth/therapies');
            if (!response.ok) throw new Error('Failed to fetch therapies');
            const data = await response.json();
            // Match backend fields: id, name
            therapyOptions = data.map(opt => ({ value: opt.id, label: opt.name }));
            if (therapyOptions.length > 0) {
                addTherapyBtn.disabled = false;
            } else {
                addTherapyBtn.disabled = true;
            }
            console.log('Therapy options:', therapyOptions);
        } catch (err) {
            therapyOptions = [];
            addTherapyBtn.disabled = true;
            console.error('Error fetching therapies:', err);
        }
    }
    fetchTherapyOptions();

    // --- Therapy Row Creation ---
    let therapyIndex = 0;
    function createTherapyRow(therapy) {
        const row = document.createElement('div');
        row.className = 'therapy-row form-row';

        // Therapy name
        const therapyGroup = document.createElement('div');
        therapyGroup.className = 'form-group';
        const therapyLabel = document.createElement('label');
        therapyLabel.textContent = 'Therapy';
        const therapyInput = document.createElement('input');
        therapyInput.type = 'text';
        therapyInput.className = 'form-control therapy-name';
        therapyInput.readOnly = true;
        therapyInput.value = therapy.label;
        therapyGroup.appendChild(therapyLabel);
        therapyGroup.appendChild(therapyInput);

        // Duration
        const durationGroup = document.createElement('div');
        durationGroup.className = 'form-group';
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Duration';
        const durationInput = document.createElement('input');
        durationInput.type = 'text';
        durationInput.className = 'form-control therapy-duration';
        durationInput.readOnly = true;
        durationGroup.appendChild(durationLabel);
        durationGroup.appendChild(durationInput);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => row.remove();

        // Layout
        row.appendChild(therapyGroup);
        row.appendChild(durationGroup);
        row.appendChild(removeBtn);

        // Fetch duration from backend
        fetch(`/api/auth/therapy-duration/${therapy.value}`)
            .then(res => res.json())
            .then(data => {
                durationInput.value = data.duration_days !== undefined ? data.duration_days : '';
            })
            .catch(() => { durationInput.value = ''; });

        return row;
    }

    // --- Add Therapy Button and Visibility ---
    addTherapyBtn.addEventListener('click', function() {
        if (therapyOptions.length === 0) return;
        // Add next therapy in the list, loop if needed
        const therapy = therapyOptions[therapyIndex % therapyOptions.length];
        therapyList.appendChild(createTherapyRow(therapy));
        therapyIndex++;
    });

    // --- Form Reset ---
    const resetBtn = document.getElementById('resetBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    resetBtn.addEventListener('click', function() {
        appointmentForm.reset();
        therapyList.innerHTML = '';
        datePicker.clear();
        timePicker.clear();
    });

    // --- Form Submission ---
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Prepare variables for DB insertion
        const therapyPlanRows = [];
        let sequenceOrder = 1;
        let gapDays = 0;

        Array.from(therapyList.querySelectorAll('.therapy-row')).forEach(row => {
            // Check if this is a therapy input (has .therapy-name)
            const therapyInput = row.querySelector('.therapy-name');
            const durationInput = row.querySelector('.therapy-duration');
            if (therapyInput && durationInput) {
                // Therapy row
                const therapyName = therapyInput.value;
                const durationDays = parseInt(durationInput.value) || 0;
                // You would fetch therapy_id from your DB using therapyName
                therapyPlanRows.push({
                    therapy_plan_id: null, // to be set by DB
                    patient_id: document.getElementById('userSelect').value,
                    therapist_id: null, // set as needed
                    therapy_id: null, // set as needed
                    start_date: document.getElementById('appointmentDate').value,
                    end_date: '', // calculate as needed
                    status: 'scheduled',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    sequence_order: sequenceOrder,
                    duration_days: durationDays,
                    gap_days: gapDays,
                    preferred_time: document.getElementById('appointmentTime').value
                });
                sequenceOrder++;
            } else if (durationInput) {
                // Gap row (no therapy name)
                gapDays = parseInt(durationInput.value) || 0;
            }
        });

        // You can now send therapyPlanRows to your backend for DB insertion
        console.log('Therapy Plan Rows:', therapyPlanRows);
        showToast('Therapy session successfully appointed!');
        setTimeout(() => {
            appointmentForm.reset();
            therapyList.innerHTML = '';
            datePicker.clear();
            timePicker.clear();
        }, 2000);
    });

    // --- Toast Notification ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.message');
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Sidebar and Mobile Menu Logic ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && !e.target.closest('.sidebar') && !e.target.closest('#sidebar-toggle')) {
            sidebar.classList.remove('active');
        }
    });
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        let therapyIndex = 0;
        addTherapyBtn.addEventListener('click', function() {
            if (therapyOptions.length === 0) return;
            // Add next therapy in the list, loop if needed
            const therapy = therapyOptions[therapyIndex % therapyOptions.length];
            therapyList.appendChild(createTherapyRow(therapy));
            therapyIndex++;
        });
