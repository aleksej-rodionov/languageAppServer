const Note = require('../models/note');



const note_create = (req, res) => {
    const note = new Note(req.body);

    note.save()
        .then((result) => {
            console.log(result);
            res.status(200).json({ status: 'ok', body: result });
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', body: err });
        });
}

const note_index_by_user = (req, res) => {
    // const userEmail = req.params.email;
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
    const userEmail = req.user.email;

    Note.findOne({ _id: noteId })
        .then((note) => {
            if(note) {
                if(note.email == userEmail) {
                    res.json({ status: 'ok', body: note });
                } else {
                    res.json({ status: 'error', error: "You don\'t have access to this note" });
                }
            } else {
                res.json({ status: 'error', error: "Note not found" });
            }
        })
        .catch((err) => {
            res.json({ status: 'error', error: err });
        });
}

const note_update = (req, res) => { // todo make 1 db request instead of 2
    const noteId = req.params.noteId;
    const userEmail = req.user.email;

    Note.findOne({ _id: noteId })
        .then((note) => {
            if(note) {
                if(note.email == userEmail) {
                    Note.findOneAndUpdate({ _id: noteId }, req.body, { new: true })
                        .then((result) => {
                            console.log(result);
                            res.status(200).json({ status: 'ok', body: result });
                        })
                        .catch((err) => {
                            res.status(500).json({ status: 'error', error: err })
                        })
                } else {
                    res.status(403).json({ status: 'error', error: "You don\'t have access to this note" })
                }
            } else {
                res.status(404).json({ status: 'error', error: "Note not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', error: err })
        });
}

const note_delete = (req, res) => {
    const noteId = req.params.noteId;
    const userEmail = req.user.email;

    Note.findOne({ _id: noteId })
        .then((note) => {
            if(note.email == userEmail) {
                Note.findByIdAndDelete(noteId, req.body)
                    .then((result) => {
                        res.json({ status: 'ok', body: result });
                    })
                    .catch((err) => {
                        res.json({ status: 'error', error: err })
                    })
            } else {
                res.json({ status: 'error', error: "You don\'t have access to this note" })
            }
        })
        .catch((err) => {
            res.json({ status: 'error', error: err })
        });
}



module.exports = {
    note_create,
    note_index_by_user,
    note_by_id,
    note_update,
    note_delete
}