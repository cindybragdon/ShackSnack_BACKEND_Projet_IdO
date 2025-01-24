
<h2 align="center">ShackSnack_BACKEND_Projet_IdO : Gâtez vos animaux sainement</h2> 

<h1 align="center"><i> Epreuve Finale </i></h1>
<h2 align="center">Remis par :</h2>
<h2 align="center">Cindy Bragdon</h2>
<h2 align="center">Olivier Poirier</h2>
<h2 align="center">Jenna-Lee Lecavalier</h2>

<h2 align="center">Dans le cadre du cours PROJET - DÉVELOPPEMENT IDO 420-611-MV</h2> 
<h2 align="center">Enseigné par Sofian Faïdi, Cégep Marie-Victorin</h2>

<p align="center">
  <a href="https://github.com/cindybragdon">
    <img src="https://github.com/cindybragdon.png?size=64" width="64" height="64" alt="Cindy" style="border-radius: 50%; overflow: hidden;">
  </a>
  <a href="https://github.com/olivierpoirier">
    <img src="https://github.com/olivierpoirier.png?size=64" width="64" height="64" alt="Olivier" style="border-radius: 50%; overflow: hidden;">
  </a>
  <a href="https://github.com/JennaLeeL">
    <img src="https://github.com/JennaLeeL.png?size=64" width="64" height="64" alt="Jenna" style="border-radius: 50%; overflow: hidden;">
  </a>

---

## :label: Table des matières

- [Contexte du travail](#contexte-du-travail)
- [Outils et Technologies utilisés](#outils-et-technologies-utilisés)
- [Installation et mise en route](#installation-et-mise-en-route)
- [Tests](#tests)
- [Étapes de déploiement](#étapes-de-déploiement)
- [Documentation](#documentation)

---

## Contexte du travail
:mortar_board:  
**Shack Snack** est une application mobile connectée à un système d’alimentation automatique pour animaux. Ce projet est développé dans le cadre du projet de fin de formation d’un DEC en informatique. Il utilise un Raspberry Pi et ses sensors, une caméra, un distributeur de croquettes, et une application mobile pour permettre aux propriétaires d’animaux de surveiller et de gérer les repas de leurs compagnons à distance.

## Fonctionnalités principales 🚀

### Système Raspberry Pi
- Détection de présence : un capteur infrarouge détecte l’arrivée de l’animal.
- Prise de photo : activation de la caméra pour capturer une photo de l’animal.
- Envoi de notification : une photo de l’animal est envoyée sur l’application mobile.
- Nourrir l’animal : activation du servomoteur pour distribuer les croquettes lorsque l’utilisateur envoie un signal via l’application.
- Suivi des demandes : conservation des logs pour surveiller la fréquence des repas de l’animal.

### Application mobile (Expo/React Native)
- **Notifications** : réception d’une alerte avec la photo de l’animal lorsqu’il se présente devant la caméra.
- **Contrôle à distance** : possibilité de nourrir ou non l’animal via deux options dans l’application.
- **Statistiques** : suivi des repas pour ajuster la fréquence et assurer la santé de l’animal.
- **Interface utilisateur moderne** : design épuré et intuitif avec support du mode sombre.

---

## Technologies utilisées 🛠️

### Système Raspberry Pi
- **Langage** : Python
- **Matériel** : Raspberry Pi, caméra avec microphone, capteur infrarouge, servomoteur, distributeur de croquettes personnalisé.

### Application Mobile
- **Langages et frameworks** :
  - [Expo](https://expo.dev/)
  - [React Native](https://reactnative.dev/)
  - [React Navigation Drawer](https://reactnavigation.org/)
  - [NativeWind](https://www.nativewind.dev/) + [TailwindCSS](https://tailwindcss.com/)
  - [Axios](https://axios-http.com/)
  - [JWT](https://jwt.io/) pour l'authentification.
- **Stockage local** : AsyncStorage
- **Animations** : Lottie
- **Tests** :
  - [Jest](https://jestjs.io/)
  - [React Test Renderer](https://reactjs.org/docs/test-renderer.html)

### Backend
- **Langages et frameworks** :
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
- **Base de données** :
  - [MySQL](https://www.mysql.com/) ou [MongoDB](https://www.mongodb.com/).

---
