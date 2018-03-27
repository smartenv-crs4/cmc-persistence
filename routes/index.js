/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2018 CRS4                                 *
 *       This file is part of CRS4 Microservice IOT - Persistence (CMC-Persist).       *
 *                                                                            *
 *       CMC-Persist is free software: you can redistribute it and/or modify     *
 *     it under the terms of the GNU General Public License as published by   *
 *       the Free Software Foundation, either version 3 of the License, or    *
 *                    (at your option) any later version.                     *
 *                                                                            *
 *       CMC-Persist is distributed in the hope that it will be useful,          *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        *
 *               GNU General Public License for more details.                 *
 *                                                                            *
 *       You should have received a copy of the GNU General Public License    *
 *       along with CMC-Persist.  If not, see <http://www.gnu.org/licenses/>.    *
 * ############################################################################
 */

var express = require('express');
var router = express.Router();
var Device = require('../models/historiesScheduler').HistoryScheduler;
var commonFunction=require('./commonfunctions');
var version = require('../package.json').version;
var config = require('propertiesmanager').conf;
var auth = require('tokenmanager');
var authField = config.decodedTokenFieldName;
var restApiRoot  = '/api' + (config.restApiVersion !='' ? '/v' + config.restApiVersion : '');

auth.configure({
  authorizationMicroserviceUrl:config.authUrl+ '/tokenactions/checkiftokenisauth',
  decodedTokenFieldName:authField,
  authorizationMicroserviceToken:config.auth_token
});


console.log('###### API ROOT #######' + restApiRoot );
//authms middleware wrapper for dev environment (no authms required)
function authWrap(req, res, next) {
if (!req.app.get("nocheck"))
  auth.checkAuthorization(req, res, next);
else
  next();
}

// get home page
router.get('/', function(req, res, next) {
res.render('index', {title: 'Cmc Persistence'});
});

// page for history scheduler creation
router.get(restApiRoot + '/createhistoryscheduler', function(req, res, next) {
 commonFunction.renderCreateHistoryScheduler(req, res, restApiRoot);
});

//add a new history scheduler
router.post(restApiRoot + '/historyschedulers', commonFunction.saveHistoryScheduler);

//get all history schedulers
router.get(restApiRoot + '/historyschedulers', commonFunction.getAllHistorySchedulers);

//start or stop a new history scheduling
router.get(restApiRoot + '/historyschedulers/:idDevice/:startOrStop', commonFunction.startOrStopHistory);

// page for history scheduler starting/stopping
router.get(restApiRoot + '/startstophistoryscheduler', function(req, res, next) {
 commonFunction.renderStartStopHistoryScheduler(req, res, restApiRoot);
});

module.exports = router;
