//Sélecteurs élements Jquery
const choixMode = "#mode";
const choixExo = "#exercice";
const choixDiff = "#difficulte";
const choixChrono = "#chrono";
const bouton = "#jouer";
const jeu =  "#jeu";
const fleche = ".fleche";
const haut = "#haut";
const gauche = "#gauche";
const bas = "#bas";
const droite = "#droite";
const espace = "#espace";

function setUpSite() {
    $(bouton).click(setUpGame());
}

function setUpGame() {
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
}

//Fonctions de gestion des modes de jeu
function journee(exercice, difficulte, chrono) {
    /*
     * Joue tout les modes de jeu
     * dans l'ordre, avec des transitions
     */
}

function reponseBonne(key) {
    //Réponse choisie
    let reponseChoisie;
    switch(key) {
        case 37:
            reponseChoisie = $(gauche).text();
            break;
        
        case 38:
            reponseChoisie = $(haut).text();
            break;
            
        case 39:
            reponseChoisie = $(droite).text();
            break;
            
        case 40:
            reponseChoisie = $(bas).text();
            break;
    }
    
    if(reponseChoisie.localeCompare(localStorage.getItem('reponse')) == 0)
        return true;
    else
        return false;
}