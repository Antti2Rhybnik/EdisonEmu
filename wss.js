"use strict";
const WS = require('ws');

const HOST = 'wss://iotmmsp1942206778trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/ws/data/50f2e452-c95d-4168-920c-e07f7c8ef962';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Sensor {

    constructor(id_, class_, io_port_) {
        this.io_port = io_port_;
        this.msg = {sensor_id: id_, sensor_class: class_, sensor_value: 0, timestamp: "0"};
    }

    get id() {
        return this.msg.sensor_id;
    }

    get class() {
        return this.msg.sensor_class;
    }


    readInput() {
        this.msg.sensor_value = getRandomArbitrary(this.id * 10 * (1 - 0.05), this.id * 10 * (1 + 0.05));
    }

    getMessage() {

        var sap_msg_struct = {
            "mode":"async",
            "messageType":"bfdb9f931da6f202de05",
            "messages": [this.msg]
        };

        return JSON.stringify(sap_msg_struct);
    }


}



const OPTIONS = {
    headers: {
        Authorization: 'Bearer 4c721e1eeb7e3be80d9a96c609a42fa'
    }
}




var sensors = [
    new Sensor('1', 'WATER', 1),
    new Sensor('2', 'LIGHT', 2)
];



function setupWebSocket() {

    var timerId = 0;
    var ws = new WS(HOST, OPTIONS);

    ws.onopen = () => {
        console.log("opened");
        timerId = setInterval(() => {

            sensors.forEach((sensor) => {

                sensor.readInput();
                console.log(">>", sensor.msg);
                ws.send( sensor.getMessage() );
            });

        }, 1000);
    };

    ws.onerror = (err) => { console.log(err+'') };

    ws.onmessage = (msg_) => {
        console.log("<<:", msg_.data);
    };

    ws.onclose = () => {
        console.log("Connection closed");
        clearInterval(timerId);
        setTimeout(setupWebSocket, 1000);
    };
}


setupWebSocket();