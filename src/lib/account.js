/**
 * IOST Account
 * @class
 */
class Account {
    /**
     * initialize with account id
     * @constructor
     * @param {string} id iost account id
     */
    constructor(id) {
        this.id = id;
        this.keyPair = {
            active: [],
            owner: []
        }
    }
    /**
     * add secret key information
     * @param {string} permission active or owner
     * @param {Crypto.KeyPair} keyPair secretkey Buffer
     * @returns {void}
     */
    addKeyPair(permission, keyPair) {
        this.keyPair[permission].push(keyPair)
    }
    /**
     * add signature to transaction as multisigner
     * @param {Transaction.Tx} tx transaction object
     * @param {string} permission active or owner
     * @returns {void}
     */
    sign(tx, permission) {
        this.keyPair[permission].forEach(keyPair => {
            tx.addSign(keyPair)
        })
    }
    /**
     * add signature to transaction as publisher
     * @param {Transaction.Tx} tx transaction object
     * @returns {void}
     */
    publishSign(tx) {
        this.keyPair.active.forEach(keyPair => {
            tx.addPublishSign(this.id, keyPair)
        })
    }
}

module.exports = Account