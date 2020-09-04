//Objet de compte utilisateur.
function Compte() {
    //Variables globales
    //String, nom du joueur.
    this.nom = "Nom";
    //Int, nombre de match gagnés.
    this.nombreVictoires = 0;
    //Int, nombre de buts marqués.
    this.nombreButs = 0;
    //Int, nombre de bonnes réponses données.
    this.nombreBonneReponses = 0;
    
    //Variables de trophés
    //Bool, True si débloqués
    //Nombre de victoires
    this.uneVictoire = false;
    this.deuxVictoires = false;
    this.cinqVictoires = false;
    this.dixVictoires = false;
    //Nombre de buts marqués
    this.unBut = false;
    this.deuxButs = false;
    this.cinqButs = false;
    this.dixButs = false;
    //Victoire selon la difficulté
    this.mathTresFacile = false;
    this.mathFacile = false;
    this.matchMoyen = false;
    this.matchDifficile = false;
    this.matchTresDifficile = false;
}