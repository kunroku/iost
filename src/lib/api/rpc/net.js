/**
 * Net API
 */
module.exports = class Net {
    constructor(request) {
        this.request = request
    }
    /**
     * 
     * @returns {Promise<Response.NodeInfo>}
     */
    getNodeInfo() {
        return this.request('get', 'getNodeInfo')
    }
}