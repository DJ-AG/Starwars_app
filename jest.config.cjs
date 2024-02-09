module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/components/CharacterModal/CharacterModal.css'
  }
};
