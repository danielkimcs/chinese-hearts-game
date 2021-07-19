import React from "react";
import { isLegalMove } from "../../../../../../utility/helpers";
import { compareCards } from '../../../../../../utility/helpers';
import PlayableCard from './playableCard';

import { useDispatch, useSelector } from "react-redux";
import { sendFaceDownCard } from "../../../../../../services/user/actions";
import { getConfirmedHandStatus, getPlayerId } from "../../../../../../services/user/selectors";
import { getRoomPaused, getRoomState } from "../../../../../../services/room/selectors";

const Utility = require('../../../../../../../../shared/utility');
const Constants = require('../../../../../../../../shared/constants');

export const PlayerHand = ({ currentCards, playCard, currentTrick }) => {
    const dispatch = useDispatch();
    const pause = useSelector(getRoomPaused);
    const roomState = useSelector(getRoomState);
    const hasConfirmedHand = useSelector(getConfirmedHandStatus);
    const myPlayerId = useSelector(getPlayerId);
    const hasNotConfirmedHand = roomState === Constants.ROOM_STATES.ROUND_CONFIRM && !hasConfirmedHand;
    const sortedCurrentCards = currentCards.sort(compareCards);

    const setFaceDown = (card) => {
        if (card.faceDown) return;
        if (!Utility.isSpecialCard(card)) return;
        if (pause) return;

        dispatch(sendFaceDownCard(card));
    }

    return (
        <div className="grid justify-items-center">
            <div className="flex flex-row flex-wrap justify-center">
                {sortedCurrentCards.map((card) => {
                    if (!card.faceDown && hasNotConfirmedHand) {
                        let isSpecial = Utility.isSpecialCard(card);
                        return (
                            <PlayableCard card={card} enabled={isSpecial} onClick={() => setFaceDown(card)} />
                        );
                    } else if (!card.faceDown
                        && currentTrick
                        && currentTrick.currentTurnPlayerId === myPlayerId) {
                        let isLegal = isLegalMove(currentTrick, currentCards, card);
                        return (
                            <PlayableCard card={card} enabled={isLegal} onClick={() => playCard(card)} />
                        );
                    } else {
                        if (card.faceDown) return null;
                        return (
                            <PlayableCard card={card} enabled={false} />
                        );
                    }
                })}
            </div>
        </div>
    );
}