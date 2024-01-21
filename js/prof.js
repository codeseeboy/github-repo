
const API_URL = 'https://api.github.com/users/';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('username-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        fetchUserAndRepositories(username);
    });
});

async function fetchUserAndRepositories(username) {
    try {
        const userResponse = await fetch(`${API_URL}${username}`);

        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error(`User not found: ${username}`);
            } else {
                throw new Error(`Error fetching user information. Status: ${userResponse.status}`);
            }
        }

        const userData = await userResponse.json();

        const header = document.getElementById('user-header');
        header.innerHTML = `
            <img src="${userData.avatar_url}" alt="${username}'s Profile Image" class="profile-image">
            <div class="about">
                <h1>${username}</h1>
                <p class="bio">${userData.bio || 'No bio available'}</p>
                <p class="location">Location: ${userData.location || 'Not specified'}</p>
                <p class="link"><a href="${userData.html_url}" target="_blank">GitHub Profile</a></p>
                <p class="link"><a href="https://twitter.com/${userData.twitter_username}" target="_blank"  class="twitter-link">Twitter Profile</a>
                </p>
                <p>
       <a href="#" style="color: white;" id="home" class="home-link">HOME</a></p>
            </div>
        `;

        document.getElementById('home').addEventListener('click', function (e) {
            e.preventDefault();
            window.location.reload();
        });

        fetchRepositories(username);
    } catch (error) {
        console.error('Error fetching user information:', error.message);
    }
}
