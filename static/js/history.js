async function loadHistory() {
    const response = await fetch('/get_history');
    const data = await response.json();
    
    if (!response.ok) {
        alert(data.error);
        return;
    }

    // Extract date (X-axis) and total emissions (Y-axis)
    const labels = data.map(entry => entry.date);
    const values = data.map(entry => entry.total);

    // Select the canvas element
    const ctx = document.getElementById('emissionChart').getContext('2d');

    // Create the Chart.js line graph
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // X-axis: Dates
            datasets: [{
                label: 'Total Carbon Emissions (kg CO2)',
                data: values, // Y-axis: Total emissions
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                tension: 0.3
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
}

window.onload = loadHistory;