let data = null;
let lastMegaGame = [];
let userNumbers = [];
let fourMatches = [];
let fiveMatches = [];
let sixMatches = [];

const maxNumbers = 15;

async function fetchLastResult() {
  data = await getDatabase();

  // Extract the last result
  const lastResult = data.allResults[data.allResults.length - 1];
  lastMegaGame = [
    lastResult.Bola1,
    lastResult.Bola2,
    lastResult.Bola3,
    lastResult.Bola4,
    lastResult.Bola5,
    lastResult.Bola6,
  ];
  // Update HTML elements with the last result
  document.getElementById("concurso").textContent = lastResult.Concurso;
  document.getElementById("date").textContent = formatDateToPortuguese(
    lastResult["Data do Sorteio"]
  );
  document.getElementById("bola1").textContent = lastResult.Bola1;
  document.getElementById("bola2").textContent = lastResult.Bola2;
  document.getElementById("bola3").textContent = lastResult.Bola3;
  document.getElementById("bola4").textContent = lastResult.Bola4;
  document.getElementById("bola5").textContent = lastResult.Bola5;
  document.getElementById("bola6").textContent = lastResult.Bola6;
  document.getElementById("lastConcurso").textContent = lastResult.Concurso;

  const winnersElement = document.getElementById("winners");
  winnersElement.textContent = lastResult["Ganhadores 6 acertos"];

  if (lastResult["Ganhadores 6 acertos"] === 0) {
    const acumulouMessage = document.createElement("span");
    acumulouMessage.textContent = " Acumulou!!";
    acumulouMessage.style.fontSize = "1.5em"; // Aumenta o tamanho da fonte
    acumulouMessage.style.color = "red"; // Define a cor como vermelho
    acumulouMessage.style.fontWeight = "bold"; // Deixa o texto em negrito
    winnersElement.appendChild(acumulouMessage);
  }
}

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

function compareNumbers() {
  if (userNumbers.length < 6) {
    showToast("Erro", "O jogo seu deve possuir ao menos 6 dezenas");
  } else {
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
  }

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

function formatDateToPortuguese(dateString) {
  // Split the dateString (DD/MM/YYYY) to extract day, month, and year
  const [day, month, year] = dateString.split("/");

  // Create a new Date object using the extracted values
  const date = new Date(`${year}-${month}-${day}`);

  // Format the date to the desired string in Portuguese
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long", // Full name of the day (e.g., "Sábado")
    day: "numeric", // Numeric day (e.g., "28")
    month: "long", // Full name of the month (e.g., "Setembro")
    year: "numeric", // Full year (e.g., "2024")
  });

  // Capitalize the first letter of the weekday
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

async function getDatabase() {
  try {
    // Define the path to the JSON file in the 'database' folder
    const dataPath = "./database/lottery-results.json";

    // Fetch the file
    const response = await fetch(dataPath);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch database: ${response.statusText}`);
    }

    // Parse and return the JSON content
    return await response.json();
  } catch (error) {
    console.error("Error fetching the database file:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

document.getElementById("playButton").onclick = compareNumbers;
document.getElementById("resetButton").onclick = resetBoard;

fetchLastResult();
createNumberBoard();
