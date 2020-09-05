//SITE.JS
/*
 * Fonctions en rapport avec le fonctionnement du site, hors jeu directement (sauf chrono)
 * Affichage, mise à jour du compte, etc etc...
 */

//TODO Mise à jour des variables du site

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
//const compte = "#compte";
const file_reader = "#file_reader";

//Objets et mots clé de sauvegarde
const LS_Compte = "compte";
const LS_Partie = "partie";
let partie;
let compte;

//Elements HTML compte
const zoneNom = "#nom";
const txtVictoires = "#nbv";
const txtButs = "#nbb";
const txtReponses = "#nbbr";
const t_tf = "#t_tf";
const t_f = "#t_f";
const t_m = "#t_m";
const t_d = "#t_d";
const t_td = "#t_td";
const t_1v = "#t_1v";
const t_2v = "#t_2v";
const t_5v = "#t_5v";
const t_10v = "#t_10v";
const t_1b = "#t_1b";
const t_2b = "#t_2b";
const t_5b = "#t_5b";
const t_10b = "#t_10b";

//Variables chrono
var idInterval = Array();
var chronoFin;
var chronoActuel;
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Var chemins vers images
var icones = "res/icones/";

function setUpSite() {    
    if(!localStorage.getItem(LS_Compte))
    {
        compte = new Compte();
        localStorage.setItem(LS_Compte, compte);
    }
    
    if(localStorage.getItem(LS_Partie))
    {
        //TODO Reprise de partie à l'ouverture de page
    }
    
    setUpCompte();
    
    affichageCompte();
    
    $(espace).hide();
    
    //Mettre à jour taille canvas
    $(window).resize(function() {
        if($(window).width() < 1000)
        {
            
            $(jeu).css("width", $(window).width());
            $(jeu).css("height", $(window).width() / 2);
        }
        else
        {
            $(jeu).css("width", 1000);
            $(jeu).css("height", 500);
        }
    });
    
    $(window).resize();
}

function majNom(val) {
    compte.nom = val;
}

function affichageCompte() {
    if($(compte).is(":visible"))
        $(compte).hide();
    else
        $(compte).show();
}

function setUpGame() {
    //TODO Réécrire/maj la fonction setUpGame avec l'objet Partie (réfléchir fusion fonction introduction()).
    /*
     * Créer un objet Partie
     * Récupérer les valeurs d'options de partie
     * Mettre à jour l'objet Partie
     * Sauvegarder l'objet Partie
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
    
    //Sauvegarde locale
    localStorage.setItem(LS_longueurPartie, longueur);
    localStorage.setItem(LS_typeExercice, typeExercice);
    localStorage.setItem(LS_difficulte, difficulte);
    localStorage.setItem(LS_chrono, chrono);
    
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
    $(zoneNom).val(compte.nom);
    $(txtVictoires).text(compte.nombreVictoires);
    $(txtButs).text(compte.nombreButs);
    $(txtReponses).text(compte.nombreBonneReponses);
    
    //Mise à jour trophés acquis
    majTrophes();
    
    //Activer trophés gagnés
    let trophes = Array();
    
    let nbVictoires = compte.nombreVictoires;
    if(nbVictoires > 9)
        trophes.push(t_10v);
    if(nbVictoires > 4)
        trophes.push(t_5v);
    if(nbVictoires > 1)
        trophes.push(t_2v);
    if(nbVictoires > 0)
        trophes.push(t_1v);
    
    let nbButs = compte.nombreButs;
    if(nbButs > 9)
        trophes.push(t_10b);
    if(nbButs > 4)
        trophes.push(t_5b);
    if(nbButs > 1)
        trophes.push(t_2b);
    if(nbButs > 0)
        trophes.push(t_1b);
    
    if(compte.matchTresFacile)
        trophes.push(t_tf);
    if(compte.matchFacile)
        trophes.push(t_f);
    if(compte.matchMoyen)
        trophes.push(t_m);
    if(compte.matchDifficile)
        trophes.push(t_d);
    if(compte.matchTresDifficile)
        trophes.push(t_td);
    
    trophes.forEach(function(trophe) {
        console.log(trophe);
        $(trophe).css("background-color","yellow");
    });
}

function exporter() {
    let compteJSON = JSON.stringify(compte);
    
    //Procédure de téléchargement
    let file = new Blob([compteJSON], {type: "application/json"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, compte.nom);
    else { // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = compte.nom;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function importer(event) {
    //Récupération du fichier json
    let file = event.target.files[0];
    
    //Création objet de lecture
    let fileReader = new FileReader();
    
    //une fois le fichier convertis en string
    fileReader.onloadend = function(event2) {
        console.log(event2.target.result);
        
        //Récupération éléments JSON
        let compteString = event2.target.result;
        compte = JSON.parse(compteString);
        
        //Mise à jour affichage du compte
        setUpCompte();
    }
    
    //lancement conversion
    fileReader.readAsText(file);
}