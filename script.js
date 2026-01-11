let students = JSON.parse(localStorage.getItem("students")) || [];

const list = document.getElementById("list");
const total = document.getElementById("total");
const percent = document.getElementById("percent");
const progressBar = document.getElementById("progressBar");
const ctx = document.getElementById("chart").getContext("2d");

function addStudent() {
  if (!studentName.value || !monthSelect.value) return;

  students.push({
    name: studentName.value,
    month: monthSelect.value,
    present: false
  });

  studentName.value = "";
  save();
}

function toggle(i) {
  students[i].present = !students[i].present;
  save();
}

function save() {
  localStorage.setItem("students", JSON.stringify(students));
  render();
}

function render() {
  list.innerHTML = "";
  let f = filterMonth.value;

  students.forEach((s, i) => {
    if (f && s.month !== f) return;

    list.innerHTML += `
      <li>
        ${s.name} (${s.month})
        <button class="${s.present ? "present" : "absent"}"
          onclick="toggle(${i})">
          ${s.present ? "Present" : "Absent"}
        </button>
      </li>`;
  });

  updateStats();
  drawAnalytics();
}

function updateStats() {
  const present = students.filter(s => s.present).length;
  const absent = students.length - present;

  total.innerText = students.length;
  percent.innerText = students.length
    ? Math.round((present / students.length) * 100) + "%"
    : "0%";

  progressBar.style.width = students.length
    ? (present / students.length) * 100 + "%"
    : "0%";
}

/* =========================
   🔥 PROFESSIONAL ANALYTICS
   ========================= */
function drawAnalytics() {
  ctx.clearRect(0, 0, 400, 250);

  const present = students.filter(s => s.present).length;
  const absent = students.length - present;
  const max = Math.max(present, absent, 1);

  // Axis
  ctx.strokeStyle = "#9ca3af";
  ctx.beginPath();
  ctx.moveTo(50, 20);
  ctx.lineTo(50, 220);
  ctx.lineTo(360, 220);
  ctx.stroke();

  // Labels
  ctx.fillStyle = "#374151";
  ctx.font = "14px Segoe UI";
  ctx.fillText("Students", 10, 30);

  // Bars
  animateBar(120, present, max, "#22c55e", "Present");
  animateBar(240, absent, max, "#dc2626", "Absent");
}

function animateBar(x, value, max, color, label) {
  let height = 0;
  const targetHeight = (value / max) * 160;

  function grow() {
    ctx.clearRect(x - 40, 0, 80, 220);

    // Redraw axis
    ctx.strokeStyle = "#9ca3af";
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, 220);
    ctx.lineTo(360, 220);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(x - 20, 220 - height, 40, height);

    // Count
    ctx.fillStyle = "#111827";
    ctx.font = "14px Segoe UI";
    ctx.fillText(value, x - 5, 210 - height);

    // Label
    ctx.fillText(label, x - 22, 240);

    if (height < targetHeight) {
      height += 4;
      requestAnimationFrame(grow);
    }
  }

  grow();
}

/* Navigation */
function showSection(id) {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("analytics").classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
}

/* Dark Mode */
function toggleDark() {
  document.documentElement.classList.toggle("dark");
}

/* Reset */
function resetData() {
  if (confirm("Clear all student data?")) {
    localStorage.removeItem("students");
    students = [];
    render();
  }
}

render();
