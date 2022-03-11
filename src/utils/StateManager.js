const EventEmitter = require('events');
//import EventEmitter from 'events';
const conn = require('../../database/db');
//import conn from '../../database/db';
const mysql = require('mysql2/promise');
//import * as mysql from 'mysql2/promise';

class StateManager extends EventEmitter {

    constructor (opts) {
        super(opts);
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
            //queueLimit: 0,
            //connectionLimit: 0
        }).then((connection) => this.connection = connection)
            .catch(e => console.log(e));
        this.setMaxListeners(0)
    }
}

module.exports = new StateManager();