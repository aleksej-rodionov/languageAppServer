const User = require('../models/user')
const bcrypt = require('bcrypt');



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

// const user_details = (req, res) => {
//     const id = req.params.id;
//     User.findById(id)
//         .then((result) => {
//             // console.log(result);
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

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

// const user_update = (req, res) => {
//     const id = req.params.id;

//     User.findByIdAndUpdate(id, req.body)
//         .then((result) => {
//             // console.log();
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

const user_delete = (req, res) => {
    const id = req.params.id

    const user = User.findByIdAndDelete(id)
    const testtext = user.testtext
    if (testtext) {
        return res.json({ status: 'ok', data: testtext });
    }

    res.json({ status: error, error: "Testtext not found" })
}

const user_current = (req, res) => {
    const userEmail = req.user.email;
    console.log(userEmail);

    User.findOne({ email: userEmail })
        .then((result) => {
            res.json({ status: "ok", body: result });
        })
        .catch((err) => {
            res.json({ status: 'error', error: err });
        });
}

const change_password = async (req, res) => {
    const { oldpassword, newpassword } = req.body
    const user = req.user;

    // todo find user and compare old passwords
    const userInDb = await User.findOne({ email: user.email }).lean()
    if (!userInDb) {
        return res.json({ status: 'error', error: 'Invalid email/password (user == null)' });
    }
    if (await bcrypt.compare(oldpassword, userInDb.password)) {
    
    // check if new password is valid
    if (!newpassword || typeof newpassword !== 'string') {
        return res.status(400).json({ status: 'error', error: 'Invalid new password' })
    }
    if (newpassword.length < 6) {
        return res.status(400).json({
            status: 'error',
            error: 'New password too small. Should be at least 6 characters'
        })
    }
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    console.log('hashedNewPassword = ' + hashedNewPassword);

    // findAndUpdate user with new password
    await User.updateOne(
            { email: user.email }, 
            { $set: { password: hashedNewPassword } }, 
            { new: true }
        )
        .then((result) => {
            return res.status(200).send({ status: 'ok', body: hashedNewPassword })
        })
        .catch((err) => {
            return res.status(500).send({ status: 'error', error: err.message })
        });
    }

    // console.log('before sending error')
    // return res.status(400).send({ status: 'error', error: 'Invalid email/password (incorrect password)' });
}



module.exports = {
    user_index,
    // user_details,
    user_testtext,
    // user_update,
    user_delete,
    user_current,
    change_password
}



