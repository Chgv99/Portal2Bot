const StateManager = require('./StateManager.js');
const connection = require('../../database/db.js');

let load = async function(){
    connection.connect;
    console.log("Loading cache" + connection);
    //console.log("Loading cache" + StateManager.listenerCount());
    //console.log("Loading cache" + JSON.stringify(sm));
    //console.log("Loading cache" + Object.assign(StateManager, sm));
    try {
        await connection.query(
            `SELECT * FROM globals WHERE id = 1`
        ).then(result => {
            console.log(result);
        })
        StateManager.emit('mapChannelUpdated', mapchannelid.parseInt());    
    }  catch (error) {
        console.error(error);
    }
}

exports.load = load;