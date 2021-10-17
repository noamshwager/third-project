const io = require("socket.io");

let socketServer;

function init(expressListener) {
    socketServer = io(expressListener, { cors: { origin: "http://localhost:3000" } });
    socketServer.sockets.on("connection", socket => {
        console.log("Client Connected. Total Clients: ", socketServer.engine.clientsCount);
        socket.on("disconnect", () => console.log("Client Disconnected. Total client: ", socketServer.engine.clientsCount - 1));
    });
}

function vacationAdded(addedVacation) {
    socketServer.sockets.emit("msg-from-server-vacation-added", addedVacation);
}

function vacationUpdated(updatedVacation) {
    socketServer.sockets.emit("msg-from-server-vacation-updated", updatedVacation);
}

function vacationDeleted(vacationId) {
    socketServer.sockets.emit("msg-from-server-vacation-deleted", vacationId);
}



module.exports = {
    init,
    vacationAdded,
    vacationUpdated,
    vacationDeleted,
};