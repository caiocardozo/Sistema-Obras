import { Construction } from './../construction/construction';
import { Supervisor } from './../supervisor/supervisor';
import { Contract } from './../contract/contract';
export class Measurement {
    id: number;
    constructionId: number;
    contractId: number;
    supervisorId: number;
    date: Date;
    amount: number;
    comments: string;
    apportionmentCode: number;
    chit: number;
    chitSeries: string
    dateOfGeneration: Date;
    userIdRegistered: number;
    supervisor: Supervisor;
    contract: Contract;
    construction: Construction;
}
