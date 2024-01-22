/* jshint esversion: 9 */
const Url = "http://localhost:8000/api/v1/titles/";
let total;
window.addEventListener('load', () => {
    BestNoteMovie();
    CarrouselCategory("");
   
        });
 
        
function BestNoteMovie() {
    let bestMovieTitle = document.getElementById('top-title');
    let bestImg = document.getElementsByClassName('bestcontent-image')[0].getElementsByTagName("img")[0];
    let bestDesc = document.getElementsByClassName('best-description')[0];
    let bestButton = document.getElementsByClassName('button')[0];
    
    fetch(Url + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            bestMovieTitle.innerHTML = data.results[0].title;
            bestImg.src = data.results[0].image_url;
            bestButton.setAttribute("onclick", `openModal("${data.results[0].id}")`);
            fetch(data.results[0].url)
                .then(response => response.json())
                .then(data => {
                    bestDesc.innerHTML = data.description;
                   
                });
        });
 
}

// Fonctions du modal
function openModal(id) {
    var modal = document.getElementById("myModal");
    var closemodal = document.getElementsByClassName("close")[0];
    fetch(Url + id)
        .then(response => response.json())
        .then(data => {

            document.getElementById('modal-cover').onerror = function() {
                // En cas d'erreur de chargement de l'image, définir l'image par défaut
                this.src = "images/no_image.jpg";
            };
            document.getElementById('modal-cover').src = data.image_url;
            document.getElementById('modal-title').innerHTML = data.title;
            document.getElementById('modal-genres').innerHTML = data.genres;
            document.getElementById('modal-Release Date').innerHTML = data.date_published;
            document.getElementById('modal-rating').innerHTML = data.rated;
            document.getElementById('modal-imdb').innerHTML = data.imdb_score + " / 10";
            document.getElementById('modal-directors').innerHTML = data.directors;
            document.getElementById('modal-cast').innerHTML = data.actors;
            document.getElementById('modal-duration').innerHTML = data.duration + " min";
            document.getElementById('modal-country').innerHTML = data.countries;
            let modalBoxOffice = document.getElementById('modal-box-office');
            if (data.worldwide_gross_income == null) {
                modalBoxOffice.innerHTML = "N/A";
            } else  {
                modalBoxOffice.innerHTML = data.worldwide_gross_income + " " + data.budget_currency;
            }
            let modalDesc = document.getElementById('modal-desc');
            if (data.long_description == null) {
                modalDesc.innerHTML = "N/A";
            } else {
                modalDesc.innerHTML = data.long_description;
            }
    modal.style.display = "block";
    closemodal.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal)
            modal.style.display = "none";
    };
});
        
}

async function GetCategories(name) {
    const ResultsCategories = await fetch(Url + "?sort_by=-imdb_score&genre=" + name);
    

    if (name === "") {
        total = 8;
    } else {
        total = 7;
    }

    if (!ResultsCategories.ok)
        return;

    const data = await ResultsCategories.json();
    let moviesData = Array(...data.results);

    if (moviesData.length < total) {
        try {
            let ResultsCategories2 = await (await fetch(data.next)).json();
            moviesData.push(...Array(...ResultsCategories2.results).slice(0, total - moviesData.length));
            console.log("Avant modification :", moviesData);
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }
    }

    // Parcourir moviesData et gérer les erreurs d'image
    moviesData = await Promise.all(moviesData.map(async movie => {
        try {
            const response = await fetch(movie.image_url);
            if (!response.ok) {
                throw new Error("Image not found");
            }
            return {
                ...movie,
                image_url: movie.image_url,
            };
        } catch (error) {
            console.error("Erreur lors du chargement de l'image :", error.message);
            return {
                ...movie,
                image_url: "images/no_image.jpg", // Remplacer par l'image de remplacement en cas d'erreur
            };
        }
    }));
    console.log("APRES modification :", moviesData);

    return moviesData;
}



async function CarrouselCategory(category) {

    let categoryName = category;
    let DisplayCategoryName = category;
    
    if (category == ""){
        category = "Best";
    }
    category = category.charAt(0).toUpperCase() + category.slice(1);

    const section = document.createElement("section");
    section.classList.add("categories");

    const carrousel = document.createElement('div');
    carrousel.classList.add('container');

    const categoryTitle = document.createElement('h2');
    categoryTitle.innerHTML = `${category} movies`;
    
    carrousel.append(categoryTitle);

    const carrouselContainer = document.createElement('div');
    carrouselContainer.classList.add('carrousel-container','centered');

    const carrouselContent = document.createElement('div');
    carrouselContent.classList.add('carrousel-content');
    carrouselContent.setAttribute("id", `${DisplayCategoryName}-movies`);
    carrouselContent.style.left = "75px"; 
    document.querySelector('.carrousels').appendChild(section);

    const movies = await  GetCategories(categoryName);

    let i = 0;
    for (const movie of movies) {
        const box = document.createElement('div');
        box.classList.add("box",'centered');
        box.setAttribute("id", `${categoryName}${i + 1}`);

        const movieCover = document.createElement("img");
        movieCover.setAttribute("alt", movie.title);
        console.log("titre" + movie.title +"  url" + movie.image_url)
        movieCover.src = movie.image_url;
        box.appendChild(movieCover);

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const movieTitle = document.createElement("p");
        movieTitle.classList.add('centered-movie-title');
        movieTitle.innerHTML = movie.title;
        overlay.appendChild(movieTitle);

        const modalButton = document.createElement("button");
        modalButton.classList.add("overlay-button");
        modalButton.setAttribute("onclick", `openModal("${movie.id}")`);
        modalButton.innerHTML = "More Info";
        overlay.appendChild(modalButton);

        box.appendChild(overlay);
        carrouselContent.appendChild(box);

        i++;
    }

    
    const controls = document.createElement("div");
    controls.classList.add("controls");
    console.log(movies.length);
    console.log(total);
    

    if (movies.length >= total) {
        const leftButton = createControlButton('left', '❮', `CarrouselRight("${DisplayCategoryName}")`, DisplayCategoryName);
        const rightButton = createControlButton('right', '❯', `CarrouselLeft("${DisplayCategoryName}")`, DisplayCategoryName);
        controls.appendChild(leftButton);
        controls.appendChild(rightButton);
        
    }
    carrouselContainer.appendChild(carrouselContent);
    carrouselContainer.appendChild(controls);
    carrousel.appendChild(carrouselContainer);
    section.appendChild(carrousel);
    
}
// carrousel controls

function CarrouselLeft(category) {
    let carrouselContent = document.querySelector("#" + category + "-movies");

    // Obtenir la largeur d'une boîte dans le carrousel
    let boxWidth = carrouselContent.querySelector(".box").offsetWidth+31;
    
    // nombre d'images à déplacer
    let imagesToMove = 1;

    // Déplace le carrousel vers la droite
    if (parseInt(carrouselContent.style.left) - (boxWidth * imagesToMove) >= -740) {
    {carrouselContent.style.left = (parseInt(carrouselContent.style.left) - (boxWidth * imagesToMove)) + "px";
    }
}
}


    function CarrouselRight(category) {
        let carrouselContent = document.querySelector("#" + category + "-movies");
    
        // Obtenir la largeur d'une boîte dans le carrousel
        let boxWidth = carrouselContent.querySelector(".box").offsetWidth+31;
    
        // nombre d'images à déplacer
        let imagesToMove = -1;
    
        // Déplace le carrousel vers la gauche
        if (parseInt(carrouselContent.style.left) - (boxWidth * imagesToMove) <= 75){
        carrouselContent.style.left = (parseInt(carrouselContent.style.left) - (boxWidth * imagesToMove)) + "px";
        }
    }

    function createControlButton(type, label, onclickFunction, category) {
        const button = document.createElement('button');
        button.classList.add('btn', type,'show');
        button.setAttribute('aria-label', `${category} slide ${type}`);
        button.setAttribute('id', `${category}-${type}`);
        button.setAttribute('onclick', onclickFunction);
        button.innerHTML = label;
        return button;
    }
   
