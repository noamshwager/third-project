import { IconButton, Modal } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import { useState } from 'react';
import VacationModel from "../../../Models/VacationModel";
import globals from '../../../Services/Globals';
import jwtAxios from '../../../Services/JwtAxios';
import notify from '../../../Services/Notify';
import EditVacation from '../EditVacation/EditVacation';
import "./AdminVacationCard.css";

interface AdminVacationCardProps {
    vacation: VacationModel;
}

function AdminVacationCard(props: AdminVacationCardProps): JSX.Element {

    const [open, setOpen] = useState<boolean>(false);//for modal that will be opened when pressing edit vacation button

    async function deleteVacation() {//delete vacation from database when the delete button is clicked by admin
        try {
            await jwtAxios.delete<VacationModel>(`${globals.vacationsUrl}${props.vacation.vacationId}`);//delete vacation from database and the controller will emit socket (msg-from-server-vacation-deleted) using socketHelper and SocketManager will update state
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="AdminVacationCard">
            <div>
                {/* Modal for editing vacation, creates new component with a form for editing vacation */}
                <Modal open={open} onClose={() => { setOpen(false) }} >
                    <div style={{ position: "absolute", top: "45.5%", left: "46.5%", transform: "translate(-40%, -50%)" }}>
                        <EditVacation vacation={props.vacation} />
                    </div>
                </Modal>
                {/* two buttons one for deleting vacation and one for editing, which when pressed basically opens the modal which contains the edit vacation component */}
                <section>
                    <IconButton size="small" color="secondary" onClick={deleteVacation}>
                        <ClearIcon />
                    </IconButton>
                    <br />
                    <IconButton size="small" color="primary" onClick={() => { setOpen(true) }}>
                        <CreateIcon />
                    </IconButton>
                </section>
                <br />
                <label>Location: </label>{props.vacation.location}
                <br />
                {/* I change the string because the date was in full format including hours and seconds */}
                <label>start date: </label>{props.vacation.startDate.indexOf("T") === -1 ? props.vacation.startDate : props.vacation.startDate.substring(0, props.vacation.startDate.indexOf("T"))}
                <br />
                {/* I change the string because the date was in full format including hours and seconds */}
                <label>end date: </label>{props.vacation.endDate.indexOf("T") === -1 ? props.vacation.endDate : props.vacation.endDate.substring(0, props.vacation.endDate.indexOf("T"))}
                <br />
                <label>price: </label>{props.vacation.price} &#36;
                <br />
                <label>description: </label>
                <br />
                <span>{props.vacation.description}</span>
                <br />
                {/* present the image using the route in vacations controller */}
                <img src={`${globals.vacationsUrl}images/` + props.vacation.vacationImage} />
            </div>
        </div>
    );
}

export default AdminVacationCard;
