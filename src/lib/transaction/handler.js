/**
 * tx handler class
 * @class
 */
class Handler {
    /**
     * initialize with tx and rpc
     * @constructor
     * @param {Transaction.Tx} tx 
     * @param {API.RPC} rpc 
     * @param {boolean} log console.log output
     */
    constructor(tx, rpc, log = false) {
        let self = this;
        this.tx = tx;
        this.log = log;
        this.Pending = (res) => {
            if (self.log) console.log(`Pending... tx: ${res.hash}, ${JSON.stringify(self.tx.actions)}`);
            self.status = 'pending';
        };
        this.Success = (res) => {
            if (self.log) console.log(`Success... tx, receipt: ${JSON.stringify(res)}`);
            self.status = 'success';
        };
        this.Failed = (res) => {
            if (self.log) console.log(`error... tx failed, res: ${JSON.stringify(res)}, tx: ${JSON.stringify(self.tx)}`);
            self.status = 'failed';
        };
        this.rpc = rpc;
        this.status = 'idle';
        this.hash = null
    }
    /**
     * 
     * @param {Function} callback 
     * @returns {Transaction.Handler}
     */
    onPending(callback) {
        let self = this;
        this.Pending = (res) => {
            self.status = 'pending';
            try {
                let p = callback(res);
                if (typeof p === 'object' && typeof p.catch === 'function') {
                    p.catch(e => {
                        if (self.log) console.error(`on pending failed. ${e}`)
                    })
                }
            } catch (e) {
                if (self.log) console.error(`on pending failed. ${e}`)
            }
        };
        return this
    }
    /**
     * 
     * @param {Function} callback 
     * @returns {Transaction.Handler}
     */
    onSuccess(callback) {
        let self = this;
        this.Success = (res) => {
            self.status = 'success';
            try {
                let p = callback(res);
                if (typeof p === 'object' && typeof p.catch === 'function') {
                    p.catch(e => {
                        if (self.log) console.error(`on success failed. ${e}`)
                    })
                }
            } catch (e) {
                if (self.log) console.error(`on success failed. ${e}`)
            }
        };
        return this
    }
    /**
     * 
     * @param {Function} callback 
     * @returns {Transaction.Handler}
     */
    onFailed(callback) {
        let self = this;
        this.Failed = (res) => {
            self.status = 'failed';
            try {
                let p = callback(res);
                if (typeof p === 'object' && typeof p.catch === 'function') {
                    p.catch(e => {
                        if (self.log) console.error(`on failed failed. ${e}`)
                    })
                }
            } catch (e) {
                if (self.log) console.error(`on failed failed. ${e}`)
            }
        };
        return this
    }
    /**
     * 
     * @returns {void}
     */
    sendTx() {
        let self = this;
        self.rpc.transaction.sendTx(self.tx).then(res => {
            self.hash = res.hash;
            self.Pending(res)
        }).catch(e => {
            self.Failed(`send tx failed: ${e}`)
        });
        return this
    }
    /**
     * 
     * @param {IOST.Account} publisher publisher account object
     * @param {Array<{ account: IOST.Account, permision: string }>} signers accuont object and permission pair list
     * @returns {void}
     */
    signAndSend(publisher, signers = []) {
        for (const signer of signers) {
            this.tx.addSigner(signer.account.id, signer.permission)
        }
        for (const signer of signers) {
            signer.account.sign(this.tx, signer.permission)
        }
        publisher.publishSign(this.tx);
        this.sendTx()
    }
    /**
     * 
     * @param {number} interval default 250 ms
     * @param {number} times default 100 times request
     * @returns {void}
     */
    listen(interval = 250, times = 100) {
        let self = this;
        let i = 1;
        let id = setInterval(() => {
            if (self.status === 'idle') {
                return
            }
            if (self.status === 'success' || self.status === 'failed' || i > times) {
                clearInterval(id);
                if (self.status !== 'success' && self.status !== 'failed' && i > times) {
                    self.Failed('error: tx ' + self.hash + ' on chain timeout.');
                }
                return
            }
            i++;
            self.rpc.transaction.getTxReceiptByTxHash(self.hash).then(res => {
                if (self.log) console.log(`[${interval * i / 1e3} seconds]`);
                if (res.status_code === 'SUCCESS' && self.status === 'pending') {
                    self.Success(res)
                } else if (res.status_code !== undefined && self.status === 'pending') {
                    self.Failed(res)
                }
            }).catch(e => {
                // receipt not found (tx has not mined)
                if (self.log) process.stdout.write('.')
            })
        }, interval)
    }
}

module.exports = Handler