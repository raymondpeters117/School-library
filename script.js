let books = JSON.parse(localStorage.getItem("books")) || [];
let borrows = JSON.parse(localStorage.getItem("borrows")) || [];

// 💾 SAVE DATA
function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("borrows", JSON.stringify(borrows));
}

// 🆔 SMART BOOK ID
function generateBookId(subject, classLevel) {
  let subjectCode = subject.substring(0, 3).toUpperCase();
  let classCode = classLevel.toUpperCase();
  let year = new Date().getFullYear();
  let number = String(books.length + 1).padStart(3, "0");

  return `${subjectCode}-${classCode}-${year}-${number}`;
}

// ➕ ADD BOOK
function addBook() {
  let subject = document.getElementById("subject").value.trim();
  let publisher = document.getElementById("publisher").value.trim();
  let classLevel = document.getElementById("classLevel").value.trim();
  let year = document.getElementById("year").value.trim();
  let copies = document.getElementById("copies").value.trim();

  if (!subject || !publisher || !classLevel || !year || !copies) {
    alert("Please fill all fields");
    return;
  }

  books.push({
    id: generateBookId(subject, classLevel),
    subject,
    publisher,
    classLevel,
    year,
    copies: parseInt(copies),
    available: parseInt(copies)
  });

  saveData();
  clearInputs();
  renderBooks();
}

// 🧹 CLEAR INPUTS
function clearInputs() {
  document.getElementById("subject").value = "";
  document.getElementById("publisher").value = "";
  document.getElementById("classLevel").value = "";
  document.getElementById("year").value = "";
  document.getElementById("copies").value = "";
}

// 📚 SHOW BOOKS
function renderBooks(data = books) {
  let list = document.getElementById("bookList");
  list.innerHTML = "";

  data.forEach(book => {
    list.innerHTML += `
      <tr>
        <td>${book.id}</td>
        <td>${book.subject}</td>
        <td>${book.publisher}</td>
        <td>${book.classLevel}</td>
        <td>${book.year}</td>
        <td>${book.copies}</td>
        <td>${book.available}</td>
        <td>
          <button onclick="issueBook('${book.id}')">Issue</button>
          <button onclick="returnBook('${book.id}')">Return</button>
          <button onclick="editBook('${book.id}')">Edit</button>
          <button onclick="deleteBook('${book.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// 👨‍🎓 BORROW BOOK (FULL FIXED)
function borrowBook() {
  let studentName = document.getElementById("studentName").value.trim();
  let studentClass = document.getElementById("studentClass").value.trim();
  let bookId = document.getElementById("bookId").value.trim();

  // ✅ FIXED SAFE MATCHING
  let book = books.find(
    b => b.id.trim().toUpperCase() === bookId.trim().toUpperCase()
  );

  if (!studentName || !studentClass || !bookId) {
    alert("Please fill all fields");
    return;
  }

  if (!book) {
    alert("Book ID not found. Please check carefully.");
    return;
  }

  if (book.available <= 0) {
    alert("No copies available");
    return;
  }

  book.available--;

  borrows.push({
    studentName,
    studentClass,
    bookId: book.id,
    subject: book.subject,
    date: new Date().toLocaleDateString()
  });

  saveData();
  clearBorrowInputs();
  renderBooks();
  renderBorrows();
}

// 🧹 CLEAR BORROW INPUTS
function clearBorrowInputs() {
  document.getElementById("studentName").value = "";
  document.getElementById("studentClass").value = "";
  document.getElementById("bookId").value = "";
}

// 📖 BORROW RECORDS
function renderBorrows() {
  let list = document.getElementById("borrowList");
  if (!list) return;

  list.innerHTML = "";

  borrows.forEach(b => {
    list.innerHTML += `
      <tr>
        <td>${b.studentName}</td>
        <td>${b.studentClass}</td>
        <td>${b.bookId}</td>
        <td>${b.subject}</td>
        <td>${b.date}</td>
      </tr>
    `;
  });
}

// 📤 ISSUE BOOK
function issueBook(id) {
  let book = books.find(
    b => b.id.trim().toUpperCase() === id.trim().toUpperCase()
  );

  if (!book) return;

  if (book.available > 0) {
    book.available--;

    borrows.push({
      studentName: "Unknown",
      studentClass: "Unknown",
      bookId: book.id,
      subject: book.subject,
      date: new Date().toLocaleDateString()
    });
  }

  saveData();
  renderBooks();
  renderBorrows();
}

// 🔄 RETURN BOOK
function returnBook(id) {
  let book = books.find(
    b => b.id.trim().toUpperCase() === id.trim().toUpperCase()
  );

  if (!book) return;

  if (book.available < book.copies) {
    book.available++;
  }

  saveData();
  renderBooks();
}

// ✏️ EDIT BOOK
function editBook(id) {
  let book = books.find(
    b => b.id.trim().toUpperCase() === id.trim().toUpperCase()
  );

  if (!book) return;

  let newSubject = prompt("Edit Subject:", book.subject);
  let newPublisher = prompt("Edit Publisher:", book.publisher);
  let newClass = prompt("Edit Class:", book.classLevel);
  let newYear = prompt("Edit Year:", book.year);
  let newCopies = prompt("Edit Copies:", book.copies);

  if (!newSubject || !newPublisher || !newClass || !newYear || !newCopies) {
    alert("Edit cancelled");
    return;
  }

  let diff = parseInt(newCopies) - book.copies;

  book.subject = newSubject.trim();
  book.publisher = newPublisher.trim();
  book.classLevel = newClass.trim();
  book.year = newYear.trim();
  book.copies = parseInt(newCopies);
  book.available += diff;

  if (book.available < 0) book.available = 0;

  saveData();
  renderBooks();
}

// ❌ DELETE BOOK
function deleteBook(id) {
  books = books.filter(
    b => b.id.trim().toUpperCase() !== id.trim().toUpperCase()
  );

  saveData();
  renderBooks();
  renderBorrows();
}

// 🔍 SEARCH
function searchBook() {
  let value = document.getElementById("search").value.toLowerCase();

  let filtered = books.filter(b =>
    b.id.toLowerCase().includes(value) ||
    b.subject.toLowerCase().includes(value) ||
    b.publisher.toLowerCase().includes(value) ||
    b.classLevel.toLowerCase().includes(value)
  );

  renderBooks(filtered);
}

// 🚀 INIT
renderBooks();
renderBorrows();