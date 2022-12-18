const EnglishWord = require('../models/englishWord');



const englishword_create = (req, res) => {
    const englishWord = new EnglishWord(req.body);

    englishWord.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const englishword_update = (req, res) => {
    const id = req.params.id;

    EnglishWord.findByIdAndUpdate(id, req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishword_delete = (req, res) => {
    const id = req.params.id;

    EnglishWord.findByIdAndDelete(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishword_index = (req, res) => {
    EnglishWord.find().sort({ eng: -1 }) // todo sort by alphabet by "eng" field
        .then((result) => {
            // console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.lpg(err);
        })
}

const englishword_details = (req, res) => {
    const id = req.params.id;
    EnglishWord.findById(id)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}



module.exports = {
    englishword_create,
    englishword_update,
    englishword_delete,
    englishword_index,
    englishword_details
}