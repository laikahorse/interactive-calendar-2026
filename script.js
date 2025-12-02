const calendarContainer = document.getElementById("calendar-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const saveBtn = document.getElementById("save");
const nameSelect = document.getElementById("name");
const availabilitySelect = document.getElementById("availability");

let selectedCell = null;

// Data for months
const months = [
    { name: "January 2026", days: 31, startDay: 4 }, // Jan 1, 2026 = Thursday
    { name: "February 2026", days: 28, startDay: 0 }, // Feb 1, 2026 = Sunday
    { name: "March 2026", days: 31, startDay: 0 } // Mar 1, 2026 = Sunday
];

const availabilities = {}; // stores {date: {person: availability}}

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
        for (let i = 0; i < 6; i++) {
            const row = table.insertRow();
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                if (i === 0 && j < month.startDay) {
                    cell.textContent = "";
                } else if (date <= month.days) {
                    cell.dataset.date = `${month.name} ${date}`;
                    cell.innerHTML = `<div>${date}</div><div class="bubbles"></div>`;
                    
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

function updateBubbles(cell) {
    const date = cell.dataset.date;
    const bubbleContainer = cell.querySelector(".bubbles");
    bubbleContainer.innerHTML = "";

    if (!availabilities[date]) return;

    for (const person in availabilities[date]) {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble", person);
        bubble.title = `${person}: ${availabilities[date][person]}`;
        bubbleContainer.appendChild(bubble);
    }
}

saveBtn.onclick = () => {
    if (!selectedCell) return;
    const person = nameSelect.value;
    const avail = availabilitySelect.value;
    const date = selectedCell.dataset.date;

    if (!availabilities[date]) availabilities[date] = {};
    availabilities[date][person] = avail;

    updateBubbles(selectedCell);

    modal.style.display = "none";
    selectedCell = null;
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

createCalendar();
