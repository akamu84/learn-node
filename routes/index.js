const express = require('express');
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Async handlers need to be wrapped in catchErrors function

// Get all stores
router.get('/', storeController.getStores);
router.get('/stores', catchErrors(storeController.getStores));

// Get one store
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// Add store
router.get('/add', storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

// Update Store
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore));

module.exports = router;
