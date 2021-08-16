const IOST = require('./src/iost');
const Tx = require('./src/lib/transaction/tx');
const Handler = require('./src/lib/transaction/handler');
const RPC = require('./src/lib/api/rpc');
const Contract = require('./src/lib/api/contract');
const Account = require('./src/lib/account');
const KeyPair = require('./src/lib/kp');
const IKeyPair = require('./src/lib/crypto/ikp');
const Signature = require('./src/lib/crypto/signature');
const Codec = require('./src/lib/crypto/codec');
const Bs58 = require('./src/lib/bs58');
const ContractABI = require('./src/lib/abi');

exports.IOST = IOST;

IOST.Account = Account;
IOST.KeyPair = KeyPair;
IOST.Bs58 = Bs58;
IOST.ContractABI = ContractABI;
IOST.Transaction = {
  Tx,
  Handler,
};
IOST.Crypto = {
  KeyPair: IKeyPair,
  Signature,
  Codec,
};
IOST.API = {
  Contract,
  RPC,
};

module.exports = IOST;
