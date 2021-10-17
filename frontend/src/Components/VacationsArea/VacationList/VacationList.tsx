import { Component } from "react";
import { History } from "history";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { FollowedVacationsDownloadedAction, UnFollowedVacationsDownloadedAction, VacationsDownloadedAction } from "../../../Redux/VacationsState";
import VacationCard from "../VacationCard/VacationCard";
import { socketManagerInstance } from "../../../Socket.io/SocketManager";
import { Unsubscribe } from "redux";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import globals from "../../../Services/Globals";

interface VacationListProps {
    history: History;
}

interface VacationListState {
    followedVacations: VacationModel[];
    unFollowedVacations: VacationModel[];
}

class VacationList extends Component<VacationListProps, VacationListState> {

    private unsubscribeFromStore: Unsubscribe;

    public constructor(props: VacationListProps) {
        super(props);
        this.state = { followedVacations: store.getState().vacationState.followedVacations, unFollowedVacations: store.getState().vacationState.unFollowedVacations };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("you are not logged in.");
                this.props.history.push("/login");
                return;
            }

            if (store.getState().authState.user.isAdmin === "yes") {
                notify.error("Admin can only use Admin vacation list");
                this.props.history.push("/admin-vacations");
                return;
            }

            socketManagerInstance.connect();//connect to socket

            this.unsubscribeFromStore = store.subscribe(() => {
                this.setState({ followedVacations: store.getState().vacationState.followedVacations, unFollowedVacations: store.getState().vacationState.unFollowedVacations });
            });

            if (this.state.followedVacations.length === 0 && this.state.unFollowedVacations.length === 0) {

                const followedVacationsResponse = await jwtAxios.get<VacationModel[]>(`${globals.vacationsUrl}followed/${JSON.parse(localStorage.getItem("user")).userId}`);//get followed vacations

                const unFollowedVacationsResponse = await jwtAxios.get<VacationModel[]>(`${globals.vacationsUrl}un-followed/${JSON.parse(localStorage.getItem("user")).userId}`);// get unfollowed vacations

                this.setState({ followedVacations: followedVacationsResponse.data, unFollowedVacations: unFollowedVacationsResponse.data });

                store.dispatch(FollowedVacationsDownloadedAction(followedVacationsResponse.data));
                store.dispatch(UnFollowedVacationsDownloadedAction(unFollowedVacationsResponse.data));

            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="VacationList">
                {/* show first followed vacations and then unfollowed vacations */}
                {this.state.followedVacations.map((v, index) => <VacationCard vacation={v} isFollowed={true} key={index} />)}
                {this.state.unFollowedVacations.map((v, index) => <VacationCard vacation={v} isFollowed={false} key={index} />)}

            </div>
        );
    }

    public componentWillUnmount(): void {

        if (store.getState().authState.user !== null) {//I checked this because if admin tried to go to this route but got redirected, disconnecting the socket before it got connected will cause error
            if (store.getState().authState.user.isAdmin !== "yes") {
                socketManagerInstance.disconnect();
            }
        }

        if (this.unsubscribeFromStore !== undefined) {
            this.unsubscribeFromStore();
        }
    }

}

export default VacationList;
