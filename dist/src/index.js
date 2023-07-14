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
const express_1 = __importDefault(require("express"));
const HollowDBService2_1 = __importDefault(require("./utils/HollowDBService2"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const contract = 'ONEB5WqkItn8LRPmBP2QL_U82sLrhfqbbnt2XzP08_0';
const walletPath = '/home/aleyna/CodeSpaces/WebstormProjects/tsAPI/src/wallets/wallet.json';
const dbManager = new HollowDBService2_1.default(contract, walletPath);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return "Hello World!";
}));
app.get('/get/:key', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.params.key;
    try {
        const value = yield dbManager.get(key);
        res.status(200).send({ value });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error getting value: ${error.message}` });
        }
    }
}));
app.post('/put', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body;
    try {
        console.log(key, value);
        yield dbManager.put(key, value);
        console.log(value);
        res.status(200).send({ message: 'Value inserted/updated successfully', value: value });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error inserting/updating value: ${error.message}` });
        }
    }
}));
app.put('/update/:key', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value } = req.body;
    const key = req.params.key;
    try {
        yield dbManager.update(key, value);
        res.status(200).send({ message: 'Value updated successfully', value: value });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error updating value: ${error.message}` });
        }
    }
}));
app.delete('/remove/:key', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.params.key;
    try {
        yield dbManager.remove(key);
        res.status(200).send({ message: 'Value removed successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error removing value: ${error.message}` });
        }
    }
}));
module.exports.handler = (0, serverless_http_1.default)(app);
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map