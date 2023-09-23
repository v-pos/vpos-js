const assert = require('assert');
const Vpos = require('../vpos.js');

const merchant = new Vpos({});
const refundId = "";
const refundTransaction = "";

describe('vPOS', () => {
  describe('Payments', () => {
    describe('Positives', () => {
      it('should create a new payment request transaction', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '900000000'});
        assert.strictEqual(response.status_code, 202);
      });
    });

    describe('Negatives', () => {
      it('should not create a new payment request transaction if token is invalid', async () => {
        const merchantPayment = new Vpos({token: 'sdyfisdhfsdiut'})
        const response = await merchantPayment.newPayment({amount: '123.45', customer: '925888553'});
        assert.strictEqual(response.status_code, 401);
      });

      it('should not create a new payment request transaction if customer format is invalid', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '92588855'});
        assert.strictEqual(response.status_code, 400);
      });

      it('should not create a new payment request transaction if amount format is invalid', async () => {
        const response = await merchant.newPayment({amount: '123.45.67', customer: '925888553'});
        assert.strictEqual(response.status_code, 400);
      });
    });
  });

  describe('Refunds', () => {
    describe('Positives', () => {
      it('should create a new refund request transaction', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '925888553'})
        const paymentId = await merchant.requestId({response: response});

        response = await merchant.newRefund({parentTransactionId: paymentId});
        assert.strictEqual(response.status_code, 202);
      });
    });

    describe('Negatives', () => {
      it('should not create a new refund request transaction if token is invalid', async () => {
        const merchantRefund = new Vpos({token: 'jkshfisdufgsd'})
        const response = await merchantRefund.newRefund({parentTransactionId: '1jYQryG3Qo4nzaOKgJxzWDs25Hv'});
        assert.strictEqual(response.status_code, 401);
      });

      it('should not create a new refund request transaction if parent_transaction_id is not present', async () => {
        const response = await merchant.newRefund({});
        assert.strictEqual(response.status_code, 400);
      });

      it('should not create a new refund request transaction if supervisor_card is invalid', async () => {
        const merchantRefund = new Vpos({supervisorCard: '12345678910111213'});
        const response = await merchantRefund.newRefund({parentTransactionId: '1jYQryG3Qo4nzaOKgJxzWDs25Hv'});
        assert.strictEqual(response.status_code, 400);
      });
    });
  });

  describe('Transactions', () => {
    describe('Positives', () => {
      it('should get a single transaction', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '925888553'})
        const paymentId = await merchant.requestId({response: response});

        response = await merchant.getTransaction({transactionId: paymentId});
        assert.strictEqual(response.status_code, 200);
      });
    });

    describe('Negatives', () => {
      it('should not get a non existent single transaction', async () => {
        const response = await merchant.getTransaction({transactionId: '1jYQryG3Qo4nzaOKgJxzWDs25H'});
        assert.strictEqual(response.status_code, 404);
      });

      it('should not get a single transaction if token is invalid', async () => {
        const merchantTransaction = new Vpos({token: 'kjsdfhsdiufs'})
        const response = await merchantTransaction.getTransaction({transactionId: '1jYQryG3Qo4nzaOKgJxzWDs25H'});
        assert.strictEqual(response.status_code, 401);
      });
    });
  });

  describe('Requests', () => {
    describe('Positives', () => {
      it('should get a running single request status', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '900000000'});
        const paymentRequest = await merchant.getRequest({response: response});

        assert.strictEqual(paymentRequest.status_code, 200);
      });

      it('should get a compconsted single request status', async () => {
        const response = await merchant.newPayment({amount: '123.45', customer: '900000000'});
        assert.strictEqual(response.status_code, 202);
      });
    });

    describe('Negatives', () => {
      it('should not get a single request status if token is invalid', async () => {
        const secondMerchantRequest = new Vpos({token: 'jhfsdfutsdufgs'})
        const response = await merchant.newPayment({amount: '123.45', customer: '925888553'});

        const secondResponse = await secondMerchantRequest.getRequest({response: response})
        assert.strictEqual(secondResponse.status_code, 401);
      });
    });
  });
});