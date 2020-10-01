// Type definitions for IOST.js

export as namespace IOST;

export = IOST;

declare class IOST {
    public publisher: IOST.Account | null
    public signers: IOST.Account[]
    public serverTimeDiff: number
    public config: Parameter.Config
    public rpc: API.RPC
    public contract: API.Contract
    constructor(config?: Parameter.Config)
    setServerTimeDiff: () => Promise<number>
    createTx: () => Transaction.Tx
    call: (contract: string, abi: string, args: (number | string)[], tx?: Transaction.Tx) => Transaction.Tx
    setPublisher: (account: IOST.Account) => void
    addSigner: (account: IOST.Account, permision: 'active' | 'owner') => void
    signAndSend: (tx: Transaction.Tx, log?: boolean) => Transaction.Handler
}

declare namespace IOST {
    class Bs58 {
        static encode: (buf: Buffer) => string
        static decode: (str: string) => Buffer
    }
    class Account {
        public id: string;
        public keyPair: {
            active: Crypto.KeyPair[],
            owner: Crypto.KeyPair[]
        }
        constructor(id: string)
        addKeyPair: (permission: 'active' | 'owner', keyPair: Crypto.KeyPair) => void
        sign: (tx: Transaction.Tx, permission: 'active' | 'owner') => void
        publishSign: (tx: Transaction.Tx) => void
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
}
declare namespace Transaction {
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
        public amount_limit: Parameter.AmountLimit[]
        public chain_id: number
        public reserved: null
        public delay: number
        public time: number
        public expiration: number
        constructor(gasRatio: number, gasLimit: string)
        addSigner: (name: string, permission: 'active' | 'owner') => void
        addApprove: (token: string, amount: number | string) => void
        getApproveList: () => Parameter.AmountLimit[]
        addAction: (contract: string, abi: string, args: string) => void
        setTime: (expiration: number, delay: number, serverTimeDiff: number) => void
        addSign: (keyPair: Crypto.KeyPair) => void
        addPublishSign: (id: string, keyPair: Crypto.KeyPair) => void
    }
    class Handler {
        public tx: Tx
        public log: boolean
        public listenConfig: Parameter.ListenConfig
        public status: 'idle' | 'pending' | 'success' | 'failed'
        public Pending: (res: Response.TransactionPending) => void
        public Success: (res: Response.TxReceipt) => void
        public Failed: (res: Response.TxReceipt) => void
        constructor(tx: Tx, rpc: API.RPC, log?: boolean)
        onPending: (callback: (res: Response.TransactionPending) => any) => Transaction.Handler
        onSuccess: (callback: (res: Response.TxReceipt) => any) => Transaction.Handler
        onFailed: (callback: (res: Response.TxReceipt) => any) => Transaction.Handler
        sign: (publisher: IOST.Account, signers?: { account: IOST.Account, permission: 'active' | 'owner'}[]) => void
        send: () => void
        signAndSend: (publisher: IOST.Account, signers?: { account: IOST.Account, permission: 'active' | 'owner'}[]) => void
        listen: (config: Parameter.ListenConfig) => void
    }
}
declare namespace Crypto {
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
declare namespace API {
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
declare namespace Contract {
    interface Auth {
        assignPermission: (id: string, permission: 'active' | 'owner', publicKey: string, threshold: number, tx?: Transaction.Tx) => Transaction.Tx
        revokePermission: (id: string, permission: 'active' | 'owner', publicKey: string, tx?: Transaction.Tx) => Transaction.Tx
        signUp: (name: string, ownerkey: string, activekey: string, tx?: Transaction.Tx) => Transaction.Tx
    }
    interface GAS {
        pledge: (pledgor: string, to: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        unpledge: (pledgor: string, from: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
    }
    interface RAM {
        buy: (payer: string, receiver: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        sell: (seller: string, receiver: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        lend: (from: string, to: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
    }
    interface System {
        setCode: (source: string, abi: Object, tx?: Transaction.Tx) => Transaction.Tx
        updateCode: (source: string, abi: Object, contractName: string, data: string, tx?: Transaction.Tx) => Transaction.Tx
        cancelDelaytx: (txHash: string, tx?: Transaction.Tx) => Transaction.Tx
        requireAuth: (account: string, permission: 'active' | 'owner', tx?: Transaction.Tx) => Transaction.Tx
        receipt: (data: string, tx?: Transaction.Tx) => Transaction.Tx
    }
    interface Token {
        create: (tokenSym: string, issuer: string, totalSupply: string | number, config: string, tx?: Transaction.Tx) => Transaction.Tx
        issue: (tokenSym: string, to: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        transfer: (tokenSym: string, from: string, to: string, amount: string | number, memo: string, tx?: Transaction.Tx) => Transaction.Tx
        transferFreeze: (tokenSym: string, from: string, to: string, amount: string | number, ftime: string | number, memo: string, tx?: Transaction.Tx) => Transaction.Tx
        destroy: (tokenSym: string, from: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        balanceOf: (tokenSym: string, from: string, tx?: Transaction.Tx) => Transaction.Tx
        supply: (tokenSym: string, tx?: Transaction.Tx) => Transaction.Tx
        totalSupply: (tokenSym: string, tx?: Transaction.Tx) => Transaction.Tx
    }
    interface Token721 {
        create: (tokenSym: string, issuer: string, totalSupply: string | number, tx?: Transaction.Tx) => Transaction.Tx
        issue: (tokenSym: string, to: string, metaData: string, tx?: Transaction.Tx) => Transaction.Tx
        transfer: (tokenSym: string, from: string, to: string, tokenID: string, memo: string, tx?: Transaction.Tx) => Transaction.Tx
        destroy: (tokenSym: string, from: string, amount: string | number, tx?: Transaction.Tx) => Transaction.Tx
        balanceOf: (tokenSym: string, from: string, tx?: Transaction.Tx) => Transaction.Tx
        ownerOf: (tokenSym: string, tokenID: string, tx?: Transaction.Tx) => Transaction.Tx
        tokenOfOwnerByIndex: (tokenSym: string, owner: string, index: string, tx?: Transaction.Tx) => Transaction.Tx
        tokenMetadata: (tokenSym: string, tokenID: string, tx?: Transaction.Tx) => Transaction.Tx
    }
}
declare namespace RPC {
    interface Net {
        getNodeInfo: () => Promise<Response.NodeInfo>
    }
    interface Blockchain {
        getChainInfo: () => Promise<Response.ChainInfo>
        getBlockByHash: (hash: string, complete: boolean) => Promise<Response.Block>
        getBlockByNum: (num: number, complete: boolean) => Promise<Response.Block>
        getTokenInfo: (symbol: string, useLongestChain?: number) => Promise<Response.TokenInfo>
        getBalance: (address: string, tokenSymbol?: string, useLongestChain?: number) => Promise<Response.TokenBalance>
        getToken721Balance: (address: string, tokenSymbol: string, useLongestChain?: number) => Promise<Response.Token721Balance>
        getToken721Metadata: (tokenSymbol: string, tokenID: string, useLongestChain?: number) => Promise<Response.Token721Metadata>
        getToken721Owner: (tokenSymbol: string, tokenID: string, useLongestChain?: number) => Promise<Response.Token721Owner>
        getContract: (id: string, useLongestChain?: number) => Promise<Response.Contract>
        getContractStorage: (contractID: string, key: string, field: string, pending?: boolean) => Promise<Response.Storage>
        getContractStorageFields: (contractID: string, key: string, pending?: boolean) => Promise<Response.StorageFields>
        getAccountInfo: (id: string, reversible: boolean) => Promise<Response.AccountInfo>
    }
    interface Transaction {
        sendTx: (tx: Transaction.Tx) => Promise<Response.TransactionPending>
        getTxByHash: (hash: string) => Promise<Response.Tx>
        getTxReceiptByTxHash: (txHash: string) => Promise<Response.TxReceipt>
    }
    interface Economy {
        getGasRatio: () => Promise<Response.GasRation>
        getRAMInfo: () => Promise<Response.RAMInfo>
    }
}
declare namespace Parameter {
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
declare namespace Response {
    type TransactionPending = {
        hash: string,
        pre_tx_receipt: Response.TxReceipt | null
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
            amount_limit: Parameter.AmountLimit[]
        }[]
    }
    type Storage = {
        data: string
        block_hash: string,
        block_number: string
    }
    type StorageFields = {
        fields: string[],
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
            amount_limit: Parameter.AmountLimit[],
            tx_receipt: Response.TxReceipt
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
