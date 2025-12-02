// --- Firebase setup ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- Calendar & Modal elements ---
const calendarContainer = document.getElementById("calendar-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const saveBtn = document.getElementById("save");
const nameSelect = document.getElementById("name");
const availabilitySelect = document.getElementById("availability");

let selectedCell = null;

// --- Calendar data ---
const months = [
    { name: "January 2026", days: 31, startDay: 4 }, // Jan 1, 2026 = Thursday
    { name: "February 2026", days: 28, startDay: 0 }, // Feb 1, 2026 = Sunday
    { name: "March 2026", days: 31, startDay: 0 } // Mar 1, 2026 = Sunday
];

// --- Create the calendar ---
function createCalendar() {
    months.forEach((month) => {
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
        for (let i = 0; i < 6; i++) { // up to 6 weeks
            const row = table.insertRow();
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                if (i === 0 && j < month.startDay) {
                    cell.textContent = "";
                } else if (date <= month.days) {
                    cell.dataset.date = `${month.name} ${date}`;
                    cell.innerHTML = `<div>${date}</div>`; // date number

                    if (month.name === "February 2026" && date === 6) {
                        cell.classList.add("birthday");
                        cell.title = "Alex's Birthday 🎉";
                    }

                    // Click to open modal
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

// --- Update text inside a calendar cell ---
function updateCellText(cell, data) {
    // Remove previous text
    const existingText = cell.querySelector(".cell-text");
    if (existingText) existingText.remove();

    const textDiv = document.createElement("div");
    textDiv.classList.add("cell-text");

    if (!data) {
        cell.appendChild(textDiv);
        return;
    }

    // Special case for Feb 6 birthday
    if (cell.dataset.date === "February 2026 6") {
        textDiv.innerHTML = "🎉 Happy Birthday Alex! 🎉<br>";
    }

    // List all availabilities
    for (const person in data) {
        textDiv.innerHTML += `${person} - ${data[person]}<br>`;
    }

    cell.appendChild(textDiv);
}

// --- Save availability to Firebase ---
saveBtn.onclick = () => {
    if (!selectedCell) return;
    const person = nameSelect.value;
    const avail = availabilitySelect.value;
    const date = selectedCell.dataset.date;

    db.ref("calendar/" + date + "/" + person).set(avail);
    modal.style.display = "none";
    selectedCell = null;
}

// --- Modal close handlers ---
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// --- Initialize calendar ---
createCalendar();

// --- Listen for real-time updates from Firebase ---
months.forEach((month) => {
    for (let d = 1; d <= month.days; d++) {
        const dateStr = `${month.name} ${d}`;
        const cell = document.querySelector(`[data-date='${dateStr}']`);
        db.ref("calendar/" + dateStr).on("value", snapshot => {
            const data = snapshot.val();
            updateCellText(cell, data);
        });
    }
});
