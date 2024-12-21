export interface Wallet {
    address: string;
    name: string;
    privateKey?: string;
    seedPhrase?: string;
}

export interface ActiveWalletData {
    qrData: string;
    wallet: Wallet;
    privateKey: string;
}
