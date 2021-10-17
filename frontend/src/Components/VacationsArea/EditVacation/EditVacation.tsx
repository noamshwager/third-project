import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import "./EditVacation.css";

interface EditVacationProps {
    vacation: VacationModel;
}

function EditVacation(props: EditVacationProps): JSX.Element {

    const { register, handleSubmit, formState } = useForm<VacationModel>();

    async function send(vacation: VacationModel) {
        try {
            const response = await jwtAxios.put<VacationModel>(`${globals.vacationsUrl}${props.vacation.vacationId}`, VacationModel.convertToFormData(vacation));//update vacation in database, the controller will emit socket (msg-from-server-vacation-updated) using socketHelper and SocketManager will update state
            notify.success("Vacation has been updated. Click outside the modal to close it.");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="EditVacation">
            <form onSubmit={handleSubmit(send)}>
                <h2>Edit Vacation:</h2>

                <label>Location:</label>
                <input type="text" {...register("location", { required: true, minLength: 3 })} defaultValue={props.vacation.location} />
                {formState.errors.location?.type === "required" && <span>Missing location.</span>}
                {formState.errors.location?.type === "minLength" && <span>Minimum length is 3 characters.</span>}
                <br />

                <label>start date:</label>
                <input type="date" {...register("startDate", { required: true })} defaultValue={props.vacation.startDate.indexOf("T") !== -1 ? props.vacation.startDate.substring(0, props.vacation.startDate.indexOf("T")) : props.vacation.startDate} />
                {formState.errors.startDate?.type === "required" && <span>Missing start date.</span>}
                <br />

                <label>end date:</label>
                <input type="date"{...register("endDate", { required: true })} defaultValue={props.vacation.endDate.indexOf("T") !== -1 ? props.vacation.endDate.substring(0, props.vacation.endDate.indexOf("T")) : props.vacation.endDate} />
                {formState.errors.endDate?.type === "required" && <span>Missing end date.</span>}
                <br />

                <label>price:</label>
                <input type="number"{...register("price", { required: true, min: 0 })} defaultValue={props.vacation.price} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}
                <br />

                <label>description:</label>
                <textarea rows={4} cols={40} {...register("description", { required: true, minLength: 65, maxLength: 140 })} defaultValue={props.vacation.description} />
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Minimum length is 65 characters.</span>}
                {formState.errors.description?.type === "maxLength" && <span>Maximum length is 140 characters.</span>}
                <br />

                <label>Image: </label>
                <input type="file" accept="images/*" {...register("vacationImageFile", { required: true })} />
                {formState.errors.vacationImageFile?.type === "required" && <span>Missing image.</span>}
                <br />

                <button>Edit</button>
            </form>
        </div>
    );
}

export default EditVacation;
