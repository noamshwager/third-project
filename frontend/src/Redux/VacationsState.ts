import VacationModel from "../Models/VacationModel";

//Vacations State:
export class VacationsState {
    public vacations: VacationModel[] = [];
    public followedVacations: VacationModel[] = [];
    public unFollowedVacations: VacationModel[] = [];
}

//Vacations Action Type:
export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    FollowedVacationsDownloaded = "FollowedVacationsDownloaded",
    UnFollowedVacationsDownloaded = "UnFollowedVacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted",
    VacationsCleared="VacationsCleared"
}

//Vacations Action:
export interface VacationsAction {
    type: VacationsActionType;
    payload?: any;
}

//Vacations Action Creators:
export function VacationsDownloadedAction(vacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.VacationsDownloaded, payload: vacations };
}
export function FollowedVacationsDownloadedAction(followedVacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.FollowedVacationsDownloaded, payload: followedVacations };
}
export function UnFollowedVacationsDownloadedAction(unFollowedVacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.UnFollowedVacationsDownloaded, payload: unFollowedVacations };
}
export function VacationAddedAction(addedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationAdded, payload: addedVacation };
}
export function VacationUpdatedAction(updatedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationUpdated, payload: updatedVacation };
}
export function VacationDeletedAction(id: number): VacationsAction {
    return { type: VacationsActionType.VacationDeleted, payload: id };
}
export function VacationsCleared(): VacationsAction {
    return { type: VacationsActionType.VacationsCleared };
}

export function vacationsReducer(currentState: VacationsState = new VacationsState(),
    action: VacationsAction): VacationsState {

    const newState = { ...currentState };

    switch (action.type) {
        case VacationsActionType.VacationsDownloaded:
            newState.vacations = action.payload;
            break;

        case VacationsActionType.FollowedVacationsDownloaded:
            newState.followedVacations = action.payload;
            break;

        case VacationsActionType.UnFollowedVacationsDownloaded:
            newState.unFollowedVacations = action.payload;
            break;

        case VacationsActionType.VacationAdded:
            newState.vacations.push(action.payload);
            newState.unFollowedVacations.push(action.payload);
            break;

        case VacationsActionType.VacationUpdated:
            const indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.vacationId);
            newState.vacations[indexToUpdate] = action.payload;

            const indexToUpdateFollowed = newState.followedVacations.findIndex(v => v.vacationId === action.payload.vacationId);
            if (indexToUpdateFollowed !== -1) {
                newState.followedVacations[indexToUpdateFollowed] = action.payload;
            }
            else {
                const indexToUpdateUnFollowed = newState.unFollowedVacations.findIndex(v => v.vacationId === action.payload.vacationId);
                newState.unFollowedVacations[indexToUpdateUnFollowed] = action.payload;
            }
            break;

        case VacationsActionType.VacationDeleted:
            const indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload);
            newState.vacations.splice(indexToDelete, 1);
            const indexToDeleteFollowed = newState.followedVacations.findIndex(v => v.vacationId === action.payload);
            if (indexToDeleteFollowed !== -1) {
                newState.followedVacations.splice(indexToDeleteFollowed, 1);
            }
            else {
                const indexToDeleteUnFollowed = newState.unFollowedVacations.findIndex(v => v.vacationId === action.payload);
                newState.unFollowedVacations.splice(indexToDeleteUnFollowed, 1);
            }
            break;
        
        case VacationsActionType.VacationsCleared:
            newState.vacations=[];
            newState.followedVacations=[];
            newState.unFollowedVacations=[];
            break;

    }
    return newState;
}
