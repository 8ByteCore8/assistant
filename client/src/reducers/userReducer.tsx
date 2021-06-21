const SET_AUTH_STATUS = "SET_AUTH_STATUS";
const SET_USER_DATA = "SET_USER_DATA";

const defaultState = {
    authorizationStatus: "needConfirmation"
}

export default function userReducer(state = defaultState, action: any) {
    switch (action.type) {
        case SET_AUTH_STATUS:
            return {
                ...state,
                authorizationStatus: action.payload
            }
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export const setAuthorizationStatus = (payload: any) => ({type: SET_AUTH_STATUS, payload});
export const setUserData = (payload: any) => ({type: SET_USER_DATA, payload});