const User = require('../models/user')



const user_create = async (req, res) => {
    console.log(req.body);

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
    console.log(user);
    user.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        });
    } catch {
        console.log('catch block fired')
        res.status(500).send()
    }
}

const user_login = async (req, res) => {
    // const user = User.findById // todo
}

const user_delete = (req, res) => {
    const id = req.params.id

    User.findByIdAndDelete(id)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
}



module.exports = {
    user_create,
    user_login,
    user_delete
}