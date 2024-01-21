let repositoriesData = [];
let currentPage = 1;
const repositoriesPerPage = 10;

async function fetchAllRepositories(username) {
    const url = `${API_URL}${username}/repos?per_page=100`;

    document.getElementById('loader').style.display = 'block';

    try {
        let allRepositories = [];
        let page = 1;

        // Fetch user information
        const userResponse = await fetch(`${API_URL}${username}`);
        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error(`User not found: ${username}`);
            } else {
                throw new Error(`Error fetching user information. Status: ${userResponse.status}`);
            }
        }

        const userData = await userResponse.json();

        // Update user information
        const header = document.getElementById('user-header');
        header.innerHTML = `
            <img src="${userData.avatar_url}" alt="${username}'s Profile Image" class="profile-image">
            <div class="about">
                <h1>${username}</h1>
                <p class="bio">${userData.bio || 'No bio available'}</p>
                <p class="location">Location: ${userData.location || 'Not specified'}</p>
                <p class="link"><a href="${userData.html_url}" target="_blank">GitHub Profile</a></p>
            </div>`;

        while (true) {
            const response = await fetch(`${url}&page=${page}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch repositories for ${username}. Status: ${response.status}`);
            }

            const repositories = await response.json();

            if (repositories.length === 0) {
                break; 
            }

            allRepositories = allRepositories.concat(repositories);
            page++;
        }

        repositoriesData = allRepositories;

        currentPage = 1;

        displayRepositories(currentPage);
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

function displayRepositories(page) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';

    const startIndex = (page - 1) * repositoriesPerPage;
    const endIndex = startIndex + repositoriesPerPage;
    const currentRepositories = repositoriesData.slice(startIndex, endIndex);

    currentRepositories.forEach(repository => {
        const repoHtml = `<div class="repository">
                            <h3>${repository.name}</h3>
                            <div>
                                <p>${repository.description || 'No description available'}</p>
                            </div>
                            <div>
                                <p class="lang"><span>${repository.language || 'Not specified'}</span></p>
                                <div><p>Topics: ${repository.topics ? repository.topics.join(', ') : 'No topics available'}</p></div>
                            </div>
                         </div>`;
        repositoriesContainer.innerHTML += repoHtml;
    });

    const totalPages = Math.ceil(repositoriesData.length / repositoriesPerPage);
   

    const pageNumbersContainer = document.getElementById('pageNumbers');
    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    pageNumbersContainer.innerHTML = '';
    pageNumbers.forEach(pageNumber => {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = pageNumber;
        pageBtn.addEventListener('click', () => goToPage(pageNumber));
        pageNumbersContainer.appendChild(pageBtn);
    });
}


function getPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayRepositories(currentPage);
    }
}

function getNextPage() {
    const totalPages = Math.ceil(repositoriesData.length / repositoriesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayRepositories(currentPage);
    }
}

function jumpToPreviousPage() {
    if (currentPage > 1) {
        currentPage -= 1; 
        displayRepositories(currentPage);
    }
}

document.getElementById('jumpPrevBtn').addEventListener('click', jumpToPreviousPage);