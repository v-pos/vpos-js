const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const url = process.env.VPOS_ENVIRONMENT === "PRD" ? "https://api.vpos.ao" : "https://sandbox.vpos.ao";

const GPO_POS_ID = process.env.GPO_POS_ID;
const GPO_SUPERVISOR_CARD = process.env.GPO_SUPERVISOR_CARD;
const PAYMENT_CALLBACK_URL = process.env.VPOS_PAYMENT_CALLBACK_URL;
const REFUND_CALLBACK_URL = process.env.VPOS_REFUND_CALLBACK_URL;
const MERCHANT_VPOS_TOKEN = process.env.MERCHANT_VPOS_TOKEN;

module.exports = class Vpos {
  request() {
    var request = {
      headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
      },
      maxRedirects: 0
    }

    return request;
  }

  getTransaction({
    transactionId,
    vposToken = MERCHANT_VPOS_TOKEN
  }) {

    var request = this.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(url + '/api/v1/transactions/' + transactionId, request)
    .then(response => {
      return {
        status: response.status,
        message: response.statusText,
        data: response.data
      }
    }) .catch(error => {
      return {
        status: error.response.status,
        message: error.response.statusText,
        details: error.response.data
      }
    });
  }

  getTransactions({
    vposToken = MERCHANT_VPOS_TOKEN
  }) {

    const request = this.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(url + '/api/v1/transactions', request)
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

  newPayment({
    amount,
    posId = GPO_POS_ID,
    customer,
    callback_url = PAYMENT_CALLBACK_URL,
    vposToken = MERCHANT_VPOS_TOKEN
  }) {
    let body = {type: "payment", pos_id: posId, mobile: customer, amount: amount, callback_url: callback_url}

    const request = this.request();
    request.headers['Idempontency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(url + '/api/v1/transactions', body, request)
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

  newRefund({
    parentTransactionId,
    supervisorCard = GPO_SUPERVISOR_CARD,
    callbackUrl = REFUND_CALLBACK_URL,
    vposToken = MERCHANT_VPOS_TOKEN
  }) {
    let body = {type: "refund", parent_transaction_id: parentTransactionId, supervisor_card: supervisorCard, callback_url: callbackUrl}

    const request = this.request();
    request.headers['Idempontency-Key'] = uuidv4();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(url + '/api/v1/transactions', body, request)
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
    requestId,
    vposToken = MERCHANT_VPOS_TOKEN
  }) {

    const request = this.request();
    request.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(url + '/api/v1/requests/' + requestId, request)
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
