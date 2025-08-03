document.getElementById('fitness-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const distance = document.getElementById('distance').value;
    const time = document.getElementById('time').value;

    const caloriesBurnt = calculateCalories(distance, time);
    document.getElementById('calories-burnt').innerText = `Calories Burnt: ${caloriesBurnt} kcal`;

    const date = new Date().toLocaleDateString();
    saveTrackRecord(date, distance, time, caloriesBurnt);

    updateTrackRecordTable();
    updateMedals();
    updateStreaks();
});

function calculateCalories(distance, time) {
    // Simple formula for calories burnt, can be adjusted as needed
    return (distance * 50) + (time * 0.1);
}

function saveTrackRecord(date, distance, time, caloriesBurnt) {
    let records = JSON.parse(localStorage.getItem('trackRecords')) || [];
    // Check if the record for the current date already exists
    const existingRecordIndex = records.findIndex(record => record.date === date);
    if (existingRecordIndex !== -1) {
        // Update the existing record
        records[existingRecordIndex] = { date, distance, time, caloriesBurnt };
    } else {
        // Add a new record
        records.push({ date, distance, time, caloriesBurnt });
    }
    localStorage.setItem('trackRecords', JSON.stringify(records));
}

function updateTrackRecordTable() {
    const records = JSON.parse(localStorage.getItem('trackRecords')) || [];
    const tbody = document.querySelector('#track-record-table tbody');
    tbody.innerHTML = ''; // Clear the table before adding new records

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.distance}</td>
            <td>${record.time}</td>
            <td>${record.caloriesBurnt}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateMedals() {
    const records = JSON.parse(localStorage.getItem('trackRecords')) || [];
    const streakDays = records.length; // Assuming each record represents a unique day
    let bronze = 0, silver = 0, gold = 0;

    if (streakDays >= 365) {
        gold = Math.floor(streakDays / 365);
        streakDays %= 365;
    }
    if (streakDays >= 30) {
        silver = Math.floor(streakDays / 30);
        streakDays %= 30;
    }
    if (streakDays >= 7) {
        bronze = Math.floor(streakDays / 7);
    }

    document.getElementById('bronze-medals').innerText = bronze;
    document.getElementById('silver-medals').innerText = silver;
    document.getElementById('gold-medals').innerText = gold;
}

function updateStreaks() {
    const records = JSON.parse(localStorage.getItem('trackRecords')) || [];
    const streaks = calculateStreaks(records);

    document.getElementById('current-streak').innerText = streaks.currentStreak;
    document.getElementById('longest-streak').innerText = streaks.longestStreak;
}

function calculateStreaks(records) {
    if (records.length === 0) return { currentStreak: 0, longestStreak: 0 };

    records.sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < records.length; i++) {
        const prevDate = new Date(records[i - 1].date);
        const currDate = new Date(records[i].date);
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }

    return { currentStreak, longestStreak };
}

// Load existing track records and medals on page load
document.addEventListener('DOMContentLoaded', function() {
    updateTrackRecordTable();
    updateMedals();
    updateStreaks();
});
