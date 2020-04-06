const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// DB Config
const passport = require('passport');

//Connect database
const db = require('../config/keys').mongoURI;
const assert = require('assert');

const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');


//Render Add new item page
router.get('/addNewItem', ensureAuthenticated, (req, res) => res.render('addNewItem'));



// Get added item from the database
router.get('/get-items2', function (req, res, next) {

    var resultArray = []
    mongoose.connect(db, function (err, db) {

        assert.equal(null, err);
        var cursor = db.collection('items').find();
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {


            console.log(resultArray);
            console.log("Printed Resutls")

        });




    });

});



// Get itmes assosiated with the logged in account
router.get('/get-items', function (req, res, next) {

    var resultArray = []
    mongoose.connect(db, function (err, db) {

        assert.equal(null, err);
        var cursor = db.collection('items').find({
            ownerID: req.user.id
        });
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {


            console.log(resultArray);
            console.log("Printed Resutls")

        });




    });

});



// Add new item to the database
router.post('/insert-item', function (req, res, next) {


    var item = {
        brand: req.body.brand,
        type: req.body.type,
        colour: req.body.colour,
        ownerID: req.user.id
    };
    let errors = [];

    if (!req.body.brand || !req.body.type || !req.body.colour) {

        errors.push({
            msg: 'Please enter all fields'
        });

    } else {

        mongoose.connect(db, function (err, db) {



            assert.equal(null, err);

            db.collection('items').insertOne(item, function (err, result) {

                assert.equal(null, err);
                console.log('Item inserted');
                req.flash('success_msg', 'Item added successfully');
                res.redirect("/dashboard")
            });


        })



    }




});


// Delete the item from the database
router.get('/delete-item', function (req, res, next) {


});




module.exports = router;