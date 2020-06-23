# Documentation
## Introduction
FootMath est un jeu éducatif web codé en Javascript, avec les librairies JQuery et JCanvas. Le style est aidé de la librairie Less. Il n'y a pas d'installation nécessaire, tout est jouable sur internet.

Quiz.js is a script based on an other script called Transition.js. Transition.js is used for creating presentation using HTML and the script is available at this address : https://math.unice.fr/~pantz/Geek/transition.html.

## Description technique du jeu
Une description rapide du fonctionnement de la partie jeu (fonctions de la feuille jeu.js, sauf chrono).

### Introduction()
Lorsqu'une partie est lancée, la fonction **introduction()** est appellée en première. Celle-ci affiche un texte d'introduction, montre la touche pour continuer, rempli des variables de partie nécessaire et les sauvegarde localement, et créé des évènements appelant la fonction **partie()**.

Forme de la fonction :
```
Texte d'introduction
Montrer la barre espace
Mettre à jour les variables
Sauvegarde locale
Évènements pour continuer la partie
```

### Partie()
La fonction **partie()** représente une boucle de jeu. Elle vérifie les variables d'avancement de la partie, et en fonction, continue la partie ou y met fin.

Forme de la fonction :
```
Si fin de mi-temps
    Informations de début de mi-temps
    Mettre à jour qui a la balle
    Sauvegarder localement

si le match est fini
    si victoire du joueur
        Mise à jour nombre de victoires
        Mise à jour trophés
    Texte de fin de match
    Vider les variables locales et globales de partie
    Supprimer tout les évènements de partie
    Mise à jour du compte
```

### DebutBoucle()
La fonction debutBoucle() appelle la création de question, choisis un obstacle (inutilisé), choisis toutes les images à afficher selon les variables de partie, affiche la partie, et créé les évènements vers finBoucle() vérifiant la réponse.

Forme de la fonction :
``` 
Choisir un obstacle (inutilisé)
Créer une question
Selon la position sur le terrain
    Choisir les images à afficher (pendant la question, en cas de victoire et de défaite)
afficher la question et les images
Évènements vers finBoucle()
si chrono existe
    activer chrono
```

### FinBoucle(reponseBonne)
La fonction finBoucle(reponseBonne) arrête le chrono s'il le faut, met à jour la partie selon si la réponse est bonne, sauvegarde localement, met à jour les trophés et renvoie à partie().

Forme de la fonction :
``` 
Fin du chrono
Selon si la réponse est bonne
    mise à jour variables de partie
    mise à jour nombre de bonnes réponses ou buts
    afficher réaction
Sauvegarde locale
Mise à jour trophés
Renvoie à Partie()
```

### Autres
* drawBase : Dessine la base d'une partie (fond, carte, texte...).
* creerQuestion() : renvoie vers une fonction de création selon le type de question voulu.
* creer\[type]() : créé une question et ses réponses selon la difficulté voulu dans le type voulu.
* setTouches() : Répartie les réponses dans les différentes touches
* reponseBonne(key) : vérifie si la réponse donnée est la bonne
* setChrono(), chronometre(), stopChrono() : Débute; met à jour régulièrement, vérifie si le chrono est fini, si oui renvoie une réponse fausse; met fin au chrono sans renvoyer de mauvaise réponse

## Crédits
Conçu entièrement par Arnaud LYSENSOONE BIJOU dans le cadre d'un DUT Informatique à l'IUT de Nice.
Merci à Lina pour la création d'assets (inutilisés), ainsi que Rémi, Loris, Julien et Quentin d'avoir testé.

Librairies :
* JQuery : [jquery.com](https://jquery.com/)
* JCanvas : [projects.calebevans.me/jcanvas](https://projects.calebevans.me/jcanvas/)
* Less : [lesscss.org](http://lesscss.org/)

## Licence
FootMath est gratuit, open source, sous licence GNU GPL3.