const initialState = {
    allUsers: [],
    allUsersPages: 0,
    twentyUsers: [],
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_TWENTY_USERS":
        return {
          ...state,
          twentyUsers: action.payload,
        };
      case "FETCH_ALL_USERS":
        return {
          ...state,
          allUsers: action.payload,
        };
      case "SET_TOTAL_PAGES":
        return {
          ...state,
          allUsersPages: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;