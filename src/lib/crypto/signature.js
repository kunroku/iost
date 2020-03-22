const Codec = require('./codec');
/**
 * 
 * @class
 */
class Signature {
    /**
     * 
     * @param {Buffer} data 
     * @param {Crypto.KeyPair} keyPair 
     */
    constructor(data, keyPair) {
        this.keyPair = keyPair;
        this.sig = keyPair.sign(data)
    }

    _bytes() {
        let c = new Codec();
        c.pushByte(this.keyPair.algoType);
        c.pushBytes(this.sig);
        c.pushBytes(this.keyPair.publicKey);
        return c._buf
    }
    toJSON() {
        return {
            algorithm: this.keyPair.algoName,
            public_key: this.keyPair.publicKey.toString('base64'),
            signature: this.sig.toString('base64')
        }
    }
    /**
     * verify raw data with signature
     * @param {Buffer} data 
     * @returns {boolean}
     */
    verify(data) {
        return this.keyPair.verify(data)
    }
}

module.exports = Signature