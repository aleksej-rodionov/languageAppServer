const EnglishCategory = require('../models/englishCategory');



const english_category_create = (req, res) => {
    console.log(req.body);
    // const englishCategory = new EnglishCategory({
    //     catName: req.body.catName
    // });
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



module.exports = {
    english_category_create
}