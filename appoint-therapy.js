document.addEventListener('DOMContentLoaded', function() {
    // Initialize flatpickr for date and time pickers
    const datePicker = flatpickr("#appointmentDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true
    });

    const timePicker = flatpickr("#appointmentTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        minTime: "09:00",
        maxTime: "20:00",
        minuteIncrement: 15,
        disableMobile: true
    });

    // Therapy type descriptions
    const therapyDescriptions = {
        'cognitive': 'Cognitive Behavioral Therapy (CBT) helps identify and change negative thought patterns and behaviors that may be causing difficulties in your life.',
        'mindfulness': 'Mindfulness Meditation focuses on being present in the moment and developing a non-judgmental awareness of thoughts and feelings.',
        'stress': 'Stress Management therapy provides techniques and strategies to help you cope with stress and improve your overall well-being.',
        'anxiety': 'Anxiety Relief therapy helps identify triggers and develop coping mechanisms to manage anxiety symptoms effectively.',
        'depression': 'Depression Counseling offers support and strategies to help manage symptoms of depression and improve mood and motivation.',
        'couples': 'Couples Therapy helps improve communication, resolve conflicts, and strengthen relationships between partners.'
    };

    // Show therapy description when therapy type is selected
    const therapyTypeSelect = document.getElementById('therapyType');
    const therapyDescription = document.getElementById('therapyDescription');

    therapyTypeSelect.addEventListener('change', function() {
        const selectedTherapy = this.value;
        if (selectedTherapy && therapyDescriptions[selectedTherapy]) {
            therapyDescription.textContent = therapyDescriptions[selectedTherapy];
            therapyDescription.style.display = 'block';
        } else {
            therapyDescription.style.display = 'none';
        }
    });

    // Reset form
    const resetBtn = document.getElementById('resetBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    
    resetBtn.addEventListener('click', function() {
        appointmentForm.reset();
        therapyDescription.style.display = 'none';
        datePicker.clear();
        timePicker.clear();
    });

    // Form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            user: document.getElementById('userSelect').value,
            therapyType: therapyTypeSelect.options[therapyTypeSelect.selectedIndex].text,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            duration: document.querySelector('input[name="duration"]:checked').value,
            mode: document.querySelector('input[name="mode"]:checked').value,
            notes: document.getElementById('notes').value
        };
        
        // In a real app, you would send this data to a server
        console.log('Appointment data:', formData);
        
        // Show success message
        showToast('Therapy session successfully appointed!');
        
        // Reset form after submission
        setTimeout(() => {
            appointmentForm.reset();
            therapyDescription.style.display = 'none';
            datePicker.clear();
            timePicker.clear();
        }, 2000);
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.message');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Mobile menu toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && !e.target.closest('.sidebar') && !e.target.closest('#sidebar-toggle')) {
            sidebar.classList.remove('active');
        }
    });

    // Prevent form submission on Enter key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});
