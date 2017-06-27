import { Supervisor } from './../supervisor/supervisor';
import { Construction } from './../construction/construction';
export class SupervisorConstruction {
    id: number;
    constructionId: number;
    supervisorId: number;
    status: string;
    dateOfGeneration: Date;
    userIdRegistere: number;
    construction: Construction;
    supervisor: Supervisor;
}
