const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
});

storeSchema.pre('save', function setSchemaSlug(next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  return next();
  // TODO: Make slugs unique
});

module.exports = mongoose.model('Store', storeSchema);
