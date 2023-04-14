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
      filename: dbPath,
      driver: sqlite3.Database,
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

const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieNames = `SELECT movie_name FROM movie;`;
  const movieName = await database.get(getMovieNames);
  response.send(
    movieName.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postQuery = `
    INSERT INTO movie (director_id,movie_name,lead_actor) VALUES 
    (${directorId},'${movieName}','${leadActor}');`;
  await database.run(postQuery);
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
  const directors = await database.all(directorQuary);
  response.send(
    directors.map((eachDirector) =>
      convertDirectorDbObjectToResponseObject(eachDirector)
    )
  );
});

app.get("/directors/", async (request, response) => {
  const getDirectorsDetails = `
    SELECT * FROM director;`;
  const directorsDetails = await database.all(getDirectorsDetails);
  response.send(directorsDetails);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id='${directorId}';`;
  const moviesArray = await database.all(getDirectorMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});
module.exports = app;
