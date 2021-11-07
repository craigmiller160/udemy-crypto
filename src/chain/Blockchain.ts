import { Block } from '../block/Block';
import { genesisBlock, mineBlock } from '../block/blockUtils';
import { BlockData } from '../types/restTypes';
import { isValidChain } from './blockchainUtils';
import { logger } from '../logger';

export class Blockchain {
	#chain: ReadonlyArray<Block> = [genesisBlock()];

	get chain(): ReadonlyArray<Block> {
		return this.#chain.slice();
	}

	addBlock(data: BlockData): Block {
		const block = mineBlock(this.chain[this.chain.length - 1], data);
		this.#chain = [...this.#chain, block];
		return block;
	}

	replaceChain(newChain: ReadonlyArray<Block>) {
		if (newChain.length <= this.#chain.length) {
			logger.warn('Received chain is not longer than the current chain');
			return;
		}
		if (!isValidChain(newChain)) {
			logger.warn('Received chain is not valid');
			return;
		}

		this.#chain = newChain;
		logger.info('Replacing blockchain with the new chain');
	}
}
