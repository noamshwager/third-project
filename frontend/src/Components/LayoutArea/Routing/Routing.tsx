import { Redirect, Route, Switch } from "react-router";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AdminVacationList from "../../VacationsArea/AdminVacationList/AdminVacationList";
import Home from "../../VacationsArea/Home/Home";
import VacationList from "../../VacationsArea/VacationList/VacationList";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Switch>
                <Route path="/home" component={Home} exact />
                <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/vacations" component={VacationList} exact />
                <Route path="/admin-vacations" component={AdminVacationList} exact />
                <Redirect from="/" to="/home" exact />
            </Switch>
        </div>
    );
}

export default Routing;
