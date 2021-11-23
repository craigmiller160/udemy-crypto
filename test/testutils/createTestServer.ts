import { Blockchain } from '../../src/chain/Blockchain';
import { TransactionPool } from '../../src/transaction/TransactionPool';
import { P2pServer } from '../../src/p2p-server';
import { createServerApplication } from '../../src/rest-server';
import { Express } from 'express';
import { Wallet } from '../../src/wallet/Wallet';
import { unpackRight } from './utilityFunctions';
import { genesisBlock } from '../../src/block/blockUtils';

jest.mock('../../src/p2p-server');

export interface TestServer {
	app: Express;
	blockchain: Blockchain;
	transactionPool: TransactionPool;
	p2pServer: P2pServer;
	wallet: Wallet;
}

export const createTestServer = (): TestServer => {
	const blockchain = new Blockchain(unpackRight(genesisBlock()));
	const wallet = new Wallet();
	const transactionPool = new TransactionPool();
	const p2pServer = new P2pServer(blockchain, transactionPool);
	const app = createServerApplication(
		blockchain,
		transactionPool,
		wallet,
		p2pServer
	);
	return {
		app,
		blockchain,
		transactionPool,
		p2pServer,
		wallet
	};
};
