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
