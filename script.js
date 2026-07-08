const API_KEY = "0c043cfd49ab94d4de6e977e59cb1e01";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genre");
const yearSelect = document.getElementById("year");
const sortSelect = document.getElementById("sort");
const clearBtn = document.getElementById("clearBtn");
const loader = document.getElementById("loader");

const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

async function loadGenres() {
    const res = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );

    const data = await res.json();

    data.genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function loadYears() {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1980; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

async function fetchMovies(url) {

    loader.style.display = "block";

    try {

        const res = await fetch(url);
        const data = await res.json();

        displayMovies(data.results);

    } catch (error) {

        moviesContainer.innerHTML =
            "<h2>Failed to load movies</h2>";
    }

    loader.style.display = "none";
}

function displayMovies(movies) {

    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesContainer.innerHTML = "<h2>No movies found</h2>";
        return;
    }

    movies.forEach(movie => {

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image";

        const year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "N/A";

        const overview = movie.overview
            ? movie.overview.slice(0, 100) + "..."
            : "No description available.";

        movieEl.innerHTML = `
            <img src="${poster}" alt="${movie.title}">

            <div class="movie-info">

                <h3>${movie.title}</h3>

                <p>${year}</p>

                <p>${overview}</p>

                <span class="rating">
                    ⭐ ${movie.vote_average.toFixed(1)}
                </span>

            </div>
        `;

        movieEl.addEventListener("click", () => showMovieDetails(movie));

        moviesContainer.appendChild(movieEl);
    });
}

function showMovieDetails(movie) {

    const poster = movie.poster_path
        ? IMG_URL + movie.poster_path
        : "https://via.placeholder.com/500x750?text=No+Image";

    modalBody.innerHTML = `
        <div class="modal-body">

            <img src="${poster}" alt="${movie.title}">

            <div class="details">

                <h2>${movie.title}</h2>

                <p><strong>Release:</strong> ${movie.release_date || "N/A"}</p>

                <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)}</p>

                <p><strong>Language:</strong> ${movie.original_language.toUpperCase()}</p>

                <p>${movie.overview || "No overview available."}</p>

            </div>

        </div>
    `;

    modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

searchInput.addEventListener("input", () => {

    const query = searchInput.value.trim();

    if (query === "") {
        applyFilters();
        return;
    }

    fetchMovies(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
});

genreSelect.addEventListener("change", applyFilters);
yearSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

function applyFilters() {

    const genre = genreSelect.value;
    const year = yearSelect.value;
    const sort = sortSelect.value;

    let url =
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`;

    if (genre) {
        url += `&with_genres=${genre}`;
    }

    if (year) {
        url += `&primary_release_year=${year}`;
    }

    fetchMovies(url);
}

clearBtn.addEventListener("click", () => {

    searchInput.value = "";
    genreSelect.value = "";
    yearSelect.value = "";
    sortSelect.value = "popularity.desc";

    loadTrendingMovies();
});

function loadTrendingMovies() {

    fetchMovies(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
}

loadGenres();
loadYears();
loadTrendingMovies();