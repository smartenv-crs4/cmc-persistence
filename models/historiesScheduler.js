var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create new history scheduler schema
var HistorySchedulerSchema = new Schema({
    idDevice: {type: String, index: { unique: true }},
    name: String,
    description: String,
    frequency: Number,
    running: Boolean
});

// Compile model from schema
var HistoryScheduler = mongoose.model('historiesscheduler', HistorySchedulerSchema );
module.exports.HistorySchedulerSchema = HistorySchedulerSchema;
module.exports.HistoryScheduler = HistoryScheduler;
