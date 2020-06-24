//SITE.JS
/*
 * Fonctions en rapport avec le fonctionnement du site, hors jeu directement (sauf chrono)
 * Affichage, mise à jour du compte, etc etc...
 */

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
const file_reader = "#file_reader";

//Variables localStorage (sauvegarde d'urgence)
const LS_enPartie = "enPartie";
const LS_longueurPartie = "longueurPartie";
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

//Trophés
const T_uneVictoire = "uneVictoire";
const T_deuxVictoires = "deuxVictoires";
const T_cinqVictoires = "cinqVictoires";
const T_dixVictoires = "dixVictoires";
const T_unBut = "unBut";
const T_deuxButs = "deuxButs";
const T_cinqButs = "cinqButs";
const T_dixButs = "dixButs";
const T_matchTresFacile = "matchTresFacile";
const T_matchFacile = "matchFacile";
const T_matchMoyen = "matchMoyen";
const T_matchDifficile = "matchDifficile";
const T_matchTresDifficile = "matchTresDifficile";

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
    
    //Une partie était-elle en cours ?
    let EP = localStorage.getItem(LS_enPartie);
    if(EP == "true")
    {
        //Récupérer toutes les variables nécessaires à la partie
        enPartie = true;
        
        if(localStorage.getItem(LS_versEnnemie) == "true")
            versEnnemie = true;
        else
            versEnnemie = false;
        
        balleAuCentre = parseInt(localStorage.getItem(LS_balleAuCentre));
        nbPhases = parseInt(localStorage.getItem(LS_nbPhases));
        indexPhase = parseInt(localStorage.getItem(LS_indexPhase));
        
        if(localStorage.getItem(LS_longueurPartie) == "courte")
        {
            tailleTerrain = tailleCourte;
            tmpsPhase = 5;
        }
        else
        {
            tailleTerrain = tailleLongue;
            tmpsPhase = 3;
        }
        
        indexTerrain = parseInt(localStorage.getItem(LS_indexTerrain));
        miTemps = parseInt(localStorage.getItem(LS_miTemps));
        scoreAmi = parseInt(localStorage.getItem(LS_scoreAmi));
        scoreEnnemie = parseInt(localStorage.getItem(LS_scoreEnnemie));
        typeExercice = localStorage.getItem(LS_typeExercice);
        difficulte = localStorage.getItem(LS_difficulte);
        chrono = localStorage.getItem(LS_chrono);
        difficulte = localStorage.getItem(LS_difficulte);
        
        //Affichage
        drawBase();
        $(jeu).drawText({
            fillStyle: 'black',
            x: 500, y: 250,
            fontSize: 20,
            text: "Pour reprendre la partie, appuyez sur Espace"
        });
        
        //Event reprendre la partie
        $(document).keypress(function(event) {
            if(event.keyCode == 32)
            {
                $(espace).hide();
                resetEventsPartie();
                debutBoucle();
            }
        });
        
        $(espace).click(function() {
            $(espace).hide();
            resetEventsPartie();
            debutBoucle();
        });
    }
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
    console.log("set up compte");
    
    //Variables de compte : nom & scores
    let nm = localStorage.getItem(LS_nom);
    let vt = localStorage.getItem(LS_nbVictoires);
    let bt = localStorage.getItem(LS_nbButs);
    let brt = localStorage.getItem(LS_nbBonnesReponses);
    
    console.log(nm + " " + vt + " " + bt + " " + brt);
    
    if(nm == null)
    {
        nm = "Nom";
        localStorage.setItem(LS_nom, nm);
    }
    if(vt == null)
    {
        vt = 0;
        localStorage.setItem(LS_nbVictoires, vt);
    }
    if(bt == null)
    {
        bt = 0;
        localStorage.setItem(LS_nbButs, bt);
    }
    if(brt == null)
    {
        brt = 0;
        localStorage.setItem(LS_nbBonnesReponses, brt);
    }
    
    $(zoneNom).val(nm);
    $(txtVictoires).text(vt);
    $(txtButs).text(bt);
    $(txtReponses).text(brt);
    
    //Mise à jour trophés acquis
    majTrophes();
    
    //Trophés
    let mtf = localStorage.getItem(T_matchTresFacile);
    let mf = localStorage.getItem(T_matchFacile);
    let mm = localStorage.getItem(T_matchMoyen);
    let md = localStorage.getItem(T_matchDifficile);
    let mtd = localStorage.getItem(T_matchTresDifficile);
    
    let bu = localStorage.getItem(T_unBut);
    let bd = localStorage.getItem(T_deuxButs);
    let bc = localStorage.getItem(T_cinqButs);
    let bdi = localStorage.getItem(T_dixButs);
    
    let vu = localStorage.getItem(T_uneVictoire);
    let vd = localStorage.getItem(T_deuxVictoires);
    let vc = localStorage.getItem(T_cinqVictoires);
    let vdi = localStorage.getItem(T_dixVictoires);
    
    //Activer trophés gagnés
    let trophes = Array();
    
    if(mtf == "true")
        trophes.push(t_tf);
    if(mf == "true")
        trophes.push(t_f);
    if(mm == "true")
        trophes.push(t_m);
    if(md == "true")
        trophes.push(t_d);
    if(mtd == "true")
        trophes.push(t_td);
    
    if(bu == "true")
        trophes.push(t_1b);
    if(bd == "true")
        trophes.push(t_2b);
    if(bc == "true")
        trophes.push(t_5b);
    if(bdi == "true")
        trophes.push(t_10b);
    
    if(vu == "true")
        trophes.push(t_1v);
    if(vd == "true")
        trophes.push(t_2v);
    if(vc == "true")
        trophes.push(t_5v);
    if(vdi == "true")
        trophes.push(t_10v);
    
    console.log(trophes);
    
    trophes.forEach(function(trophe) {
        console.log(trophe);
        $(trophe).css("background-color","yellow");
    });
}

//Fonctions mise à jour des trophés
function majTrophes() {
    //Récupérer valeurs compte
    let victoires = parseInt(localStorage.getItem(LS_nbVictoires));
    let buts = parseInt(localStorage.getItem(LS_nbButs));
    
    //maj trophés buts
    if(buts > 9)
        localStorage.setItem(T_dixButs, "true");
    if(buts > 4)
        localStorage.setItem(T_cinqButs, "true");
    if(buts > 1)
        localStorage.setItem(T_deuxButs, "true");
    if(buts > 0)
        localStorage.setItem(T_unBut, "true");
    
    //maj trophés nombre victoires
    if(victoires > 9)
        localStorage.setItem(T_dixVictoires, "true");
    if(victoires > 4)
        localStorage.setItem(T_cinqVictoires, "true");
    if(victoires > 1)
        localStorage.setItem(T_deuxVictoires, "true");
    if(victoires > 0)
        localStorage.setItem(T_uneVictoire, "true");
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

function exporter() {
    //Set up variables pour JSON
    let nom;
    let victoires;
    let buts;
    let bonnesReponses;
    let trophesDiff = Array();
    
    //Récupérer variables du compte sûres
    nom = localStorage.getItem(LS_nom);
    victoires = localStorage.getItem(LS_nbVictoires);
    buts = localStorage.getItem(LS_nbButs);
    bonnesReponses = localStorage.getItem(LS_nbBonnesReponses);
    
    //Test variables de trophés
    //Trophés de difficulté
    if(localStorage.getItem(T_matchTresFacile) == "true")
        trophesDiff.push(true);
    else
        trophesDiff.push(false);
    
    if(localStorage.getItem(T_matchFacile) == "true")
        trophesDiff.push(true);
    else
        trophesDiff.push(false);
    
    if(localStorage.getItem(T_matchMoyen) == "true")
        trophesDiff.push(true);
    else
        trophesDiff.push(false);
    
    if(localStorage.getItem(T_matchDifficile) == "true")
        trophesDiff.push(true);
    else
        trophesDiff.push(false);
    
    if(localStorage.getItem(T_matchTresDifficile) == "true")
        trophesDiff.push(true);
    else
        trophesDiff.push(false);
    
    //Créer JSON
    //Compte(nom, victoires, buts, bonnesReponses, trophesDiff, trophesVic, trophesBut)
    let compteObjet = {
        //Bases compte
        nom: nom,
        victoires: victoires,
        bonnesReponses: bonnesReponses,
        buts: buts,
        
        //Array trophés
        trophesDiff: trophesDiff
    }
    
    let compteJSON = JSON.stringify(compteObjet);
    
    //Procédure de téléchargement
    let file = new Blob([compteJSON], {type: "application/json"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = nom;
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
        let compteJSON = JSON.parse(compteString);
        
        //MAJ éléments compte depuis JSON
        localStorage.setItem(LS_nom, compteJSON.nom);
        localStorage.setItem(LS_nbVictoires, compteJSON.victoires);
        localStorage.setItem(LS_nbButs, compteJSON.buts);
        localStorage.setItem(LS_nbBonnesReponses, compteJSON.bonnesReponses);
        
        localStorage.setItem(T_matchTresFacile, compteJSON.trophesDiff[0]);
        localStorage.setItem(T_matchFacile, compteJSON.trophesDiff[1]);
        localStorage.setItem(T_matchMoyen, compteJSON.trophesDiff[2]);
        localStorage.setItem(T_matchDifficile, compteJSON.trophesDiff[3]);
        localStorage.setItem(T_matchTresDifficile, compteJSON.trophesDiff[4]);
        
        majTrophes();
        
        setUpCompte();
        
        /*
         * let compteObjet = {
        //Bases compte
        nom: nom,
        victoires: victoires,
        bonnesReponses: bonnesReponses,
        
        //Array trophés
        trophesDiff: trophesDiff,
        trophesVic: trophesVic,
        trophesBut: trophesBut
    }
         */
    }
    
    //lancement conversion
    fileReader.readAsText(file);
}