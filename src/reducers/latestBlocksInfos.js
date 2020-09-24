import Store from "../store/latestBlocksInfos";

export const initialState = Store;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "latestBlocksInfos": {
      if (action.data) {
        return {
          ...state,
          loading: false,
          error: null,
          latestBlocksInfos: action.data
        };
      }
      return initialState;
    }
    default:
      return state;
  }
}
