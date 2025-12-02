const calendarContainer = document.getElementById("calendar-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const saveBtn = document.getElementById("save");
const nameSelect = document.getElementById("name");
const availabilitySelect = document.getElementById("availability");

let selectedDate = null;

// Data for months
const months = [
    { name: "January 2026", days: 31, startDay: 4 }, // Jan 1, 2026 is Thursday
    { name: "February 2026", days: 28, startDay: 0 }, // Feb 1, 2026 is Sunday
    { name: "March 2026", days: 31, startDay: 0 } // Mar 1, 2026 is Sunday
];

const availabilities = {}; // store selections

function createCalendar() {
    months.forEach((month, mIndex) => {
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
        for (let i = 0; i < 6; i++) { // max 6 weeks
            const row = table.insertRow();
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                if (i === 0 && j < month.startDay) {
                    cell.textContent = "";
                } else if (date <= month.days) {
                    cell.textContent = date;
                    cell.dataset.date = `${month.name} ${date}`;
                    if (month.name === "February 2026" && date === 6) {
                        cell.classList.add("birthday");
                        cell.title = "Alex's Birthday 🎉";
                    }

                    // click event
                    cell.addEventListener("click", () => {
                        selectedDate = cell.dataset.date;
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

saveBtn.onclick = () => {
    if (!selectedDate) return;
    const person = nameSelect.value;
    const avail = availabilitySelect.value;

    if (!availabilities[selectedDate]) availabilities[selectedDate] = {};
    availabilities[selectedDate][person] = avail;

    modal.style.display = "none";
    selectedDate = null;

    console.log(availabilities); // replace with display code if desired
}

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
}

createCalendar();
