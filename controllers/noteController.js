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

// const note_index = (req, res) => {
//     console.log("note index request")

//     Note.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

const note_index_by_user = (req, res) => {
    // const requestEmail = req.params.email;
    // console.log(requestEmail);
    const userEmail = req.user.email;
    console.log(userEmail);

    Note.find({ email: userEmail })
        .then((result) => {
            console.log(result);
            // res.send(result);
            res.json({ status: "ok", body: result })
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "error", error: err })
        });
}

const note_by_id = (req, res) => {
    const noteId = req.params.noteid
    console.log("noteId = " + noteId)

    const userEmail = req.user.email;
    console.log("userEmail = " + userEmail)

    Note.findOne({ _id: noteId })
        .then((note) => {
            console.log(note);
            if(note.email == userEmail) {
                res.json({ status: 'ok', body: note })
            } else {
                res.json({ status: 'error', error: "You don\'t have access to this note" })
            }
        })
        .catch((err) => {
            console.log(err);
        });
}




module.exports = {
    note_create,
    // note_index,
    note_index_by_user,
    note_by_id
}