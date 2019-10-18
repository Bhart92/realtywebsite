var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
  address: String,
  city: String,
  zipCode: String,
  sqft: String,
  lotSize: String,
  yearBuilt: String,
  bedrooms: String,
  bathrooms: String,
  amenities: String,
  price: Number,
  description: String,
  image: String,
  imageId: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Listing', listingSchema);
