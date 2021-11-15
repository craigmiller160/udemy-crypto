import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { Wallet } from '../wallet/Wallet';
import { P2pServer } from '../p2p-server';
import { getValidTransactions } from '../transaction/transactionPoolUtils';
import { rewardTransaction } from '../transaction/transactionUtils';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { Block } from '../block/Block';

export const mine = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
): E.Either<Error, Block> => {
	const validTransactions = getValidTransactions(transactionPool);
	if (validTransactions.length === 0) {
		return E.left(new Error('No transactions to mine'));
	}

	return pipe(
		rewardTransaction(wallet, blockchain.wallet),
		E.map((rewardTxn) => [...validTransactions, rewardTxn]),
		E.chain((transactions) => blockchain.addBlock(transactions)),
		E.map((block: Block) => {
			p2pServer.syncChains();
			transactionPool.clear();
			p2pServer.broadcastClearTransactions();
			return block;
		})
	);
};
