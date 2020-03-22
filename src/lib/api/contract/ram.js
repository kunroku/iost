const contract = 'ram.iost';
/**
 * ram related contract, including buying/selling/transferring.
 * Details of economic model are introduced on RAM economic model.
 * You can get price estimate in RPC when you buy or sell a little ram.
 */
module.exports = (iost) => {
    return {
        /**
         * buy RAM from system. minimum buying amount is 10 bytes.
         * contract will return the amount of iost costed.
         * @param {string} payer the account who buys ram.
         * @param {string} receiver the account who gets the bought ram
         * @param {string|number} amount ram bytes to buy
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        buy(payer, receiver, amount, tx = iost.createTx()) {
            if (!Number.isInteger(Number(amount))) {
                throw new Error('amount require integer or string integer')
            }
            if (Number(amount) < 10) {
                throw new Error('minimum buying amount is 10 bytes.')
            }
            iost.call(contract, 'buy', [payer, receiver, Number(amount)], tx);
            tx.addApprove('iost');
            return tx
        },
        /**
         * Sell unused ram to system. minimum selling amount is 10 bytes.
         * contract will return the amount of iost returned.
         * @param {string} seller the account who sells ram.
         * @param {string} receiver the account who gets the iost returned
         * @param {string|number} amount ram bytes to sell
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        sell(seller, receiver, amount, tx = iost.createTx()) {
            if (!Number.isInteger(Number(amount))) {
                throw new Error('amount require integer or string integer')
            }
            if (Number(amount) < 10) {
                throw new Error('minimum buying amount is 10 bytes')
            }
            iost.call(contract, 'sell', [seller, receiver, Number(amount)], tx);
            return tx
        },
        /**
         * transfer ram to others.
         * Only ram one bought can be transferred to others. So ram others transferred to you cannot be sold to system nor transferred to others.
         * minimum transferring amount is 10 bytes.
         * @param {string} from the account who transfers ram.
         * @param {string} to the account who receives ram
         * @param {string|number} amount ram bytes to transfer
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        lend(from, to, amount, tx = iost.createTx()) {
            if (!Number.isInteger(Number(amount))) {
                throw new Error('amount require integer or string integer')
            }
            if (Number(amount) < 10) {
                throw new Error('minimum transferring amount is 10 bytes.')
            }
            iost.call(contract, 'lend', [from, to, Number(amount)], tx);
            return tx
        }
    }
}