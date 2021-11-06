import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';
import { createTimestamp } from '../utils/dateUtils';
import SHA256 from 'crypto-js/sha256';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';

export const newTransaction = (
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): E.Either<Error, Transaction> => {
	if (amount > senderWallet.balance) {
		return E.left(new Error(`Amount ${amount} exceeds sender balance`));
	}

	const outputs: ReadonlyArray<TransactionOutput> = [
		{
			// TODO wouldn't it just be -amount instead of the new balance?
			amount: senderWallet.balance - amount,
			address: senderWallet.publicKey
		},
		{
			amount,
			address: recipientAddress
		}
	];

	const input: TransactionInput = {
		timestamp: createTimestamp(),
		amount: senderWallet.balance,
		address: senderWallet.publicKey,
		// TODO why does the input signature sign the outputs?
		signature: senderWallet.sign(SHA256(JSON.stringify(outputs)).toString())
	};

	return E.right(new Transaction(input, outputs));
};
