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
