/**
 * Transaction API
 */
module.exports = class Transaction {
    constructor(request) {
        this.request = request
    }
    /**
     * 
     * @param {IOST.Tx} tx 
     * @returns {Promise<Response.TransactionPending>}
     */
    sendTx(tx) {
        const api = 'sendTx';
        return this.request('post', api, JSON.parse(JSON.stringify(tx)))
    }
    /**
     * 
     * @param {string} hash 
     * @returns {Promise<Response.Tx>}
     */
    getTxByHash(hash) {
        const api = 'getTxByHash/' + hash;
        return this.request('get', api)
    }
    /**
     * 
     * @param {string} hash 
     * @returns {Promise<Response.TxReceipt>}
     */
    getTxReceiptByTxHash(hash) {
        const api = 'getTxReceiptByTxHash/' + hash;
        return this.request('get', api)
    }
}