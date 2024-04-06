// Variable to store "Tambahkan buku" form
let addBookForm = {};

// Variable to store "Find book" form
let findBookForm = "";

// An array that acts like a database
let books;

// In which page we are on? On Finished or On Unfinished?
let isOnFinished = false;

// Adding book
const addBook = (e) => {
    e.preventDefault();
    
    // Generate ID and default value directly
    addBookForm = {
        ...addBookForm,
        id: + new Date(),
        isComplete: false,
        year: parseInt(addBookForm["year"])
    };
    
    // Add to database then reset the form
    books.push(addBookForm);
    localStorage.setItem("books", JSON.stringify(books));
    
    // Reset the form
    addBookForm = {};
    e.target.reset();

    // ...
    updatePage();
}

// Modifying form
const formAddOnInput = (e) => {
    addBookForm = {
        ...addBookForm,
        [e.target.name]: e.target.value
    }
}

// Modifying form
const formFindOnInput = (e) => {
    findBookForm = e.target.value;

    updatePage();
}

// Just as same as "formFindOnInput", this func is just for more attractive web xd
const search = (e) => {
    e.preventDefault();

    updatePage();
}

// Update the page so it will determine what books are about to show
const updatePage = () => {
    // Get book data from local storage
    books = JSON.parse(localStorage.getItem("books"));
    
    // Is user finding a book?
    if (findBookForm != "")
    {
        // If yes, filter the books
        books = books.filter(book => 
            book.title.toLowerCase().includes(findBookForm.toLowerCase())
        );
    }

    if (books == null)
        books = [];

    // Clear list first
    const list = document.getElementById("books-list");
    while (list.firstElementChild) {
        list.firstElementChild.remove();
    }

    // Iterate then add to dom
    for (const book of books) {
        // If the book is not fit to the current page
        if (book.isComplete != isOnFinished) continue;

        // Add to DOM
        list.innerHTML += 
        `<div class="book-card">
            <section class="book-header">
                <h3 class="title">${book.title}</h3>
                <button class="btn edit-btn" title="Edit judul buku" onclick="editBook(${book.id})">
                    <i class="gg-pen"></i>
                </button>
            </section>
            <p>Author: ${book.author}</p>
            <p>Tahun Rilis: ${book.year}</p>
            
            <!-- Buttons -->
            <section class="book-card-btns">
                <button class="btn move-btn" onclick="moveBookToOtherShelf(${book.id})">Pindahkan</button>
                <button class="btn remove-btn" onclick="removeBook(${book.id})">Hapus</button>
            </section>
        </div>`
    }
}

const moveBookToOtherShelf = (id) => {
    // Find the book by its ID from database
    const bookToMove = books.findIndex(book => book.id === id);

    // Just negate the is complete and update the local storage
    books[bookToMove].isComplete = !books[bookToMove].isComplete;
    localStorage.setItem("books", JSON.stringify(books));

    // Then update
    updatePage();
}

const editBook = (id) => {
    // Find the book by its ID from database
    const bookToEdit = books.findIndex(book => book.id === id);

    // Just simply use prompt for this one since we only want to change the title
    const newTitle = prompt("Masukan judul barunya: ", books[bookToEdit].title);

    if (newTitle === null || newTitle === "")
        return;

    // Edit
    books[bookToEdit].title = newTitle;
    localStorage.setItem("books", JSON.stringify(books));

    // Then update
    updatePage();
}

const removeBook = (id) => {
    // Find the book by its ID from database
    const bookToRemove = books.findIndex(book => book.id === id);

    // Remove from array then update local storage
    books.splice(bookToRemove, 1);
    localStorage.setItem("books", JSON.stringify(books));

    // Then update
    updatePage();
}

// Switch page and then update the page
const switchPage = (value) => {
    isOnFinished = value;
    updatePage();

    // Don't forget to update the DOM
    document.getElementById("page-title").innerText = isOnFinished ? "Finished" : "Unfinished";
}

// Using main just to make programming easier for me
const main = () => {
    // Immediately getting books from local storage (if exists)
    updatePage();
}

main();
