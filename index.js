const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database("./school.db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("./middleware/auth");
const {validateUserSignUp, userValidation} = require('./middleware/validation/user')
const {registerUser} = require('./controllers/user')
const docs = require('./docs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const path = require('path');


require("dotenv").config(); //Obtenir des variables d'environnement à partir de fichiers .env
//La bibliothèque dotenv, qui nous permet de charger 
//des variables d'environnement à partir d'un fichier, 
//peut être utilisée. Chaque environnement possède 
//ses propres informations de configuration, 
//qui peuvent être un jeton, des informations
// d'identification de base de données, etc. 
//Les configurations séparées facilitent le déploiement
// de notre application dans différents environnements.
// https://swagger.io/specification/#infoObject

// const swaggerOptions = {
//   swaggerDefinition : {
//       info: {
//           title: 'School API',
//           description: 'Student API information',
//           contact: {
//               name: 'Lorry James'
//           },
//           server: ["http://localhost:3000"]
//       }
//   },
//   apis: ["index.js"]
// };

//const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended : false }));
router.use(bodyParser.json());

//router.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(docs));

//storage engine
const storage = multer.diskStorage({
    destination: './upolad/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});


const upload = multer ({
   storage: storage,
   limits: {fileSize: 1024*1024*10}
});

//router.use('/profile ', express.static('/upload/images'));


router.post("/upload", upload.single('profile'), (req, res) =>{
    console.log(req.file);

    res.json({
        success : true,
        profile_url: `http://localhost:3000/profile/${req.file.filename}`
    })
});

function erHandler(err, req, res, next){
    if(err instanceof multer.MulterError){
        res.json ({
            success: false,
            message: err.message
        })
    }
}

router.use(erHandler);

 router.get('/users', (req, res, next) => {
    findAllUsers((err, users) => {
        if (err) return res.status(500).send('Server error!');
        if (!users) return res.status(404).send('No Users found!');
        res.status(200).send({
            "users": users
        });
    //res.json([{id: 1, name: 'James'}, {id: 2, name: 'Lorry'}])
    });
});
    
router.get('/', (req, res) => {
    res.status(200).send('Ceci est un serveur d authentification');
});

router.post('/register', validateUserSignUp, userValidation,registerUser);



router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        if (!user) return res.status(404).send('User not found!');
        const result = bcrypt.compareSync(password, user.password);
        if (!result) return res.status(401).send('Password not valid!');

        const expiresIn = 20;
        const accessToken = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, {
            expiresIn: expiresIn
        });
        res.status(200).send({"access_token": accessToken, "expires_in": expiresIn });
    });
});
app.use(router);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`L'API peut maintenant recevoir des requêtes http://localhost:` + port);
});

const createUsersTable = () => {
    const sqlQuery = `CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY, name text, email text UNIQUE,password text)`;
            return database.run(sqlQuery);
    }
    
    const findUserByEmail = (email, cb) => {
        return database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            cb(err, row)
        });
    }
    
    const createUser = (user, cb) => {
        return database.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', user, (err) => {
            cb(err)
        });
    }

    const findAllUsers = (cb) => {
        return database.all(`SELECT * FROM users`, (err, rows) => {
            cb(err, rows)
        });
    }
    
    createUsersTable();


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


/**
     * 
     * @swagger
     * /updateUser/maison@mail.com:
     *  put:
     *    description: Update User by email
     *    parameters:
     *    - name: name
     *      description: Name of the User
     *      in: body
     *      required: true
     *      type: string
     *    responses:
     *      '201':
     *        description: Create
     */
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

      const updateUser = (name, email, cb) => {
               return database.get(`UPDATE users set name =? WHERE email = ?`, name, email, (err, row) => {
                cb(err, row)
            });
        }
      

  