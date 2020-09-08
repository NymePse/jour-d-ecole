//Objet de sauvegarde d'avancement et options de parties
function Partie() {
    //Variables globales de partie
    //Bool, une partie est-elle en cours ?
    this.enPartie = false;
    //Int, "temps" d'une question (5 pour court, 15 pour longue).
    this.dureeMiTemps = 5;
    //Int, taille du terrain (5 pour court, 7 pour long).
    this.tailleTerrain = 5;
    //Int, index du centre du terrain.
    this.indexCentre = 3;
    //String (char), type d'exercice sélectionné.
    this.typeExercice = "?";
    //String (char), niveau de difficulté.
    this.difficulte = "?";
    //Int, temps max du chronomètre.
    this.dureeChronometre = 0;
    
    //Variables d'avancement de la partie
    //Int, numéro de la mi-temps actuelle (1 ou 2).
    this.miTemps = 1;
    //Int, question actuelle (de 1 à dureeMiTemps).
    this.indexQuestion = 1;
    //Int, point sur la carte de la phase actuelle (de 1 à tailleTerrain).
    this.indexTerrain = 1;
    
    //Variable de score
    //Int, nombre de buts marqués par le joueur.
    this.butsAllies = 0;
    //Int, nombre de buts marqués par l'adversaire.
    this.butsEnnemies = 0;
    
    //Variables d'affichage
    //Bool, la balle est-elle au joueur ?
    this.versEnnemie = false;
    //Bool, est-ce une remise en jeu ?
    this.balleAuCentre = false;
    //Int, représente l'équipe ayant la balle au tout début de la partie (0 allié, 1 ennemie). 
    this.equipeCentre = 0;
    //Bool, la remise au centre est-elle pour l'allié ?
    this.remiseAllie = false;
}