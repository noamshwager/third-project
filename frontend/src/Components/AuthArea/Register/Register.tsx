import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import UserModel from "../../../Models/UserModel";
import { userRegisteredAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notify";
import "./Register.css";

function Register(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<UserModel>();

    async function submit(user: UserModel) {
        try {
            const response = await axios.post<UserModel>(`${globals.authUrl}register`, user);//add user to database and return object with token and without password
            store.dispatch(userRegisteredAction(response.data));//update state and set local storage with user object
            notify.success("You have been successfully registered.");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Register Box">
            <form onSubmit={handleSubmit(submit)}>
                <h2>Register</h2>

                <label>First Name:</label>
                <input type="text" {...register("firstName", { required: true, minLength: 2, maxLength: 30 })} />
                {formState.errors.firstName?.type === "required" && <span>Missing<br /> first name.</span>}
                {formState.errors.firstName?.type === "minLength" && <span>Minimum<br /> length is 2 <br/> characters.</span>}
                {formState.errors.firstName?.type === "maxLength" && <span>Maximum<br /> length is 30 <br/> characters.</span>}
                <br />

                <label>Last Name:</label>
                <input type="text" {...register("lastName", { required: true, minLength: 2, maxLength: 30 })} />
                {formState.errors.lastName?.type === "required" && <span>Missing <br /> last name.</span>}
                {formState.errors.lastName?.type === "minLength" && <span>Minimum <br /> length is 2 <br/> characters.</span>}
                {formState.errors.lastName?.type === "maxLength" && <span>Maximum <br /> length is 30 <br/> characters.</span>}
                <br />

                <label>Username:</label>
                <input type="text" {...register("userName", { required: true, minLength: 4, maxLength: 25 })} />
                {formState.errors.userName?.type === "required" && <span>Missing<br /> username.</span>}
                {formState.errors.userName?.type === "minLength" && <span>Minimum<br /> length is 4 <br />characters.</span>}
                {formState.errors.userName?.type === "maxLength" && <span>Maximum<br /> length is 25 <br />characters.</span>}
                <br />

                <label>Password:</label>
                <input type="password" {...register("password", { required: true, minLength: 4, maxLength: 25 })} />
                {formState.errors.password?.type === "required" && <span>Missing<br /> password.</span>}
                {formState.errors.password?.type === "minLength" && <span>Minimum<br /> length is 4 <br />characters.</span>}
                {formState.errors.password?.type === "maxLength" && <span>Maximum<br /> length is 25 <br />characters.</span>}
                <br />

                <button>Register</button>

            </form>
        </div>
    );
}

export default Register;
