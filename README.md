# SWcharacter-app

**SWcharacter-app** is a UI frontend application where users can retrieve information about Star Wars characters and their backgrounds from the SWAPI API. However, due to data inconsistencies in the SWAPI API, many details are missing, including images. To address this issue, another API, [https://akabab.github.io/starwars-api/api](https://akabab.github.io/starwars-api/api), is used to fetch images based on the character names provided by the SWAPI API.

## Features

- **Authentication**: Upon visiting the website, users are greeted by a login screen. Although authentication is not required by the SWAPI API, it has been implemented for visual appeal. Users can use any username and password combination to log in, and a mock JWT token is generated.
- **Search and Filter**: Users can search through the SWAPI API for their favorite Star Wars characters. Additionally, they can filter characters by movie, species, or homeworld. However, due to missing data in the SWAPI API, some filtered searches may yield unexpected results.

## Running the App

To run this app, ensure you have the following dependencies installed:

```bash
npm install
Then, you can use the following scripts:

Development: Run npm run dev to start the development server.

Building: Use npm run build to build the project.

Linting: Run npm run lint to lint the code.

Testing: Use npm test to run tests.

Project Link
Access the project on Netlify: https://swcharacter-app.netlify.app/characters

Dependencies
Here are the key dependencies used in this project:

React: JavaScript library for building user interfaces.
React Router DOM: Routing library for React applications.
Axios: Promise-based HTTP client for making requests.
FontAwesome: Icon library for React applications.
For more details, refer to the package.json file.
```
