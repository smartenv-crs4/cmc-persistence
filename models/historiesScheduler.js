/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2018 CRS4                                 *
 *       This file is part of CRS4 Microservice IOT - Persistence (CMC-Persistence).       *
 *                                                                            *
 *       CMC-Persistence is free software: you can redistribute it and/or modify     *
 *     it under the terms of the GNU General Public License as published by   *
 *       the Free Software Foundation, either version 3 of the License, or    *
 *                    (at your option) any later version.                     *
 *                                                                            *
 *       CMC-Persistence is distributed in the hope that it will be useful,          *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        *
 *               GNU General Public License for more details.                 *
 *                                                                            *
 *       You should have received a copy of the GNU General Public License    *
 *       along with CMC-Persistence.  If not, see <http://www.gnu.org/licenses/>.    *
 * ############################################################################
 */

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
