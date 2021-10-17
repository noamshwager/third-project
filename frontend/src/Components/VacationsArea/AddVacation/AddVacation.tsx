import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import "./AddVacation.css";

function AddVacation(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<VacationModel>();

    async function send(vacation: VacationModel) {
        try {
            const response = await jwtAxios.post<VacationModel>(globals.vacationsUrl, VacationModel.convertToFormData(vacation));//add new vacation to database and the controller will emit socket (msg-from-server-vacation-added) using socketHelper and SocketManager will update state
            notify.success("Vacation has been added. Click outside the modal to close it.");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">
            <form onSubmit={handleSubmit(send)}>

                <h2>Add Vacation</h2>

                <label>Location: </label>
                <input type="text" {...register("location", { required: true, minLength: 3 })} />
                {formState.errors.location?.type === "required" && <span>Missing location.</span>}
                {formState.errors.location?.type === "minLength" && <span>Minimum length is 3 characters.</span>}
                <br />

                <label>Start Date: </label>
                <input type="date" {...register("startDate", { required: true })} />
                {formState.errors.startDate?.type === "required" && <span>Missing start date.</span>}
                <br />

                <label>End Date: </label>
                <input type="date" {...register("endDate", { required: true })} />
                {formState.errors.endDate?.type === "required" && <span>Missing end date.</span>}
                <br />

                <label>price: </label>
                <input type="number" {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}
                <br />

                <label>Description: </label>
                <textarea rows={4} cols={40} {...register("description", { required: true, minLength: 65, maxLength: 140 })} />
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Minimum length is 65 characters.</span>}
                {formState.errors.description?.type === "maxLength" && <span>Maximum length is 140 characters.</span>}
                <br />

                <label>Image: </label>
                <input type="file" accept="images/*" {...register("vacationImageFile", { required: true })} />
                {formState.errors.vacationImageFile?.type === "required" && <span>Missing image.</span>}
                <br />

                <button>Add</button>

            </form>
        </div>
    );
}

export default AddVacation;
