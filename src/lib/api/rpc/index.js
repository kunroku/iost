const axios = require('axios');
const Net = require('./net');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const Economy = require('./economy');

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
                method,
                baseURL: host,
                url,
                data,
                timeout,
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
        this.net = new Net(request);
        this.blockchain = new Blockchain(request);
        this.transaction = new Transaction(request);
        this.economy = new Economy(request)
    }
}
module.exports = RPC;