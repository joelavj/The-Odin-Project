
let myLibrary = [];
const mainContainer = document.querySelector('main');
const btnViewForm = document.getElementById("add-book");

// HTML du formulaire d'ajout de livre
function formHTML() {
    return `
    <form>
        <legend>New book</legend>
        <input type="text" id="title" placeholder="title..." required>
        <input type="text" id="author" placeholder="author..." required>
        <input type="number" min="1" id="nbrPages" placeholder="number of pages...">
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
                <th>Number of pages
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
function bookHTML(book) {
    title = document.createElement('td');
    title.textContent = book.title;
    author = document.createElement('td');
    author.textContent = book.author;
    nbrPages = document.createElement('td');
    nbrPages.textContent = book.nbrPages;
    statusRead = document.createElement('td');
    statusRead.innerHTML = `<button onclick="changeStatusRead('${book.id}')">${book.statusRead ? 'Read' : 'Unread'}</button>`;
    action = document.createElement('td');
    action.innerHTML = `<button onclick="deleteBook('${book.id}')">Delete</button>`;
    rowArray = document.createElement('tr');
    rowArray.appendChild(title);
    rowArray.appendChild(author);
    rowArray.appendChild(nbrPages);
    rowArray.appendChild(statusRead);
    rowArray.appendChild(action);
    return rowArray;
}
// Objet livre
function Book(title, author, nbrPages, statusRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.nbrPages = nbrPages;
    this.statusRead = statusRead;
}
// fonction d'ajout d'un livre dans la bibliothèque
function addBookToLibrary(title, author, nbrPages, statusRead) {
    myLibrary.push(new Book(title, author, nbrPages, statusRead));
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
    myLibrary.forEach((book) => {
        document.querySelector('tbody').appendChild(bookHTML(book));
    });
}
// Fonction qui supprime un livre
function deleteBook(id_book) {
    console.log(id_book);
    myLibrary = myLibrary.filter((book) => book.id !== id_book);
    viewLibrary();
}
// Affiche le formulaire
btnViewForm.addEventListener("click", () => {
    mainContainer.innerHTML = formHTML();
    document.getElementById("cancel").addEventListener("click", viewLibrary);
    document.querySelector('form').addEventListener("submit", formValidate);
});
// fonction qui traite un formulaire
function formValidate(e) {
    e.preventDefault();
    // Récuperer le titre
    title = e.target.title.value;
    // Récuperer l'auteur
    author = e.target.author.value;
    // Récuperer le nombre de pages
    nbrPages = e.target.nbrPages.value;
    // Récuperer le statut de lecture
    inputStatusRead = document.querySelector('input[name="status-read"]:checked');
    statusRead = false;
    if (inputStatusRead !== null && inputStatusRead.value === 'true') {
        statusRead = true;
    }
    // Après validation, ajout dans library
    addBookToLibrary(title, author, nbrPages, statusRead);
    // Afficher la librairie
    viewLibrary();
}

function changeStatusRead(id_book) {
    myLibrary.forEach((book) => {
        if (book.id == id_book) {
            book.statusRead = !book.statusRead;
        }
    });
    viewLibrary();
}

viewLibrary();