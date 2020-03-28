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
     * @override
     * @param {Buffer} data 
     * @returns {Buffer}
     */
    sign(data) {
        return Buffer.from(nacl.sign.detached(data, this.secretKey))
    }
    /**
     * 
     * @override
     * @param {Buffer} data 
     * @param {Buffer} sig 
     * @returns {boolean}
     */
    verify(data, sig) {
        return nacl.sign.detached.verify(data, sig, this.publicKey)
    }
    /**
     * 
     * @override
     * @returns {Crypto.KeyPair}
     */
    static randomKeyPair() {
        const keyPair = nacl.sign.keyPair();
        return new Ed25519(Buffer.from(keyPair.secretKey))
    }
}

module.exports = Ed25519