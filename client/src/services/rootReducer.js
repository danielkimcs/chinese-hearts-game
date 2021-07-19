import { combineReducers } from "redux";
import room from "./room/roomReducer";
import user from "./user/userReducer";

export default combineReducers({ room, user });
