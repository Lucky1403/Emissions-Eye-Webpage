function flipCard() {
    let hiddenCards = document.querySelectorAll('.flip-card-hidden');
    hiddenCards.forEach(card => {
        card.style.display = 'flex'; // Reveal the hidden cards
    });

    // Hide the parent card
    document.getElementById('parent-card').style.display = 'none';

    // Optionally, hide the Start button after clicking
    document.getElementById('start-button').style.display = 'none';
}

// Ensure cards are hidden initially when the page loads
document.addEventListener("DOMContentLoaded", function() {
    let hiddenCards = document.querySelectorAll('.flip-card-hidden');
    hiddenCards.forEach(card => {
        card.style.display = 'none';
    });
});

function showNextCard(nextCardId) {
    let nextCard = document.getElementById(nextCardId);
    if (nextCard) {
        nextCard.style.display = "block"; // Keep previous cards visible
        let innerCard = nextCard.querySelector(".flip-card-inner");
        if (innerCard) {
            innerCard.style.transform = "rotateY(180deg)";
        }
    }
}

function submitData() {
    alert("Your data has been submitted!");
}





