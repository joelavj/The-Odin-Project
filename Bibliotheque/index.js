'use strict';
let myLibrary = [];
const mainContainer = document.querySelector('main');
const btnViewForm = document.getElementById("add-book");

// HTML du formulaire d'ajout de livre
function formHTML() {
    return `
    <form>
        <h2>New book</h2>
        <input type="text" name="title" placeholder="title..." required>
        <input type="text" name="author" placeholder="author..." required>
        <input type="number" min="1" name="numberOfPages" placeholder="number of pages..." required>
        <label>
            <input type="checkbox" name="status-read" value="true">
            Read
        </label>
        <button type="submit">Add to library</button>
        <button id="cancel" type="button">Cancel</button>
    </form>
    `;
}
//  HTML du d'affichage du library
function libraryHTML() {
    return `
    <table>
        <caption>List of books in the library</caption>
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Number of pages</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
    `;
}
// HTML d'un livre 
function createBookRow(book) {
    const title = document.createElement('td');
    title.textContent = book.title;
    const author = document.createElement('td');
    author.textContent = book.author;
    const numberOfPages = document.createElement('td');
    numberOfPages.textContent = book.numberOfPages;
    const statusRead = document.createElement('td');
    statusRead.innerHTML = `<button class="btn-status">${book.statusRead ? 'Read' : 'Unread'}</button>`;
    const action = document.createElement('td');
    action.innerHTML = `<button class="btn-delete">Delete</button>`;
    const rowArray = document.createElement('tr');
    rowArray.dataset.id = book.id;
    rowArray.appendChild(title);
    rowArray.appendChild(author);
    rowArray.appendChild(numberOfPages);
    rowArray.appendChild(statusRead);
    rowArray.appendChild(action);
    return rowArray;
}
// Objet livre
function Book(title, author, numberOfPages, statusRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.statusRead = statusRead;
}
// fonction d'ajout d'un livre dans la bibliothèque
function addBookToLibrary(title, author, numberOfPages, statusRead) {
    myLibrary.push(new Book(title, author, numberOfPages, statusRead));
}
// fonction d'affichage des livres 
function viewLibrary() {
    if (myLibrary.length === 0) {
        mainContainer.innerHTML = `
        <p>Empty library, add books</p>
        `;
        return;
    }
    mainContainer.innerHTML = libraryHTML();
    const tbody = document.querySelector('tbody');
    myLibrary.forEach((book) => {
        tbody.appendChild(createBookRow(book));
    });
}
mainContainer.addEventListener('click', (e) => {
    const id = e.target.closest('tr')?.dataset.id;
    if (e.target.matches('.btn-delete')) deleteBook(id);
    if (e.target.matches('.btn-status')) { findBook(id).toggleRead(); viewLibrary(); }

})
// Fonction qui supprime un livre
function deleteBook(idBook) {
    myLibrary = myLibrary.filter((book) => book.id !== idBook);
    viewLibrary();
}
// Affiche le formulaire
btnViewForm.addEventListener("click", () => {
    mainContainer.innerHTML = formHTML();
    document.getElementById("cancel").addEventListener("click", viewLibrary);
    document.querySelector('form').addEventListener("submit", handleSubmit);
});
// fonction qui traite un formulaire
function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    // Récuperer le titre
    const title = form.get('title');
    // Récuperer l'auteur
    const author = form.get('author');
    // Récuperer le nombre de pages
    const numberOfPages = Number(form.get('numberOfPages'));
    // Récuperer le statut de lecture
    const statusRead = e.target.elements['status-read'].checked;
    // Après validation, ajout dans library
    addBookToLibrary(title, author, numberOfPages, statusRead);
    // Afficher la librairie
    viewLibrary();
}

function findBook(idBook) {
    return myLibrary.find(book => book.id === idBook);
}

// Change le statut de lecture d'un livre
Book.prototype.toggleRead = function () {
    this.statusRead = !this.statusRead;
};

viewLibrary();