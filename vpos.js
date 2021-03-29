const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const GPO_POS_ID = process.env.GPO_POS_ID;
const GPO_SUPERVISOR_CARD = process.env.GPO_SUPERVISOR_CARD;
const PAYMENT_CALLBACK_URL = process.env.PAYMENT_CALLBACK_URL;
const REFUND_CALLBACK_URL = process.env.REFUND_CALLBACK_URL;
const VPOS_API_KEY = process.env.VPOS_API_KEY;
const VPOS_PROFILE = process.env.VPOS_PROFILE;

module.exports = class Vpos {
  static request() {
    return {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      maxRedirects: 0
    };
  }

  static setUrl(profile) {
    if (profile === "PRD") {
      return "https://api.vpos.ao"
    } else {
      return "https://sandbox.vpos.ao"
    }
  }

  getTransaction({
    profile = VPOS_PROFILE,
    transactionId,
    vposToken = VPOS_API_KEY,
  }) {

    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(Vpos.setUrl(profile) + '/api/v1/transactions/' + transactionId, request)
    .then(response => {
      return {
        status: response.status,
        message: response.statusText,
        data: response.data
      }
    })
    .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  getTransactions({
    profile = VPOS_PROFILE,
    vposToken = VPOS_API_KEY
  }) {

    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(Vpos.setUrl(profile) + '/api/v1/transactions', request)
    .then(response => {
      return {
        status: response.status,
        message: response.statusText,
        data: response.data
      }
    })
    .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  newPaymentTransaction({
    profile = VPOS_PROFILE,
    amount,
    posId = GPO_POS_ID,
    customer,
    callback_url = PAYMENT_CALLBACK_URL,
    vposToken = VPOS_API_KEY
  }) {
    let body = {type: "payment", pos_id: posId, mobile: customer, amount: amount, callback_url: callback_url}

    const request = Vpos.request();
    request.headers['Idempotency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(Vpos.setUrl(profile) + '/api/v1/transactions', body, request)
    .then(response => {
      return {
        status: response.status,
        message: response.statusText,
        location: response.headers.location
      }
    })
    .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  newRefundTransaction({
    profile = VPOS_PROFILE,
    parentTransactionId,
    supervisorCard = GPO_SUPERVISOR_CARD,
    callbackUrl = REFUND_CALLBACK_URL,
    vposToken = VPOS_API_KEY
  }) {
    let body = {type: "refund", parent_transaction_id: parentTransactionId, supervisor_card: supervisorCard, callback_url: callbackUrl}

    const request = Vpos.request();
    request.headers['Idempotency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(Vpos.setUrl(profile) + '/api/v1/transactions', body, request)
    .then(response => {
      return {
        status: response.status,
        message: response.statusText,
        location: response.headers.location
      }
    })
    .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  getRequest({
    profile = VPOS_PROFILE,
    requestId,
    vposToken = VPOS_API_KEY
  }) {

    const request = Vpos.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(Vpos.setUrl(profile) + '/api/v1/requests/' + requestId, request)
    .then(response => {
      if (response.status === 200) {
        return {
          status: response.status,
          message: response.statusText,
          data: response.data
        }
      } else {
        return {
          status: response.status,
          message: response.statusText,
          location: response.headers.location
        }
      }
    })
    .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }
}
