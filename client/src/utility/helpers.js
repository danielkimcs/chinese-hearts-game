const Constants = require('../../../shared/constants');


export const isLegalMove = (currentTrick, currentHand, playedCard) => {
    if (!currentTrick) return false;
    if (!currentTrick.leadingSuit.length || playedCard.suit === currentTrick.leadingSuit) return true;
    return !currentHand.filter(card => card.suit === currentTrick.leadingSuit).length;
}

export const renderPlayerList = ({ myUsername, players }) => {
    let teamPlayers = players.filter(player =>
        player.currentTeam.length > 0
        && player.nextPlayerUsername.length > 0);
    if (teamPlayers.length !== Constants.REQUIRED_NUM_PLAYERS) {
        return players.filter(player => player.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED);
    }
    else { // Players are now divided in teams so display in proper playing order
        let usernameToPlayerObj = {};
        teamPlayers.forEach(playerObj => usernameToPlayerObj[playerObj.username] = playerObj);

        let myPlayerObj = teamPlayers.filter(player => player.username === myUsername)[0];
        let sortedTeamPlayers = [myPlayerObj];
        let currentPlayerUsername = sortedTeamPlayers[0].nextPlayerUsername;
        while (currentPlayerUsername.localeCompare(sortedTeamPlayers[0].username) !== 0) {
            let currentPlayerObj = usernameToPlayerObj[currentPlayerUsername];
            sortedTeamPlayers.push(currentPlayerObj);
            currentPlayerUsername = currentPlayerObj.nextPlayerUsername;
        }

        return sortedTeamPlayers;
    }
}

export const compareCards = (card1, card2) => {
    if (card1.suit !== card2.suit) {
        return Constants.CARD_TYPE.SUITS[card2.suit] - Constants.CARD_TYPE.SUITS[card1.suit];
    } else {
        return Constants.CARD_TYPE.RANKS[card2.rank] - Constants.CARD_TYPE.RANKS[card1.rank];
    }
}