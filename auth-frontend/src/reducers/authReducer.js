export const authInitialState = {
    user: null,
    accessToken: null,
}

export const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload.user,
                accessToken: action.payload.accessToken,
            };
        case 'LOGOUT':
            return {
                user: null,
                accessToken: null,
            };
        default: 
            return state;
    }
};