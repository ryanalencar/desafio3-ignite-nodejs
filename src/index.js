const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

let repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.indexOf(repository);

  const newRepository = {
    ...repository,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete(
  "/repositories/:id",
  checkIfRepositoryExists,
  (request, response) => {
    const { repository } = request;

    repositories = repositories.filter((repo) => repo.id !== repository.id);

    return response.status(204).json(repositories);
  }
);

app.post(
  "/repositories/:id/like",
  checkIfRepositoryExists,
  (request, response) => {
    const { repository } = request;

    const repositoryIndex = repositories.indexOf(repository);

    const newRepository = {
      ...repository,
      likes: repositories[repositoryIndex].likes + 1,
    };

    repositories[repositoryIndex] = newRepository;

    return response.json(newRepository);
  }
);

module.exports = app;
