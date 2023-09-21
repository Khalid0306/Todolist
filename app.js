const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000 ;

//Gestion de session
app.use(session({
    secret: 'MzJIzEJVFZ8QGhwUkQmmWz6asz1d7gXm',
    resave: false,
    saveUninitialized: true,
  }))


//Cela précise a Express qu'on va utiliser EJS comme moteur de template 
app.set('view engine', 'ejs');

app.use(express.static('node_modules'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Page d'affichage Todo List
app.get('/', (req, res) => {
//Si l'utilisateur n'a pas de tâches dans sa session on lui crée alors une liste de tâches vide
    if (!req.session.tasks) {
        req.session.tasks = [];
    }
    res.render('pages/todolist', { tasks: req.session.tasks });
});

//Pour ajouter des tâches
app.post('/task', (req, res) => {
    //Boucle if pour éviter l'entrée de tâches vide 
    if (req.body.task) {
        req.session.tasks.push({
            title: req.body.task,
            status: false,
        });
    }
    res.redirect('/');
});

//Pour changer le status des tâches
app.get('/task/:id/status', (req, res) => {
    //Boucle if pour eviter l'entrée manuelle d'id inconnue 
    if (req.session.tasks[req.params.id]) {
        req.session.tasks[req.params.id].status = true;
    }
    res.redirect('/'); 
});

//Pour supprimer les tâches
app.get('/task/:id/delete', (req, res) => {
    //Boucle if pour eviter l'entrée manuelle d'id inconnue 
    if ( req.session.tasks[req.params.id]) {
        req.session.tasks.splice(req.params.id, 1);  
    }
    res.redirect('/');
});

//En cas d'utilisation d'un chemin inconnue 
app.use((req, res) => {
    res.status(404).send("<h1>Erreur 404, page non trouvée.</h1>");
});


app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
}); 