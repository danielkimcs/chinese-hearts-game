import { combineReducers } from "redux";
import { RESET_STORE } from "./constants";
import room from "./room/roomReducer";
import user from "./user/userReducer";

const appReducer = combineReducers({ room, user });

const rootReducer = (state, action) => {
    if (action.type === RESET_STORE) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}

export default rootReducer;
