import Cookies from "js-cookie"

export const userReducer = (
  state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};
