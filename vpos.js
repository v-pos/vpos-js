const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const GPO_POS_ID = process.env.GPO_POS_ID;
const GPO_SUPERVISOR_CARD = process.env.GPO_SUPERVISOR_CARD;
const PAYMENT_CALLBACK_URL = process.env.PAYMENT_CALLBACK_URL;
const REFUND_CALLBACK_URL = process.env.REFUND_CALLBACK_URL;
const MERCHANT_VPOS_TOKEN = process.env.MERCHANT_VPOS_TOKEN;
const VPOS_ENVIRONMENT = process.env.VPOS_PROFILE;
const REQUEST_LOCATION = 17;
const TRANSACTION_LOCATION = 21;

module.exports = class Vpos {
  constructor(
      {
        environment: environment,
        token: token,
        posId: posId,
        supervisorCard: supervisorCard,
        paymentCallbackUrl: paymentCallbackUrl,
        refundCallbackUrl: refundCallbackUrl
      }
  ) {
    this.environment = environment || VPOS_ENVIRONMENT;
    this.token = token || MERCHANT_VPOS_TOKEN;
    this.posId = posId || GPO_POS_ID;
    this.supervisorCard = supervisorCard || GPO_SUPERVISOR_CARD;
    this.paymentCallbackUrl = paymentCallbackUrl || PAYMENT_CALLBACK_URL;
    this.refundCallbackUrl = refundCallbackUrl || REFUND_CALLBACK_URL;
  }

  static request() {

    return {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      maxRedirects: 0
    };
  }

  host() {
    if (this.environment === 'PRD') {
      return 'https://api.vpos.ao'
    } else {
      return 'https://sandbox.vpos.ao'
    }
  }

  getTransaction({transactionId: transactionId}) {
    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + this.token;

    return axios.get(this.host() + '/api/v1/transactions/' + transactionId, request)
    .then(response => {
      return {
        status_code: response.status,
        message: response.statusText,
        data: response.data
      }
    })
    .catch(error => {
      return {
        status_code: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  getTransactions() {
    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + this.token;

    return axios.get(this.host() + '/api/v1/transactions', request)
    .then(response => {
      return {
        status_code: response.status,
        message: response.statusText,
        data: response.data
      }
    })
    .catch(error => {
      return {
        status_code: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  newPayment({amount: amount, customer: customer}) {
    let body = {type: "payment", pos_id: this.posId, mobile: customer, amount: amount, callback_url: this.paymentCallbackUrl}

    let request = Vpos.request();
    request.headers['Idempotency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + this.token;

    return axios.post(this.host() + '/api/v1/transactions', body, request)
    .then(response => {
      return {
        status_code: response.status,
        message: response.statusText,
        location: response.headers.location
      }
    })
    .catch(error => {
      return {
        status_code: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  newRefund({parentTransactionId: parentTransactionId}) {
    let body = {
      type: "refund",
      parent_transaction_id: parentTransactionId,
      supervisor_card: this.supervisorCard,
      callback_url: this.refundCallbackUrl
    };

    const request = Vpos.request();
    request.headers['Idempotency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + this.token;

    return axios.post(this.host() + '/api/v1/transactions', body, request)
    .then(response => {
      return {
        status_code: response.status,
        message: response.statusText,
        location: response.headers.location
      }
    })
    .catch(error => {
      return {
        status_code: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  getRequest({response: response}) {
    let requestId = '';
    if (response.status_code === 202) {
      requestId = response.location.substring(REQUEST_LOCATION);
    } else {
      requestId = response.location.substring(TRANSACTION_LOCATION);
    }

    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + this.token;

    if (response.status_code === 202) {
      return axios.get(this.host() + '/api/v1/requests/' + requestId, request)
          .then(response => {
            if (response.status === 200) {
              return {
                status_code: response.status,
                message: response.statusText,
                data: response.data
              }
            } else {
              return {
                status_code: response.status,
                message: response.statusText,
                location: response.headers.location
              }
            }
          })
          .catch(error => {
            return {
              status_code: error.response.status,
              message: error.response.statusText,
              details: error.response.data
            }
          });
    } else {
      return axios.get(this.host() + '/api/v1/transactions/' + requestId, request)
          .then(response => {
            if (response.status === 200) {
              return {
                status_code: response.status,
                message: response.statusText,
                data: response.data
              }
            } else {
              return {
                status_code: response.status,
                message: response.statusText,
                location: response.headers.location
              }
            }
          })
          .catch(error => {
            return {
              status_code: error.response.status,
              message: error.response.statusText,
              details: error.response.data
            }
          });
    }
  }
}
