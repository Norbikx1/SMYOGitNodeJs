const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// DB Config
const passport = require('passport');

//Connect database
const db = require('../config/keys').mongoURI;
const assert = require('assert');

//Creates a connection to the database
const conn = mongoose.createConnection(db);

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//Creates the storage engine
const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({storage});

router.get('/newPost', ensureAuthenticated, function(req, res){
    res.render('newPost', {
        name : req.user.name,
    });
});

router.post('/upload', upload.single('file'), async (req, res) => {
    
    var lastFile = await gfs.files.find().sort({$natural:-1}).limit(1).toArray();
    console.log(lastFile);
    console.log(lastFile[0]._id.toString());

    var currentDate = new Date();
    currentDate.toLocaleDateString();

    var post = {
        imageID : lastFile[0]._id.toString(),
        description : req.body.description,
        likes : 0,
        ownerID : req.user.id,
        uploadDate : currentDate
    }

    mongoose.connect(db, function(err, db){
        assert.equal(null, err);
        db.collection('posts').insertOne(post, function(err, result){
            assert.equal(null, err);

            console.log("Post created");
            res.redirect("/dashboard");
        });
    });

});
module.exports = router;