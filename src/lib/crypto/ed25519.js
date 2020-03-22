const nacl = require('tweetnacl');
const KeyPair = require('./ikp');
/**
 * 
 * IOST.KeyPair Ed25519 implement
 * @class
 */
class Ed25519 extends KeyPair {
    /**
     * 
     * @constructor
     * @param {Buffer|Uint8Array} secretKey 
     */
    constructor(secretKey) {
        const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
        super('ED25519', 2, Buffer.from(keyPair.secretKey), Buffer.from(keyPair.publicKey))
    }
    /**
     * 
     * @param {Buffer} data 
     * @returns {Buffer}
     */
    sign(data) {
        return Buffer.from(nacl.sign.detached(data, this.secretKey))
    }
    /**
     * 
     * @param {Buffer} data 
     * @param {Buffer} sig 
     * @returns {boolean}
     */
    verify(data, sig) {
        return nacl.sign.detached.verify(data, sig, this.publicKey)
    }
    /**
     * 
     * @returns {Crypto.KeyPair}
     */
    static randomKeyPair() {
        const keyPair = nacl.sign.keyPair();
        return new Ed25519(Buffer.from(keyPair.secretKey))
    }
}

module.exports = Ed25519