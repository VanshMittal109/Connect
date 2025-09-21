document.addEventListener('DOMContentLoaded', function () {
  const userDetailsForm = document.getElementById('userDetailsForm');
  const timeSlotForm = document.getElementById('timeSlotForm');
  const userDetailsSection = document.getElementById('userDetailsSection');
  const timeSlotSection = document.getElementById('timeSlotSection');
  const backButton = document.getElementById('backButton');

  // Handle User Details Form
  userDetailsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;

    if (!email || !name || !contact || !dob || !gender) {
      alert('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const contactRegex = /^\d+$/;
    if (!contactRegex.test(contact)) {
      alert('Contact number should contain only digits.');
      return;
    }

    localStorage.setItem('userData', JSON.stringify({ email, name, contact, dob, gender }));

    // Switch to time slot section
    userDetailsSection.classList.add('hidden');
    timeSlotSection.classList.remove('hidden');

    // Set minimum date = today
    const appointmentDate = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
  });

  // Handle Time Slot Form
  timeSlotForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const description = document.getElementById('description').value.trim();

    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }

    localStorage.setItem('appointmentData', JSON.stringify({
      date,
      time,
      description,
      user: JSON.parse(localStorage.getItem('userData')) || {}
    }));

    alert('Appointment booked successfully!');
    window.location.href = 'dashboard.html';
  });

  // Back button    
  backButton.addEventListener('click', function () {
    timeSlotSection.classList.add('hidden');
    userDetailsSection.classList.remove('hidden');
  });
});
