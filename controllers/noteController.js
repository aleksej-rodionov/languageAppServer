const Note = require('../models/note');



const note_create = (req, res) => {
    const note = new Note(req.body);

    note.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const note_index = (req, res) => {

    Note.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const note_index_by_email = (req, res) => {
    const requestEmail = req.params.email;
    console.log(requestEmail);

    Note.find( {email: requestEmail} )
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}




module.exports = {
    note_create,
    note_index,
    note_index_by_email
}