// Global variables to store our data
let allPokemonData = [];        // All Pokemon we loaded from the internet

/**
 * This is the main function that starts everything
 * It's like the "start button" for our app
 */
async function startApp() {
    console.log('Starting Pokemon app...');
    
    // TODO:Load Pokemon data from the internet
    // TODO:Render Pokemon on page
    
    console.log('Pokemon app is ready!');
}

/**
 * TODO: Implement this function
 * Loads Pokemon data from the PokeAPI
 * This function gets the first 151 Pokemon (Generation 1)
 */


/**
 * TODO: Implement this function
 * Shows Pokemon cards on the webpage
 * This function creates the visual cards and puts them on the page
 */

function createPokemonCard(pokemon) {
    // Create a new div element for the card
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    
    // Get the Pokemon's image, with a fallback if no image exists
    const imageUrl = pokemon.sprites?.front_default || 
                    pokemon.sprites?.other?.['official-artwork']?.front_default
    
    // Get the Pokemon's types (like Fire, Water, Grass, etc.)
    const types = pokemon.types?.map(type => type.type.name) || ['unknown'];
    
    // Create the HTML content for the card
    card.innerHTML = `
        <div class="pokemon-image">
            <img src="${imageUrl}" alt="${pokemon.name}" loading="lazy">
        </div>
        <div class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</div>
        <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
        <div class="pokemon-types">
            ${types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
        </div>
    `;
    
    // Add a click event so users can click the card to see more details
    card.addEventListener('click', () => {
        showPokemonDetails(pokemon);
    });
    
    return card;
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function showPokemonDetails(pokemon) {
    // Get the Pokemon's types and join them with commas
    const types = pokemon.types?.map(type => type.type.name).join(', ') || 'Unknown';
    
    // Convert height from decimeters to meters (divide by 10)
    const height = pokemon.height ? (pokemon.height / 10).toFixed(1) : 'Unknown';
    
    // Convert weight from hectograms to kilograms (divide by 10)
    const weight = pokemon.weight ? (pokemon.weight / 10).toFixed(1) : 'Unknown';
    
    // Show an alert popup with the Pokemon's details
    alert(`${capitalizeFirstLetter(pokemon.name)}
ID: #${pokemon.id}
Types: ${types}
Height: ${height}m
Weight: ${weight}kg`);
}

/**
 * This code runs when the webpage finishes loading
 * It starts our Pokemon app
 */
document.addEventListener('DOMContentLoaded', () => {
    startApp();
});