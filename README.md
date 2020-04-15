JS SDK of IOST，helps developers interact with iost blockchain node, including geting block data, sending transactions, etc.
It can be used in browsers and also on nodejs platform.

## Installation

Using npm in your project

```
npm install @kunroku/iost
```

## CDN

```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@kunroku/iost@1.0.3/dist/iost.min.js"></script>
```

exports to window.IOST global.


## Sign up example

```
const IOST = require('@kunroku/iost');

// init iost sdk (default is for localhost network)
const iost = new IOST({
    host: 'http://127.0.0.1:30001',
    chainId: 1020,
    gasLimit: 1000000
});

const creatorId = 'admin';
const secretKey = '2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1';
const account = new IOST.Account(creatorId);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secretKey));
account.addKeyPair('active', kp);
account.addKeyPair('owner', kp);

const newId = 'test001';
const newKp = IOST.KeyPair.Ed25519.randomKeyPair();
// show secret key of new account
console.log(IOST.Bs58.encode(newKp.secretKey));

const tx = iost.contract.auth.signUp(newId, IOST.Bs58.encode(newKp.publicKey), IOST.Bs58.encode(newKp.publicKey));
iost.contract.gas.pledge(creatorId, newId, 20, tx);
iost.contract.ram.buy(creatorId, newId, 1024, tx);

iost.setPublisher(account);

const handler = iost.signAndSend(tx);
handler.listen();
handler.onPending(console.log);
handler.onSuccess(console.log);
handler.onFailed(console.log);
```

## Usage

### Encoding

##### IOST.Bs58.encode(buf)

buffer to base58string

##### IOST.Bs58.decode(buf)

base58string to buffer

### IOST.KeyPair instance

#### Ed25519 Algorithm

##### new IOST.KeyPair.Ed25519(secretKey)

initialize with buffer or uint8array type secret key

#### Secp256k1 Algorithm

##### new IOST.KeyPair.Secp256k1(secretKey)

initialize with buffer or uint8array type secret key

### IOST.Account instance

##### new IOST.Account(id)

initialize with iost account id

##### account.addKeyPair(permission, keyPair)

add keyPair to account instance

### IOST instance

##### new IOST(config?)

config type

```
{
	host?: string,
	chainId?: number,
	gasRatio?: number,
	gasLimit?: number,
	delay?: number,
	expiration?: number,
	defaultLimit?: 'unlimited' | number
}
```

##### setServerTimeDiff()

set the time difference between your environment and the node

##### iost.createTx()

create empty transaction instance

##### iost.call(contract, abi, args, tx?)

returns tx of calling smart contract

if you want to add action to already exist tx instance, you can set it the end of args

##### iost.setPublisher(account)

set IOST.Account to IOST instance

##### iost.addSigner(account, permission)

for multi signature

##### iost.signAndSend(tx, log?)

add signature of publisher and signer to tx and then send it

if you want to check processing time in the console, set log true


```
const handler = signAndSend(tx);
handler.listen();
handler.onPending(res => { console.log(res) });
handler.onSuccess(res => { console.log(res) });
handler.onFailed(res => { console.log(res) });

```

###### handler.listen(config?)

if you want to change listen config, you can set like this


```
handler.listen({ interval: 1000, times: 50, irreversible: true });

```


<!--
#### Official Contract API

##### iost.contract.auth.assignPermission(id, permission: , publicKey, threshold, tx?)



#### RPC API

##### iost.rpc.net.getNodeInfo()

##### iost.rpc.blockchain.getBlockByHash(hash, complete?)

##### iost.rpc.blockchain.getBlockByNum(num, complete?)

##### iost.rpc.blockchain.getTokenInfo(symbol, useLongestChain?)

##### iost.rpc.blockchain.getBalance(address, symbol, useLongestChain?)

-->