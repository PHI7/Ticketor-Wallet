
export interface NFTTicket {
  id: string;
  tokenId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  categoryName: string;
  imageURL: string | null;
  isRedeemed: boolean;
  qrCodeString: string;
  redeemedDate: string | null;
}
