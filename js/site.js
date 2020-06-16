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
const compte = "#compte";

//Variables localStorage (sauvegarde d'urgence)
const LS_enPartie = "enPartie"
const LS_versEnnemie = "versEnnemie";
const LS_balleAuCentre = "balleAuCentre";
const LS_nbPhases = "nbPhases";
const LS_indexPhase = "indexPhase";
const LS_indexTerrain = "indexTerrain";
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
const zoneNom = "#nom";
const txtVictoires = "#nbv";
const txtButs = "#nbb";
const txtReponses = "#nbbr";

//Variables chrono
var idInterval = Array();
var chronoFin;
var chronoActuel;
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Var chemins vers images
var icones = "res/icones/";

//TODO
function setUpSite() {
    //TODO
    /*
     * reset chrono
     * récup info compte
     * afficher infos
     * récup LS_enPartie
     * si == true
     *   proposer reprendre partie (afficher toutes info)
     *   events reprendre partie
     */
    
    stopChrono();
    
    setUpCompte();
    
    affichageCompte();
    
    let EP = localStorage.getItem(LS_enPartie);
    
    if(EP == "true")
    {
       
    }
    
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
    localStorage.setItem(LS_nom, val);
    console.log(val);
}

function affichageCompte() {
    if($(compte).is(":visible"))
        $(compte).hide();
    else
        $(compte).show();
}

function setUpGame() {
    
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
            tmpsPhase = 5;
            break;
        case "longue":
            nbPhases = phasesLongue;
            tailleTerrain = tailleLongue;
            tmpsPhase = 3;
            break;
    }
    
    $(bouton).blur();
    
    introduction();
}
    
function setUpCompte() {
    let nm = localStorage.getItem(LS_nom);
    let vt = localStorage.getItem(LS_nbVictoires);
    let bt = localStorage.getItem(LS_nbButs);
    let brt = localStorage.getItem(LS_nbBonnesReponses);
    
    console.log(nm + " " + vt + " " + bt + " " + brt);
    
    if(nm == null)
        nm = "Nom";
    if(vt == null)
        vt = 0;
    if(bt == null)
        bt = 0;
    if(brt == null)
        brt = 0;
    
    console.log(nm + " " + vt + " " + bt + " " + brt);
    
    $(zoneNom).val(nm);
    $(txtVictoires).text($(txtVictoires).text() + " " + vt);
    $(txtButs).text($(txtButs).text() + " " + bt);
    $(txtReponses).text($(txtReponses).text() + " " + brt);
}

//Fonctions de chronomètre
function setChrono() {
    switch(chrono) {
        case "lent":
            chronoFin = chronoLent;
            break;
        case "moyen":
            chronoFin = chronoMoyen;
            break;
        case "rapide":
            chronoFin = chronoRapide;
            break;
    }
    
    chronoActuel = 0;
    
    idInterval.push(setInterval(chronometre,10));
}

//TODO : actualiser avec un seul mode + fin renvoie false
function chronometre() {
    
    chronoActuel += 10;
    let rad = (chronoActuel / chronoFin) * 360;
    
    $(jeu).drawRect({
        fillStyle: '#3498db',
        x: 500, y: 100,
        height: 20, width: 20
    });
    $(jeu).drawArc({
        strokeStyle: 'black',
        strokeWidth: 5,
        x: 500, y: 100,
        radius: 10,
        start: 0, end: rad
    });
    
    if(chronoActuel == chronoFin)
    {
        stopChrono();
        chronoActuel = 0;
        finBoucle(false);
    }
}

function stopChrono() {
    idInterval.forEach(function(id) {
        clearInterval(id);
    });
    
    idInterval = Array();
}

//Autres fonctions
function incrementerVariableLocale(nomVariable) {
    let valeur = parseInt(localStorage.getItem(nomVariable));
    localStorage.setItem(nomVariable, valeur + 1);
}

function viderVariablesParties() {
    enPartie = false;
    versEnnemie = null;
    nbPhases = null;
    indexPhase = null;
    miTemps = null;
    scoreAmi = null;
    scoreEnnemie = null;
    typeExercice = null;
    difficulte = null;
    chrono = null;
    question = null;
    bonneReponse = null;
    reponses = Array();
    obstacle = null;
    obstaclesFaits = Array();
    
    localStorage.removeItem(LS_enPartie);
    localStorage.removeItem(LS_versEnnemie);
    localStorage.removeItem(LS_nbPhases);
    localStorage.removeItem(LS_indexPhase);
    localStorage.removeItem(LS_scoreAmi);
    localStorage.removeItem(LS_scoreEnnemie);
    localStorage.removeItem(LS_miTemps);
    localStorage.removeItem(LS_typeExercice);
    localStorage.removeItem(LS_difficulte);
    localStorage.removeItem(LS_chrono);
}

function viderListesQuestions() {
    additionsFaites = Array();
    soustractionsFaites = Array();
    multiplicationsFaites = Array();
    divisionsFaites = Array();
    obstaclesFaits = Array();
}

function resetEventsPartie() {
    $(document).off("keypress");
    $(document).off("keydown");
    $(classfleche).off("click");
    $(espace).off("click");
}