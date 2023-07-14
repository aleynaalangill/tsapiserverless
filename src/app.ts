import express from "express";
import HollowDbManager from './utils/HollowDBService2';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());
const contract = 'ONEB5WqkItn8LRPmBP2QL_U82sLrhfqbbnt2XzP08_0';
const walletPath = '/home/aleyna/CodeSpaces/WebstormProjects/tsAPI/src/wallets/wallet.json';
const dbManager = new HollowDbManager(contract, walletPath);

app.get('/', async (req, res) => {
    return "Hello World!";
});

app.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const value = await dbManager.get(key);
        res.status(200).send({ value });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error getting value: ${error.message}` });
        }
    }
});

app.post('/put', async (req, res) => {
    const { key, value } = req.body;
    try {
        console.log(key, value);
        await dbManager.put(key, value);
        console.log(value);
        res.status(200).send({ message: 'Value inserted/updated successfully', value: value });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error inserting/updating value: ${error.message}` });
        }
    }
});

app.put('/update/:key', async (req, res) => {
    const { value } = req.body;
    const key = req.params.key;
    try {
        await dbManager.update(key, value);
        res.status(200).send({ message: 'Value updated successfully', value: value});
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error updating value: ${error.message}` });
        }
    }
});

app.delete('/remove/:key', async (req, res) => {
    const key = req.params.key;
    try {
        await dbManager.remove(key);
        res.status(200).send({ message: 'Value removed successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({ error: `Error removing value: ${error.message}` });
        }
    }
});


module.exports.handler = serverless(app)

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
