export type Character = {
  name?: string;
  bornLocation?: string;
  diedLocation?: string;
  homeworld?: string;
  affiliations?: string[];
  apprentices?: string[];
  gender?: string;
  dimensions?: number;
  species?: string;
  wiki?: string;
  image?: string;
};

export type CharacterProps = {
  character: {
    id: string;
    name: string;
    image: string;
  };
  onClick: (character: CharacterProps['character']) => void; // Adding onClick handler
};

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};
