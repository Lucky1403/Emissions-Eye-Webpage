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

function showNextCard(nextCardId) {
    let currentCard = document.querySelector(".flip-card-hidden:not([style*='display: none'])");
    if (currentCard) {
        currentCard.style.display = "none";
    }

    let nextCard = document.getElementById(nextCardId);
    if (nextCard) {
        nextCard.style.display = "block";
        let innerCard = nextCard.querySelector(".flip-card-inner");
        if (innerCard) {
            innerCard.style.transform = "rotateY(180deg)";
        }
    }
}

function submitData() {
    alert("Your data has been submitted!");
}




