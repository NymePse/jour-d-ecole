//Sélecteurs élements Jquery
const choixMode = "#mode";
const choixExo = "#exercice";
const choixDiff = "#difficulte";
const choixChrono = "#chrono";
const bouton = "#jouer";
const jeu =  "#jeu";
const haut = "#haut";
const gauche = "#gauche";
const bas = "#bas";
const droite = "#droite";
const espace = "#espace";

//Fonctions globales
var gameArea = {
    canvas : $(jeu),
    start : function() {
        this.context = this.canvas.getContext("2d");
    }
}

function setGame() {
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
}

function getAnswerClicked(clickedDiv) {}

function getAnswerKeys(event) {}

//Fonctions de gestion des modes de jeu
function journee(exercice, difficulte, chrono) {
    /*
     * Joue tout les modes de jeu
     * dans l'ordre, avec des transitions
     */
}

function chemin(exercice, difficulte, chrono) {
    /*
     * Pas de fin prématurée
     * Chaque obstacle donne la réponse
     * => type d'obstacle force la réponse sur une touche précise
     */
}

function foot(exercice, difficulte, chrono) {
    /*
     * Pas de fin prématurée
     * Se joue en 3 ou 4 parties
     * 1 partie = 3 à 4 obstacles
     * 1 partie peut se terminer prématurément
     */
}

function soleil(exercice, difficulte, chrono) {
    /*
     * 
     */
}