/**
 * 
 * IOST Key Pair abstract class
 * @class
 */
class KeyPair {
    /**
     * 
     * @constructor
     * @param {string} algoName
     * @param {number} algoType
     * @param {Buffer} secretKey
     * @param {Buffer} publicKey 
     */
    constructor(algoName, algoType, secretKey, publicKey) {
        this.algoName = algoName;
        this.algoType = algoType;
        this.secretKey = secretKey;
        this.publicKey = publicKey
    }
    /**
     * requires implementation in subclass
     * @param {Buffer} data 
     */
    sign(data) {
        throw new Error('Not Implemented')
    }
    /**
     * requires implementation in subclass
     * @param {Buffer} data 
     * @param {Buffer} sig 
     */
    verify(data, sig) {
        throw new Error('Not Implemented')
    }
    /**
     * requires implementation in subclass
     */
    static randomKeyPair() {
        throw new Error('Not Implemented')
    }
}
module.exports = KeyPair