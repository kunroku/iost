// Type definitions for IOST.js

export as namespace IOST;

export = IOST;

declare class IOST {
    public publisher: IOST.Account | null
    public signers: IOST.Account[]
    public serverTimeDiff: number
    public config: IOST.Parameter.Config
    public rpc: IOST.API.RPC
    public contract: IOST.API.Contract
    constructor(config?: IOST.Parameter.Config)
    setServerTimeDiff: () => Promise<number>
    createTx: () => IOST.Transaction.Tx
    call: (contract: string, abi: string, args: (number | string)[], tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    setPublisher: (account: IOST.Account) => void
    addSigner: (account: IOST.Account, permision: 'active' | 'owner') => void
    signAndSend: (tx: IOST.Transaction.Tx, log?: boolean) => IOST.Transaction.Handler
}

declare namespace IOST {
    class IOST {
        public publisher: IOST.Account | null
        public signers: IOST.Account[]
        public serverTimeDiff: number
        public config: IOST.Parameter.Config
        public rpc: IOST.API.RPC
        public contract: IOST.API.Contract
        constructor(config?: IOST.Parameter.Config)
        setServerTimeDiff: () => Promise<number>
        createTx: () => IOST.Transaction.Tx
        call: (contract: string, abi: string, args: (number | string)[], tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        setPublisher: (account: IOST.Account) => void
        addSigner: (account: IOST.Account, permision: 'active' | 'owner') => void
        signAndSend: (tx: IOST.Transaction.Tx, log?: boolean) => IOST.Transaction.Handler
    }
    interface Bs58 {
        encode: (buf: Buffer) => string
        decode: (str: string) => Buffer
    }
    class Account {
        public id: string;
        public keyPair: {
            active: Crypto.KeyPair[],
            owner: Crypto.KeyPair[]
        }
        constructor(id: string)
        addKeyPair: (permission: 'active' | 'owner', keyPair: Crypto.KeyPair) => void
        sign: (tx: IOST.Transaction.Tx, permission: 'active' | 'owner') => void
        publishSign: (tx: IOST.Transaction.Tx) => void
    }
    namespace KeyPair {
        class Ed25519 extends Crypto.KeyPair {
            constructor(secretKey: Buffer | Uint8Array)
            sign: (data: Buffer) => Buffer
            verify: (data: Buffer, sig: Buffer) => boolean
            static randomKeyPair: () => Crypto.KeyPair
        }
        class Secp256k1 extends Crypto.KeyPair {
            constructor(secretKey: Buffer | Uint8Array)
            sign: (data: Buffer) => Buffer
            verify: (data: Buffer, sig: Buffer) => boolean
            static randomKeyPair: () => Crypto.KeyPair
        }
    }
    namespace Transaction {
        class Tx {
            public gasRatio: number
            public gasLimit: number
            public actions: {
                contract: string,
                action_name: string,
                data: string
            }[]
            public signers: string[]
            public signatures: Crypto.Signature[]
            public publisher: string
            public publisher_sigs: string[]
            public amount_limit: IOST.Parameter.AmountLimit[]
            public chain_id: number
            public reserved: null
            public delay: number
            public time: number
            public expiration: number
            constructor(gasRatio: number, gasLimit: string)
            addSigner: (name: string, permission: 'active' | 'owner') => void
            addApprove: (token: string, amount: number | string) => void
            getApproveList: () => IOST.Parameter.AmountLimit[]
            addAction: (contract: string, abi: string, args: string) => void
            setTime: (expiration: number, delay: number, serverTimeDiff: number) => void
            addSign: (keyPair: Crypto.KeyPair) => void
            addPublishSign: (id: string, keyPair: Crypto.KeyPair) => void
        }
        class Handler {
            public tx: Tx
            public log: boolean
            public listenConfig: IOST.Parameter.ListenConfig
            public status: 'idle' | 'pending' | 'success' | 'failed'
            public Pending: (res: IOST.Response.TransactionPending) => void
            public Success: (res: IOST.Response.TxReceipt) => void
            public Failed: (res: IOST.Response.TxReceipt) => void
            constructor(tx: Tx, rpc: API.RPC, log?: boolean)
            onPending: (callback: (res: IOST.Response.TransactionPending) => any) => Transaction.Handler
            onSuccess: (callback: (res: IOST.Response.TxReceipt) => any) => Transaction.Handler
            onFailed: (callback: (res: IOST.Response.TxReceipt) => any) => Transaction.Handler
            sign: (publisher: IOST.Account, signers?: { account: IOST.Account, permission: 'active' | 'owner' }[]) => void
            send: () => void
            signAndSend: (publisher: IOST.Account, signers?: { account: IOST.Account, permission: 'active' | 'owner' }[]) => void
            listen: (config: IOST.Parameter.ListenConfig) => void
        }
    }
    namespace Crypto {
        class KeyPair {
            public algoName: string
            public algoType: number
            public secretKey: Buffer
            public publicKey: Buffer
            constructor(algoName: string, algoType: number, secretKey: Buffer, publicKey: Buffer)
            sign(data: Buffer): Buffer
            verify(data: Buffer, sig: Buffer): boolean
            static randomKeyPair: () => Crypto.KeyPair
        }
        class Signature {
            public keyPair: Crypto.KeyPair
            public sig: Buffer
            constructor(data: Buffer, keyPair: Crypto.KeyPair)
            _bytes: () => Crypto.Codec
            toJSON: () => {
                algorithm: string,
                public_key: string,
                signature: string
            }
            verify: (info: string) => boolean
        }
        class Codec {
            public _buf: Buffer
            constructor()
            pushInt: (len: number) => Crypto.Codec
            pushByte: (n: number) => Crypto.Codec
            pushInt64: (n: number) => Crypto.Codec
            pushString: (s: string) => Crypto.Codec
            pushBytes: (b: Buffer) => Crypto.Codec
        }
    }
    namespace API {
        class Contract {
            public auth: Contract.Auth
            public gas: Contract.GAS
            public ram: Contract.RAM
            public system: Contract.System
            public token: Contract.Token
            public token721: Contract.Token721
            constructor(iost: IOST)
        }
        class RPC {
            public net: RPC.Net
            public transaction: RPC.Transaction
            public blockchain: RPC.Blockchain
            public economy: RPC.Economy
            constructor(host: string, timeout: number | undefined)
        }
    }
    namespace Parameter {
        type Config = {
            host?: string,
            chainId?: number,
            gasRatio?: number,
            gasLimit?: number,
            delay?: number,
            expiration?: number,
            defaultLimit?: 'unlimited' | number
        }
        type ListenConfig = {
            interval?: number,
            times?: number,
            irreversible?: boolean
        }
        type AmountLimit = {
            token: string
            value: string
        }
        type Action = {
            contract: string
            actionName: string
            data: []
        }
    }
    namespace Response {
        type TransactionPending = {
            hash: string,
            pre_tx_receipt: IOST.Response.TxReceipt | null
        }
        type NodeInfo = {
            build_time: string,
            git_hash: string,
            mode: string,
            network: {
                id: string,
                peer_count: number
            },
            code_version: string,
            server_time: string
        }
        type ChainInfo = {
            net_name: string,
            protocol_version: string,
            chain_id: number,
            head_block: string,
            head_block_hash: string,
            lib_block: string,
            lib_block_hash: string,
            witness_list: string[]
            lib_witness_list: string[]
            pending_witness_list: string[]
            head_block_time: string,
            lib_block_time: string
        }
        type Block = {
            status: string,
            block: {
                hash: string,
                version: string,
                parent_hash: string,
                tx_merkle_hash: string,
                tx_receipt_merkle_hash: string,
                number: string,
                witness: string,
                time: string,
                gas_usage: number,
                tx_count: string,
                info: { mode: number, thread: number, batch_index: string[] },
                transactions: Tx[]
            }
        }
        type TokenInfo = {
            symbol: string,
            full_name: string,
            issuer: string,
            total_supply: string,
            current_supply: string,
            decimal: number,
            can_transfer: boolean,
            only_issuer_can_transfer: boolean,
            total_supply_float: number,
            current_supply_float: number
        }
        type TokenBalance = {
            balance: number,
            frozen_balances: {
                amount: number,
                time: string
            }[]
        }
        type Token721Balance = {
            balance: string,
            tokenIDs: string[]
        }
        type Token721Metadata = {
            metadata: string
        }
        type Token721Owner = {
            owner: string
        }
        type Contract = {
            id: string,
            code: string,
            language: string,
            version: string,
            abis: {
                name: string,
                args: string[],
                amount_limit: IOST.Parameter.AmountLimit[]
            }[]
        }
        type Storage = {
            data: string,
            block_hash: string,
            block_number: string
        }
        type StorageFields = {
            fields: string[],
            block_hash: string,
            block_number: string
        }
        type Storages = {
            datas: string[],
            block_hash: string,
            block_number: string
        }
        type AccountInfo = {
            name: string,
            balance: number,
            gas_info: {
                current_total: number,
                transferable_gas: number,
                pledge_gas: number,
                increase_speed: number,
                limit: number,
                pledged_info: { pledger: string, amount: number }[]
            },
            ram_info: { available: string, used: string, total: string },
            permissions: {
                active: {
                    name: string,
                    group_names: any[],
                    items: {
                        id: string,
                        is_key_pair: boolean,
                        weight: string,
                        permission: 'active' | 'owner'
                    }[],
                    threshold: string
                },
                owner: {
                    name: string,
                    group_names: any[],
                    items: {
                        id: string,
                        is_key_pair: boolean,
                        weight: string,
                        permission: 'active' | 'owner'
                    }[],
                    threshold: string
                }
            },
            groups: {},
            frozen_balances: { amount: number, time: string }[],
            vote_infos: []
        }
        type Tx = {
            status: string,
            transaction: {
                hash: string,
                time: string,
                expiration: string,
                gas_ratio: number,
                gas_limit: number,
                delay: string,
                chain_id: number,
                actions: { contract: string, action_name: string, data: string }[],
                signers: [],
                publisher: string,
                referred_tx: string,
                amount_limit: IOST.Parameter.AmountLimit[],
                tx_receipt: IOST.Response.TxReceipt
            },
            block_number: string
        }
        type TxReceipt = {
            tx_hash: string,
            gas_usage: number,
            ram_usage: { [id: string]: string },
            status_code: string,
            message: string,
            returns: string[],
            receipts: { func_name: string, content: string }[]
        }
        type GasRation = {
            lowest_gas_ratio: number,
            median_gas_ratio: number
        }
        type RAMInfo = {
            used_ram: string,
            available_ram: string,
            total_ram: string,
            sell_price: number,
            buy_price: number
        }
    }    
}
declare namespace Contract {
    class Auth {
        assignPermission: (id: string, permission: 'active' | 'owner', publicKey: string, threshold: number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        revokePermission: (id: string, permission: 'active' | 'owner', publicKey: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        signUp: (name: string, ownerkey: string, activekey: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
    class GAS {
        pledge: (pledgor: string, to: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        unpledge: (pledgor: string, from: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
    class RAM {
        buy: (payer: string, receiver: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        sell: (seller: string, receiver: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        lend: (from: string, to: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
    class System {
        setCode: (source: string, abi: Object, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        updateCode: (source: string, abi: Object, contractName: string, data: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        cancelDelaytx: (txHash: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        requireAuth: (account: string, permission: 'active' | 'owner', tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        receipt: (data: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
    class Token {
        create: (tokenSym: string, issuer: string, totalSupply: string | number, config: {
            fullName: string;
            canTransfer: boolean;
            decimal: number;
            onlyIssuerCanTransfer: boolean;
        }, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        issue: (tokenSym: string, to: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        transfer: (tokenSym: string, from: string, to: string, amount: string | number, memo: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        transferFreeze: (tokenSym: string, from: string, to: string, amount: string | number, ftime: string | number, memo: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        destroy: (tokenSym: string, from: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        balanceOf: (tokenSym: string, from: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        supply: (tokenSym: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        totalSupply: (tokenSym: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
    class Token721 {
        create: (tokenSym: string, issuer: string, totalSupply: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        issue: (tokenSym: string, to: string, metaData: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        transfer: (tokenSym: string, from: string, to: string, tokenID: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        destroy: (tokenSym: string, from: string, amount: string | number, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        balanceOf: (tokenSym: string, from: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        ownerOf: (tokenSym: string, tokenID: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        tokenOfOwnerByIndex: (tokenSym: string, owner: string, index: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
        tokenMetadata: (tokenSym: string, tokenID: string, tx?: IOST.Transaction.Tx) => IOST.Transaction.Tx
    }
}
declare namespace RPC {
    class Net {
        getNodeInfo: () => Promise<IOST.Response.NodeInfo>
    }
    class Blockchain {
        getChainInfo: () => Promise<IOST.Response.ChainInfo>
        getBlockByHash: (hash: string, complete: boolean) => Promise<IOST.Response.Block>
        getBlockByNum: (num: number, complete: boolean) => Promise<IOST.Response.Block>
        getTokenInfo: (symbol: string, useLongestChain?: number) => Promise<IOST.Response.TokenInfo>
        getBalance: (address: string, tokenSymbol?: string, useLongestChain?: number) => Promise<IOST.Response.TokenBalance>
        getToken721Balance: (address: string, tokenSymbol: string, useLongestChain?: number) => Promise<IOST.Response.Token721Balance>
        getToken721Metadata: (tokenSymbol: string, tokenID: string, useLongestChain?: number) => Promise<IOST.Response.Token721Metadata>
        getToken721Owner: (tokenSymbol: string, tokenID: string, useLongestChain?: number) => Promise<IOST.Response.Token721Owner>
        getContract: (id: string, useLongestChain?: number) => Promise<IOST.Response.Contract>
        getContractStorage: (contractID: string, key: string, field: string, pending?: boolean) => Promise<IOST.Response.Storage>
        getContractStorageFields: (contractID: string, key: string, pending?: boolean) => Promise<IOST.Response.StorageFields>
        getBatchContractStorage: (contractID: string, key_fields: { key: string, field: string }[], pending?: boolean) => Promise<IOST.Response.Storages>
        getAccountInfo: (id: string, reversible: boolean) => Promise<IOST.Response.AccountInfo>
    }
    class Transaction {
        sendTx: (tx: IOST.Transaction.Tx) => Promise<IOST.Response.TransactionPending>
        getTxByHash: (hash: string) => Promise<IOST.Response.Tx>
        getTxReceiptByTxHash: (txHash: string) => Promise<IOST.Response.TxReceipt>
    }
    class Economy {
        getGasRatio: () => Promise<IOST.Response.GasRation>
        getRAMInfo: () => Promise<IOST.Response.RAMInfo>
    }
}
