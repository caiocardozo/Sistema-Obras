import { Construction } from './../construction/construction';

export class Bond {
  id: string;
  constructionId: number;
  contractId: number;
  typeOfBondId: number;
  expirationDate: string;
  value: number;
  status: string;
  dateOfGeneration: Date;
  userIdRegistered: number;
  construction: Construction;
}
