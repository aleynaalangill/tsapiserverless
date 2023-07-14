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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hollowdb_1 = require("hollowdb");
const warp_contracts_1 = require("warp-contracts");
const poseidon_lite_1 = require("poseidon-lite");
const fs_1 = __importDefault(require("fs"));
class HollowDbManager {
    constructor(contractTxId, walletPath) {
        this.contractTxId = contractTxId;
        this.wallet = JSON.parse(fs_1.default.readFileSync(walletPath, 'utf8'));
        const warp = warp_contracts_1.WarpFactory.forMainnet();
        this.sdk = new hollowdb_1.SDK(this.wallet, this.contractTxId, warp);
        this.admin = new hollowdb_1.Admin(this.wallet, this.contractTxId, warp);
        const isProofRequired = false; // or false
        this.admin.updateProofRequirement('auth', isProofRequired);
    }
    computeKey(preimage) {
        return (0, poseidon_lite_1.poseidon1)([preimage]).toString();
    }
    key() {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = BigInt(2006);
            const key = this.computeKey(secret);
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
exports.default = HollowDbManager;
//# sourceMappingURL=HollowDBService3.js.map