import * as fs from 'fs';
import * as readline from 'readline-sync';
import { Movie } from './interfaces';

const data = fs.readFileSync('movies.json', 'utf-8');
const movies: Movie[] = JSON.parse(data);

function mainMenu(): void {
    let doorgaan: boolean = true;
    while(doorgaan){
        console.log("Welcome to the JSON data viewer!");
        console.log("1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit");

        const keuze = readline.questionInt("Please enter your choice: ", {limitMessage: "Input must be a number (1-3)"});
        console.log();
        switch (keuze) {
            case 1:
              viewAllMovies();
              break;
            case 2:
              filterById();
              break;
            case 3:
              doorgaan = exitApp();
              break;
            default:
              console.log("Invalid choice!");
              break;
        }
        console.log();
    }
}

function viewAllMovies(): void {
  for (const movie of movies) {
    console.log(`- ${movie.title} (${movie.id})`);
  }
}

function filterById(): void {
  const zoekId = readline.question("Please enter the ID you want to filter by: ");
  let gevonden = false;
  for (const movie of movies) {
    if (movie.id === zoekId) {
      gevonden = true;
      console.log(`- ${movie.title} (${movie.id})`);
      console.log(`  - Description: ${movie.description}`);
      console.log(`  - Genre: ${movie.genre}`);
      console.log(`  - Director: ${movie.director}`);
      console.log(`  - Release Year: ${movie.releaseYear}`);
      console.log(`  - In Theather: ${movie.inTheather}`);
      console.log(`  - Release Date: ${movie.releaseDate}`);
      console.log(`  - Image: ${movie.imageUrl}`);
      console.log(`  - Rating: ${movie.rating}`);
      console.log(`  - Content Rating: ${movie.contentRating}`);
      console.log(`  - Actors: ${movie.actors.join(', ')}`);
      console.log(`  - Studio: ${movie.studio.name}`);
      console.log(`    - Founded: ${movie.studio.foundedYear}`);
      console.log(`    - Founder: ${movie.studio.founder}`);
      console.log(`    - HQ: ${movie.studio.headquarters}`);
      console.log(`    - Logo: ${movie.studio.logoUrl}`);
    }
  }
  if (!gevonden) {
    console.log("ID not found.");
  }
}

function exitApp(): boolean {
  console.log("Goodbye!");
  return false;
}

mainMenu();