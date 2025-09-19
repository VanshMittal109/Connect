document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const therapyList = document.querySelector('.therapy-list');
    const addTherapyBtn = document.getElementById('addTherapy');
    const therapyForm = document.getElementById('therapyForm');
    const resetBtn = document.getElementById('resetBtn');
    const therapyTemplate = document.getElementById('therapyTemplate');
    
    // Therapy counter
    let therapyCount = 0;
    
    // Event Listeners
    addTherapyBtn.addEventListener('click', addTherapyBlock);
    therapyList.addEventListener('click', handleTherapyListClick);
    therapyForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    
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
            <input type="number" class="form-control gap-duration" min="1" required>
            <span> gap duration before next therapy</span>
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
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            userId: document.getElementById('userSelect').value,
            sessionMode: document.querySelector('input[name="sessionMode"]:checked').value,
            notes: document.getElementById('notes').value,
            therapies: []
        };
        
        // Get therapy data
        const therapyCards = document.querySelectorAll('.therapy-card');
        let isValid = true;
        
        therapyCards.forEach((card) => {
            const therapyType = card.querySelector('.therapy-type')?.value;
            const duration = card.querySelector('.therapy-duration')?.value;
            const gapDuration = card.querySelector('.gap-duration')?.value;
            
            // Validate therapy type
            if (!therapyType) {
                isValid = false;
                card.querySelector('.therapy-type')?.classList.add('error');
            } else {
                card.querySelector('.therapy-type')?.classList.remove('error');
            }
            
            formData.therapies.push({
                therapyType,
                duration: parseInt(duration, 10) || 30,
                gapAfter: gapDuration ? parseInt(gapDuration, 10) : null
            });
        });
        
        // Validate form
        if (!formData.userId) {
            isValid = false;
            document.getElementById('userSelect').classList.add('error');
            showToast('Please select a user', 'error');
        } else {
            document.getElementById('userSelect').classList.remove('error');
        }
        
        if (therapyCards.length === 0) {
            isValid = false;
            showToast('Please add at least one therapy', 'error');
        }
        
        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Log form data (in a real app, you would send this to a server)
        console.log('Form submitted:', formData);
        
        // Show success message
        showToast('Therapy session scheduled successfully!', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            resetForm();
        }, 1500);
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
});
