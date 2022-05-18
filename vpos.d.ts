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

export interface vPosConfig {
  token: string;
  posId: number;
  supervisorCard: string;
  paymentCallbackUrl: string;
  refundCallbackUrl: strin;
}
export class Vpos {
  constructor(config: vPosConfig);
  newPayment(amount: string, customer: string): newPaymentSucces | newPaymentError 
}
