const contract = 'auth.iost';
module.exports = (iost) => {
    return {
        /**
         * 
         * @param {string} id 
         * @param {string} permision 
         * @param {string} publicKey 
         * @param {number} threshold 
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        assignPermission(id, permision, publicKey, threshold, tx = iost.createTx()) {
            iost.call(contract, 'assignPermission', [id, permision, publicKey, threshold], tx);
            return tx
        },
        /**
         * 
         * @param {string} id 
         * @param {string} permision 
         * @param {string} publicKey 
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        revokePermission(id, permision, publicKey, tx = iost.createTx()) {
            iost.call(contract, 'revokePermission', [id, permision, publicKey], tx);
            return tx
        },
        /**
         * 
         * @param {string} name 
         * @param {string} ownerkey 
         * @param {string} activekey 
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        signUp(name, ownerkey, activekey, tx = iost.createTx()) {
            iost.call(contract, 'signUp', [name, ownerkey, activekey], tx);
            return tx
        }
    }
}