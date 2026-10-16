# Compte rendu — Projet Library (The Odin Project)

**Auteur :** Vonjiniaina Joela (joelavj)

**Projet :** [JavaScript Library — The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-library)

**Technologies :** HTML, CSS, JavaScript (vanilla)

**Date :** octobre 2026

**Solution:** [https://library/index.html](https://joelavj.github.io/The-Odin-Project/Bibliotheque/index.html)

---

## 1. Présentation

Application web permettant de gérer une petite bibliothèque personnelle : on peut ajouter des livres via un formulaire, les afficher dans un tableau, changer leur statut de lecture et les supprimer. Le projet met en pratique les objets et constructeurs JavaScript, les prototypes et la manipulation du DOM.

## 2. Objectifs pédagogiques

- Créer des objets avec un **constructeur** (`Book`) et le sécuriser avec `new.target`.
- Utiliser le **prototype** pour partager une méthode entre toutes les instances.
- Stocker les données dans un tableau (`myLibrary`) et générer l'affichage à partir de celui-ci.
- Manipuler le **DOM** : création d'éléments, `textContent`, `dataset`, écouteurs d'événements.
- Gérer un formulaire avec `FormData`.

## 3. Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| Ajouter un livre | Formulaire : titre, auteur, nombre de pages, statut « lu » |
| Afficher la bibliothèque | Tableau généré dynamiquement, message si la bibliothèque est vide |
| Changer le statut | Bouton Read / Unread sur chaque ligne |
| Supprimer un livre | Bouton Delete sur chaque ligne |
| Annuler | Le bouton Cancel du formulaire revient à la liste |

## 4. Structure du projet

```
Bibliotheque/
├── index.html   # structure de la page (header, main, footer)
├── index.js     # logique et affichage
└── style.css    # mise en forme
```

### Organisation du code JavaScript

- **Données** : `myLibrary`, constructeur `Book`, `addBookToLibrary`, `findBook`, `deleteBook`.
- **Comportement partagé** : `Book.prototype.toggleRead` inverse le statut de lecture.
- **Vues** : `formHTML`, `libraryHTML`, `createBookRow`, `viewLibrary`.
- **Événements** : un écouteur sur le bouton « New book », un sur le formulaire (`handleSubmit`), et un écouteur de **délégation** sur `<main>` pour les boutons du tableau.

## 5. Difficultés rencontrées et solutions

### 5.1 Le bouton Cancel qui soumettait le formulaire

- **Symptôme :** cliquer sur Cancel déclenchait la soumission du formulaire au lieu d'annuler.
- **Cause :** dans un `<form>`, un `<button>` sans attribut `type` est de type **`submit`** par défaut.
- **Solution :** déclarer explicitement `type="button"` sur le bouton Cancel (et garder `type="submit"` pour « Add to library »).
- **À retenir :** toujours préciser le `type` d'un bouton placé dans un formulaire.

### 5.2 Le bouton de statut qui ne marchait qu'une fois

- **Symptôme :** le premier clic changeait bien le statut, mais les clics suivants n'avaient plus d'effet visible.
- **Cause :** l'appel à `addEventListener` était placé **dans** `viewLibrary()`. Comme `<main>` n'est jamais remplacé (seul son contenu change), chaque rendu ajoutait un écouteur supplémentaire. Après le premier clic il y en avait 2, puis 4, etc. Un nombre pair d'écouteurs inverse le statut un nombre pair de fois, donc il revient à sa valeur de départ. Le bouton Delete ne montrait pas le problème, car supprimer deux fois le même livre donne le même résultat.
- **Solution :** attacher l'écouteur **une seule fois**, en dehors de `viewLibrary()`.
- **À retenir :** ne jamais enregistrer un écouteur dans une fonction appelée plusieurs fois sur un élément qui persiste. La séparation modèle / affichage a aussi été améliorée : `toggleRead` ne fait plus qu'inverser la valeur, et c'est le gestionnaire de clic qui relance le rendu.

### 5.3 Le CSS du tableau avec `flex` et `grid`

- **Symptôme :** pour aligner les colonnes, `table` avait `display: flex` et `tr` avait `display: grid`.
- **Problème :** cela détourne le tableau de son comportement natif. Les navigateurs peuvent ne plus exposer la structure de tableau aux technologies d'assistance, et une hauteur de ligne fixe risque de couper les titres longs.
- **Solution :** revenir à la mise en page native d'un tableau (`width: 100%`, `text-align`, `padding` sur les cellules).
- **À retenir :** utiliser `flex` et `grid` pour la mise en page générale, pas pour reconstruire un tableau.

### 5.4 Les `onclick` inline remplacés par des attributs `data-`

- **Avant :** les boutons étaient générés avec `onclick="deleteBook('...')"`, ce qui obligeait à avoir des fonctions globales.
- **Après :** chaque ligne `<tr>` porte l'identifiant du livre dans `data-id`, et un seul écouteur sur `<main>` retrouve la ligne avec `e.target.closest('tr')?.dataset.id`.
- **Avantages :** pas de fonctions globales imposées, du HTML plus propre, un code compatible avec les modules ES, et un seul écouteur à gérer.

### 5.5 Autres corrections

- **Variables globales implicites** (oubli de `const`) : ajout de `'use strict'` et de `const` partout. Ces noms (`title`, `author`…) pouvaient entrer en collision avec des `id` du DOM.
- **Récupération du formulaire** : utilisation de `FormData` et de `elements['status-read'].checked` plutôt qu'un `querySelector` global.
- **Nombre de pages** : converti avec `Number(...)` et rendu obligatoire.
- **HTML invalide** : balise `</th>` manquante et `<legend>` hors d'un `<fieldset>` corrigés.
- **Sécurité** : les données saisies sont insérées avec `textContent`, jamais avec `innerHTML`, ce qui évite l'injection de HTML.

## 6. Ce que j'ai appris

- La différence entre le comportement par défaut d'un bouton dans un formulaire et un bouton hors formulaire.
- Le fonctionnement de la **délégation d'événements** et le piège des écouteurs dupliqués.
- L'intérêt de stocker un identifiant dans un attribut `data-*` plutôt que d'utiliser des `onclick` inline.
- L'usage du **prototype** pour partager une méthode entre toutes les instances.
- Qu'il faut respecter la sémantique native des éléments HTML (tableau, formulaire) au lieu de la contourner avec le CSS.
- L'intérêt du mode strict pour détecter les erreurs silencieuses.

## 7. Améliorations futures

- [ ] Utiliser un élément **`<dialog>`** (`showModal()`) pour le formulaire, afin d'éviter de perdre la saisie quand on rouvre le formulaire.
- [ ] Ajouter des **`<label>`** aux champs du formulaire pour l'accessibilité (lecteurs d'écran).
- [ ] Améliorer le **contraste des couleurs** (texte clair sur fond vert).
- [ ] Sauvegarder la bibliothèque avec **`localStorage`**.
- [ ] Ajouter une confirmation avant la suppression d'un livre.
- [ ] Harmoniser la langue de l'interface (anglais ou français) et vérifier les noms (`toggleRead`).

## 8. Conclusion

Ce projet m'a permis de consolider les bases de JavaScript côté objets et DOM. Les bugs rencontrés (bouton Cancel, bouton de statut, CSS du tableau) ont été les plus formateurs : chacun m'a obligé à comprendre un comportement précis du navigateur plutôt que d'appliquer une recette. La version actuelle est fonctionnelle, et les pistes d'amélioration (dialog, labels, persistance) sont identifiées pour une prochaine itération.