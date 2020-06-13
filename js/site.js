//Sélecteurs élements Jquery
const choixLongueur = "#longueur";
const choixExo = "#exercice";
const choixDiff = "#difficulte";
const choixChrono = "#chrono";
const bouton = "#jouer";
const jeu =  "#jeu";
const classfleche = ".fleche";
const haut = "#haut";
const gauche = "#gauche";
const bas = "#bas";
const droite = "#droite";
const fleches = [haut, gauche, bas, droite];
const espace = "#espace";

//Variables localStorage (sauvegarde d'urgence)
const LS_enPartie = "enPartie"
const LS_versEnnemie = "versEnnemie";
const LS_nbPhases = "nbPhases";
const LS_indexPhase = "indexPhase";
const LS_scoreAmi = "scoreAmi";
const LS_scoreEnnemie = "scoreEnnemie";
const LS_miTemps = "miTemps";
const LS_typeExercice = "typeExercice";
const LS_difficulte = "difficulte";
const LS_chrono = "chrono";

//Variables de compte
const LS_nom = "nom";
const LS_nbVictoires = "nbVictoires";
const LS_nbButs = "nbButs";
const LS_nbBonnesReponses = "nbBonnesReponses";

//Valeurs chrono en millisecondes
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Variables chrono
var idInterval = Array();
var chronoFin;
var chronoActuel;

//Variables parties
var enPartie;
var versEnnemie;
var nbPhases;
var tailleTerrain;
var indexPhase;
var indexTerrain;
var miTemps;
var scoreAmi;
var scoreEnnemie;
var typeExercice;
var difficulte;
var chrono;
var question;
var bonneReponse;
var reponses = Array();
var obstacle;
var obstaclesFaits = Array();

//Nombre phases et taille terrain selon longueur partie
var phasesCourte = 9;
var phasesLongue = 15;
var tailleCourte = 4;
var tailleLongue = 6;

//Liste questions déjà faites dans la partie
var additionsFaites = Array();
var soustractionsFaites = Array();
var multiplicationsFaites = Array();
var divisionsFaites = Array();

//Var chemins vers images
var imgFoot = "res/foot/";
var icones = "res/icones/";

//TODO
function setUpSite() {
    //TODO
    /*
     * reset chrono
     * récup LS_enPartie
     * si == true
     *   proposer reprendre partie (afficher toutes info)
     *   events reprendre partie
     */
    
    /* EVENTS
        $(jeu).clearCanvas().drawText({
            fillStyle: 'black',
            x: $(jeu).width() /2, y: 100,
            fontSize: 20,
            text: 'Reprise de partie en mode '+ txt
        });
        
        $(document).keypress(function() {
            $(espace).off("click");
            $(document).off("keypress");
            fct();
        });
    */
}

function majNom(val) {
    localStorage.setItem(nom, val);
}

//TODO
function setUpGame() {
    //TODO
    /*
     * reset chrono
     * récupérer les choix
     * lancer partie
     */
    
    //Reset info partie
    stopChrono();
    resetEventsPartie();
    viderListesQuestions();
    viderVariablesParties();
    
    //Récupérer valeurs choisies
    let longueur = $(choixLongueur + " :selected").val();
    typeExercice = $(choixExo + " :selected").val();
    difficulte = $(choixDiff + " :selected").val();
    chrono = $(choixChrono + " :selected").val();
    
    //set partie selon taille voulue
    switch(longueur) {
        case "courte":
            nbPhases = phasesCourte;
            tailleTerrain = tailleCourte;
            break;
        case "longue":
            nbPhases = phasesLongue;
            tailleTerrain = tailleLongue;
            break;
    }
    
    $(bouton).blur();
    
    partie();
}













