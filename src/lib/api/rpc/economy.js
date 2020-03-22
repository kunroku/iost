/**
 * Economy API
 */
module.exports = (request) => {
    return {
        /**
         * 
         * @returns {Promise<Response.GasRatio>}
         */
        getGasRatio() {
            const url = 'getGasRatio';
            return request('get', url)
        },
        /**
         * 
         * @returns {Promise<Response.RAMInfo>}
         */
        getRAMInfo() {
            const url = 'getRAMInfo';
            return request('get', url)
        }
    }
}
