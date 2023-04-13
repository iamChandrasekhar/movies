const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");
const app = express();

app.use(express.json());
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (require, response) => {
  const getMovieNames = `SELECT movie_name FROM movie;`;
  const movieName = await dataBase.run(getMovieNames);
  response.send("Succes");
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postQuary = `
    INSERT INTO movie (director_id,movie_name,lead_actor) VALUES (${directorId},'${movieName}','${leadActor}');`;
  const postDetails = await database.run(postQuary);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuary = `
    SELECT * FROM movie WHERE movie_id =${movieId};`;
  const movie = await database.get(movieQuary);
  response.send(convertDbObjectToResponseObject(movie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateQuary = `
    UPDATE movie SET director_id = ${directorId},movie_name='${movieName}',lead_actor ='${leadActor}' WHERE movie_id = ${movieId};`;
  await database.run(updateQuary);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuary = `
    DELETE FROM movie WHERE movie_id = ${movieId};`;
  await database.run(deleteQuary);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const directorQuary = `SELECT * FROM director`;
  const directors = await database.run(directorQuary);
  response.send(directors);
});

app.get("/directors/:directorId/movies/", async (request, response) => {});
module.exports = app;
