import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import { userLoggedInAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notify";
import "./Login.css";

function Login(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();

    async function submit(credentials: CredentialsModel) {
        try {
            const response = await axios.post<UserModel>(`${globals.authUrl}login`, credentials);//get user with token and without password
            store.dispatch(userLoggedInAction(response.data));//update state and set user in local storage 
            notify.success("logged-in successfully");
            history.push("/home");//go to home page but now user is logged in
        }
        catch (err) {
            if (err.message === "Request failed with status code 401") {
                notify.error("Incorrect username or password.");
            }
            else {
                notify.error(err);
            }
        }
    }

    return (
        <div className="Login Box">
            <form onSubmit={handleSubmit(submit)}>
                <h2>Login</h2>

                <label>username:</label>
                <input type="text"{...register("userName", { required: true, minLength: 4, maxLength: 25 })} />
                {formState.errors.userName?.type === "required" && <span>Missing<br /> username.</span>}
                {formState.errors.userName?.type === "minLength" && <span>Minimum<br /> length is 4 <br />characters.</span>}
                {formState.errors.userName?.type === "maxLength" && <span>Maximum<br /> length is 25 <br />characters.</span>}

                <label>password:</label>
                <input type="password"{...register("password", { required: true, minLength: 4, maxLength: 25 })} />
                {formState.errors.password?.type === "required" && <span>Missing<br /> password.</span>}
                {formState.errors.password?.type === "minLength" && <span>Minimum<br /> length is 4 <br />characters.</span>}
                {formState.errors.password?.type === "maxLength" && <span>Maximum<br /> length is 25 <br />characters.</span>}

                <button>Log in</button>
            </form>
        </div>
    );
}

export default Login;
