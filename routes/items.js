
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


//Add new item
router.get('/addNewItem', ensureAuthenticated, (req, res) => res.render('addNewItem'));



module.exports =router;