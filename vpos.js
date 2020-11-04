const axios = require('axios');
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

    #randomGuid() {
        S4() {  
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
        }  
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
    }

    getTransaction(transactionId) {
        axios.get(url + '/api/v1/transactions/' + transactionId, this.#requestHeaders())
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getTransactions() {
        axios.get(url + '/api/v1/transactions', this.#requestHeaders())
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    newPaymentTransaction(amount, customer, posId) {
        body = {amount: amount, mobile: customer, pos_id: posId, callback: callback_url}

        var header = this.#requestHeader();
        header.headers['Idempontency'] = this.#randomGuid(); 

        axios.post(url + '/api/v1/transactions', body, header)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    showHeader() {
        var header = this.#requestHeaders();
        header.headers['Idempontency'] = '3242374324t7328gr823';
        console.log(header);
    }


}

let transaction = new Vpos();
//transaction.getTransaction("1jYQryG3Qo4nzaOKgJxzWDs25Ht");
transaction.showHeader();
