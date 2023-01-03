const mongoose = require('mongoose');

const { Schema } = mongoose;

const citizenModel = new Schema(
  {
    citizenId: { type: String },
    givenName: { type: String },
    surname: { type: String },
    phoneNumber: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
);

module.exports = mongoose.model('Citizen', citizenModel);
