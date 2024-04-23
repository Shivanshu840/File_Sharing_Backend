const multer = require('multer');
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const { FILE } = require('../Db/db')
const myMiddleware = require('../Authentication/index')
const { v4: uuid } = require('uuid');
const path = require('path'); 
require('dotenv').config();

// const baseURL = process.env.APP_BASE_URL

let storage = multer.memoryStorage(); // Change to memory storage

let upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).single('myFile');

router.post('/uploadFile', myMiddleware, async function (req, res) { 

    upload(req, res, async (err) => { 
        if (!req.file) {
            return res.json({
                msg: "File not present"
            });
        }

        if (err) {
            return res.status(500).json({
                msg: "error"
            });
        }

        // Generate unique filename
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;

        // Store into database
        try {
            const file = new FILE({
                filename: req.file.originalname, 
                uuid: uuid(),
                path: uniqueName, 
                size: req.file.size
            });
            const response = await file.save();
            const fileurl = `${process.env.APP_BASE_URL}/files/${response.uuid}`;
            res.json({fileurl});
        } catch(err) {
            res.json({
               msg: "Internal server error",
            });
        }
    });
});

module.exports = router;
