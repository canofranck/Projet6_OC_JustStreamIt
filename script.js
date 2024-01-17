const Url = "http://localhost:8000/api/v1/titles/";

window.addEventListener('load', () => {
    BestNoteMovie();
// Ajoutez un gestionnaire d'événements pour le bouton "More Info"
    let bestButton = document.getElementsByClassName('button')[1];
    bestButton.addEventListener('click', () => {
       // Chargez les données au moment du clic
       fetch(Url + "?sort_by=-imdb_score")
       .then(response => response.json())
       .then(data => {
           // Obtenez les informations les plus récentes et ouvrez le modal
            title = data["results"][0]["title"];
            fetch(data["results"][0]["url"])
            .then(response => response.json())
            .then(data => {
                description = data["description"];
                openModal(title, description);
       });
});
});
});

function BestNoteMovie() {
    let bestMovieTitle = document.getElementById('top-title');
    let bestImg = document.getElementsByClassName('bestcontent-image')[0].getElementsByTagName("img")[0];
    let bestDesc = document.getElementsByClassName('best-description')[0];
    let bestButton = document.getElementsByClassName('button')[1];

    fetch(Url + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            bestMovieTitle.innerHTML = data["results"][0]["title"];
            bestImg.src = data["results"][0]["image_url"];

            fetch(data["results"][0]["url"])
                .then(response => response.json())
                .then(data => {
                    bestDesc.innerHTML = data["description"];
                   
                });
        });

    let bestNoteMovieimg = document.getElementsByClassName('bestnote-image')[0].getElementsByTagName("img")[0];
    let bestNoteMovieimg2 = document.getElementsByClassName('bestnote2-image')[0].getElementsByTagName("img")[0];

    fetch(Url + "?sort_by=-imdb_score&genre=")
        .then(response => response.json())
        .then(data => {
            bestNoteMovieimg.src = data["results"][1]["image_url"];
            bestNoteMovieimg2.src = data["results"][2]["image_url"];
        });

  
    
}

// Fonctions du modal
function openModal(modalTitleText, modalDescriptionText) {
    var modal = document.getElementById("myModal");
    var modalTitle = document.getElementById("modal-title");
    var modalDescription = document.getElementById("modal-description");
    console.log("Données du film :", modalTitleText, modalDescriptionText);
    modalTitle.textContent = modalTitleText;
    modalDescription.innerHTML = "description : " + modalDescriptionText;
    
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}
