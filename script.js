const calendarContainer = document.getElementById("calendar-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const saveBtn = document.getElementById("save");
const nameSelect = document.getElementById("name");
const availabilitySelect = document.getElementById("availability");

let selectedCell = null;

// Google Sheets Web App URL
const SHEET_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

// Store availability locally
const availabilities = {};

// Calendar months
const months = [
    { name: "January 2026", days: 31, startDay: 4 },
    { name: "February 2026", days: 28, startDay: 0 },
    { name: "March 2026", days: 31, startDay: 0 }
];

// --- Create calendar ---
function createCalendar() {
    months.forEach(month => {
        const monthDiv = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = month.name;
        monthDiv.appendChild(title);

        const table = document.createElement("table");
        const header = table.insertRow();
        ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(day => {
            const th = document.createElement("th");
            th.textContent = day;
            header.appendChild(th);
        });

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = table.insertRow();
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                if (i === 0 && j < month.startDay) {
                    cell.textContent = "";
                } else if (date <= month.days) {
                    cell.dataset.date = `${month.name} ${date}`;
                    cell.innerHTML = `<div>${date}</div>`;

                    if (month.name === "February 2026" && date === 6) {
                        cell.classList.add("birthday");
                        cell.title = "Alex's Birthday 🎉";
                    }

                    cell.addEventListener("click", () => {
                        selectedCell = cell;
                        modal.style.display = "block";
                    });

                    date++;
                }
            }
        }

        monthDiv.appendChild(table);
        calendarContainer.appendChild(monthDiv);
    });
}

// --- Update cell text ---
function updateCellText(cell) {
    const existingText = cell.querySelector(".cell-text");
    if (existingText) existingText.remove();

    const textDiv = document.createElement("div");
    textDiv.classList.add("cell-text");

    const date = cell.dataset.date;
    const data = availabilities[date];

    if (!data) {
        cell.appendChild(textDiv);
        return;
    }

    // Special case for Feb 6 birthday
    if (date === "February 2026 6") {
        textDiv.innerHTML = "🎉 Happy Birthday Alex! 🎉<br>";
    }

    for (const person in data) {
        if (data[person]) {
            textDiv.innerHTML += `${person} - ${data[person]}<br>`;
        }
    }

    cell.appendChild(textDiv);
}

// --- Load data from Google Sheets ---
async function loadData() {
    try {
        const res = await fetch(SHEET_URL);
        const data = await res.json();
        data.forEach(row => {
            availabilities[row.date] = {
                Linda: row.Linda,
                Sandy: row.Sandy,
                Laika: row.Laika,
                Alex: row.Alex
            };
            const cell = document.querySelector(`[data-date='${row.date}']`);
            if (cell) updateCellText(cell);
        });
    } catch (err) {
        console.error("Error loading data from sheet:", err);
    }
}

// --- Save data to Google Sheets ---
async function saveData(date, name, availability) {
    try {
        await fetch(SHEET_URL, {
            method: "POST",
            body: JSON.stringify({ date, name, availability }),
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("Error saving data to sheet:", err);
    }
}

// --- Modal save button ---
saveBtn.onclick = async () => {
    if (!selectedCell) return;

    const date = selectedCell.dataset.date;
    const name = nameSelect.value;
    const availability = availabilitySelect.value;

    if (!availabilities[date]) availabilities[date] = {};
    availabilities[date][name] = availability;

    updateCellText(selectedCell);
    modal.style.display = "none";
    selectedCell = null;

    await saveData(date, name, availability);
};

// --- Modal close ---
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; }

// --- Initialize ---
createCalendar();
loadData();
