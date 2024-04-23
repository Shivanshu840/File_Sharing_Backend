const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { FILE } = require('../Db/db');

router.get('/:Id', async function(req, res) {
    try {
        const file = await FILE.findOne({ uuid: req.params.Id });

        if (!file) {
            return res.render('download', { error: 'Link has expired' });
        }

        // Set headers to force download
        res.set({
            'Content-Disposition': `attachment; filename="${file.filename}"`,
            'Content-Type': 'application/octet-stream', // or the appropriate MIME type
        });

        // Send the file buffer as the response
        res.send(file.buffer);
    } catch (error) {
        console.error(error);
        return res.status(500).render('download', { error: 'Internal server error' });
    }
});

module.exports = router;
