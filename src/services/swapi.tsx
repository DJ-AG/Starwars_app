import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';

export const fetchCharacters = async (page: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/people/?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCharacterByName = async (searchTerm: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/people/?search=${searchTerm}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFilms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}films/`);
    return response.data.results.map((film: any) => ({
      title: film.title,
      id: film.url.match(/\/films\/(\d+)\//)[1]
    }));
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error;
  }
};

export const fetchFilmDetails = async (filmId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}films/${filmId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching film details:', error);
    throw error;
  }
};

export const fetchCharacterDetailsByUrl = async (characterUrl: string) => {
  try {
    const response = await axios.get(characterUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching character details:', error);
    throw error;
  }
};

export const fetchSpecies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}species/`);
    return response.data.results.map((species: any) => ({
      name: species.name,
      id: species.url.match(/\/species\/(\d+)\//)[1]
    }));
  } catch (error) {
    console.error('Error fetching species:', error);
    throw error;
  }
};

export const fetchPlanets = async () => {
  try {
    const response = await axios.get(`${BASE_URL}planets/`);
    return response.data.results.map((planet: any) => ({
      name: planet.name,
      id: planet.url.match(/\/planets\/(\d+)\//)[1]
    }));
  } catch (error) {
    console.error('Error fetching planets:', error);
    throw error;
  }
};

export const fetchSpeciesDetails = async (speciesId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}species/${speciesId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching species details:', error);
    throw error;
  }
};

export const fetchPlanetDetails = async (planetId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}planets/${planetId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching planet details:', error);
    throw error;
  }
};

export const fetchCharacterImageByName = async (name: string) => {
  try {
    // Use the base URL for the new API
    const baseURL = 'https://akabab.github.io/starwars-api/api';
    // Fetch all characters
    const allCharactersResponse = await axios.get(`${baseURL}/all.json`);
    // Find the character by name
    const character = allCharactersResponse.data.find(
      (char: any) => char.name === name
    );
    // Return the image URL if the character is found, otherwise return null
    return character ? character.image : 'https://placehold.co/600x400?text=:(';
  } catch (error) {
    console.error('Error fetching character image by name:', error);
    return 'https://placehold.co/600x400?text=:(';
  }
};
