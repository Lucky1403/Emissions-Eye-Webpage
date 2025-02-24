document.getElementById("avatarSelect").addEventListener("change", function () {
    document.getElementById("avatar").src = this.value;
});

async function loadProfile() {
    const response = await fetch('/get_profile');
    const data = await response.json();

    if (response.ok) {
        document.getElementById('name').innerText = data.name;
        document.getElementById('email').innerText = data.email;
        document.getElementById('mobile').innerText = data.mobile;
    } else {
        alert(data.error);
    }
}
window.onload = loadProfile;
