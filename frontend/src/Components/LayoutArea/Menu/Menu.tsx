import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import "./Menu.css";

interface MenuState {
    user: UserModel;
}

class Menu extends Component<{}, MenuState> {

    private unsubscribe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = { user: store.getState().authState.user };
    }

    public componentDidMount(): void {
        this.unsubscribe = store.subscribe(() => this.setState({ user: store.getState().authState.user }));
    }

    public render(): JSX.Element {
        return (
            <div className="Menu">

                <nav>

                    <NavLink to="/home">Home</NavLink>
                    {/* <span> | </span> */}
                    {/* if user is not logged in he will be able to press vacation list link but will be redirected to login page */}
                    {this.state.user === null && <NavLink to="/vacations">vacation list</NavLink>}
                    {/* if user is logged in show vacation list link */}
                    {this.state.user !== null && this.state.user.isAdmin === "no" && <NavLink to="/vacations">vacation list</NavLink>}
                    {/* if user is logged in and admin show admin vacation list link */}
                    {this.state.user !== null && this.state.user.isAdmin === "yes" && <NavLink to="/admin-vacations">admin vacation list</NavLink>}

                </nav>
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

}

export default Menu;
