import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './Landing.css';
import {
  fetchCharacters,
  fetchCharacterByName,
  fetchCharacterDetailsByUrl,
  fetchFilmDetails,
  fetchSpeciesDetails,
  fetchPlanetDetails,
  fetchFilms,
  fetchSpecies,
  fetchPlanets
} from '../../services/swapi';
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import { UnifiedCharacterType } from '../../types'; // Assuming this import path is correct

const Landing: React.FC = () => {
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [characters, setCharacters] = useState<UnifiedCharacterType[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<UnifiedCharacterType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    film: null,
    species: null,
    planet: null
  });
  const [totalPages, setTotalPages] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [films, setFilms] = useState<{ title: string; id: string }[]>([]);
  const [species, setSpecies] = useState<{ name: string; id: string }[]>([]);
  const [planets, setPlanets] = useState<{ name: string; id: string }[]>([]);
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [filmsData, speciesData, planetsData] = await Promise.all([
          fetchFilms(),
          fetchSpecies(),
          fetchPlanets()
        ]);
        setFilms(filmsData);
        setSpecies(speciesData);
        setPlanets(planetsData);
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };

    fetchFiltersData();
  }, []);

  const loadMoreCharacters = useCallback(async () => {
    if (isLoading || !nextPage || nextPage === 'null') return; // Check if there's a next page
    setIsLoading(true);
    try {
      const data = await fetchCharacters(parseInt(nextPage));
      setCharacters((prev) => [...prev, ...data.results]);
      setNextPage(
        data.next ? new URL(data.next).searchParams.get('page') : null
      );
    } catch (error) {
      console.error('Failed to load more characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextPage, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !areFiltersApplied // Check if filters are not applied
      ) {
        loadMoreCharacters();
      }
    };

    if (!areFiltersApplied) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreCharacters, areFiltersApplied]);

  useEffect(() => {
    const loadCharactersForCurrentPage = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCharacters(currentPage);
        setCharacters(data.results); // Assuming fetchCharacters now correctly maps to UnifiedCharacterType
        updatePagination(data.next, data.previous);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialDataLoaded) {
      loadCharactersForCurrentPage();
    }
  }, [currentPage, initialDataLoaded]);

  const loadCharacters = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacters(page);
      setCharacters(data.results);
      updatePagination(data.next, data.previous);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = async () => {
    setIsLoading(true);
    setCharacters([]);
    setAreFiltersApplied(false);
    setSelectedFilters({
      film: null,
      species: null,
      planet: null
    });
    await loadCharacters();
  };

  const updatePagination = (next: string | null, previous: string | null) => {
    setNextPage(next ? new URL(next).searchParams.get('page') : null);
    setPrevPage(previous ? new URL(previous).searchParams.get('page') : null);
  };

  const handleSearchByName = debounce(async (query: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacterByName(query);
      setCharacters(data.results);
      setTotalPages(Math.ceil(data.count / 10));
      resetPagination();
    } catch (error) {
      console.error('Failed to search characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleCharacterClick = async (characterProp: UnifiedCharacterType) => {
    try {
      const detailedCharacter = await fetchCharacterDetailsByUrl(
        characterProp.url
      );
      if (detailedCharacter.homeworld) {
        const homeworldId =
          detailedCharacter.homeworld.match(/\/planets\/(\d+)\/$/)[1];
        if (homeworldId) {
          const homeworldDetails = await fetchPlanetDetails(homeworldId);
          detailedCharacter.homeworldDetails = homeworldDetails;
        }
      }

      // Fetch species details if species URL is present
      if (detailedCharacter.species && detailedCharacter.species.length > 0) {
        const speciesId =
          detailedCharacter.species[0].match(/\/species\/(\d+)\/$/)[1];
        if (speciesId) {
          const speciesDetails = await fetchSpeciesDetails(speciesId);
          detailedCharacter.speciesDetails = {
            name: speciesDetails.name,
            classification: speciesDetails.classification,
            designation: speciesDetails.designation,
            averageHeight: speciesDetails.average_height,
            language: speciesDetails.language
          };
        }
      }
      setSelectedCharacter(detailedCharacter);
    } catch (error) {
      console.error('Failed to fetch character details:', error);
    } finally {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  // Handle filter change
  const handleFilterChange = async (
    filterType: string,
    filterValue: string | null
  ) => {
    if (filterType === 'reset') {
      resetFilters();
    } else {
      const updatedFilters = { ...selectedFilters, [filterType]: filterValue };
      setSelectedFilters(updatedFilters);
      applyFilters(updatedFilters);
      setAreFiltersApplied(true); // Indicate that filters are applied
    }
  };

  // Apply filters and fetch filtered characters
  const applyFilters = async (filters: any) => {
    setIsLoading(true);
    setCharacters([]); // Clear characters before applying new filters

    try {
      let characterUrls = new Set();

      // Fetch characters based on film filter if set
      if (filters.film) {
        const filmDetails = await fetchFilmDetails(filters.film);
        filmDetails.characters.forEach((url: string) => characterUrls.add(url));
      }

      // Fetch characters based on species filter if set
      if (filters.species) {
        const speciesDetails = await fetchSpeciesDetails(filters.species);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              speciesDetails.people.includes(url)
            )
          );
        } else {
          speciesDetails.people.forEach((url: string) =>
            characterUrls.add(url)
          );
        }
      }

      // Fetch characters based on planet filter if set
      if (filters.planet) {
        const planetDetails = await fetchPlanetDetails(filters.planet);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              planetDetails.residents.includes(url)
            )
          );
        } else {
          planetDetails.residents.forEach((url: string) =>
            characterUrls.add(url)
          );
        }
      }

      // If no filter is set, load characters normally without pagination
      if (!filters.film && !filters.species && !filters.planet) {
        loadCharacters();
        return;
      }

      // Fetch detailed character information for the filtered URLs
      const charactersData =
        characterUrls.size > 0
          ? await Promise.all(
              [...characterUrls].map((url) =>
                fetchCharacterDetailsByUrl(url as string)
              )
            )
          : [];

      setCharacters(charactersData);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPagination = () => {
    setNextPage(null);
    setPrevPage(null);
  };

  return (
    <div className="center-container">
      <Header
        onSearch={handleSearchByName}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        films={films}
        species={species}
        planets={planets}
      />
      {isLoading && <Loader />}
      <div className="card-container">
        {characters.map((character, index) => (
          <Character
            key={index}
            character={character}
            onClick={() => handleCharacterClick(character)}
          />
        ))}
      </div>
      {isModalOpen && selectedCharacter && (
        <CharacterModal character={selectedCharacter} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Landing;
