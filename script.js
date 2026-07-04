let books = [];
let borrowRecords = [];
let bookIdCounter = 1;

// ADD BOOK
function addBook() {
  let subject = document.getElementById("subject").value.trim();
  let publisher = document.getElementById("publisher").value.trim();
  let classLevel = document.getElementById("classLevel").value.trim();
  let year = document.getElementById("year").value.trim();
  let copies = parseInt(document.getElementById("copies").value);

  if (!subject || !publisher || !classLevel || !year || !copies) {
    alert("Fill all fields");
    return;
  }

  books.push({
    id: bookIdCounter++,
    subject,
    publisher,
    classLevel,
    year,
    copies,
    available: copies
  });

  renderBooks();
}

// DISPLAY BOOKS
function renderBooks(list = books) {
  let table = document.getElementById("bookList");
  table.innerHTML = "";

  list.forEach(book => {
    table.innerHTML += `
      <tr>
        <td>${book.id}</td>
        <td>${book.subject}</td>
        <td>${book.publisher}</td>
        <td>${book.classLevel}</td>
        <td>${book.year}</td>
        <td>${book.copies}</td>
        <td>${book.available}</td>
        <td>
          <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// DELETE BOOK
function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  renderBooks();
}

// SEARCH
function searchBook() {
  let value = document.getElementById("search").value.toLowerCase();

  let filtered = books.filter(b =>
    b.subject.toLowerCase().includes(value)
  );

  renderBooks(filtered);
}

// BORROW BOOK
function borrowBook() {
  let name = document.getElementById("studentName").value.trim();
  let className = document.getElementById("studentClass").value.trim();
  let bookId = parseInt(document.getElementById("bookId").value);

  let book = books.find(b => b.id === bookId);

  if (!book) {
    alert("Book not found");
    return;
  }

  if (book.available <= 0) {
    alert("No copies available");
    return;
  }

  book.available--;

  borrowRecords.push({
    name,
    className,
    subject: book.subject,
    date: new Date().toLocaleDateString()
  });

  renderBooks();
  renderBorrows();
}

// BORROW LIST
function renderBorrows() {
  let table = document.getElementById("borrowList");
  table.innerHTML = "";

  borrowRecords.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td>${r.className}</td>
        <td>${r.subject}</td>
        <td>${r.date}</td>
      </tr>
    `;
  });
}
