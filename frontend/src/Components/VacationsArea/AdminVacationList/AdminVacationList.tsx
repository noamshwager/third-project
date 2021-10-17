import { Component } from "react";
import { History } from "history";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import "./AdminVacationList.css";
import { VacationsDownloadedAction } from "../../../Redux/VacationsState";
import AdminVacationCard from "../AdminVacationCard/AdminVacationCard";
import { socketManagerInstance } from "../../../Socket.io/SocketManager";
import { Unsubscribe } from "redux";
import { Button, Modal } from "@material-ui/core";
import AddVacation from "../AddVacation/AddVacation";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import globals from "../../../Services/Globals";

interface AdminVacationListProps {
    history: History;
}

interface AdminVacationListState {
    vacations: VacationModel[];
    open: boolean;//for modal that contains form to add vacation
}

class AdminVacationList extends Component<AdminVacationListProps, AdminVacationListState> {

    private unsubscribeFromStore: Unsubscribe;

    public constructor(props: AdminVacationListProps) {
        super(props);
        this.state = { vacations: store.getState().vacationState.vacations, open: false };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("you are not logged in.");
                this.props.history.push("/login");
                return;
            }

            if (store.getState().authState.user.isAdmin === "no") {
                notify.error("you are not Admin.");
                this.props.history.push("/vacations");
                return;
            }

            socketManagerInstance.connect();//connect to socket

            this.unsubscribeFromStore = store.subscribe(() => {
                this.setState({ vacations: store.getState().vacationState.vacations });
            });

            if (this.state.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(globals.vacationsUrl);//get all vacations
                this.setState({ vacations: response.data });
                store.dispatch(VacationsDownloadedAction(response.data));
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="AdminVacationList">
                {/* modal for adding vacation which creates AddVacation component with a form to add vacation */}
                <Modal open={this.state.open} onClose={() => { this.setState({ open: false }) }}>
                    <div style={{ position: "absolute", top: "45.5%", left: "46.5%", transform: "translate(-40%, -50%)" }}>
                        <AddVacation />
                    </div>
                </Modal>
                {/* button for opening modal */}
                <Button variant="contained" color="primary" size="medium" onClick={() => this.setState({ open: true })}>Add Vacation</Button>
                <br /><br />
                {/* create and present an admin suiting card for each vacation */}
                {this.state.vacations.map((v, index) => <AdminVacationCard vacation={v} key={index} />)}
            </div>
        );
    }

    public componentWillUnmount(): void {
        if(store.getState().authState.user){
            if (store.getState().authState.user.isAdmin !== "no") {//I checked this because if user tried to go to this route but got redirected, disconnecting the socket before it got connected will cause error
                socketManagerInstance.disconnect();
            }

        }

        if (this.unsubscribeFromStore !== undefined) {
            this.unsubscribeFromStore();
        }
    }
}

export default AdminVacationList;
