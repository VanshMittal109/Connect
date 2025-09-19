document.getElementById("addTherapyBtn").addEventListener("click", function() {
  const container = document.getElementById("therapyContainer");
  const div = document.createElement("div");
  div.classList.add("therapy-block");

  div.innerHTML = `
    <label>Select Therapy</label>
    <select>
      <option>Choose therapy...</option>
      <option>Cognitive Therapy</option>
      <option>Physical Therapy</option>
      <option>Speech Therapy</option>
    </select>
    <label>Duration (minutes)</label>
    <input type="number" placeholder="Enter duration">
  `;

  container.appendChild(div);
});

document.getElementById("addGapBtn").addEventListener("click", function() {
  const container = document.getElementById("gapContainer");
  const div = document.createElement("div");
  div.classList.add("gap-block");

  div.innerHTML = `
    <label>Gap Duration (minutes)</label>
    <input type="number" placeholder="Enter gap duration">
  `;

  container.appendChild(div);
});
