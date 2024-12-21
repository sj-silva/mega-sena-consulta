let userNumbers = [];
let fourMatches = [];
let fiveMatches = [];
let sixMatches = [];

const maxNumbers = 15;

function createNumberBoard() {
  const board = document.getElementById("numberBoard");
  for (let i = 1; i <= 60; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => toggleNumberSelection(btn, i);
    board.appendChild(btn);
  }
}

function toggleNumberSelection(button, number) {
  if (userNumbers.includes(number)) {
    userNumbers = userNumbers.filter((n) => n !== number);
    button.classList.remove("selected");
  } else if (userNumbers.length < maxNumbers) {
    userNumbers.push(number);
    button.classList.add("selected");
  } else {
    alert("Você pode selecionar até 15 números.");
  }
}

function resetBoard() {
  userNumbers = [];
  document.querySelectorAll("#numberBoard button").forEach((btn) => {
    btn.classList.remove("selected");
  });
  document.getElementById("matchesTableBody").innerHTML = "";
  document.getElementById("fourMatchesTableBody").innerHTML = "";
  document.getElementById("fiveMatchesTableBody").innerHTML = "";
  document.getElementById("sixMatchesTableBody").innerHTML = "";
  document.querySelector(".table-section").style.display = "none";
  document.querySelector(".nav-tab-section").style.display = "none";
}

// Function to populate the matches table
function populateMatchesTable(matches, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);
  tableBody.innerHTML = ""; // Clear any existing rows

  if (matches.length === 0) {
    // No matches, show an empty message
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", 3); // Span across all columns
    cell.classList.add("text-center", "text-muted"); // Center align and style the text
    cell.textContent = "Nenhum resultado encontrado"; // Message to display
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    matches.forEach((game) => {
      const row = document.createElement("tr");

      const concursoCell = document.createElement("td");
      concursoCell.textContent = game.concurso;
      row.appendChild(concursoCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = game.dataDoSorteio;
      row.appendChild(dateCell);

      const numbersCell = document.createElement("td");
      numbersCell.textContent = game.drawnNumbers.join(", ");
      row.appendChild(numbersCell);

      tableBody.appendChild(row);
    });
  }
}

function showToast(title, message) {
  // Set the title and message
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;

  // Show the toast
  const toastElement = document.getElementById("alertToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

async function compareNumbers() {
  if (userNumbers.length < 6) {
    showToast("Erro", "Jogo deve possuir ao menos 6 dezenas");
  } else {
    const response = await fetch(
      "https://sergjsilva.github.io/lottery-data/lottery-results.json"
    );
    const data = await response.json();
    const matches = { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
    const tableResult = document.querySelector(".table-section");
    tableResult.style.display = "block";
    userNumbers.sort((a, b) => a - b);
    document.querySelector(
      ".game-table-title"
    ).textContent = `Seu jogo: ${userNumbers.join("-")}`;

    fourMatches = [];
    fiveMatches = [];
    sixMatches = [];

    data.allResults.forEach((game) => {
      const currentGame = [
        game.Bola1,
        game.Bola2,
        game.Bola3,
        game.Bola4,
        game.Bola5,
        game.Bola6,
      ];

      const matchCount = userNumbers.filter((number) =>
        currentGame.includes(number)
      ).length;
      matches[matchCount]++;
      if (matchCount === 4 || matchCount === 5 || matchCount === 6) {
        const gameDetails = {
          concurso: game["Concurso"],
          dataDoSorteio: game["Data do Sorteio"],
          drawnNumbers: currentGame,
        };

        if (matchCount === 4) {
          fourMatches.push(gameDetails);
        } else if (matchCount === 5) {
          fiveMatches.push(gameDetails);
        } else if (matchCount === 6) {
          sixMatches.push(gameDetails);
        }
      }
    });

    const tableBody = document.getElementById("matchesTableBody");
    tableBody.innerHTML = Object.entries(matches)
      .map(([match, freq]) => `<tr><td>${match}</td><td>${freq}</td></tr>`)
      .join("");
    // Scroll to the table section
    tableResult.scrollIntoView({
      behavior: "smooth", // For smooth scrolling
      block: "start", // Aligns the section to the start of the viewport
    });

    // Call the function to populate Nav Tabs Section
    populateMatchesTable(fourMatches, "fourMatchesTableBody");
    populateMatchesTable(fiveMatches, "fiveMatchesTableBody");
    populateMatchesTable(sixMatches, "sixMatchesTableBody");

    document.querySelector(".nav-tab-section").style.display = "block";
  }
}

document.getElementById("playButton").onclick = compareNumbers;
document.getElementById("resetButton").onclick = resetBoard;

createNumberBoard();
