const Long = require('long');
/**
 * 
 * @class
 */
class Codec {
    /**
     * 
     * @constructor
     */
    constructor() {
        this._buf = Buffer.alloc(0)
    }
    /**
     * 
     * @param {number} len 
     * @returns {Crypto.Codec}
     */
    pushInt(len) {
        let bb = Buffer.alloc(4);
        bb.writeInt32BE(len, 0);
        this._buf = Buffer.concat([this._buf, bb]);
        return this
    }
    /**
     * 
     * @param {number} n 
     * @returns {Crypto.Codec}
     */
    pushByte(n) {
        let bb = Buffer.alloc(1);
        bb.writeUInt8(n, 0);
        this._buf = Buffer.concat([this._buf, bb]);
        return this
    }
    /**
     * 
     * @param {number} n 
     * @returns {Crypto.Codec}
     */
    pushInt64(n) {
        let l = Long.fromString(n+"");
        let bb = Buffer.alloc(8);
        bb.writeInt32BE(l.high, 0);
        bb.writeInt32BE(l.low, 4);
        this._buf = Buffer.concat([this._buf, bb]);
        return this
    }
    /**
     * 
     * @param {string} s 
     * @returns {Crypto.Codec}
     */
    pushString(s) {
        let bb = Buffer.from(s);
        this.pushInt(bb.length);
        this._buf = Buffer.concat([this._buf, bb]);
        return this
    }
    /**
     * 
     * @param {Buffer} b 
     * @returns {Crypto.Codec}
     */
    pushBytes(b) {
        this.pushInt(b.length);
        this._buf = Buffer.concat([this._buf, b]);
        return this
    }
}

module.exports = Codec
