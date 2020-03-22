/**
 * Blockchain API
 */
module.exports = (request) => {
    return {
        /**
         * 
         * @returns {Promise<Response.ChainInfo>}
         */
        getChainInfo() {
            const url = 'getChainInfo';
            return request('get', url)
        },
        /**
         * 
         * @param {string} hash 
         * @param {boolean} complete 
         * @returns {Promise<Response.Block>}
         */
        getBlockByHash(hash, complete = true) {
            const url = 'getBlockByHash/' + hash + '/' + complete;
            return request('get', url)
        },
        /**
         * 
         * @param {number} num 
         * @param {boolean} complete 
         * @returns {Promise<Response.Block>}
         */
        getBlockByNum(num, complete = true) {
            const url = 'getBlockByNumber/' + num + '/' + complete;
            return request('get', url)
        },
        /**
         * 
         * @param {string} address 
         * @param {string} tokenSymbol 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.TokenBalance>}
         */
        getBalance(address, tokenSymbol = 'iost', useLongestChain = 0) {
            const url = 'getTokenBalance/' + address + '/' + tokenSymbol + '/' + useLongestChain;
            return request('get', url)
        },
        /**
         * 
         * @param {string} symbol 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.TokenInfo>}
         */
        getTokenInfo(symbol, useLongestChain = 0) {
            const api = 'getTokenInfo/' + symbol + '/' + useLongestChain;
            return request('get', api)
        },
        /**
         * 
         * @param {string} address 
         * @param {string} tokenSymbol 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.Token721Balance>}
         */
        getToken721Balance(address, tokenSymbol, useLongestChain = 0) {
            const api = 'getToken721Balance/' + address + '/' + tokenSymbol + '/' + useLongestChain;
            return request('get', api)
        },
        /**
         * 
         * @param {string} tokenSymbol 
         * @param {string} tokenID 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.Token721Metadata>}
         */
        getToken721Metadata(tokenSymbol, tokenID, useLongestChain = 0) {
            const url = 'getToken721Metadata/' + tokenSymbol + '/' + tokenID + '/' + useLongestChain;
            return request('get', url);
        },
        /**
         * 
         * @param {string} tokenSymbol 
         * @param {string} tokenID 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.Token721Owner>}
         */
        getToken721Owner(tokenSymbol, tokenID, useLongestChain = 0) {
            const url = 'getToken721Owner/' + tokenSymbol + '/' + tokenID + '/' + useLongestChain;
            return request('get', url);
        },
        /**
         * 
         * @param {string} id 
         * @param {number} useLongestChain 
         * @returns {Promise<Response.Contract>}
         */
        getContract(id, useLongestChain = 0) {
            const api = 'getContract/' + id + '/' + useLongestChain;
            return request('get', api)
        },
        /**
         * 
         * @param {string} id 
         * @param {string} key 
         * @param {string} field 
         * @param {boolean} by_longest_chain 
         * @returns {Promise<Response.ContractStorage>}
         */
        getContractStorage(id, key, field, by_longest_chain = false) {
            const query = {
                id,
                key,
                field,
                by_longest_chain
            };
            const api = 'getContractStorage';
            return request('post', api, query)
        },
        /**
         * 
         * @param {string} id 
         * @param {string} key 
         * @param {boolean} by_longest_chain 
         * @returns {Promise<Response.ContractStorageFields>}
         */
        getContractStorageFields(id, key, by_longest_chain = false) {
            const query = {
                id,
                key,
                by_longest_chain
            };
            const api = 'getContractStorageFields';
            return request('post', api, query)
        },
        /**
         * 
         * @param {string} id 
         * @param {boolean} reversible 
         * @returns {Promise<Response.AccountInfo>}
         */
        getAccountInfo(id, reversible = true) {
            const api = 'getAccount/' + id + '/' + (reversible ? 1 : 0);
            return request('get', api)
        }
    }
}
