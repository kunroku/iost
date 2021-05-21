const contract = 'auth.iost';

module.exports = class Auth {
    constructor(iost) {
        this.iost = iost
    }
    /**
     * 
     * @param {string} id 
     * @param {string} permision 
     * @param {string} publicKey 
     * @param {number} threshold 
     * @param {Transaction.Tx} tx 
     * @returns {Transaction.Tx}
     */
    assignPermission(id, permision, publicKey, threshold, tx = this.iost.createTx()) {
        this.iost.call(contract, 'assignPermission', [id, permision, publicKey, threshold], tx);
        return tx
    }
    /**
     * 
     * @param {string} id 
     * @param {string} permision 
     * @param {string} publicKey 
     * @param {Transaction.Tx} tx 
     * @returns {Transaction.Tx}
     */
    revokePermission(id, permision, publicKey, tx = this.iost.createTx()) {
        this.iost.call(contract, 'revokePermission', [id, permision, publicKey], tx);
        return tx
    }
    /**
     * 
     * @param {string} name 
     * @param {string} ownerkey 
     * @param {string} activekey 
     * @param {Transaction.Tx} tx 
     * @returns {Transaction.Tx}
     */
    signUp(name, ownerkey, activekey, tx = this.iost.createTx()) {
        this.iost.call(contract, 'signUp', [name, ownerkey, activekey], tx);
        return tx
    }
}
