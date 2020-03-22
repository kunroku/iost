const BN = require('bn.js');
const EC = require('elliptic').ec;
const secp = new EC('secp256k1');
const KeyPair = require('./ikp');
/**
 * 
 * IOST.KeyPair Secp256k1 implement
 * @class
 */
class Secp256k1 extends KeyPair {
    /**
     * 
     * @constructor
     * @param {Buffer|Uint8Array} secretKey 
     */
    constructor(secretKey) {
        const keyPair = secp.keyFromPrivate(secretKey);
        super('SECP256K1', 1, Buffer.from(keyPair.getPrivate('hex'), 'hex'), Buffer.from(keyPair.getPublic(true, 'hex'), 'hex'))
    }
    /**
     * 
     * @override
     * @param {Buffer} data 
     * @returns {Buffer}
     */
    sign(data) {
        const keyPair = secp.keyFromPrivate(this.secretKey);
        let sig = keyPair.sign(data);
        const r = sig.r;
        const n = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
        let s = n.sub(sig.s);
        if (s.gt(sig.s)) {
            s = sig.s
        }
        sig = Buffer.concat([Buffer.from(r.toArray()), Buffer.from(s.toArray())]);
        return sig

    }
    /**
     * 
     * @override
     * @param {Buffer} data 
     * @param {Buffer} sig 
     * @returns {boolean}
     */
    verify(data, sig) {
        const r = new BN(sig.slice(0, 32).toString('hex'), 16);
        const s = new BN(sig.slice(32, 64).toString('hex'), 16);
        return secp.verify(data, { r, s }, this.publicKey)
    }
    /**
     * 
     * @override
     * @returns {Crypto.KeyPair}
     */
    static randomKeyPair() {
        const keyPair = secp.genKeyPair();
        return new Secp256k1(Buffer.from(keyPair.getPrivate('hex'), 'hex'))
    }
}
module.exports = Secp256k1
