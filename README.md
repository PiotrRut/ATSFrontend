# :airplane: Air Ticket Sales System (Front end)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b3cc5e5c-2cb3-4899-8565-fc0d27198284/deploy-status)](https://app.netlify.com/sites/ats-group6/deploys)


This repository contains the full source code of my group's solution to the 2nd year group project at City, University of London.

We have been asked to build from the bottom a fully functional system that will keep records of tickets sold by a travel agency to customers, and produce reports required by an airline. All parts of the system are based on exact specification and requirements provided to the students by the University.

### Our solution

We have chosen to create the system as a web app, based purely on React for the user interface, and Node & Express server-side, with MongoDB as our database. There is a separate repository for backend to this project, which handles the server requests and database connection, and is available [here](https://github.com/PiotrRut/ATSBackend).

Since the project specification does not require the system to be working on mobile phones, there is no mobile and responsiveness optimisation to this web app.

### Installation

In order to run the front on of the website, clone this repository, and run `yarn start` inside it. This will run the app in development mode, available at http://localhost:3000.
