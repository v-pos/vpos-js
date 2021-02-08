const assert = require('assert');
const Vpos = require('../vpos.js');

let merchant = new Vpos();
let paymentId = "";
let refundId = "";
let refundTransaction = "";
let paymentTransaction = "";

describe('vPOS', () => {
  describe('Payments', () => {
    describe('Positives', () => {
      it('should create a new payment request transaction', async () => {
        let response = await merchant.newPayment({amount: "123.45", customer: "925888553"});
        assert.equal(response.status_code, 202);
      });
    });

    describe('Negatives', () => {
      it('should not create a new payment request transaction if token is invalid', async () => {
        let response = await merchant.newPayment({amount: "123.45", customer: "925888553", token: "kjsdfhskdjfhskjd"});
        assert.equal(response.status_code, 401);
      });
      it('should not create a new payment request transaction if customer format is invalid', async () => {
        let response = await merchant.newPayment({amount: "123.45", customer: "92588855"});
        assert.equal(response.status_code, 400);
      });
      it('should not create a new payment request transaction if amount format is invalid', async () => {
        let response = await merchant.newPayment({amount: "123.45.67", customer: "925888553"});
        assert.equal(response.status_code, 400);
      });
    });
  });

  describe('Refunds', () => {
    describe('Positives', () => {
      it('should create a new refund request transaction', async () => {
        let response = await merchant.newRefund({parentTransactionId: "1jYQryG3Qo4nzaOKgJxzWDs25Hv"});
        assert.equal(response.status_code, 202);
      });
    });
    describe('Negatives', () => {
      it('should not create a new refund request transaction if token is invalid', async () => {
        response = await merchant.newRefund({parentTransactionId: "1jYQryG3Qo4nzaOKgJxzWDs25Hv", token: "kjsdfhskdjfhskjd"});
        assert.equal(response.status_code, 401);
      });
      it('should not create a new refund request transaction if parent_transaction_id is not present', async () => {
        let response = await merchant.newRefund({});
        assert.equal(response.status_code, 400);
      });
      it('should not create a new refund request transaction if supervisor_card is invalid', async () => {
        let response = await merchant.newRefund({parentTransactionId: "1jYQryG3Qo4nzaOKgJxzWDs25Hv", supervisorCard: "12345678910111213"});
        assert.equal(response.status_code, 202);

        refundId = response.location.substring(17);
        refundTransaction = await merchant.getTransaction({Id: refundId});

        assert.equal(refundTransaction.data.status, "rejected")
        // TODO: This test should have been 2007. Has to be refactored as soon we have the mock server
        assert.equal(refundTransaction.data.status_reason, 1003)
      });
    });
  });

  describe('Transactions', () => {
    describe('Positives', () => {
      it('should get all transactions', async () => {
        let response = await merchant.getTransactions({});
        assert.equal(response.status_code, 200);
      });
      it('should get a single transaction', async () => {
        let response = await merchant.getTransaction({Id: "1jYQryG3Qo4nzaOKgJxzWDs25Ht"});
        assert.equal(response.status_code, 200);
      });
    });

    describe('Negatives', () => {
      it('should not get a non existent single transaction', async () => {
        let response = await merchant.getTransaction({Id: "1jYQryG3Qo4nzaOKgJxzWDs25H"});
        assert.equal(response.status_code, 404);
      });

      it('should not get a single transaction if token is invalid', async () => {
        let response = await merchant.getTransaction({Id: "1jYQryG3Qo4nzaOKgJxzWDs25H", token: "1jYQryG3Qo4nzaO"});
        assert.equal(response.status_code, 401);
      });
    });
  });

  describe('Requests', () => {
    describe('Positives', () => {
      it('should get a running single request status', async () => {
        let response = await merchant.newPayment({amount: "123.45", customer: "925888553"});

        refundId = merchant.getRequestId({response: response})

        response = await merchant.getRequest({requestId: refundId});
        assert.equal(response.status_code, 200);
      });

      it('should get a completed single request status', async () => {
        let response = await merchant.getRequest({requestId: "1jYQryG3Qo4nzaOKgJxzWDs25Ht"});
        assert.equal(response.status_code, 303);
      });
    });

    describe('Negatives', () => {
      it('should not get a single request status if token is invalid', async () => {
        let response = await merchant.getRequest({requestId: "1jYQryG3Qo4nzaOKgJxzWDs25Ht", token: "1jYQryG3Qo4nzaOKgJxzWDs25H"});
        assert.equal(response.status_code, 401);
      });
    });
  });
});
