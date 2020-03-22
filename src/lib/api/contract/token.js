const contract = 'token.iost';
/**
 * Token contract is used for token creation, distribution, transfer and destruction, can freeze token for some time, and also with support for configuring the full name of tokens, decimal places, transfer attributes
 */
module.exports = (iost) => {
    return {
        /**
         * Create token.
         * @param {string} tokenSym Token symbol, unique within the contract. Its length should be between 2 and 16 and could only contain characters in [a-z0-9_]
         * @param {string} issuer token issuer who has token issue permission.
         * @param {string|number} totalSupply Total amount of supply
         * @param {string} config token configuration. It contains 4 keys:
         * fullName —— string type, full name of the token.
         * canTransfer —— bool type, whether the token can be transferred.
         * decimal —— number type, the token decimal.
         * onlyIssuerCanTransfer —— bool type, whether the token is allowed to transfer only by token issuer.
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        create(tokenSym, issuer, totalSupply, config, tx = iost.createTx()) {
            if (Number.isNaN(Number(totalSupply))) {
                throw new Error('amount totalSupply number or string number')
            }
            JSON.parse(config);
            iost.call(contract, 'create', [tokenSym, issuer, Number(totalSupply), config], tx);
            return tx
        },
        /**
         * Issue tokens.
         * @param {string} tokenSym Token symbol
         * @param {string} to Account who receives token
         * @param {string|number} amount The amount of token transferred
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        issue(tokenSym, to, amount, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            iost.call(contract, 'issue', [tokenSym, to, amount.toString()], tx);
            return tx
        },
        /**
         * Token transfer.
         * @param {string} tokenSym Token symbol
         * @param {string} from Account who sends token
         * @param {string} to Account who receives token
         * @param {string|number} amount The amount of token transferred
         * @param {string} memo Additional information
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        transfer(tokenSym, from, to, amount, memo, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            iost.call(contract, 'transfer', [tokenSym, from, to, amount.toString(), memo], tx);
            tx.addApprove(tokenSym, amount.toString());
            return tx
        },
        /**
         * Transfer and freeze tokens.
         * @param {string} tokenSym Token symbol
         * @param {string} from Account who sends token
         * @param {string} to Account who receives token
         * @param {string|number} amount The amount of token transferred
         * @param {string} ftime token freeze time
         * @param {string} memo Additional information
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        transferFreeze(tokenSym, from, to, amount, ftime, memo, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            iost.call(contract, 'transferFreeze', [tokenSym, from, to, amount.toString(), ftime, memo], tx);
            tx.addApprove(tokenSym, amount.toString());
            return tx
        },
        /**
         * Destroy tokens.
         * @param {string} tokenSym Token symbol
         * @param {string} from Account who destroys token
         * @param {string|number} amount The amount of token destroyed
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        destroy(tokenSym, from, amount, tx = iost.createTx()) {
            if (Number.isNaN(Number(amount))) {
                throw new Error('amount require number or string number')
            }
            iost.call(contract, 'destroy', [tokenSym, from, amount.toString()], tx);
            tx.addApprove(tokenSym, amount.toString());
            return tx
        },
        /**
         * Get the token balance.
         * @param {string} tokenSym Token symbol
         * @param {string} from Account name which is queried
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        balanceOf(tokenSym, from, tx = iost.createTx()) {
            iost.call(contract, 'balanceOf', [tokenSym, from], tx);
            return tx
        },
        /**
         * Get the token circulation, that is, the total amount of tokens that have been issued and have not been destroyed.
         * @param {string} tokenSym Token symbol
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        supply(tokenSym, tx = iost.createTx()) {
            iost.call(contract, 'supply', [tokenSym], tx);
            return tx
        },
        /**
         * Get the total circulation of tokens.
         * @param {string} tokenSym Token symbol
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        totalSupply(tokenSym, tx = iost.createTx()) {
            iost.call(contract, 'totalSupply', [tokenSym], tx);
            return tx
        }
    }
}