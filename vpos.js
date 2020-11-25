const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const url = process.env.VPOS_PROFILE == "PRD" ? "https://api.vpos.ao" : "https://sandbox.vpos.ao";

const GPO_POS_ID = process.env.GPO_POS_ID;
const GPO_SUPERVISOR_CARD = process.env.GPO_SUPERVISOR_CARD;
const PAYMENT_CALLBACK_URL = process.env.PAYMENT_CALLBACK_URL;
const REFUND_CALLBACK_URL = process.env.REFUND_CALLBACK_URL;
const VPOS_API_KEY = process.env.VPOS_API_KEY;

module.exports = class Vpos {
  #requestHeaders() {
    var config = {
      headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
      }
    }

    return config;
  }

  getTransaction({
    transactionId,
    vposToken = VPOS_API_KEY
  }) {

    var header = this.#requestHeaders();
    header.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(url + '/api/v1/transactions/' + transactionId, header)
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
    vposToken = VPOS_API_KEY
  }) {

    var header = this.#requestHeaders();
    header.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.get(url + '/api/v1/transactions', header)
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
    amount,
    posId = GPO_POS_ID,
    customer,
    callback_url = PAYMENT_CALLBACK_URL,
    vposToken = VPOS_API_KEY
  }) {
    let body = {type: "payment", pos_id: posId, mobile: customer, amount: amount, callback_url: callback_url}

    var header = this.#requestHeaders();
    header.headers['Idempontency-Key'] = uuidv4();
    header.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(url + '/api/v1/transactions', body, header)
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
    parentTransactionId,
    supervisorCard = GPO_SUPERVISOR_CARD,
    callbackUrl = REFUND_CALLBACK_URL,
    vposToken = VPOS_API_KEY
  }) {
    let body = {type: "refund", parent_transaction_id: parentTransactionId, supervisor_card: supervisorCard, callback_url: callbackUrl}

    var header = this.#requestHeaders();
    header.headers['Idempontency-Key'] = uuidv4();
    header.headers['Authorization'] = 'Bearer ' + vposToken;

    return axios.post(url + '/api/v1/transactions', body, header)
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
}
