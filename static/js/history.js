async function loadHistory() {
    try {
        const response = await fetch('/get_history');
        const data = await response.json();
        
        const msgEl = document.getElementById('history-msg');
        const chartEl = document.getElementById('emissionChart');

        if (!response.ok) {
            msgEl.innerText = data.error;
            chartEl.style.display = 'none';
            return;
        }

        msgEl.innerText = '';
        chartEl.style.display = 'block';

        // Extract date (X-axis) and total emissions (Y-axis)
        const labels = data.map(entry => entry.date);
        const values = data.map(entry => entry.total);

        // Select the canvas element
        const ctx = chartEl.getContext('2d');

    // Create the Chart.js line graph
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // X-axis: Dates
            datasets: [{
                label: 'Total Carbon Emissions (kg CO2)',
                data: values,
                borderColor: '#00b09b',
                backgroundColor: 'rgba(0, 176, 155, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#96c93d',
                pointBorderColor: '#fff',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Your Carbon Emission History'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Date' },
                    ticks: { autoSkip: true, maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: 'Emissions (kg CO2)' }
                }
            }
        }
    });
    } catch (error) {
        console.error("Error loading history:", error);
        document.getElementById('history-msg').innerText = "Failed to load history.";
    }
}

window.onload = loadHistory;