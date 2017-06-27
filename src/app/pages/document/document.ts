import { DocumentTypeConstruction } from './../documenttypeconstruction/documenttypeconstruction';
export class Document {
    id: number;
    constructionId: number;
    documentTypeConstructionId: number;
    date: string;
    number: number;
    comments: string;
    dateOfGeneration: Date;
    userIdRegistered: number;
    documenttypeconstruction: DocumentTypeConstruction;
}
