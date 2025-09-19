// Patient form validation and handling
const patientForm = document.getElementById("patient-form");
const toastContainer = document.getElementById("toast-container");
const patientTableBody = document.querySelector("#patientTable tbody");
let editRow = null;

// Toast message
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Validation functions
function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}
function validateContact(contact) {
  return /^\d{10}$/.test(contact);
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Error display
function setError(id, message) {
  document.getElementById(id).textContent = message;
}

// Reset errors
function resetErrors() {
  ["nameError", "genderError", "contactError", "emailError"].forEach((id) =>
    setError(id, "")
  );
}

// Modal controls
const modal = document.getElementById("success-modal");
const overlay = document.getElementById("modal-overlay");
const closeModal = () => {
  modal.classList.remove("show");
  overlay.classList.remove("show");
};
document.getElementById("close-modal").addEventListener("click", closeModal);
document.getElementById("modal-ok").addEventListener("click", closeModal);

// Form submit
patientForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  resetErrors();

  const fields = {
    name: document.getElementById("name"),
    gender: document.getElementById("gender"),
    contact: document.getElementById("contact"),
    email: document.getElementById("email"),
    join: document.getElementById("join"),
    dob: document.getElementById("dob"),
  };

  let valid = true;
  if (!validateName(fields.name.value)) {
    setError("nameError", "Name should contain only letters and spaces.");
    valid = false;
  }
  if (!fields.gender.value) {
    setError("genderError", "Please select a gender.");
    valid = false;
  }
  if (!validateContact(fields.contact.value)) {
    setError("contactError", "Contact must be exactly 10 digits.");
    valid = false;
  }
  if (!validateEmail(fields.email.value)) {
    setError("emailError", "Invalid email format.");
    valid = false;
  }

  if (!valid) return;

  const row = editRow || patientTableBody.insertRow();
  row.innerHTML = `
    <td>#P-${Math.floor(Math.random() * 1000)}</td>
    <td>${fields.name.value}</td>
    <td>${fields.gender.value}</td>
    <td>${fields.contact.value}</td>
    <td>${fields.email.value}</td>
    <td>${fields.join.value}</td>
    <td>${fields.dob.value}</td>
    <td>
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    </td>
  `;

  // Save patient (fake backend call)
  try {
    await fetch("http://localhost:3001/api/auth/patients", {
      method: editRow ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fields.name.value,
        gender: fields.gender.value,
        contact: fields.contact.value,
        email: fields.email.value,
        joiningDate: fields.join.value,
        dob: fields.dob.value,
      }),
    });
    modal.classList.add("show");
    overlay.classList.add("show");
  } catch (error) {
    console.error("Error saving patient:", error);
    showToast("Error saving patient!", "error");
  }

  patientForm.reset();
  editRow = null;
});

// Table edit/delete
patientTableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (e.target.classList.contains("delete-btn")) {
    row.remove();
    showToast("Patient deleted successfully!", "success");
  }
  if (e.target.classList.contains("edit-btn")) {
    const tds = row.querySelectorAll("td");
    document.getElementById("name").value = tds[1].textContent;
    document.getElementById("gender").value = tds[2].textContent;
    document.getElementById("contact").value = tds[3].textContent;
    document.getElementById("email").value = tds[4].textContent;
    document.getElementById("join").value = tds[5].textContent;
    document.getElementById("dob").value = tds[6].textContent;
    editRow = row;
  }
});

// Reset button
document.getElementById("reset-btn").addEventListener("click", () => {
  patientForm.reset();
  resetErrors();
  showToast("Form reset successfully!", "success");
});
