const express = require("express");
const Multer = require("multer");

const authMiddleware = require("./middleware/authorization");

const studentController = require("./controllers/students");
const questionController = require("./controllers/questions");
const answersController = require("./controllers/answer");
const feedController = require("./controllers/feed");
const sessionController = require("./controllers/sessions");

const studentValidators = require("./validators/students");
const questionValidators = require("./validators/questions");
const answerValidators = require("./validators/answers");

const routes = express.Router();

const multer = Multer({
    storage: Multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, callback) => {
            const filename = Date.now() + "." + file.originalname.split(".").pop();

            return callback(null, filename);

        }
    })
});

routes.post("/upload", multer.single("arquivo"), (req, res) => {
    console.log(req.file);

    res.send(req.file);
});

//Rotas públicas
routes.post("/sessions", sessionController.store);

routes.post("/students", studentValidators.create, studentController.store);

routes.use(authMiddleware);


//Rotas de Alunos
routes.get("/students", studentController.index);

routes.get("/students/:id", studentController.find);

routes.delete("/students/:id", studentController.delete);

routes.put("/students/:id", studentController.update);

//Rotas de Perguntas
routes.post("/questions", questionValidators.create, questionController.store);

routes.put("/questions/:id", questionController.update);

routes.delete("/questions/:id", questionController.delete);

module.exports = routes;

//Rotas de Respostas

routes.post("/questions/:id/answers", answerValidators.create, answersController.store);

//Rotas do feed

routes.get("/feed", feedController.index);

module.exports = routes;

