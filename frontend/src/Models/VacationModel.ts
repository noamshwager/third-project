class VacationModel {
    public vacationId: number;
    public location: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public description: string;
    public vacationImage: string;
    public vacationImageFile?: FileList;

    public static convertToFormData(vacation: VacationModel): FormData {
        const myFormData = new FormData();
        myFormData.append("location", vacation.location);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("startDate", vacation.startDate.toString());
        myFormData.append("endDate", vacation.endDate.toString());
        myFormData.append("description", vacation.description);
        myFormData.append("vacationImageFile", vacation.vacationImageFile.item(0));
        return myFormData;
    }
}


export default VacationModel;
