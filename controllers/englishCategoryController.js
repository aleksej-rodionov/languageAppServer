const EnglishCategory = require('../models/englishCategory');



const englishcategory_create = (req, res) => {
    console.log(req.body);
    const englishCategory = new EnglishCategory(req.body)

    console.log(englishCategory);
    englishCategory.save()
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishcategory_update = (req, res) => {
    const id = req.params.id
    console.log(id);
    EnglishCategory.findByIdAndUpdate(id, req.body)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishcategory_delete = (req, res) => {
    const id = req.params.id
    console.log(id);
    EnglishCategory.findByIdAndDelete(id)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishcategory_index = (req, res) => {
    EnglishCategory.find().sort({ createdAt: -1 })
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const englishcategory_details = (req, res) => {
    const id = req.params.id;
    EnglishCategory.findById(id)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}


module.exports = {
    englishcategory_create,
    englishcategory_update,
    englishcategory_delete,
    englishcategory_index,
    englishcategory_details
}