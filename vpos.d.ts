export interface newPaymentSucces {
  status_code: number;
  message: string;
  location: string;
}
export interface vPosErrorRequest {
  status_code: number;
  message: string;
  details: object;
}

export interface getTransactionSucess{
  status_code: number;
  message: string;
  data: object;
}

export interface VPosConfig {
  token: string | undefined;
  posId: number | undefined;
  supervisorCard: number | undefined;
  paymentCallbackUrl: string | undefined;
  refundCallbackUrl: string | undefined;
}

export class Vpos {
  constructor(config: VPosConfig ) 
  newPayment({amount: string, customer: string}): Promisse<newPaymentSucces> | Promisse<vPosErrorRequest>
  getTransaction({transactionId: string}): Promisse<getTransactionSucess> | Promisse<vPosErrorRequest>
}



export default Vpos
