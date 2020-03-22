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
        this.auth = require('./auth')(iost);
        this.gas = require('./gas')(iost);
        this.ram = require('./ram')(iost);
        this.token = require('./token')(iost);
        this.token721 = require('./token721')(iost);
        this.system = require('./system')(iost)
    }
}
module.exports = Contract