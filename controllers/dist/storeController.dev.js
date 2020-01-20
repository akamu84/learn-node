"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var mongoose = require('mongoose');

var multer = require('multer');

var jimp = require('jimp');

var uuid = require('uuid');

var Store = mongoose.model('Store');
var multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: function fileFilter(req, file, next) {
    var isPhoto = file.mimetype.startsWith('image/');

    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: 'That file type isn\'t allowed!'
      }, false);
    }
  }
};
exports.upload = multer(multerOptions).single('photo');

exports.resize = function _callee(req, res, next) {
  var extension, photo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 3;
            break;
          }

          next(); // Skip to the next middleware

          return _context.abrupt("return");

        case 3:
          // Get the image file extension from the mimetype
          extension = req.file.mimetype.split('/')[1]; // Build a unique file name

          req.body.photo = "".concat(uuid.v4(), ".").concat(extension); // Resize the photo

          _context.next = 7;
          return regeneratorRuntime.awrap(jimp.read(req.file.buffer));

        case 7:
          photo = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(photo.resize(800, jimp.AUTO));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(photo.write("./public/uploads/".concat(req.body.photo)));

        case 12:
          // Once photo has been written then keep going
          next();

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.homePage = function (req, res) {
  res.render('index');
};

exports.addStore = function (req, res) {
  res.render('editStore', {
    title: 'Add Store'
  });
};

exports.createStore = function _callee2(req, res) {
  var store;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(new Store(req.body).save());

        case 2:
          store = _context2.sent;
          req.flash('success', "Successfully created ".concat(store.name, ". \n    Care to leave a review?"));
          res.redirect("/store/".concat(store.slug));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getStores = function _callee3(req, res) {
  var stores;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Store.find());

        case 2:
          stores = _context3.sent;
          res.render('stores', {
            title: 'Stores',
            stores: stores
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getStoreBySlug = function _callee4(req, res, next) {
  var store;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Store.findOne({
            slug: req.params.slug
          }));

        case 2:
          store = _context4.sent;

          if (store) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next());

        case 5:
          return _context4.abrupt("return", res.render('store', {
            title: store.name,
            store: store
          }));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.editStore = function _callee5(req, res) {
  var store;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Store.findOne({
            _id: req.params.id
          }));

        case 2:
          store = _context5.sent;
          // Confirm user is store owner
          // TODO
          // Render edit form
          res.render('editStore', {
            title: "Edit ".concat(store.name),
            store: store
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.updateStore = function _callee6(req, res) {
  var store;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // Set the location data to be a point
          req.body.location.type = 'Point'; // Find and update store

          _context6.next = 3;
          return regeneratorRuntime.awrap(Store.findOneAndUpdate({
            _id: req.params.id
          }, // query
          req.body, // data
          {
            // options
            "new": true,
            // return the new store
            runValidators: true // run model validation

          }).exec());

        case 3:
          store = _context6.sent;
          // run the query
          req.flash('success', "\n    Successfully updated <strong>".concat(store.name, "</strong>. \n    <a href=\"/store/").concat(store.slug, "\">View Store \u2192</a>\n  ")); // Redirect to the store

          res.redirect("/stores/".concat(store.id, "/edit"));

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.getStoresByTag = function _callee7(req, res) {
  var tag, tagQuery, tagsPromise, storesPromise, _ref, _ref2, tags, stores;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          tag = req.params.tag;
          tagQuery = tag || {
            $exists: true
          };
          tagsPromise = Store.getTagsList();
          storesPromise = Store.find({
            tags: tagQuery
          });
          _context7.next = 6;
          return regeneratorRuntime.awrap(Promise.all([tagsPromise, storesPromise]));

        case 6:
          _ref = _context7.sent;
          _ref2 = _slicedToArray(_ref, 2);
          tags = _ref2[0];
          stores = _ref2[1];
          res.render('tag', {
            tags: tags,
            tag: tag,
            stores: stores,
            title: 'Tags'
          });

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  });
};