const mongoose = require('mongoose');



const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'Coordinates must be an array of two numbers.'
    }
  }
});

const routeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  routeName: { type: String, required: true },
  startTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  stops: [stopSchema]
});

module.exports = mongoose.model('Route', routeSchema);
