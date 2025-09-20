document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const therapyList = document.querySelector('.therapy-list');
    const addTherapyBtn = document.getElementById('addTherapy');
    const therapyForm = document.getElementById('therapyForm');
    const resetBtn = document.getElementById('resetBtn');
    const therapyTemplate = document.getElementById('therapyTemplate');
    
    // Therapy counter
    let therapyCount = 0;
    
    // Store fetched therapies
    let therapiesData = [];

    // Event Listeners
    addTherapyBtn.addEventListener('click', addTherapyBlock);
    therapyList.addEventListener('click', handleTherapyListClick);
    therapyForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    
    // Fetch therapies from backend and store
    async function fetchTherapies() {
        try {
            const res = await fetch('/api/auth/therapies');
            therapiesData = await res.json();
        } catch (err) {
            showToast('Failed to fetch therapies', 'error');
        }
    }

    // Fetch user list for dropdown
    async function fetchUserList() {
        try {
            const res = await fetch('/api/auth/user-list');
            const users = await res.json();
            const userSelect = document.getElementById('userSelect');
            userSelect.innerHTML = '<option value="" disabled selected>Choose a user...</option>';
            users.forEach(u => {
                const option = document.createElement('option');
                option.value = u.id;
                option.textContent = u.name;
                userSelect.appendChild(option);
            });
        } catch (err) {
            showToast('Failed to fetch user list', 'error');
        }
    }

    // Populate therapy dropdown for a given select element
    function populateTherapyDropdown(selectEl) {
        selectEl.innerHTML = '<option value="" disabled selected>Select therapy type...</option>';
        therapiesData.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.name;
            selectEl.appendChild(option);
        });
    }

    // Fetch duration for a therapy and set it in the input
    async function setTherapyDuration(therapyId, durationInput) {
        if (!therapyId) return;
        try {
            const res = await fetch(`/api/auth/therapy-duration/${therapyId}`);
            const data = await res.json();
            if (data.duration_days) {
                durationInput.value = data.duration_days;
            }
        } catch (err) {
            showToast('Failed to fetch duration', 'error');
        }
    }

    // Add a new therapy block
    function addTherapyBlock() {
        therapyCount++;
        const clone = document.importNode(therapyTemplate.content, true);
        const therapyCard = clone.querySelector('.therapy-card');

        // Set therapy number
        const therapyNumber = therapyCard.querySelector('.therapy-number');
        if (therapyNumber) {
            therapyNumber.textContent = therapyCount;
        }

        // Add data attribute to track this block
        therapyCard.dataset.index = therapyCount;

        // Populate therapy dropdown
        const therapyTypeSelect = therapyCard.querySelector('.therapy-type');
        if (therapyTypeSelect) {
            populateTherapyDropdown(therapyTypeSelect);
            // Add change event to fetch duration
            const durationInput = therapyCard.querySelector('.therapy-duration');
            therapyTypeSelect.addEventListener('change', function() {
                setTherapyDuration(this.value, durationInput);
            });
        }

        // Append the new therapy card to the list
        therapyList.appendChild(therapyCard);

        // Scroll to the new therapy card
        therapyCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Handle clicks within the therapy list
    function handleTherapyListClick(e) {
        // Handle remove therapy button click
        if (e.target.closest('.remove-therapy')) {
            e.preventDefault();
            const therapyCard = e.target.closest('.therapy-card');
            if (therapyCard) {
                // Add fade out animation
                therapyCard.style.opacity = '0';
                therapyCard.style.transform = 'translateY(-10px)';
                
                // Remove after animation completes
                setTimeout(() => {
                    therapyCard.remove();
                    updateTherapyNumbers();
                }, 200);
            }
        }
        
        // Handle add gap button click
        if (e.target.closest('.add-gap')) {
            e.preventDefault();
            const therapyCard = e.target.closest('.therapy-card');
            if (therapyCard) {
                const gapArea = therapyCard.querySelector('.gap-area');
                if (gapArea && !gapArea.querySelector('.gap-row')) {
                    addGapInput(gapArea);
                }
            }
        }
        
        // Handle remove gap button click
        if (e.target.closest('.remove-gap')) {
            e.preventDefault();
            const gapRow = e.target.closest('.gap-row');
            if (gapRow) {
                gapRow.style.opacity = '0';
                gapRow.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    gapRow.remove();
                }, 200);
            }
        }
    }
    
    // Add gap input to a therapy card
    function addGapInput(gapArea) {
        const gapRow = document.createElement('div');
        gapRow.className = 'gap-row';
        gapRow.innerHTML = `
            <input type="number" class="form-control gap-duration" default="0" required>
            <span> gap durationn before next therapy</span>
            <button type="button" class="btn-icon remove-gap" title="Remove gap">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        gapArea.appendChild(gapRow);
    }
    
    // Update therapy numbers when a therapy is removed
    function updateTherapyNumbers() {
        const therapyCards = document.querySelectorAll('.therapy-card');
        therapyCount = therapyCards.length;
        
        therapyCards.forEach((card, index) => {
            const number = card.querySelector('.therapy-number');
            if (number) {
                number.textContent = index + 1;
            }
            card.dataset.index = index + 1;
        });
    }
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        // Get form data
        const patient_id = document.getElementById('userSelect').value;
        const therapist_id = 23;
        const therapyCards = document.querySelectorAll('.therapy-card');
        const therapies = [];
        therapyCards.forEach((card) => {
            const therapyType = card.querySelector('.therapy-type')?.value;
            const duration = parseInt(card.querySelector('.therapy-duration')?.value, 10) || 0;
            const gapDuration = parseInt(card.querySelector('.gap-duration')?.value, 10) || 0;
            if (!therapyType) return;
            therapies.push({
                therapy_id: therapyType, // therapyType is the id from dropdown
                duration_days: duration + gapDuration,
                gap_days: gapDuration
            });
        });
        if (!patient_id || therapies.length === 0) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        // Send to backend
        try {
            const res = await fetch('/api/auth/therapy-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id, therapist_id, therapies })
            });
            const result = await res.json();
            if (res.ok) {
                showToast('Therapy plans saved!', 'success');
                setTimeout(() => { resetForm(); }, 1500);
            } else {
                showToast(result.error || 'Failed to save plans', 'error');
            }
        } catch (err) {
            showToast('Network error', 'error');
        }
    }
    
    // Reset form
    function resetForm() {
        // Clear all therapy cards
        therapyList.innerHTML = '';
        
        // Reset counter
        therapyCount = 0;
        
        // Reset form fields
        therapyForm.reset();
        
        // Remove error classes
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        // Create toast if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set toast content and style
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Initial fetch of therapies and user list on page load
    fetchTherapies();
    fetchUserList();
});
