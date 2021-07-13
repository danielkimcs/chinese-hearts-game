// Because Webpack is difficult to work with
import Card_back from '../assets/back.svg';
import Card_clubs_2 from '../assets/clubs_2.svg';
import Card_clubs_3 from '../assets/clubs_3.svg';
import Card_clubs_4 from '../assets/clubs_4.svg';
import Card_clubs_5 from '../assets/clubs_5.svg';
import Card_clubs_6 from '../assets/clubs_6.svg';
import Card_clubs_7 from '../assets/clubs_7.svg';
import Card_clubs_8 from '../assets/clubs_8.svg';
import Card_clubs_9 from '../assets/clubs_9.svg';
import Card_clubs_10 from '../assets/clubs_10.svg';
import Card_clubs_jack from '../assets/clubs_jack.svg';
import Card_clubs_queen from '../assets/clubs_queen.svg';
import Card_clubs_king from '../assets/clubs_king.svg';
import Card_clubs_ace from '../assets/clubs_ace.svg';
import Card_diamonds_2 from '../assets/diamonds_2.svg';
import Card_diamonds_3 from '../assets/diamonds_3.svg';
import Card_diamonds_4 from '../assets/diamonds_4.svg';
import Card_diamonds_5 from '../assets/diamonds_5.svg';
import Card_diamonds_6 from '../assets/diamonds_6.svg';
import Card_diamonds_7 from '../assets/diamonds_7.svg';
import Card_diamonds_8 from '../assets/diamonds_8.svg';
import Card_diamonds_9 from '../assets/diamonds_9.svg';
import Card_diamonds_10 from '../assets/diamonds_10.svg';
import Card_diamonds_jack from '../assets/diamonds_jack.svg';
import Card_diamonds_queen from '../assets/diamonds_queen.svg';
import Card_diamonds_king from '../assets/diamonds_king.svg';
import Card_diamonds_ace from '../assets/diamonds_ace.svg';
import Card_hearts_2 from '../assets/hearts_2.svg';
import Card_hearts_3 from '../assets/hearts_3.svg';
import Card_hearts_4 from '../assets/hearts_4.svg';
import Card_hearts_5 from '../assets/hearts_5.svg';
import Card_hearts_6 from '../assets/hearts_6.svg';
import Card_hearts_7 from '../assets/hearts_7.svg';
import Card_hearts_8 from '../assets/hearts_8.svg';
import Card_hearts_9 from '../assets/hearts_9.svg';
import Card_hearts_10 from '../assets/hearts_10.svg';
import Card_hearts_jack from '../assets/hearts_jack.svg';
import Card_hearts_queen from '../assets/hearts_queen.svg';
import Card_hearts_king from '../assets/hearts_king.svg';
import Card_hearts_ace from '../assets/hearts_ace.svg';
import Card_spades_2 from '../assets/spades_2.svg';
import Card_spades_3 from '../assets/spades_3.svg';
import Card_spades_4 from '../assets/spades_4.svg';
import Card_spades_5 from '../assets/spades_5.svg';
import Card_spades_6 from '../assets/spades_6.svg';
import Card_spades_7 from '../assets/spades_7.svg';
import Card_spades_8 from '../assets/spades_8.svg';
import Card_spades_9 from '../assets/spades_9.svg';
import Card_spades_10 from '../assets/spades_10.svg';
import Card_spades_jack from '../assets/spades_jack.svg';
import Card_spades_queen from '../assets/spades_queen.svg';
import Card_spades_king from '../assets/spades_king.svg';
import Card_spades_ace from '../assets/spades_ace.svg';

import React from "react";

let ASSET_IMPORTS = {
    'back.svg': Card_back,
    'clubs_2.svg': Card_clubs_2,
    'clubs_3.svg': Card_clubs_3,
    'clubs_4.svg': Card_clubs_4,
    'clubs_5.svg': Card_clubs_5,
    'clubs_6.svg': Card_clubs_6,
    'clubs_7.svg': Card_clubs_7,
    'clubs_8.svg': Card_clubs_8,
    'clubs_9.svg': Card_clubs_9,
    'clubs_10.svg': Card_clubs_10,
    'clubs_jack.svg': Card_clubs_jack,
    'clubs_queen.svg': Card_clubs_queen,
    'clubs_king.svg': Card_clubs_king,
    'clubs_ace.svg': Card_clubs_ace,
    'diamonds_2.svg': Card_diamonds_2,
    'diamonds_3.svg': Card_diamonds_3,
    'diamonds_4.svg': Card_diamonds_4,
    'diamonds_5.svg': Card_diamonds_5,
    'diamonds_6.svg': Card_diamonds_6,
    'diamonds_7.svg': Card_diamonds_7,
    'diamonds_8.svg': Card_diamonds_8,
    'diamonds_9.svg': Card_diamonds_9,
    'diamonds_10.svg': Card_diamonds_10,
    'diamonds_jack.svg': Card_diamonds_jack,
    'diamonds_queen.svg': Card_diamonds_queen,
    'diamonds_king.svg': Card_diamonds_king,
    'diamonds_ace.svg': Card_diamonds_ace,
    'hearts_2.svg': Card_hearts_2,
    'hearts_3.svg': Card_hearts_3,
    'hearts_4.svg': Card_hearts_4,
    'hearts_5.svg': Card_hearts_5,
    'hearts_6.svg': Card_hearts_6,
    'hearts_7.svg': Card_hearts_7,
    'hearts_8.svg': Card_hearts_8,
    'hearts_9.svg': Card_hearts_9,
    'hearts_10.svg': Card_hearts_10,
    'hearts_jack.svg': Card_hearts_jack,
    'hearts_queen.svg': Card_hearts_queen,
    'hearts_king.svg': Card_hearts_king,
    'hearts_ace.svg': Card_hearts_ace,
    'spades_2.svg': Card_spades_2,
    'spades_3.svg': Card_spades_3,
    'spades_4.svg': Card_spades_4,
    'spades_5.svg': Card_spades_5,
    'spades_6.svg': Card_spades_6,
    'spades_7.svg': Card_spades_7,
    'spades_8.svg': Card_spades_8,
    'spades_9.svg': Card_spades_9,
    'spades_10.svg': Card_spades_10,
    'spades_jack.svg': Card_spades_jack,
    'spades_queen.svg': Card_spades_queen,
    'spades_king.svg': Card_spades_king,
    'spades_ace.svg': Card_spades_ace,
};
let constantToFileName = {
    'HEART': 'hearts',
    'CLUB': 'clubs',
    'DIAMOND': 'diamonds',
    'SPADE': 'spades',
    'JACK': 'jack',
    'QUEEN': 'queen',
    'KING': 'king',
    'ACE': 'ace'
}

const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let ASSET_NAMES = ['back.svg'];
SUITS.forEach(suit => RANKS.forEach(rank => ASSET_NAMES.push(suit + "_" + rank + ".svg")));

const assets = {};
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.onload = () => {
            assets[assetName] = asset;
            resolve();
        };
        asset.src = ASSET_IMPORTS[assetName];
    });
}

export const downloadAssets = () => downloadPromise;
export const getCardImage = (rank = null, suit = null) =>
    <img
        src={assets[(!(rank || suit) ? 'back'
            : constantToFileName[suit] + '_' + (constantToFileName[rank] ? constantToFileName[rank] : rank)) + '.svg'].src}
        className="mx-auto h-full"
        draggable={false} />;