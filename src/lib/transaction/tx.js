const { SHA3 } = require('sha3');
const Codec = require('../crypto/codec');
const Signature = require('../crypto/signature');
/**
 * IOST Transaction
 * @class
 */
class Tx {
    /**
     * 
     * @constructor
     * @param {number} chainId mainnet: 1024, testnet: 1023, localhost: 1020
     * @param {number} gasLimit 
     * @param {number} gasRatio
     */
    constructor(chainId, gasLimit = 2000000, gasRatio = 1) {
        this.gasLimit = gasLimit;
        this.gasRatio = gasRatio;
        this.actions = [];
        this.signers = [];
        this.signatures = [];
        this.publisher = '';
        this.publisher_sigs = [];
        this.amount_limit = [];
        this.chainId = chainId;
        this.reserved = null
    }
    /**
     * 
     * @param {string} id iost account id
     * @param {string} permission active or owner
     * @returns {void}
     */
    addSigner(id, permission) {
        if (this.signers.indexOf(`${id}@${permission}`) === -1) {
            this.signers.push(`${id}@${permission}`)
        }
    }
    /**
     * 
     * @param {string} token token symbol
     * @param {string|number} amount default is 'unlimited'
     * @returns {void}
     */
    addApprove(token, amount = 'unlimited') {
        let index = null;
        for (let i = 0; i < this.amount_limit.length; i++) {
            if (this.amount_limit[i].token === token) {
                if (this.amount_limit[i].value === 'unlimited') {
                    return 
                }
                index = i;
                break
            }
        }
        if (amount !== 'unlimited') {
            amount = Number(amount);
            if (Number.isNaN(amount)) {
                throw new Error('invalid amount')
            }
            if (index !== null) {
                amount += Number(this.amount_limit[index].value)
            }
            amount = amount.toFixed(8)
        }
        if (index === null) {
            this.amount_limit.push({
                token: token,
                value: amount
            })
        } else {
            this.amount_limit[index].value = amount
        }
    }
    /**
     * 
     * @returns {Array<Parameters.AmountLimit>}
     */
    getApproveList() {
        return this.amount_limit
    }
    /**
     * 
     * @param {string} contract contract name
     * @param {string} abi funciton name
     * @param {Array<number|string>} args args
     * @returns {void}
     */
    addAction(contract, abi, args) {
        this.actions.push({
            contract: contract,
            actionName: abi,
            data: JSON.stringify(args),
        })
    }
    /**
     * 
     * @param {number} expiration 
     * @param {number} delay 
     * @param {number} serverTimeDiff 
     * @returns {void}
     */
    setTime(expiration, delay, serverTimeDiff) {
        this.time = new Date().getTime() * 1e6 + serverTimeDiff;
        this.expiration = this.time + expiration * 1e9;
        this.delay = delay
    }
    _base_hash() {
        const hash = new SHA3(256);
        hash.update(this._bytes(0));
        return hash.digest('binary')
    }
    /**
     * 
     * @param {Crypto.KeyPair} keyPair secretKey and publicKey pair
     * @returns {void}
     */
    addSign(keyPair) {
        const signature = new Signature(this._base_hash(), keyPair);
        this.signatures.push(signature)
    }
    _publish_hash() {
        const hash = new SHA3(256);
        hash.update(this._bytes(1));
        return hash.digest('binary')
    }
    /**
     * 
     * @param {string} id publisher's iost account id
     * @param {Crypto.KeyPair} keyPair secretKey and publicKey pair
     * @returns {void}
     */
    addPublishSign(id, keyPair) {
        this.publisher = id;
        const info = this._publish_hash();
        const sig = new Signature(info, keyPair);
        this.publisher_sigs.push(sig)
    }
    _bytes(n) {
        let c = new Codec();
        c.pushInt64(this.time);
        c.pushInt64(this.expiration);
        c.pushInt64(this.gasRatio * 100);
        c.pushInt64(this.gasLimit * 100);
        c.pushInt64(this.delay);
        c.pushInt(this.chainId);
        if (!this.reserved) {
            c.pushInt(0)
        }

        c.pushInt(this.signers.length);
        for (let i = 0; i < this.signers.length; i++) {
            c.pushString(this.signers[i])
        }
        c.pushInt(this.actions.length);
        for (let i = 0; i < this.actions.length; i++) {
            let c2 = new Codec();
            c2.pushString(this.actions[i].contract);
            c2.pushString(this.actions[i].actionName);
            c2.pushString(this.actions[i].data);
            c.pushBytes(c2._buf)
        }
        c.pushInt(this.amount_limit.length);
        for (let i = 0; i < this.amount_limit.length; i++) {
            let c2 = new Codec();
            c2.pushString(this.amount_limit[i].token);
            c2.pushString(this.amount_limit[i].value + "");
            c.pushBytes(c2._buf);
        }
        if (n > 0) {
            c.pushInt(this.signatures.length);
            for (let i = 0; i < this.signatures.length; i++) {
                c.pushBytes(this.signatures[i]._bytes())
            }
        }
        return c._buf
    }
}

module.exports = Tx
