const User = require('../models/user')



const user_index = (req, res) => {
    User.find().sort({createdAt: -1})
        .then((result) => {
            // console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
}

const user_details = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((result) => {
            // console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const user_testtext = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const user_update = (req, res) => {
    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body)
        .then((result) => {
            // console.log();
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

const user_delete = (req, res) => {
    const id = req.params.id

    const user = User.findByIdAndDelete(id)
    const testtext = user.testtext
    if (testtext) {
        return res.json({ status: 'ok', data: testtext });
    }

    res.json({ status: error, error: "Testtext not found" })
}



module.exports = {
    user_index,
    user_details,
    user_testtext,
    user_update,
    user_delete
}



