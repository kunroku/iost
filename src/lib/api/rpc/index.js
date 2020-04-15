const axios = require('axios');
/**
 * RPC
 * @class 
 */
class RPC {
    /**
     * 
     * @param {string} host 
     * @param {number} timeout 
     */
    constructor(host, timeout = undefined) {
        const request = async (method, url, data = undefined) => {
            if (method === 'post') {
                if (!data) throw new Error('post data is undefied')
            }
            const config = {
                method: method,
                baseURL: host,
                url: url,
                data: data,
                timeout: timeout,
                headers: {
                    'Content-Type': 'text/plain'
                }
            };
            try {
                const response = await axios(config);
                return response.data;
            } catch (error) {
                if (error.response !== undefined) {
                    throw new Error(`${JSON.stringify(error.response.data)}`);
                }
                else {
                    throw new Error(`${error}`);
                }
            }
        }
        this.net = require('./net')(request);
        this.blockchain = require('./blockchain')(request);
        this.transaction = require('./transaction')(request);
        this.economy = require('./economy')(request)
    }
}
module.exports = RPC;