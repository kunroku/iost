/**
 * Transaction API
 */
module.exports = (request) => {
    return {
        /**
         * 
         * @param {IOST.Tx} tx 
         * @returns {Promise<Response.TransactionPending>}
         */
        sendTx(tx) {
            const api = 'sendTx';
            return request('post', api, JSON.parse(JSON.stringify(tx)))
        },
        /**
         * 
         * @param {string} hash 
         * @returns {Promise<Response.Tx>}
         */
        getTxByHash(hash) {
            const api = 'getTxByHash/' + hash;
            return request('get', api)
        },
        /**
         * 
         * @param {string} hash 
         * @returns {Promise<Response.TxReceipt>}
         */
        getTxReceiptByTxHash(hash) {
            const api = 'getTxReceiptByTxHash/' + hash;
            return request('get', api)
        }
    }
}
