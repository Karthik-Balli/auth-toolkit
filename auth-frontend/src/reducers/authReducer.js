export const authInitialState = {
  user: null,
  accessToken: null,
};

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return {
        user: null,
        accessToken: null,
      };
    default:
      return state;
  }
};
