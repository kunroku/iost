# iost.js

JS SDK of IOST，helps developers interact with iost blockchain node, including geting block data, sending transactions, etc.
It can be used in browsers and also on nodejs platform.

<!--## Installation
Using npm in your project
```
npm install iost
```

## CDN
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iost@0.1.18/dist/iost.min.js"></script>
```
exports to window.IOST global.
-->
## Sign up example

```
const IOST = require('../src/iost')

// init iost sdk (default is for localhost reg test)
const iost = new IOST({
    host: 'http://127.0.0.1:30001',
    chainId: 1020,
    gasLimit: 1000000,
});

const creatorId = 'admin';
const secretKey = '2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1';
const account = new IOST.Account(creatorId);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secretKey));
account.addKeyPair('active', kp);
account.addKeyPair('owner', kp);

const newId = 'test002';
const newKp = IOST.KeyPair.Ed25519.randomKeyPair();
console.log(newKp.publicKey.length)
// show secret key of new account
console.log(IOST.Bs58.encode(newKp.secretKey));

const tx = iost.contract.auth.signUp(newId, IOST.Bs58.encode(newKp.publicKey), IOST.Bs58.encode(newKp.publicKey));
iost.contract.gas.pledge(creatorId, newId, 20, tx);
iost.contract.ram.buy(creatorId, newId, 1024, tx);

iost.setPublisher(account);

const handler = iost.signAndSend(tx);
handler.onPending(console.log);
handler.onSuccess(console.log);
handler.onFailed(console.log); 
```
## APIs



