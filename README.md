# Consulta Mega-Sena

**Consulta Mega-Sena** is a web application designed to allow users to compare their lottery bets with historical Mega-Sena results. With an intuitive interface, users can select their numbers, check their matches, and view detailed statistics.

## Features

- **Number Selection**: Select up to 15 numbers for your Mega-Sena bet.
- **Historical Comparison**: Compare your selected numbers with historical Mega-Sena results.
- **Interactive Board**: Easy-to-use number board for selecting and resetting numbers.
- **Dynamic Tables**: Displays frequency of matches and detailed game results for 4, 5, and 6 matches.
- **Responsive Design**: Optimized for both desktop and mobile devices using Bootstrap.
- **Similarity Comparison**: Your game will be compared with the latest Mega-Sena draw in the database using Cosine Similarity.

## Example Comparison

Consider the following example where the user bets on the numbers `[1, 5, 23, 30, 32, 44]` and the result for Mega-Sena draw 2809 was:

- **Draw 2809 Result**: 2, 4, 15, 28, 34, 39

The system will calculate the **Cosine Similarity** between the user's game and the last Mega-Sena draw in the database. The similarity will be shown as a percentage, allowing the user to see how close their game is to the actual draw.

## Live Demo

You can try the application [here](https://sergjsilva.github.io/lottery-data/lottery-results.json).

## Technologies Used

- **HTML5**: For structure and content.
- **CSS3**: For styling, including Bootstrap for responsiveness and design.
- **JavaScript**: For interactivity and data handling.
- **Bootstrap**: For a responsive and consistent user interface.
- **Fetch API**: To retrieve historical lottery data.
- **Cosine Similarity Algorithm**: Used to compare the user's game with the latest draw.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sergjsilva/consulta-mega-sena.git
   ```
