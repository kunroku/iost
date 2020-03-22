const contract = 'gas.iost';
/**
 * GAS related contract, including pledging IOST for gas, unpleding, transferring GAS.
 * Details of economic model are introduced on GAS economic model.
 */
module.exports = (iost) => {
    return {
        /**
         * pledge iost for gas. minimum pledging amount is 1 iost.
         * @param {string} pledgor the account who pledges iost
         * @param {string} to the account who gets gas
         * @param {string|number} amount iost amount for pledging
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        pledge(pledgor, to, amount, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            if (Number(amount) < 1) {
                throw new Error('minimum pledging amount is 1 iost')
            }
            iost.call(contract, 'pledge', [pledgor, to, amount.toString()], tx);
            tx.addApprove('iost');
            return tx
        },
        /**
         * undo pledge. iost pledged earlier will be returned. minimum unpledging amount is 1 iost.
         * @param {string} pledgor the account who pledges iost.
         * @param {string} from the account who pledged gas by pledgor
         * @param {string|number} amount iost amount for pledging
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        unpledge(pledgor, from, amount, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            if (Number(amount) < 1) {
                throw new Error('minimum unpledging amount is 1 iost')
            }
            iost.call(contract, 'unpledge', [pledgor, from, amount.toString()], tx);
            return tx
        }
    }
}