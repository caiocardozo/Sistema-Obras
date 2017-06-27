import { SPBidding } from './../spbidding/spbidding';
import { BiddingApportionment } from './../biddingapportionment/biddingapportionment';
import { Construction } from './../construction/construction';

export class Bidding {
    id: number;
    constructionId: number;
    biddingShoppingPortalId: number;
    amount: number;
    executionTime: number;
    dateOfGeneration: Date;
    userIdRegistered: number;
    lastUpdatedDate: Date;
    userIdUpdated: number;
    construction: Construction;
    spBidding: SPBidding;
    biddingApportionment: BiddingApportionment[];
}
