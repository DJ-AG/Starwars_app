export interface UnifiedCharacterType {
  id: string;
  name: string;
  image?: string | null;
  url: string;
  birth_year?: string;
  mass?: string;
  created?: string;
  films?: string[];
  homeworldDetails?: {
    name: string;
    terrain: string;
    climate: string;
    population: string;
  };
  speciesDetails?: {
    name: string;
    classification: string;
    designation: string;
    language: string;
  };
  gender?: string;
  height?: number;
  species?: string;
  onClick?: (character: UnifiedCharacterType) => void;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

// Inside or imported into swapi.tsx

export interface FilmResponse {
  title: string;
  url: string;
  // Add other fields as necessary
}

export interface SpeciesResponse {
  name: string;
  url: string;
  // Add other fields as necessary
}

export interface PlanetResponse {
  name: string;
  url: string;
  // Add other fields as necessary
}
