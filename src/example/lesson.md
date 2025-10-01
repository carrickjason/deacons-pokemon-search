# Lesson Plan

## Introduction

Today we will be building a Pokemon grid app using JavaScript.

Introduce working example

## 1. Review HTML

- html, head, body

## 2. Review CSS

- selectors
- properties
- values

## 3. Review JavaScript

- variables
- functions
- loops
- conditionals
- objects
- arrays

## 4. Insert Header and Root Elements

1. Insert Header
```html
<header>
    <h1>Pokemon Search</h1>
</header>
```
2. Style Header
```css
header {
    text-align: center;
    padding: 2rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
```

3. Insert Main
```html
<main>
    <div id="pokemon-grid" class="pokemon-grid"></div>
</main>
```

## 5. Request Pokemon Data
1. Create loadAllPokemon function
```javascript
async function loadAllPokemon() {
    console.log('Loading Pokemon data...');
    // Step 1: Get a list of Pokemon names and URLs in one request
    const listData = await getPokemonList();
    const pokemonList = listData.results;  // Array of {name, url} objects
    
    console.log(`Got list of ${pokemonList.length} Pokemon`);
    
    // Step 2: Get detailed information for each Pokemon
    const detailPromises = pokemonList.map(pokemon => getPokemonDetails(pokemon.url));
    
    // Wait for all the detailed requests to finish
    const pokemonDetails = await Promise.all(detailPromises);
    
    return pokemonDetails;
}
```

2. Call loadAllPokemon function in startApp function
```javascript
    allPokemonData = await loadAllPokemon();
    console.log(`Loaded ${allPokemonData.length} Pokemon!`);
```

3. Inspect logs to see if the data is loading

## 5. Show Pokemon on Page

1. render a single pokemon card
```javascript
// Show createPokemonCard function
// call it with a single pokemon
function showPokemonOnPage(pokemon) {
    const pokemonGrid = document.getElementById('pokemon-grid');
    const pokemon = allPokemonData[0];
    const pokemonCard = createPokemonCard(pokemon);
    pokemonGrid.appendChild(pokemonCard);
}
```

**Add a second pokemon to the page**

2. Style pokemon card
```css
.pokemon-card {
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.pokemon-image {
    width: 120px;
    height: 120px;
    margin: 0 auto 1rem;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #e9ecef;
}
```

3. render all pokemon cards

```javascript
function showPokemonOnPage() {
    const pokemonGrid = document.getElementById('pokemon-grid');
    console.log('Showing Pokemon on the page...');
    
    // Clear any existing Pokemon cards
    pokemonGrid.innerHTML = '';
    
    // Create a card for each Pokemon
    allPokemonData.forEach(pokemon => {
        const pokemonCard = createPokemonCard(pokemon);
        pokemonGrid.appendChild(pokemonCard);
    });
    
    console.log(`Showing ${allPokemonData.length} Pokemon`);
}
```

2. Call showPokemonOnPage function in startApp function

```javascript
    showPokemonOnPage();
```

## 6. Use AI to implement search

Prompt: I want to be able to search for pokemon by name and by type. The search input should be in the header and should include a clear button.  It also show the number of pokemon included in the results.