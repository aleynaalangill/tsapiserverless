"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { SDK, Admin } = require('hollowdb');
const { WarpFactory } = require('warp-contracts');
const { poseidon1 } = require('poseidon-lite');
const fs = require('fs');
// const { ripemd160 } = require('@ethersproject/sha2');
// const snarkjs = require('snarkjs');
const { computeKey } = require("../../hollowdb/tests/utils");
class HollowDbManager {
    constructor(contractTxId, walletPath) {
        this.contractTxId = contractTxId;
        this.wallet = JSON.parse(fs.readFileSync(walletPath).toString());
        const warp = WarpFactory.forMainnet();
        this.sdk = new SDK(this.wallet, this.contractTxId, warp);
        this.admin = new Admin(this.wallet, this.contractTxId, warp);
        const isProofRequired = false; // or false
        this.admin.updateProofRequirement("auth", isProofRequired);
    }
    computeKey(preimage) {
        return poseidon1([preimage]).toString();
    }
    key() {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = BigInt(2006);
            const key = computeKey(secret);
            return key;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sdk.get(key);
            return result;
        });
    }
    put(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sdk.put(key, value);
            const { cachedValue } = yield this.sdk.readState();
            return cachedValue;
        });
    }
    update(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sdk.update(key, value);
            const { cachedValue } = yield this.sdk.readState();
            return cachedValue;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sdk.remove(key);
            const { cachedValue } = yield this.sdk.readState();
            return cachedValue;
        });
    }
}
module.exports = HollowDbManager;
//# sourceMappingURL=HollowDbService.js.map