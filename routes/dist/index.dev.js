"use strict";

var express = require('express');

var storeController = require('../controllers/storeController');

var userController = require('../controllers/userController');

var _require = require('../handlers/errorHandlers'),
    catchErrors = _require.catchErrors;

var router = express.Router(); // Async handlers need to be wrapped in catchErrors function
// Get all stores

router.get('/', storeController.getStores);
router.get('/stores', catchErrors(storeController.getStores)); // Get one store

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug)); // Add store

router.get('/add', storeController.addStore);
router.post('/add', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.createStore)); // Update Store

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.updateStore)); // Get tags

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag)); // User login

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister);
module.exports = router;