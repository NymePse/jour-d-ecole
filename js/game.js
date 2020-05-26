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

//Fonctions globales
var gameArea = {
    canvas : $(jeu),
    start : function() {
        this.context = $(jeu).getContext("2d");
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
    
    /*
     * Variables :
     * 
     */
    
    /*
     * Déroulement :
     * bloquer bouton Jouer
     * clear canvas
     * binder évenement clavier & click div
     * Afficher texte d'introduction
     * Attendre appuis barre espace
     * 
     * boucle phase de jeu (tant que pas fini) :
     *      Quelques secondes, boucle gif personnage & décors
     *      Créer une question
     *      Créer les réponses
     *      Sélectionner type d'obstacle
     *      mapper les réponses selon l'obstacle dans les touches
     *      Afficher obstacle & question
     * 
     *      attendre réponse ou fin de chrono :
     *        si chrono et chrono pas fini
     *          avancer chrono
     * 
     *      si chrono fini OU mauvaise réponse
     *        afficher défaite obstacle
     *      sinon
     *        afficher réussite obstacle
     *        points++
     *  
     * clear canvas
     * afficher fond de fin
     * afficher texte fin selon résultat
     * afficher score
     * débloquer bouton Jouer
     */
}

function foot(exercice, difficulte, chrono) {
    /*
     * Pas de fin prématurée
     * Se joue en 3 ou 4 parties
     * 1 partie = 3 à 4 obstacles
     * 1 partie peut se terminer prématurément
     * Obstacles placés aléatoirement
     */
}

function soleil(exercice, difficulte, chrono) {
    /*
     * Fin prématurée au bout d'une mauvaise réponse
     * se joue en 4 à 6 obstacles
     * Réponse placée au hasard
     */
}

//TESTS
function tests() {
    $(fleche).bind("click", function() {
        $(jeu).clearCanvas();
        $(jeu).drawText({
            fillStyle: 'black',
            x: 150, y: 100,
            fontSize: 48,
            fontFamily: 'Comic Sans MS, sans-serif',
            text: $(this).text()
        });
    });
}