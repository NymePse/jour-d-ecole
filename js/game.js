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
        this.interval = setInterval()
    }
}

function setGame() {
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
}

function getAnswerClicked(this) {}

function getAnswerKeys(event) {}

//Fonctions de gestion des modes de jeu
function journee(exercice, difficulte, chrono) {}

function chemin(exercice, difficulte, chrono) {}

function foot(exercice, difficulte, chrono) {}

function soleil(exercice, difficulte, chrono) {}