const Url = "http://localhost:8000/api/v1/titles/";

window.addEventListener('load', () => {
    BestNoteMovie();
    GetCategories("Crime")
    GetCategories("Comedy")
    GetCategories("Action")
});

function BestNoteMovie() {
    let bestMovieTitle = document.getElementById('top-title');
    let bestImg = document.getElementsByClassName('bestcontent-image')[0].getElementsByTagName("img")[0];
    let bestDesc = document.getElementsByClassName('best-description')[0];
    let bestButton = document.getElementsByClassName('button')[1];
    console.log(bestButton)

    fetch(Url + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            bestMovieTitle.innerHTML = data["results"][0]["title"];
            bestImg.src = data["results"][0]["image_url"];
            bestButton.setAttribute("onclick", `openModal("${data["results"][0]["id"]}")`)
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
function openModal(id) {
    var modal = document.getElementById("myModal");
    fetch(Url + id)
        .then(response => response.json())
        .then(data => {

            document.getElementById('modal-cover').src = data["image_url"];
            document.getElementById('modal-title').innerHTML = "title : " +data["title"];
            // document.getElementById('modal-description').innerHTML = "description : " + data["description"];
            document.getElementById('modal-genres').innerHTML = "genres : " +data["genres"];
            document.getElementById('modal-Release Date').innerHTML = "date_published : " +data["date_published"];
            document.getElementById('modal-rating').innerHTML = "rated : " +data["rated"];
            document.getElementById('modal-imdb').innerHTML = "imdb_score : " +data["imdb_score"] + " / 10";
            document.getElementById('modal-directors').innerHTML = "directors : " +data["directors"];
            document.getElementById('modal-cast').innerHTML = "actors : " +data["actors"] + "...";
            document.getElementById('modal-duration').innerHTML = "duration: " +data["duration"] + " min";
            document.getElementById('modal-country').innerHTML = "countries : " +data["countries"];
            document.getElementById('modal-box-office').innerHTML = "worldwide_gross_income : " +data["worldwide_gross_income"];
            document.getElementById('modal-desc').innerHTML = "long_description : " +data["long_description"];
    modal.style.display = "block";
})
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}
async function GetCategories(name) {

    const ResultsCategories = await fetch(Url + "?sort_by=-imdb_score&genre=" + name);
    let total = 7;
    if (!ResultsCategories.ok)
        return
    const data = await ResultsCategories.json();
    let moviesData = Array(...data.results);
       if (moviesData.length < total) {
        let ResultsCategories2 = await (await fetch(data.next)).json();
        moviesData.push(...Array(...ResultsCategories2.results).slice(0, total - moviesData.length));
    }
    console.log(moviesData);
    return moviesData;
}
