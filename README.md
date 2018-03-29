# CMC Persistence
CMC Persistence is a node application to manage the storage of historical device data using CMC History. Every device has its own scheduler that contains the directives to be used for saving historical data. <br>
It use CMC-Auth for application authentication. <br>

## Usage

### Install

#### 1) Install all dependencies

    npm install


### Run the application

#### For *development* mode, run:

    NODE_ENV=dev npm start

#### For *production* mode, run:

    npm start

    The backoffice where you can add a new scheduler can be found at
    <code>http://service_base_url/createhistoryscheduler</code><br><br>
    To start or stop a process to save historical data of a device, go to <code>http://service_base_url/startstophistoryscheduler</code> page<br><br>
