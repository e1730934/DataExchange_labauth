const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database("./school.db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("./middleware/auth");
const {validateUserSignUp, userValidation} = require("./middleware/validation/user");
const {registerUser} = require("./controllers/user");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config(); //Obtenir des variables d'environnement à partir de fichiers .env
//La bibliothèque dotenv, qui nous permet de charger
//des variables d'environnement à partir d'un fichier,
//peut être utilisée. Chaque environnement possède
//ses propres informations de configuration,
//qui peuvent être un jeton, des informations
// d'identification de base de données, etc.
//Les configurations séparées facilitent le déploiement
// de notre application dans différents environnements.

    const app = express();
    const router = express.Router();

    router.use(bodyParser.urlencoded({extended: false}));
    router.use(bodyParser.json());

const swaggerOptions = {
    swaggerDefinition : {
        info: {
            title: "School API",
            description: "School API Information",
            contact: {
                name: "Bilal Khendaf"
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ["index.js"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(router);
const port = process.env.PORT || 3000;



const updateUser = (name, email, cb) => {
    return database.get(`UPDATE users
                         set name =?
                         WHERE email = ?`, name, email, (err, row) => {
        cb(err, row)
    });
}


const createUsersTable = () => {
    const sqlQuery = `CREATE TABLE IF NOT EXISTS users
                      (
                          id
                          integer
                          PRIMARY
                          KEY,
                          name
                          text,
                          email
                          text
                          UNIQUE,
                          password
                          text
                      )`;
    return database.run(sqlQuery);
}

const findUserByEmail = (email, cb) => {
    return database.get(`SELECT *
                         FROM users
                         WHERE email = ?`, [email], (err, row) => {
        cb(err, row)
    });
}

const createUser = (user, cb) => {
    return database.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', user, (err) => {
        cb(err)
    });
}
createUsersTable();

router.get('/', (req, res) => {
    res.status(200).send('Ceci est un serveur d authentification');
});


router.post('/register', validateUserSignUp, userValidation, registerUser)


router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        if (!user) return res.status(404).send('User not found!');
        const result = bcrypt.compareSync(password, user.password);
        if (!result) return res.status(401).send('Password not valid!');

        const expiresIn = 24 * 60 * 60 ;
        const accessToken = jwt.sign({id: user.id}, process.env.TOKEN_KEY, {
            expiresIn: expiresIn
        });
        res.status(200).send({"access_token": accessToken, "expires_in": expiresIn});
    });
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        schema:
 *          type: string
 *          minimum: 1
 *          description: The email of the user
 */
router.get('/user/:email', (req, res) => {
    console.log(req.params.email)
    findUserByEmail(req.params.email, (err, user) => {
        if (err) return res.status(500).send('Server error');
        if (!user) return res.status(404).send('User not found!');
        res.status(200).send({
            "user": user
        });
    });
});


router.put('/updateUser/:email', (req, res) => {
    findUserByEmail(req.params.email, (err, user) => {
        if (err) return res.status(500).send('Server error');
        if (!user) return res.status(404).send('User not found!');
        updateUser(req.body.name, req.params.email, (err) => {
            if (err) {
                return res.status(500).send("Server error!!!!");

            }
            res.status(200).send({
                "Message": "User modifié!!"
            });
        });

    });
});


app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Bienvenue, votre Jeton est valid!!");
});


const server = app.listen(port, () => {
    console.log(`L'API peut maintenant recevoir des requêtes http://localhost:` + port);
});
