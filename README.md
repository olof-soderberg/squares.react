<!-- ABOUT THE PROJECT -->
## About The Project

This is the React.js webapp for the application Squares.
<br>
Squares is a project driven by passion for the creation of potentially an infinite amount of squares, each with a different color from the last!
Functionality includes, but might not be limited to, adding and clearing all squares.

<img width="381" height="356" alt="image" src="https://github.com/user-attachments/assets/d1f5c9ac-e368-4e7e-a55a-47bfd088157b" />


### Built With

[![React][React.js]][React-url]

# Getting Started

Download the code and follow installation steps below. 
<br>
**Obs**. This guide is for Windows only at the moment.

## Prerequisites

The easiest way of running this app is by building and running both the api and react app with docker.
That way there are less dependencies, but you still need Docker in some form to build the images and run the containers.

### Docker
* Docker
  ```sh
  winget install -e --id Docker.DockerDesktop
  ```
### Non Docker
* Node/NPM
  ```sh
  winget install -e --id OpenJS.NodeJS
  ```

## Installation

### Docker 
1. Open up a terminal in main folder
2. Build React app docker image
   ```sh
   docker build -f squares.react/Dockerfile -t squares-react .   
   ```
3. Run React app docker container
   ```js
   docker run -p 3000:3000 squares-react
   ```
4. Run the api ([Follow guide](https://github.com/olof-soderberg/Squares.Backend?tab=readme-ov-file#getting-started))
5. Open browser [http://localhost:3000)](http://localhost:3000)

### Non Docker
1. Open up a terminal in main folder
2. Go to folder /squares.react
3. Build React app
   ```sh
   npm install
   ```
4. Run React app
   ```sh
   npm run dev
   ```
5. Run the api ([Follow guide](https://github.com/olof-soderberg/Squares.Backend?tab=readme-ov-file#getting-started))
6. Open browser [http://localhost:3000)](http://localhost:3000)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
