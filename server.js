//implement server!

const express = require('express'); //get access to the express framework
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dancemovesRoutes = express.Router(); //get access to router
const PORT = process.env.PORT || 4000;

let Dance_Move = require('./Dance_Move.model');
//let danceMove = require('./danceMove');


//middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/dancemoves', { useNewUrlParser: true }); //localhost, config parameter
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//Retrieve list of DANCEMOVES
dancemovesRoutes.route('/').get(function(req, res) {
    Dance_Move.find(function(err, dancemoves) {
        if (err) {  //checking for errors
            console.log(err);
        } else {
            res.json(dancemoves);
        }
    });
});

//Retrieve a SINGLE DANCEMOVE using route id
dancemovesRoutes.route('/:id').get(function(req, res) { //get: accepting incoming http get request
    let id = req.params.id;
    Dance_Move.findById(id, function(err, dancemoves) {
        res.json(dancemoves);
    });
});

//for Adding todo Items to the db
dancemovesRoutes.route('/add').post(function(req, res) {
    let new_move = new Dance_Move(req.body);
    new_move.save() //save to db
        .then(new_move => {
            res.status(200).json({'new_move': 'New dance move added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new dance move failed');
        });
});

//updating the item
dancemovesRoutes.route('/update/:id').post(function(req, res) {
    Dance_Move.findById(req.params.id, function(err, dancemoves) {
        if (!dancemoves)
            res.status(404).send('data is not found');
        else
        dancemoves.dance_move = req.body.dance_move;

        dancemoves.save().then(dancemoves => { //send it back to the db
                res.json('Dance move updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});


//insterting router which is attached to path
// base route is /todos
app.use('/dancemoves', dancemovesRoutes);

//start up the server
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});



