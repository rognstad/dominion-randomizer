/* http://wiki.dominionstrategy.com/index.php/Cards */

'use strict';

let columns = ['name', 'set', 'types', 'cost', 'text', 'actions', 'cards', 'buys', 'coins', 'trash', 'others_gain', 'self_gain']
let rows = document.querySelectorAll('.wikitable tbody tr');
var cards1 = [... rows].map(processRow);

function processRow(row) {
    let card = {};
    columns.forEach(function processCell(property, index) {
        let cell = row.children[index];
        let text = '';
        if (cell.innerHTML.indexOf('coin-icon') >= 0 || cell.innerHTML.indexOf('debt-icon') >= 0) {
            text = extractAltText(cell, property);
        }
        else {
            text = extractInnerText(cell, property);
        }
        text = text.trim().replace(/(↵|\n)/g, ' ');

        if (property === 'cost') {
            card[property] = text
        }
        card[property] = text;
    });
    return card;
}

function extractAltText(cell, property) {
    let altRegex = /alt="([^"]*)"/;
    let text  = [... cell.children].reduce(function reduceImageCells(prev, current) {
        let prefix = '';
        if (prev.trim().length > 0) {
            prefix = ',';
        }
        // console.log('prev', prev, 'current', current, 'prefix', prefix);

        // handle text nodes
        if (current.nodeName.indexOf('text') >= 0) {
            return prev + prefix + current.data;
        }
        // handle images or nodes containing images
        else {
            let matches = current.innerHTML.match(altRegex);
            if (matches) {
                let alt = matches[1].trim();
                return prev + prefix + alt;
                switch(alt) {
                    case 'D':
                        alt = ' Debt';
                        break;
                    case 'P':
                        alt = ' Potion';
                        break;
                    case 'VP.png':
                        alt = ' VP';
                        break;
                    default:
                       alt = alt.replace('$', '');
                }
                return prev + prefix + alt;
            }
            return prev;
        }
    }, '');

    if (property !== 'cost') {
        return text;
    }

    /**
     * Cost examples:
     *  $2
     *  $2,P (mmoney + a potion)
     *  $4,3D (money + x debt)
     *  $5star (card cannot be purchased from the supply)
     *  $3plus (may overpay)
     */

    let factors = text.split(',');
    let cost = {};
    factors.forEach(function (factor) {
        if (factor.indexOf('$') >= 0) {
            cost.coins = Number(factor.replace('$', '')
                .replace('star', '')
                .replace('plus', ''));
        }
        else if (factor.indexOf('P') >= 0) {
            cost.potions = 1;
        }
        else if (factor.indexOf('D') >= 0) {
            cost.debt = Number(factor.replace('D', ''));
        }
    });

    return cost;
}

function extractInnerText(cell, property) {
    return cell.innerText;
}

// "$5star"
// "$4,3D"
// "$3plus"
// "$2,P"
// "$2"