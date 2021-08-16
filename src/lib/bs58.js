const bs58 = require('bs58');

class Bs58 {
  static encode(buf) {
    return bs58.encode(buf);
  }
  static decode(str) {
    return bs58.decode(str);
  }
}

module.exports = Bs58;