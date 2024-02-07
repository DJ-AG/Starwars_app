import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/';

export const fetchCharacters = async (page: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/people/?page=${page}`);
    console.log(response.data);
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
    console.log('Species', response.data.results);
    return response.data.results.map((species) => ({
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
    console.log('Planets', response.data.results);
    return response.data.results.map((planet) => ({
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
    console.log('Species Details', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching species details:', error);
    throw error;
  }
};

export const fetchPlanetDetails = async (planetId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}planets/${planetId}/`);
    console.log('Planet Details', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching planet details:', error);
    throw error;
  }
};
