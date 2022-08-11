import { GET_USER } from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "test":
      console.log("aha");
      break;
    case GET_USER:
        return action.payload;
    default:
      return state;
  }
  console.log(typeof(state))
}
