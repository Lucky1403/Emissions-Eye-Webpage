function flipCard() {
    // Hide the main card
    let mainCard = document.querySelector(".flip-card-main");
    if (mainCard) {
        mainCard.style.display = "none";
    }

    // Show the child container
    let flipCardChild = document.getElementById("flip-card-child");
    if (flipCardChild) {
        flipCardChild.classList.remove("hidden");
    }

    // Show all hidden cards inside
    document.querySelectorAll(".flip-card-hidden").forEach(card => {
        card.style.display = "flex"; // Make them visible
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let currentCardIndex = 0;
    const cards = document.querySelectorAll(".flip-card-hidden");
    const nextButtons = document.querySelectorAll(".finalbuttons");

    // Function to flip the next card
    function flipNextCard() {
        if (currentCardIndex < cards.length - 1) {
            cards[currentCardIndex].classList.add("flipped"); // Mark as flipped
            currentCardIndex++;
            cards[currentCardIndex].style.display = "block"; // Show next card
        }
    }

    // Attach event listeners to buttons
    nextButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            flipNextCard();
        });
    });
});



