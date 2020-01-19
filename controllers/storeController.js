const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const Store = mongoose.model('Store');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That file type isn\'t allowed!' }, false);
    }
  },
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    next(); // Skip to the next middleware
    return;
  }
  // Get the image file extension from the mimetype
  const extension = req.file.mimetype.split('/')[1];
  // Build a unique file name
  req.body.photo = `${uuid.v4()}.${extension}`;
  // Resize the photo
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  // Write the photo to the filesystem
  await photo.write(`./public/uploads/${req.body.photo}`);
  // Once photo has been written then keep going
  next();
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};


exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. 
    Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.getStoreBySlug = async (req, res, next) => {
  // Find the store given the slug
  const store = await Store.findOne({ slug: req.params.slug });
  // If no store found then go to next middleware
  if (!store) {
    return next();
  }
  // Render store
  return res.render('store', { title: store.name, store });
};

exports.editStore = async (req, res) => {
  // Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // Confirm user is store owner
  // TODO
  // Render edit form
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // Set the location data to be a point
  req.body.location.type = 'Point';
  // Find and update store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id }, // query
    req.body, // data
    { // options
      new: true, // return the new store
      runValidators: true, // run model validation
    },
  ).exec(); // run the query

  req.flash('success', `
    Successfully updated <strong>${store.name}</strong>. 
    <a href="/store/${store.slug}">View Store →</a>
  `);
  // Redirect to the store
  res.redirect(`/stores/${store.id}/edit`);
};
