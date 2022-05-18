export interface newPaymentSucces {
  status_code: number;
  message: string;
  location: string;
}
interface newPaymentError {
  status_code: number;
  message: string;
  details: string;
}

export class Vpos {
  token: string;
  posId: number;
  supervisorCard: string;
  paymentCallbackUrl: string;
  refundCallbackUrl: string;
  constructor(token: string, posId: number, supervisorCard: string, paymentCallbackUrl: string, refundCallbackUrl: string){
    this.token = token;
    this.posId = posId;
    this.supervisorCard = supervisorCard;
    this.paymentCallbackUrl = paymentCallbackUrl;
    this.refundCallbackUrl = refundCallbackUrl;
  }
  newPayment(amount: string, customer: string): newPaymentSucces | newPaymentError 
}
