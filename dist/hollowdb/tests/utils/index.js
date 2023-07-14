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
exports.deployContract = exports.createValues = exports.computeKey = exports.decimalToHex = exports.mineBlock = exports.addFunds = void 0;
const poseidon_lite_1 = require("poseidon-lite");
const crypto_1 = require("crypto");
const hollowdb_1 = __importDefault(require("../../src/contracts/states/hollowdb"));
const fs_1 = require("fs");
const hollowdb_2 = require("../../src/hollowdb");
/** Add funds to any wallet. */
function addFunds(warp, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const walletAddress = yield warp.arweave.wallets.getAddress(wallet);
        yield warp.arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
    });
}
exports.addFunds = addFunds;
/** Mine a block in the local instance. */
function mineBlock(warp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield warp.arweave.api.get('mine');
    });
}
exports.mineBlock = mineBlock;
/** Convert a decimal string to hexadecimal, both belonging to a bigint. */
function decimalToHex(bigIntString) {
    return '0x' + BigInt(bigIntString).toString(16);
}
exports.decimalToHex = decimalToHex;
/**
 * Compute the key that only you can know the preimage of.
 * @param preimage your secret, the preimage of the key
 * @returns key, that is the Poseidon hash of your secret as a hexadecimal string
 */
function computeKey(preimage) {
    return '0x' + (0, poseidon_lite_1.poseidon1)([preimage]).toString(16);
}
exports.computeKey = computeKey;
/**
 * Utility to create a key with its preimage, a value and a next value.
 * @param numBytes number of random bytes
 */
function createValues(numBytes = 10) {
    const KEY_PREIMAGE = BigInt('0x' + (0, crypto_1.randomBytes)(numBytes).toString('hex'));
    const KEY = computeKey(KEY_PREIMAGE);
    const VALUE = {
        val: (0, crypto_1.randomBytes)(numBytes).toString('hex'),
    };
    const NEXT_VALUE = {
        val: (0, crypto_1.randomBytes)(numBytes).toString('hex'),
    };
    return {
        KEY,
        KEY_PREIMAGE,
        VALUE: VALUE,
        NEXT_VALUE: NEXT_VALUE,
    };
}
exports.createValues = createValues;
/**
 * Deploys a contract with the optionally provided initial state.
 * Returns the `contractTxId`.
 */
function deployContract(warp, signer, initialState = hollowdb_1.default) {
    return __awaiter(this, void 0, void 0, function* () {
        const contractSource = (0, fs_1.readFileSync)('./build/hollowdb.js', 'utf8');
        const contractTxId = yield hollowdb_2.Admin.deploy(signer, initialState, contractSource, warp, true // bundling is disabled during testing
        ).then(result => result.contractTxId);
        // console.log('Contract deployed at:', contractTxId);
        const contractTx = yield warp.arweave.transactions.get(contractTxId);
        expect(contractTx).not.toBeNull();
        return contractTxId;
    });
}
exports.deployContract = deployContract;
//# sourceMappingURL=index.js.map