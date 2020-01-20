"use strict";

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var slug = require('slugs');

var storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    "default": Date.now
  },
  location: {
    type: {
      type: String,
      "default": 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must suppy an address!'
    }
  },
  photo: String
});
storeSchema.pre('save', function setSchemaSlug(next) {
  var slugRegEx, storesWithSlug;
  return regeneratorRuntime.async(function setSchemaSlug$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified('name')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          this.slug = slug(this.name); // Find other stores that have a slug with the same name

          slugRegEx = new RegExp("^(".concat(this.slug, ")((-[0-9]*$)?)$"), 'i');
          _context.next = 6;
          return regeneratorRuntime.awrap(this.constructor.find({
            slug: slugRegEx
          }));

        case 6:
          storesWithSlug = _context.sent;

          // If one exists then rename the slug
          if (storesWithSlug.length) {
            this.slug = "".concat(this.slug, "-").concat(storesWithSlug.length + 1);
          }

          return _context.abrupt("return", next());

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

storeSchema.statics.getTagsList = function getTagsList() {
  return this.aggregate([{
    $unwind: '$tags'
  }, {
    $group: {
      _id: '$tags',
      count: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      count: -1,
      _id: 1
    }
  }]);
};

module.exports = mongoose.model('Store', storeSchema);