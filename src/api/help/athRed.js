const initialState = {
    authorizationStatus: "LOG_OUT",
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOG_IN":
        return {
          ...state,
          authorizationStatus: "LOG_IN",
        };
      case "LOG_OUT":
        return {
          ...state,
          authorizationStatus: "LOG_OUT",
        };
      default:
        return state;
    }
  };
  
  export default authReducer;