import { Campus } from './../campus/campus';
import { TypeOfInspection } from './../typeofinspection/typeofinspection';
import { TypeOfConstruction } from './../typeofconstruction/typeofconstruction';
import { Situation } from './../situation/situation';


export class Construction {
    id: number;
    nickname: string;
    description: string;
    name: string;
    campId: number;
    typeOfConstructionId: number;
    situationId: number;
    typeOfInspectionId: number;
    startDate: Date;
    endDate: Date;
    contractTerminationDate: Date;
    signatureDate: Date;
    area: number;
    estimatedValue: number;
    dateOfGeneration: Date;
    userIdRegistered: number;
    lastUpdatedDate: Date;
    userIdUpdated: number;
    situation: Situation;
    typeOfConstruction: TypeOfConstruction;
    typeOfInspection: TypeOfInspection;
    camp: Campus;
}
