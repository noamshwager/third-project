import { io, Socket } from "socket.io-client";
import VacationModel from "../Models/VacationModel";
import store from "../Redux/Store";
import { VacationAddedAction, VacationDeletedAction, VacationUpdatedAction } from "../Redux/VacationsState";

class SocketManager {

    private socket: Socket;

    public connect(): void {

        this.socket = io("http://localhost:3001");

        this.socket.on("msg-from-server-vacation-added", (addedVacation: VacationModel) => {
            store.dispatch(VacationAddedAction(addedVacation));
        });

        this.socket.on("msg-from-server-vacation-updated", (updatedVacation: VacationModel) => {
            store.dispatch(VacationUpdatedAction(updatedVacation));
        });

        this.socket.on("msg-from-server-vacation-deleted", (vacationId: number) => {
            store.dispatch(VacationDeletedAction(vacationId));
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

}
export default SocketManager;

export const socketManagerInstance = new SocketManager();