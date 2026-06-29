import { expect, test, describe } from 'vitest';
import calculate, { buildSidePots, distributePotOnBoard } from "./calculator.js";

describe('buildSidePots', () => {

    test('two equal stacks, no pre-existing pot', () => {
        const players = [
            { id: 'alice', chips: 100 },
            { id: 'bob', chips: 100 }
        ];
        const result = buildSidePots(players, 0);

        expect(result.pots).toEqual([
            { amount: 200, eligibleIds: ['alice', 'bob'] }
        ]);
        expect(result.uncalled).toBe(null);
    });

    test('uneven stacks creates side pot', () => {
        const players = [
            { id: 'alice', chips: 50 },
            { id: 'bob', chips: 100 }
        ];
        const result = buildSidePots(players, 0);

        expect(result.pots).toEqual([
            { amount: 100, eligibleIds: ['alice', 'bob'] }
        ]);
        expect(result.uncalled).toEqual({ id: 'bob', chips: 50 });
    });

});

describe('distributePotOnBoard', () => {

    test('clear winner takes full pot', () => {
        const pot = { amount: 300, eligibleIds: ['alice', 'bob'] };
        const rankings = { alice: 1, bob: 2 };
        const result = distributePotOnBoard(pot, rankings);

        expect(result).toEqual({ alice: 300, bob: 0 });
    });

    test('tie splits pot evenly', () => {
        const pot = { amount: 300, eligibleIds: ['alice', 'bob'] };
        const rankings = { alice: 1, bob: 1 };
        const result = distributePotOnBoard(pot, rankings);

        expect(result).toEqual({ alice: 150, bob: 150 });
    });

});

describe('calculate', () => {

    test('two equal players, one board, no pre-existing pot', () => {
        const players = [
            { id: 'alice', chips: 100, ranks: [1] },
            { id: 'bob', chips: 100, ranks: [2] }
        ];
        const result = calculate(players, 1, 0);

        expect(result).toEqual({ alice: 200, bob: 0 });
    });

});
