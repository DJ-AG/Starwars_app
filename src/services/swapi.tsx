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
