/* http://inprogressgaming.com/projects/dominion_picker.html */

'use strict';

const stat_names = ["trash_other", "2_actions", "+buy", "attack", "defense", "is_action", "is_victory", "is_treasure", "hand_reducing_attack", "curse_giving_attack", "is_terminal_action", "treasure_trashing_attack", "hand_reducing_defense", "curse_giving_defense", "treasure_trashing_defense", "deck_manipulating_attack", "deck_manipulating_defense", "cantrip", "allows_discarding", "draws_two", "on_trash_ability", "expansion", "is_event", "is_night"];

let cards = card_names.map(n => ({name: n}));

cards.forEach((c, i) => {
    c.text = card_text[i];
    c.image = card_images[i];
    c.expansion = card_expansion[i];
    c.cost = {
        coins: card_cost[i][0],
        potions: card_cost[i][1]
    },
    c.stats = {};
    stat_names.forEach((name, index) => c.stats[name] = card_stats[i][index])
});
