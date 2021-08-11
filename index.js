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

exports.IOST = IOST;

class Bs58 {
  static encode(buf) {
    return bs58.encode(buf);
  }
  static decode(str) {
    return bs58.decode(str);
  }
}

IOST.Account = Account;
IOST.KeyPair = KeyPair;
IOST.Bs58 = Bs58;
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
