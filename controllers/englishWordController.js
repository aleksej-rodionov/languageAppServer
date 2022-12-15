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



module.exports = {
    englishword_create
}