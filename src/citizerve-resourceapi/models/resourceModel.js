const mongoose = require('mongoose');

const { Schema } = mongoose;

const resourceModel = new Schema(
  {
    resourceId: { type: String },
    citizenId: { type: String },
    name: { type: String },
    status: { type: String },
  },
);

module.exports = mongoose.model('Resource', resourceModel);
