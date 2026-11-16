
const API_URL = "https://rickandmortyapi.com/api/character";

const container = document.getElementById("characters-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");
const resultsInfo = document.getElementById("results-info");

let currentPage = 1;
let totalPages = 1;
let currentSearch = "";

async function loadCharacters(page = 1, search = "") {
    container.innerHTML = '<p class="loading">Explorando o multiverso...</p>';
    resultsInfo.textContent = "";

    try {
        let url = `${API_URL}?page=${page}`;

        if (search) {
            url += `&name=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Nenhum personagem encontrado.");
        }

        const data = await response.json();

        currentPage = page;
        totalPages = data.info.pages;

        renderCharacters(data.results);

        resultsInfo.textContent =
            `${data.info.count} personagens encontrados no multiverso.`;

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        prevButton.disabled = !data.info.prev;
        nextButton.disabled = !data.info.next;

    } catch (error) {
        container.innerHTML = `
            <p class="error-message">
                ${error.message === "Nenhum personagem encontrado."
                    ? "Nenhum personagem encontrado. Tente outra busca!"
                    : "Não foi possível carregar os personagens. Verifique sua conexão e tente novamente."}
            </p>
        `;

        resultsInfo.textContent = "";
        pageInfo.textContent = "Página 0";
        prevButton.disabled = true;
        nextButton.disabled = true;
    }
}

function renderCharacters(characters) {
    container.innerHTML = "";

    characters.forEach(character => {
        const card = document.createElement("article");
        card.classList.add("character-card");

        const image = document.createElement("img");
        image.src = character.image;
        image.alt = `Imagem de ${character.name}`;
        image.loading = "lazy";

        const info = document.createElement("div");
        info.classList.add("character-info");

        const name = document.createElement("h3");
        name.textContent = character.name;

        const status = document.createElement("span");
        status.classList.add("status");

        if (character.status === "Alive") {
            status.classList.add("alive");
        } else if (character.status === "Dead") {
            status.classList.add("dead");
        }

        const statusText = {
            Alive: "Vivo",
            Dead: "Morto",
            unknown: "Desconhecido"
        };

        status.textContent = statusText[character.status] || character.status;

        const species = document.createElement("p");
        species.textContent = `Espécie: ${character.species}`;

        const origin = document.createElement("p");
        origin.textContent = `Origem: ${character.origin.name}`;

        const location = document.createElement("p");
        location.textContent = `Localização: ${character.location.name}`;

        info.appendChild(name);
        info.appendChild(status);
        info.appendChild(species);
        info.appendChild(origin);
        info.appendChild(location);

        card.appendChild(image);
        card.appendChild(info);

        container.appendChild(card);
    });
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();

    currentSearch = searchInput.value.trim();
    loadCharacters(1, currentSearch);
});

prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        loadCharacters(currentPage - 1, currentSearch);
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        loadCharacters(currentPage + 1, currentSearch);
    }
});

loadCharacters();
