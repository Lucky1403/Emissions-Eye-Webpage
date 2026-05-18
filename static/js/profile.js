
async function loadProfile() {
    try {
        const response = await fetch('/get_profile');
        const data = await response.json();

        if (response.ok) {
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
            document.getElementById('gender').value = data.gender;
            let avatarSrc = '/static/images/default avatar.png';
            if (data.gender && data.gender.toLowerCase() === 'male') {
                avatarSrc = '/static/images/male_avatar.png';
            } else if (data.gender && data.gender.toLowerCase() === 'female') {
                avatarSrc = '/static/images/female_avatar.png';
            }
            document.getElementById('avatar').src = avatarSrc;
            document.getElementById('mobile').value = data.mobile;
            document.getElementById('country').value = data.country;
            document.getElementById('badge').innerText = data.badge;

            if (data.badge_image) {
                const badgeImg = document.getElementById('badge-img');
                badgeImg.src = data.badge_image;
                badgeImg.style.display = 'block';
            }
            
            // Highlight the earned badge in the grid
            if (data.badge_id) {
                const earnedBadge = document.getElementById(data.badge_id);
                if (earnedBadge) {
                    earnedBadge.classList.add('highlight');
                    earnedBadge.innerHTML += '<p style="color: gold; margin-top: 5px;">★ Earned ★</p>';
                }
            }
        } else {
            console.error("Profile load error:", data.error);
        }
    } catch (error) {
        console.error("Failed to load profile:", error);
    }
}
window.onload = loadProfile;

// Badge Overlay Logic
const badgeTrigger = document.getElementById('badge-section-trigger');
const badgeOverlay = document.getElementById('badgeOverlay');
const closeOverlay = document.getElementById('closeOverlay');

if (badgeTrigger && badgeOverlay) {
    badgeTrigger.addEventListener('click', () => {
        badgeOverlay.style.display = 'flex';
    });

    closeOverlay.addEventListener('click', () => {
        badgeOverlay.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === badgeOverlay) {
            badgeOverlay.style.display = 'none';
        }
    });
}
