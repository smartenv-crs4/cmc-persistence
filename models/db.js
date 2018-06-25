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
var conf = require('../config').conf;
//var app = require('../app');
var util = require('util');
var async = require('async');
var dbUrl = 'mongodb://' + conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;

var options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
  //,
  /*
	user: 'admin',
    pass: 'node'
	*/
};

exports.connect = function connect(callback) {
  mongoose.connect(dbUrl, options, function(err, res) {
    console.log('Connected to database: ' + dbUrl);

    if (err) {
      console.log('Unable to connect to database ' + dbUrl);
      callback(err);
    } else {}
  });
};

exports.disconnect = function disconnect(callback) {
  mongoose.disconnect(callback);
};
