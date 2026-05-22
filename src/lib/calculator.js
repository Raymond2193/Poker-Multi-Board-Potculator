
function buildSidePots(players, preExistingPot) {

    const pots = [];
    let uncalled = null;
    const sorted = []
    let counter = 0;

    for (let i = 0; i < players.length; ++i) {
        sorted[i] = { id: players[i].id, chips: players[i].chips };
    }

    sorted.sort(function (a, b) {
        return a.chips - b.chips;
    })

    while (sorted.length > 0) {

        if (sorted.length == 1) {
            uncalled = { id: sorted[0].id, chips: sorted[0].chips }
            break;
        }

        const smallest = sorted[0].chips;
        const layerAmount = smallest * sorted.length + preExistingPot;
        preExistingPot = 0;

        const idArray = []

        for (let i = 0; i < sorted.length; ++i) {
            idArray[i] = sorted[i].id
        }

        pots[counter] = { amount: layerAmount, eligibleIds: idArray }
        ++counter;

        for (let i = 0; i < sorted.length; ++i) {
            sorted[i].chips = sorted[i].chips - smallest;
            if (sorted[i].chips === 0) {
                sorted.splice(i, 1);
                --i;
            }
        }
    }
    return { pots, uncalled };
}




function distributePotOnBoard(pot, rankings) {

    const winners = [];
    const result = {};
    let bestRank = Infinity;

    for (let i = 0; i < pot.eligibleIds.length; ++i) {
        if (rankings[pot.eligibleIds[i]] < bestRank) {
            bestRank = rankings[pot.eligibleIds[i]];
        }
    }

    for (let i = 0; i < pot.eligibleIds.length; ++i) {
        if (rankings[pot.eligibleIds[i]] === bestRank) {
            winners.push(pot.eligibleIds[i]);
        }
    }

    const totalShare = pot.amount / winners.length;

    for (let i = 0; i < pot.eligibleIds.length; ++i) {
        if (winners.includes(pot.eligibleIds[i])) {
            result[pot.eligibleIds[i]] = totalShare;
        } else {
            result[pot.eligibleIds[i]] = 0;
        }
    }

    return result;
}


export default function calculate(players, numBoard, preExistingPot) {

    const potProfile = buildSidePots(players, preExistingPot);

    const pots = potProfile.pots;
    const uncalled = potProfile.uncalled;

    const finalStacks = {};

    for (let i = 0; i < players.length; ++i) {
        finalStacks[players[i].id] = 0;
    }

    for (let i = 0; i < pots.length; ++i) {
        const potShare = pots[i].amount / numBoard;

        for (let b = 0; b < numBoard; ++b) {
            const rankings = {};
            for (let p = 0; p < players.length; ++p) {
                rankings[players[p].id] = players[p].ranks[b];
            }

            const boardPot = { amount: potShare, eligibleIds: pots[i].eligibleIds };
            const potResult = distributePotOnBoard(boardPot, rankings);

            for (var id in potResult) {
                finalStacks[id] += potResult[id];
            }
        }
    }

    if (uncalled) {
        finalStacks[uncalled.id] += uncalled.chips;
    }

    return finalStacks;
}




