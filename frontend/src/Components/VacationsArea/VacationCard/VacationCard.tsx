import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import FollowModel from "../../../Models/FollowModel";
import VacationModel from "../../../Models/VacationModel";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
    isFollowed?: boolean;//when component is created in VacationList component it is passed this value to know whether to show if this vacation is followed or not
}

function VacationCard(props: VacationCardProps): JSX.Element {

    const [isFollowedState, setIsFollowedState] = useState<boolean>(props.isFollowed);
    const [followersState, setFollowersState] = useState<number>(0);
    let flag = true;
    useEffect(() => {
        (async () => {
            try {
                const response = await jwtAxios.get<number>(`${globals.vacationsUrl}followers/${props.vacation.vacationId}`);//get how many followers this vacation has
                if (flag) setFollowersState(response.data);
            }
            catch (err) {
                notify.error(err);
            }
        })();
        return () => { flag = false };
    }, []);

    async function changeColorAndFollowStatus() {

        if (isFollowedState === false) {
            try {
                //follow vacation
                await jwtAxios.post<FollowModel>(`${globals.vacationsUrl}followed/${JSON.parse(localStorage.getItem("user")).userId}/${props.vacation.vacationId}`);//send userId and vacationId to route in order to be added to "followers" table in database
                setIsFollowedState(!isFollowedState);
                setFollowersState(followersState + 1);
            }
            catch (err) {
                notify.error(err);
            }
        }
        else {
            try {
                //unfollow vacation
                await jwtAxios.delete<FollowModel>(`${globals.vacationsUrl}followed/${JSON.parse(localStorage.getItem("user")).userId}/${props.vacation.vacationId}`);//send userId and vacationId to route in order to be removed from "followers" table in database
                setIsFollowedState(!isFollowedState);
                setFollowersState(followersState - 1);
            }
            catch (err) {
                notify.error(err);
            }
        }

    }

    return (
        <div className="VacationCard">
            <div>
                {/* show follow or unfollow button depending on whether the vacation is followed */}
                {isFollowedState === true ? <Button onClick={changeColorAndFollowStatus} size="small" variant="contained" color="primary">Unfollow</Button> : <Button onClick={changeColorAndFollowStatus} size="small" variant="outlined" color="primary" >Follow</Button>}
                <br />
                <label>Followers: </label>{followersState}
                <br />
                <label>Location: </label>{props.vacation.location}
                <br />
                <label>start date: </label>{props.vacation.startDate.indexOf("T") === -1 ? props.vacation.startDate : props.vacation.startDate.substring(0, props.vacation.startDate.indexOf("T"))}
                <br />
                <label>end date: </label>{props.vacation.endDate.indexOf("T") === -1 ? props.vacation.endDate : props.vacation.endDate.substring(0, props.vacation.endDate.indexOf("T"))}
                <br />
                <label>price: </label>{props.vacation.price} &#36;
                <br />
                <label>description: </label>
                <br />
                <span>{props.vacation.description}</span>
                <br />
                {/* show vacation image using route created in vacations controller */}
                <img src={`${globals.vacationsUrl}images/` + props.vacation.vacationImage} />
            </div>
        </div>
    );
}

export default VacationCard;
