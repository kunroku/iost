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
            active: {
                publicKey: null,
                secretKey: null
            },
            owner: {
                publicKey: null,
                secretKey: null
            }
        }
    }
    /**
     * add secret key information
     * @param {string} permission active or owner
     * @param {Crypto.KeyPair} keyPair secretkey Buffer
     * @returns {void}
     */
    addKeyPair(permission, keyPair) {
        this.keyPair[permission] = keyPair
    }
    /**
     * add signature to transaction as multisigner
     * @param {Transaction.Tx} tx transaction object
     * @param {string} permission active or owner
     * @returns {void}
     */
    sign(tx, permission) {
        tx.addSign(this.keyPair[permission])
    }
    /**
     * add signature to transaction as publisher
     * @param {Transaction.Tx} tx transaction object
     * @returns {void}
     */
    publishSign(tx) {
        tx.addPublishSign(this.id, this.keyPair.active)
    }
}

module.exports = Account