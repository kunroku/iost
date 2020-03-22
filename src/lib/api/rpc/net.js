/**
 * Net API
 */
module.exports = (request) => {
    return {
        /**
         * 
         * @returns {Promise<Response.NodeInfo>}
         */
        getNodeInfo() {
            return request('get', 'getNodeInfo')
        }
    }
};