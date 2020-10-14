const mongoose = require('mongoose');
//access schema object
const Schema = mongoose.Schema;

let Dance_Move = new Schema({
    dance_move: {
        type: String
    }
});

//take care of schema that needs to be exported
module.exports = mongoose.model('Dance Move', Dance_Move);
