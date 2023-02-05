const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const filesPayloadExists = require('./upload_middleware/filesPayloadExists');
const fileSizeLimiter = require('./upload_middleware/fileSizeLimiter');
const fileExtLimiter = require('./upload_middleware/fileExtLimiter');

const PORT = process.env.PORT || 3500;

const app = express();

app.listen(PORT, () => console.log(`UploadServer running on port ${PORT}`));

app.post(
    '/upload', 
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        const fileUrls = [];

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: 'error', message: err })
                fileUrls.push(filepath)
                console.log(fileUrls)
                console.log(`fileUrls.length = ${fileUrls.length}`)
                return res.json({ status: 'ok',  body: fileUrls[0] }) // TODO SENDS RESPONSE AFTER 1 LOOP. FIX IT
            })
        })
        console.log(`LAST fileUrls.length = ${fileUrls.length}`)        
    }
)
