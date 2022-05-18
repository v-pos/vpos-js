declare namespace Vpos {
    interface newPaymentSucces {
        status_code: number;
        message: string;
        location: string;
    }
    interface newPaymentError {
        status_code: number;
        message: string;
        details: string;
    }
    function newPayment(amount: string, customer: string): newPaymentSucces | newPaymentError 
  }