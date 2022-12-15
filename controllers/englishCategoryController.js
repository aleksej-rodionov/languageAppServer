const EnglishCategory = require('../models/englishCategory');



const englishcategory_create = (req, res) => {
    console.log(req.body);
    // const englishCategory = new EnglishCategory({
    //     catname: req.body.catName
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
    englishcategory_create
}