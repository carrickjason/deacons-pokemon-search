/**
 * Pokemon App - A simple functional approach to building a Pokemon grid
 * This version uses simple functions instead of classes to make it easier to understand
 */

// Global variables to store our data
let allPokemonData = [];        // All Pokemon we loaded from the internet
let filteredPokemonData = [];   // Pokemon that match our search

// Get references to HTML elements we'll be working with
const pokemonGrid = document.getElementById('pokemon-grid');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-search');

/**
 * This is the main function that starts everything
 * It's like the "start button" for our app
 */
async function startApp() {
    console.log('Starting Pokemon app...');
    
    // Step 1: Load Pokemon data from the internet
    allPokemonData = await loadAllPokemon();
    console.log(`Loaded ${allPokemonData.length} Pokemon!`);
    
    // Step 2: Set up the search functionality
    setupSearch();
    
    // Step 3: Show all the Pokemon on the webpage
    showPokemonOnPage();
    
    // Step 4: Hide the loading message and enable search
    hideLoadingMessage();
    enableSearchInput();
    
    console.log('Pokemon app is ready!');
}

/**
 * Loads Pokemon data from the PokeAPI
 * This function gets the first 151 Pokemon (Generation 1)
 */
async function loadAllPokemon() {
    console.log('Loading Pokemon data...');
    
    try {
        // Step 1: Get a list of Pokemon names and URLs in one request
        const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        
        if (!listResponse.ok) {
            throw new Error(`Failed to get Pokemon list: ${listResponse.status}`);
        }
        
        const listData = await listResponse.json();
        const pokemonList = listData.results;  // Array of {name, url} objects
        
        console.log(`Got list of ${pokemonList.length} Pokemon`);
        
        // Step 2: Get detailed information for each Pokemon
        const detailPromises = pokemonList.map(pokemon => 
            getPokemonDetails(pokemon.url)
        );
        
        // Wait for all the detailed requests to finish
        const pokemonDetails = await Promise.all(detailPromises);
        
        return pokemonDetails;
    } catch (error) {
        console.error('Error loading Pokemon:', error);
        throw error;
    }
}

/**
 * Gets detailed information about one Pokemon from a URL
 * @param {string} url - The URL to get Pokemon data from
 */
async function getPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}

/**
 * Shows Pokemon cards on the webpage
 * This function creates the visual cards and puts them on the page
 */
function showPokemonOnPage() {
    console.log('Showing Pokemon on the page...');
    
    // Clear any existing Pokemon cards
    pokemonGrid.innerHTML = '';
    
    // Decide which Pokemon to show (all or filtered)
    const pokemonToShow = filteredPokemonData.length > 0 ? filteredPokemonData : allPokemonData;
    
    // Create a card for each Pokemon
    pokemonToShow.forEach(pokemon => {
        const pokemonCard = createPokemonCard(pokemon);
        pokemonGrid.appendChild(pokemonCard);
    });
    
    // Update the search results counter
    updateSearchResultsCounter(pokemonToShow.length);
    
    console.log(`Showing ${pokemonToShow.length} Pokemon`);
}

/**
 * Creates a visual card for one Pokemon
 * @param {Object} pokemon - The Pokemon data
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

/**
 * Makes the first letter of a word uppercase
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with the first letter capitalized
 * Example: "pikachu" becomes "Pikachu"
 */
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Shows detailed information about a Pokemon when clicked
 * @param {Object} pokemon - The Pokemon data
 */
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
 * Sets up the search functionality
 * This function connects the search input to our filter function
 */
function setupSearch() {
    console.log('Setting up search...');
    
    // Listen for typing in the search input (real-time search)
    searchInput.addEventListener('input', (event) => {
        filterPokemon(event.target.value);
    });
    
    // Listen for the clear button click
    clearButton.addEventListener('click', () => {
        clearSearch();
    });
    
    // Listen for Escape key to clear search
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            clearSearch();
        }
    });
}

/**
 * Enables the search input after data is loaded
 */
function enableSearchInput() {
    searchInput.disabled = false;
    clearButton.disabled = false;
    searchInput.placeholder = 'Search Pokemon by name...';
    console.log('Search is now enabled!');
}

/**
 * Filters Pokemon based on what the user types
 * @param {string} searchText - The text the user typed
 */
function filterPokemon(searchText) {
    // Convert search text to lowercase for case-insensitive search
    const searchTerm = searchText.toLowerCase().trim();
    
    if (searchTerm === '') {
        // If search is empty, clear the filtered results
        filteredPokemonData = [];
    } else {
        // Filter Pokemon that match the search term
        filteredPokemonData = allPokemonData.filter(pokemon => {
            // Check if the Pokemon name contains the search term
            return pokemon.name.toLowerCase().includes(searchTerm);
        });
    }
    
    // Show the filtered results on the page
    showPokemonOnPage();
    
    // Update the clear button state
    updateClearButton();
}

/**
 * Clears the search and shows all Pokemon
 */
function clearSearch() {
    searchInput.value = '';
    filteredPokemonData = [];
    showPokemonOnPage();
    updateClearButton();
    
    // Focus back on the search input
    searchInput.focus();
}

/**
 * Updates the clear button's disabled state
 */
function updateClearButton() {
    const hasSearchText = searchInput.value.trim() !== '';
    clearButton.disabled = !hasSearchText;
}

/**
 * Updates the search results counter
 * @param {number} count - Number of Pokemon currently displayed
 */
function updateSearchResultsCounter(count) {
    // Remove any existing results counter
    const existingCounter = document.querySelector('.search-results');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Only show counter if we're filtering (not showing all Pokemon)
    if (filteredPokemonData.length > 0) {
        const counter = document.createElement('div');
        counter.className = 'search-results';
        counter.textContent = `Showing ${count} of ${allPokemonData.length} Pokemon`;
        
        // Insert the counter after the search container
        const searchContainer = document.querySelector('.search-container');
        searchContainer.parentNode.insertBefore(counter, searchContainer.nextSibling);
    }
}

/**
 * Hides the loading message
 */
function hideLoadingMessage() {
    loadingElement.style.display = 'none';
}

/**
 * This code runs when the webpage finishes loading
 * It starts our Pokemon app
 */
document.addEventListener('DOMContentLoaded', () => {
    startApp();
});