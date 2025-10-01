const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

async function getPokemonList() {
    const response = await fetch(API_URL);
    return await response.json();
}

async function getPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}