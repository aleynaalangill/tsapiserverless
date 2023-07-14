declare module 'utils/HollowDbService' {
    export default class HollowDbManager {
        constructor(contractTxId: string, walletPath: string);
        computeKey(preimage: any): string; // Replace any with the correct type if known
        key(): Promise<string>;
        get(key: string): Promise<any>; // Replace any with the correct type if known
        put(key: string, value: string): Promise<string>; // Replace any with the correct type if known
        update(key: string, value: string): Promise<string>; // Replace any with the correct type if known
        remove(key: string): Promise<string>; // Replace any with the correct type if known
    }
}
