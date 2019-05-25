'use strict';

async function getCards() {
    return fetch('cards.json');
}

function getSelectedSetsCards(cards, sets) {
    return cards.filter(c => sets.IndexOf(c.set) >= 0);
}

function get2ActionsCards(cards) {
    return cards.filter(c => {
        c.actions && getPropertyNumber(c, 'actions') >= 2
    });
}

function get2DrawsCards(cards) {
    return cards.filter(c => getPropertyNumber(c, 'cards') >= 2);
}

function getBuysCards(cards) {
    return cards.filter(c => getPropertyNumber(c, 'buys') >= 1);
}

function getAttackCards(cards) {
    return cards.filter(c => c.types.indexOf('Attack') >= 0);
}

function getReactionCards(cards) {
    return cards.filter(c => c.types.indexOf('Reaction') >= 0);
}

const filters = {
    actions: get2ActionsCards,
    draws: get2DrawsCards,
    buys: getBuysCards,
    attacks: getAttackCards,
    reactions: getReactionCards
};

function getPropertyNumber(card, prop) {
    if (card[prop]) {
        let str = card[prop].replace('+', '');
        let num = Number(str);
        if (isNaN(num) === false) {
            return num;
        }
        return 0;
    }
    return 0;
}

function getRandomInRange(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomArrayItem(list) {
    let index = getRandomInRange(list.length - 1);
    return list[index];
}

function getRandomCards(cards, disallowedCards, num) {
    let matches = [];
    while (num > 0) {
        let card = getRandomArrayItem(cards);
        if (disallowedCards.indexOf(card) === -1 && matches.indexOf(card) === -1) {
            matches.push(card);
            num--;
        }
    }
    return matches;
}

function pickCards(options) {
    let hand = [];
    let size = 10;
    let allCards = await getCards();
    let availableCards = getSelectedSetsCards(allCards, options.sets);

    options.requirements.forEach(function (requirement) {
        if (filters.hasOwnProperty('requirement')) {
            let cards = filters[requirement](availableCards);
            hand.concat(getRandomCards(cards, hand, 1));
        }
    });``

    hand.concat(getRandomCards(availableCards, hand, size - hand.length));

    return hand;
}