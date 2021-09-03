/**
 * Blockchain API
 */
module.exports = class Blockchain {
    constructor(request) {
        this.request = request
    }
    /**
     * 
     * @returns {Promise<Response.ChainInfo>}
     */
    getChainInfo() {
        const url = 'getChainInfo';
        return this.request('get', url)
    }
    /**
     * 
     * @param {string} hash 
     * @param {boolean} complete 
     * @returns {Promise<Response.Block>}
     */
    getBlockByHash(hash, complete = true) {
        const url = 'getBlockByHash/' + hash + '/' + complete;
        return this.request('get', url)
    }
    /**
     * 
     * @param {number} num 
     * @param {boolean} complete 
     * @returns {Promise<Response.Block>}
     */
    getBlockByNum(num, complete = true) {
        const url = 'getBlockByNumber/' + num + '/' + complete;
        return this.request('get', url)
    }
    /**
     * 
     * @param {string} address 
     * @param {string} tokenSymbol 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.TokenBalance>}
     */
    getBalance(address, tokenSymbol = 'iost', useLongestChain = 0) {
        const url = 'getTokenBalance/' + address + '/' + tokenSymbol + '/' + useLongestChain;
        return this.request('get', url)
    }
    /**
     * 
     * @param {string} symbol 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.TokenInfo>}
     */
    getTokenInfo(symbol, useLongestChain = 0) {
        const api = 'getTokenInfo/' + symbol + '/' + useLongestChain;
        return this.request('get', api)
    }
    /**
     * 
     * @param {string} address 
     * @param {string} tokenSymbol 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.Token721Balance>}
     */
    getToken721Balance(address, tokenSymbol, useLongestChain = 0) {
        const api = 'getToken721Balance/' + address + '/' + tokenSymbol + '/' + useLongestChain;
        return this.request('get', api)
    }
    /**
     * 
     * @param {string} tokenSymbol 
     * @param {string} tokenID 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.Token721Metadata>}
     */
    getToken721Metadata(tokenSymbol, tokenID, useLongestChain = 0) {
        const url = 'getToken721Metadata/' + tokenSymbol + '/' + tokenID + '/' + useLongestChain;
        return this.request('get', url);
    }
    /**
     * 
     * @param {string} tokenSymbol 
     * @param {string} tokenID 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.Token721Owner>}
     */
    getToken721Owner(tokenSymbol, tokenID, useLongestChain = 0) {
        const url = 'getToken721Owner/' + tokenSymbol + '/' + tokenID + '/' + useLongestChain;
        return this.request('get', url);
    }
    /**
     * 
     * @param {string} id 
     * @param {number} useLongestChain 
     * @returns {Promise<Response.Contract>}
     */
    getContract(id, useLongestChain = 0) {
        const api = 'getContract/' + id + '/' + useLongestChain;
        return this.request('get', api)
    }
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
        return this.request('post', api, query)
    }
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
        return this.request('post', api, query)
    }
    /**
     * 
     * @param {string} id 
     * @param {{ key: string, fielod: string }[]} key_fields 
     * @param {boolean} by_longest_chain 
     * @returns {Promise<Response.ContractStorageFields>}
     */
    async getBatchContractStorage(id, key_fields, by_longest_chain = false) {
        const chunkedQuery = [];
        for (let i = 0; i < key_fields.length; i++) {
            if (i % 50 === 0) {
                chunkedQuery.push({
                    id,
                    key_fields: [],
                    by_longest_chain
                });
            }
            chunkedQuery[chunkedQuery.length - 1].key_fields.push(key_fields[i]);
        }
        const api = 'getBatchContractStorage';
        const res = {
            datas: [],
            block_hash: '',
            block_number: ''
        };
        for (const query of chunkedQuery) {
            const {
                datas,
                block_hash,
                block_number
            } = await this.request('post', api, query);
            res.datas.push(...datas);
            res.block_hash = block_hash;
            res.block_number = block_number;
        }
        return res
    }
    /**
     * 
     * @param {string} id 
     * @param {boolean} reversible 
     * @returns {Promise<Response.AccountInfo>}
     */
    getAccountInfo(id, reversible = true) {
        const api = 'getAccount/' + id + '/' + (reversible ? 1 : 0);
        return this.request('get', api)
    }
    /**
     * 
     * @param {('CONTRACT_EVENT'|'CONTRACT_RECEIPT')[]} topics 
     * @param {string} contract_id 
     * @param {(data: Response.Subscribe[]) => Promise<boolean>} onSubscribe 
     * @returns {Promise<Response.Subscribe[][]>}
     */
    subscribe(topics, contract_id, onSubscribe) {
        const api = 'subscribe';
        const body = {
            topics: topics,
            filter: { contract_id },
        };
        console.log(body);
        return this.request('post', api, body, true)
            .then(async (readable) => {
                const allMessages = [];
                for await (const chunk of readable) {
                    const messages = Buffer.from(chunk)
                        .toString('utf-8')
                        .split('\n')
                        .filter((data) => data !== '')
                        .map(JSON.parse);
                    allMessages.push(messages);
                    if (!(await onSubscribe(messages))) {
                        break;
                    }
                }
                return allMessages;
            })
    }
}
