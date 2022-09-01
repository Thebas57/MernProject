import { GET_POST_ERRORS } from "../actions/post.actions";

const initialState = {postErrors:[]};

export default function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POST_ERRORS:
      return {
        postErrors: action.payload
      }
    default:
      return state;
  }
}
