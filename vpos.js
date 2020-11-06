const axios = require('axios');
const uuid = require('uuid');
const url = process.env.VPOS_PRODILE == "PRD" ? "https://api.vpos.ao" : "https://sandbox.vpos.ao";

class Vpos {
    #requestHeaders() {
        var config = {
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + process.env.VPOS_API_KEY
            }
        }

        return config;
    }

    getTransaction(transactionId) {
        axios.get(url + '/api/v1/transactions/' + transactionId, this.#requestHeaders())
        .then(function (response) {
            console.log({status: response.status, message: response.statusText, data: response.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getTransactions() {
        axios.get(url + '/api/v1/transactions', this.#requestHeaders())
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    newPaymentTransaction(amount, customer, posId) {
        body = {amount: amount, mobile: customer, pos_id: posId, callback: callback_url}

        var header = this.#requestHeaders();
        header.headers['Idempontency'] = uuid(); 

        axios.post(url + '/api/v1/transactions', body, header)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

let transaction = new Vpos();
transaction.getTransaction("1jYQryG3Qo4nzaOKgJxzWDs25Ht");
//transaction.getTransactions();
