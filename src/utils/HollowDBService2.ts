import { SDK, Admin } from 'hollowdb';
import { WarpFactory } from 'warp-contracts';
import { poseidon1 } from 'poseidon-lite';
import fs from 'fs';

class HollowDbManager {
    private contractTxId: string;
    private wallet: any;
    private sdk: SDK;
    private admin: Admin;

    constructor(contractTxId: string, walletPath: string) {
        this.contractTxId = contractTxId;
        this.wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
        const warp = WarpFactory.forMainnet();
        this.sdk = new SDK(this.wallet, this.contractTxId, warp);
        this.admin = new Admin(this.wallet, this.contractTxId, warp);
        const isProofRequired = false; // or false
        this.admin.updateProofRequirement('auth', isProofRequired);
    }

    computeKey(preimage: any): string {
        return poseidon1([preimage]).toString();
    }

    async key(): Promise<string> {
        const secret = BigInt(2006);
        const key = this.computeKey(secret);
        return key;
    }

    async get(key: string): Promise<any> {
        const result = await this.sdk.get(key);
        return result;
    }

    async put(key: string, value: any): Promise<any> {
        await this.sdk.put(key, value);
        const { cachedValue } = await this.sdk.readState();
        return cachedValue;
    }

    async update(key: string, value: any): Promise<any> {
        await this.sdk.update(key, value);
        const { cachedValue } = await this.sdk.readState();
        return cachedValue;
    }

    async remove(key: string): Promise<any> {
        await this.sdk.remove(key);
        const { cachedValue } = await this.sdk.readState();
        return cachedValue;
    }
}

export default HollowDbManager;
