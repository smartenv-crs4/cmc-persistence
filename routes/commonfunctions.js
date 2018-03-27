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

var HistoryScheduler = require('../models/historiesScheduler').HistoryScheduler;
var domainUrl = process.env.HOST || 'localhost:' + (
process.env.PORT || 3013);
var domainUrl = domainUrl + '/api/v0.1';
var config = require('propertiesmanager').conf;
var request = require('request');
//list of processes
var listOfHistoryProcesses = [];

/**
 * saveHistoryScheduler - create a new history scheduler
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.saveHistoryScheduler = function(req, res, next) {
  //return res.status(200).send({data: {result: true, message: 'ok'}});
  var message = 'HistoryScheduler Added Successfully',
    id = null;
  HistoryScheduler.findOne({
    idDevice: req.body.historyscheduler_device_id
  }, function(err, historySchedulerFound) {
    if (err) {
      message = 'HistoryScheduler check error ';
      return res.json({id: id, message: message});
    }
    if (historySchedulerFound) {

      var body = [];
      //get url of connector
      request.get(config.devicesDomainUrl + 'read/' + historySchedulerFound.idDevice).on('data', function(data) {
        body.push(data);
      }).on('end', function() {
        body = Buffer.concat(body).toString();
        console.log(body);
        try {
          var response = JSON.parse(body);
          if (response.error) {
            console.log(response);
            return;
          }
          var meta = [];
          meta = response;
          setInterval(saveHistory, historySchedulerFound.frequency, historySchedulerFound.idDevice, meta);

        } catch (e) {
          console.error(e);
          res.status(500).send({
            "error": 500,
            "errorMessage": e.message,
            "moreInfo": domainUrl + "/v1/support/500"
          });
        }
      }).on('error', function(err) {
        res.status(404).send({
          "error": 404,
          "errorMessage": "Could not find a device with id " + req.params.id,
          "moreInfo": domainUrl + "/v1/support/404"
        });
      })
      message = 'HistoryScheduler already exist ';
      return res.json({id: id, message: message});
    }

    var historyScheduler = new HistoryScheduler({idDevice: req.body.historyscheduler_device_id, name: req.body.historyscheduler_name, description: req.body.historyscheduler_description, frequency: req.body.historyscheduler_frequency});

    historyScheduler.save(function(err) {
      if (err) {
        message = 'Problems while saving history scheduler ';
        return res.json({id: id, message: message});
      }

      res.set('Location', '/historiesScheduler/' + historyScheduler.id);
      res.status(201).send(historyScheduler.toJSON());
    });

  });
};

/**
 * getAllHistorySchedulers - listing of all history schedulers
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @return {http.ServerResponse} an http response
 */
exports.getAllHistorySchedulers = function(req, res) {
  // Retrieve and return all history schedulers from the database.
  HistoryScheduler.find(function(err, historyschedulers) {
    if (err) {
      res.status(404).send({
        "error": 404,
        "errorMessage": "Error finding all history schedulers",
        "moreInfo": domainUrl + "/v1/support/404"
      });
    } else {
      res.send(historyschedulers);
    }
  });
};

/**
 * renderCreateHistoryScheduler - render a new history creation page
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an html page
 */
exports.renderCreateHistoryScheduler = function(req, res, restApiRoot) {
  res.render('create-historyscheduler', {
    title: 'Cmc History Scheduler',
    section: 'Add a new history scheduler',
    urlForm: restApiRoot + '/historyschedulers'
  });
};

/**
 * startAllSchedulers - start all history schedulers
 *
 */
exports.startAllSchedulers = function() {
  // Retrieve and return all history schedulers from the database.
  console.log("------ Starting all history schedulers----------");
  HistoryScheduler.find({
    running: true
  }, function(err, historyschedulers) {
    if (err) {
      console.log('#Error ' + ' finding all history schedulers');
    } else {
      historyschedulers.forEach(function(historySchedulerFound) {
        console.log('Inizializzando lo starting di tutti gli schedulers...');
        if (startScheduling(historySchedulerFound.idDevice, historySchedulerFound.frequency)) {
          console.log('Scheduling for device: ' + historySchedulerFound.idDevice + ' started successfully!');
        } else {
          console.log('#Warning! Scheduling for device: ' + historySchedulerFound.idDevice + ' not started!')
        }
      });
    }
  });
}

/**
 * renderStartStopHistoryScheduler - render a start/stop scheduler page
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an html page
 */
exports.renderStartStopHistoryScheduler = function(req, res, restApiRoot) {
  // get list of devices
  var historyschedulers;
  HistoryScheduler.find(function(err, historyschedulers) {
    if (err) {
      res.status(404).send({
        "error": 404,
        "errorMessage": "Error finding all history schedulers",
        "moreInfo": domainUrl + "/v1/support/404"
      });
    } else {
      res.render('create-startstophistoryscheduler', {
        title: 'Cmc Start Stop History Scheduler',
        section: 'Start/Stop an history scheduler',
        listHistorySchedulers: historyschedulers,
        urlToCallScheduler: 'http://' + domainUrl + "/historyschedulers"
      });
    }
  });
};

/**
 * startOrStopHistory - manage a start stop history scheduler
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.startOrStopHistory = function(req, res, next) {
  var idDevice = (req.params.idDevice).toString(),
    startOrStop = (req.params.startOrStop).toString();
  console.log("StartOrStopHistory: " + idDevice);
  HistoryScheduler.findOne({
    idDevice: idDevice
  }, function(err, historySchedulerFound) {
    if (err) {
      message = 'HistoryScheduler check error ';
      return res.json({id: idDevice, message: message});
    }
    if (historySchedulerFound && startOrStop == 'on') {
      if (startScheduling(historySchedulerFound.idDevice, historySchedulerFound.frequency)) {
        res.set('Location', '/historyschedulers/' + idDevice);
        res.status(201).send(historySchedulerFound.toJSON());
      } else {
        res.status(404).send({
          "error": 404,
          "errorMessage": "Error switching off a scheduler running for device id: " + idDevice,
          "moreInfo": domainUrl + "/v1/support/404"
        });
      }
    }
    if (historySchedulerFound && startOrStop == 'off') {

      listOfHistoryProcesses[idDevice]['running'] = false;
      //update running property
      HistoryScheduler.findOneAndUpdate({
        idDevice: idDevice
      }, {
        running: false
      }, {
        new: true
      }, function(err, modelHistoryScheduler) {
        if (err) {
          console.log('Error finding and updating history scheduler running state to off');
          return res.status(404).json({
            "error": 404,
            "errorMessage": "Error finding and updating history scheduler running state to on for device: " + idDevice,
            "moreInfo": domainUrl + "/v1/support/404"
          });
        }

        res.set('Location', '/historyschedulers/' + idDevice);
        res.status(201).send(historySchedulerFound.toJSON());
      });
    }
  });
}

/**
 * saveHistory - save an history in cmc-devices
 *
  * @param  {String} idDevice a device id (cmc-devices)
  * @param  {Object} meta a device metadata
 */
saveHistory = function(idDevice, meta) {
  var message = 'History Added Successfully';
  request.post({
    url: config.historyDevicesUrl,
    body: JSON.stringify({idDevice: idDevice, data: meta}),
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + config.app_token
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    }
  });
};

/**
 * startScheduling - set the state of an history scheduler
 *
  * @param  {String} idDevice a device id (from cmc-devices)
  * @param  {Number} frequency frequency in milliseconds
 */
startScheduling = function(idDevice, frequency) {
  var timerId = setInterval(readFromDeviceForScheduling, frequency, idDevice);
  listOfHistoryProcesses[idDevice] = {
    running: true,
    timerId: timerId
  };
  //update running property
  HistoryScheduler.findOneAndUpdate({
    idDevice: idDevice
  }, {
    running: true
  }, {
    new: true
  }, function(err, modelHistoryScheduler) {
    if (err) {
      console.log('Error finding and updating history scheduler running state to on' + err);
      return false;
    }
  });
  console.log('Started scheduling for device: ' + idDevice);
  return true;
}

/**
 * readFromDeviceForScheduling - read real time device data and save it
 *
 * @param  {String} idDevice a device id (from cmc-devices)
 */
readFromDeviceForScheduling = function(idDevice) {
  if (listOfHistoryProcesses[idDevice] && listOfHistoryProcesses[idDevice]['running'] == false) {
    clearInterval(listOfHistoryProcesses[idDevice]['timerId']);
    return;
  }
  var body = [];
  //get url of connector
  request.get(config.devicesDomainUrl + 'read/' + idDevice + '?access_token=' + config.app_token).on('data', function(data) {
    body.push(data);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    console.log(body);
    try {
      var response = JSON.parse(body);
      var meta = [];

      meta = response;
      saveHistory(idDevice, meta);

    } catch (e) {
      console.error(e);
    }
  }).on('error', function(err) {
    console.error(err);
  })
}
