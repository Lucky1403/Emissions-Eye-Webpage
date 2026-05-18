function flipCard() {
    let hiddenCards = document.querySelectorAll('.flip-card-hidden');
    hiddenCards.forEach(card => {
        card.style.display = 'block'; // Reveal the hidden cards
    });

    // Hide the parent card
    document.getElementById('parent-card').style.display = 'none';
    
    // Automatically flip the first card
    setTimeout(() => {
        showNextCard('card-one');
    }, 100);
}

function showNextCard(cardId) {
    let nextCard = document.getElementById(cardId);
    if (nextCard) {
        nextCard.style.display = "block"; // Keep previous cards visible
        let innerCard = nextCard.querySelector(".flip-card-inner");
        if (innerCard) {
            innerCard.style.transform = "rotateY(180deg)";
        }
    }
}

async function submitData() {
    const data = {
        vehicle_type: document.getElementById('vehicle-type').value,
        fuel_type: document.getElementById('fuel-type').value, // Petrol, Diesel, CNG, EV
        vehicle_distance: parseFloat(document.getElementById('vehicle-distance').value) || 0,
        public_transport: document.getElementById('public-transport').value, // Bus, Metro, Train
        public_distance: parseFloat(document.getElementById('public-distance').value) || 0,
        flight_type: document.getElementById('flight-type').value, // Short-haul, Long-haul
        flights_taken: parseInt(document.getElementById('flights-taken').value) || 0,
        electricity: parseFloat(document.getElementById('electricity').value) || 0,
        lpg: parseFloat(document.getElementById('lpg').value) || 0,
        natural_gas: parseFloat(document.getElementById('natural-gas').value) || 0,
        clothes: parseInt(document.getElementById('clothes').value) || 0,
        mobile_count: parseInt(document.getElementById('mobile-count').value) || 0,
        laptop_count: parseInt(document.getElementById('laptop-count').value) || 0,
        plastic_waste: parseFloat(document.getElementById('plastic-waste').value) || 0,
        food_waste: parseFloat(document.getElementById('food-waste').value) || 0,
        trees_planted: parseInt(document.getElementById('trees-planted').value) || 0,
        renewable_energy: parseFloat(document.getElementById('renewable-energy').value) || 0
    };

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Your total emissions: ${result.total_emission} kg CO2`);
            window.location.href = "/result";
        } else {
            alert(result.error || "An error occurred while submitting data.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit data. Please try again.");
    }
}

// Ensure cards are hidden initially when the page loads
document.addEventListener("DOMContentLoaded", function() {
    let hiddenCards = document.querySelectorAll('.flip-card-hidden');
    hiddenCards.forEach(card => {
        card.style.display = 'none';
    });
});
