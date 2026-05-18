async function loadDashboard() {
    try {
        const response = await fetch('/get_dashboard_data');
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('total-emissions').innerText = data.total_emissions + " kg CO2";
            document.getElementById('last-emission').innerText = data.last_emission + " kg CO2";
            document.getElementById('total-calculations').innerText = data.total_calculations;
            
            if (data.notify_calc_due) {
                document.getElementById('notification-banner').style.display = 'flex';
            }
        } else {
            console.error("Failed to load dashboard data:", data.error);
            document.getElementById('total-emissions').innerText = "N/A";
            document.getElementById('last-emission').innerText = "N/A";
            document.getElementById('total-calculations').innerText = "N/A";
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }
}

window.onload = loadDashboard;
