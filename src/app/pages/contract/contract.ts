import { ContractApportionment } from './../contractapportionment/contractapportionment';
import { Construction } from './../construction/construction';
import { TypeOfContract } from './../typeofcontract/typeofcontract';

export class Contract {
    id: number;
    constructionId: number;
    typeOfContractId: number;
    biddingId: number;
    vendorCode: number;
    signatureDate: Date;
    contractValue: number;
    deadline: string;
    area: number;
    contractDuration: Date;
    comments: string;
    contractOrigin: number;
    dateOfGeneration: Date;
    userIdRegistered: number;
    lastUpdatedDate: Date;
    userIdUpdated: number;
    typeOfContract: TypeOfContract;
    construction: Construction;
    contractApportionment: ContractApportionment;
}


