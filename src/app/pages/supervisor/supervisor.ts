import { TypeOfInspection } from './../typeofinspection/typeofinspection';
export class Supervisor {
    id: number;
    name: string;
    cpf: number;
    email: string;
    phone: string;
    phoneTwo: string;
    typeInspectionId: number;
    creaNumber: string;
    status: string;
    dateOfGeneration: Date;
    userIdRegistere: number;
    typeofinspection: TypeOfInspection;
}
