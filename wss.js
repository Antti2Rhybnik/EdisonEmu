"use strict";
const WS = require('ws');


const HOST = 'wss://iotmmsp1942206778trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/ws/data/e527ea4a-6a43-4ff6-8296-4ac89fd0f8c7';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


class Sensor {

    constructor(id_, io_port_) {
        this.io_port = io_port_;
        this.msg = {sensor_id: id_, sensor_value: 0};
    }

    get id() {
        return this.msg.sensor_id;
    }

    get class() {
        return this.msg.sensor_class;
    }


    readInput() {
        this.msg.sensor_value = getRandomArbitrary(this.id * 10 * (1 - 0.05), this.id * 10 * (1 + 0.05));
        // this.msg.sensor_value = getLight();
    }

    getMessage() {

        var sap_msg_struct = {
            "mode":"async",
            "messageType":"b17a4204fca0e5bf7d52",
            "messages": [this.msg]
        };

        return JSON.stringify(sap_msg_struct);
    }


}



const OPTIONS = {
    headers: {
        Authorization: 'Bearer 74505559a34962d0781bd448fa7c22d'
    }
}




var sensors = [
    new Sensor(1, 1)
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

        }, 4000);
    };

    ws.onerror = (err) => { console.log(err+'') };

    ws.onmessage = (msg_) => {
        console.log("<<", msg_.data);
    };

    ws.onclose = () => {
        console.log("Connection closed");
        clearInterval(timerId);
        setTimeout(setupWebSocket, 1000);
    };
}


setupWebSocket();
