import { Express, Request } from 'express';
import { TransactionPool } from '../transaction/TransactionPool';
import { TransactionRequest } from '../types/restBodyTypes';
import { Wallet } from '../wallet/Wallet';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { logger } from '../logger';

export const configureGetTransactions = (
	app: Express,
	transactionPool: TransactionPool
) =>
	app.get('/transactions', (req, res) => {
		res.json(transactionPool.transactions);
	});

export const configureCreateTransaction = (
	app: Express,
	wallet: Wallet,
	transactionPool: TransactionPool
) =>
	app.post(
		'/transactions',
		(req: Request<unknown, unknown, TransactionRequest>, res) => {
			const { recipient, amount } = req.body;
			pipe(
				wallet.createTransaction(recipient, amount, transactionPool),
				E.fold(
					(error) => {
						logger.error('Error creating a transaction', error);
						res.status(500);
						res.send(error.message);
					},
					() => {
						res.redirect('/transactions');
					}
				)
			);
		}
	);
