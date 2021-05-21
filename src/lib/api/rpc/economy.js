/**
 * Economy API
 */
module.exports = class Economy {
    constructor(request) {
        this.request = request
    }
    /**
     * 
     * @returns {Promise<Response.GasRatio>}
     */
    getGasRatio() {
        const url = 'getGasRatio';
        return this.request('get', url)
    }
    /**
     * 
     * @returns {Promise<Response.RAMInfo>}
     */
    getRAMInfo() {
        const url = 'getRAMInfo';
        return this.request('get', url)
    }
}