const contract = 'token721.iost';
/**
 * Token721 contract is used for the creation, distribution, transfer and destruction of non-fungible tokens.
 */
module.exports = (iost) => {
    return {
        /**
         * Create tokens.
         * @param {string} tokenSym Token symbol, unique within the contract. Its length should be between 2 and 16 and could only contain characters in [a-z0-9_]
         * @param {string} issuer token issuer who has token issue permission.
         * @param {string|number} totalSupply Total amount of supply
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        create(tokenSym, issuer, totalSupply, tx = iost.createTx()) {
            if (Number.isNaN(Number(totalSupply))) {
                throw new Error('totalSupply is required number')
            }
            iost.call(contract, 'create', [tokenSym, issuer, Number(totalSupply)], tx);
            return tx
        },
        /**
         * Issue tokens.
         * @param {string} tokenSym Token symbol
         * @param {string} to The account who receives token
         * @param {string} metaData Meta data for token
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        issue(tokenSym, to, metaData, tx = iost.createTx()) {
            iost.call(contract, 'issue', [tokenSym, to, metaData], tx);
            return tx
        },
        /**
         * Token transfer.
         * @param {string} tokenSym Token symbol
         * @param {string} from Account who sends token
         * @param {string} to Account who receives token
         * @param {string} tokenID Token ID
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        transfer(tokenSym, from, to, tokenID, tx = iost.createTx()) {
            iost.call(contract, 'transfer', [tokenSym, from, to, tokenID], tx);
            return tx
        },
        /**
         * Get the token balance.
         * @param {string} tokenSym Token symbol
         * @param {string} from account name
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        balanceOf(tokenSym, from, tx = iost.createTx()) {
            iost.call(contract, 'balanceOf', [tokenSym, from], tx);
            return tx
        },
        /**
         * Get the owner of a particular token
         * @param {string} tokenSym Token symbol
         * @param {string} tokenID Token ID
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        ownerOf(tokenSym, tokenID, tx = iost.createTx()) {
            iost.call(contract, 'ownerOf', [tokenSym, tokenID], tx);
            return tx
        },
        /**
         * Get the index token owned by the account
         * @param {string} tokenSym Token symbol
         * @param {string} owner Account name
         * @param {string} index Token index, integer
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        tokenOfOwnerByIndex(tokenSym, owner, index, tx = iost.createTx()) {
            iost.call(contract, 'tokenOfOwnerByIndex', [tokenSym, owner, index], tx);
            return tx
        },
        /**
         * Get the meta data of the token
         * @param {string} tokenSym Token symbol
         * @param {string} tokenID Token ID
         * @param {Transaction.Tx} tx 
         * @returns {Transaction.Tx}
         */
        tokenMetadata(tokenSym, tokenID, tx = iost.createTx()) {
            iost.call(contract, 'tokenMetadata', [tokenSym, tokenID], tx);
            return tx
        }
    }
}