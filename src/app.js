const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());

// Todas as rotas dependem da criação de um repositório
const repositories = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);

  return next(); // Chamada para o próximo middleware
};

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository ID' });
  }

  return next();
};

// function aumentarLikes(request, response, next) {
//   var like = 0;
//   var nLikes = like++;
//   const { likes } = nLikes

//   console.log(nLikes);

//   return next();
// };

app.use(logRequest);
app.use("/project/:id", validateRepositoryId)

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  const result = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }
  
  const repository = {
    id,
    title,
    url,
    techs,
    // Como não se pode colocar o número de likes manualmente, procuramos no array repositories o repositório que tenha o index em questão
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  // Procurando o repositório com o ID (findIndex) => para cada repositório, procurar aquele que o repository.id seja igual ao id repositoryIndex
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: "Repository Not Found" });
  } else{
    repositories.splice(repositoryIndex, 1);
  };


  return res.status(204).send();
});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  // const { title, url, techs } = request.query;
  // const { likes } = request.aumentarLikes(nLikes);

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  // const repository = {
  //   id,
  //   title,
  //   url,
  //   techs,
  //   likes: repositories[repositoryIndex].likes ++
  // }

  repositories[repositoryIndex].likes ++

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
