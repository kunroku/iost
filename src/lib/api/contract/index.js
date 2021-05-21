const Auth = require('./auth');
const GAS = require('./gas');
const RAM = require('./ram');
const Token = require('./token');
const Token721 = require('./token721');
const System = require('./system');

/**
 * 
 * @class 
 */
class Contract {
    /**
     * 
     * @param {IOST} iost 
     */
    constructor(iost) {
        this.auth = new Auth(iost);
        this.gas = new GAS(iost);
        this.ram = new RAM(iost);
        this.token = new Token(iost);
        this.token721 = new Token721(iost);
        this.system = new System(iost)
    }
}
module.exports = Contract