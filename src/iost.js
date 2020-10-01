const Tx = require('./lib/transaction/tx');
const Handler = require('./lib/transaction/handler');
const RPC = require('./lib/api/rpc');
const Contract = require('./lib/api/contract');
const bs58 = require('bs58');

const defaultConfig = {
    host: 'http://127.0.0.1:30001',
    chainId: 1020,
    gasRatio: 1,
    gasLimit: 2000000,
    delay: 0,
    expiration: 90,
    defaultLimit: 'unlimited'
};

/**
 * 
 * @class
 */
class IOST {
    /**
     * [WARNING]
     * serverTimeDiff is set 0 here.
     * if you want to set correct value, you have to execute setServerTimeDiff().
     * @constructor
     * @param {Parameters.Config} config 
     */
    constructor(config = {}) {
        this.publisher = null;
        this.signers = [];
        this.serverTimeDiff = 0;
        this.config = defaultConfig;
        if (config) {
            Object.assign(this.config, config);
        }
        this.rpc = new RPC(this.config.host);
        this.contract = new Contract(this)
    }
    /**
     * adjust time
     * @param {string} host 
     * @returns {Promise<number>}
     */
    async setServerTimeDiff() {
        const requestStartTime = new Date().getTime() * 1e6;
        const nodeInfo = await this.rpc.net.getNodeInfo();
        const requestEndTime = new Date().getTime() * 1e6;
        if (requestEndTime - requestStartTime < 30 * 1e9) {
            this.serverTimeDiff = nodeInfo.server_time - requestStartTime
        }
        return this.serverTimeDiff
    }
    /**
     * create empty tx
     */
    createTx() {
        const tx = new Tx(this.config.chainId, this.config.gasLimit, this.config.gasRatio);
        tx.setTime(this.config.expiration, this.config.delay, this.serverTimeDiff);
        return tx
    }
    /**
     * call smart contract abi
     * @param {string} contract
     * @param {string} abi
     * @param {Array<number|string>} args type string or number is required
     * @returns {Transaction.Tx}
     */
    call(contract, abi, args, tx = this.createTx()) {
        tx.addAction(contract, abi, args);
        tx.setTime(this.config.expiration, this.config.delay, this.serverTimeDiff);
        return tx
    }
    /**
     * set publisher account
     * @param {IOST.Account} account 
     * @returns {void}
     */
    setPublisher(account) {
        this.publisher = account
    }
    /**
     * add multisigner account and their permission
     * @param {IOST.Account} account IOST Account object
     * @param {string} permission 'active' or 'owner'
     * @returns {void}
     */
    addSigner(account, permission) {
        this.signers.push({ account, permission })
    }
    /**
     * publish tx by set publisher, signed by set signers
     * @param {Transaction.Tx} tx 
     * @param {boolean} log console.log output
     * @returns {Transaction.Handler}
     */
    signAndSend(tx, log = false) {
        const handler = new Handler(tx, this.rpc, log);
        handler.signAndSend(this.publisher, this.signers);
        return handler
    }
}

IOST.Account = require('./lib/account');
IOST.KeyPair = require('./lib/kp');
IOST.Bs58 = class Bs58 {
    static encode(buf) {
        return bs58.encode(buf);
    }
    static decode(str) {
        return bs58.decode(str);
    }
}

module.exports = IOST