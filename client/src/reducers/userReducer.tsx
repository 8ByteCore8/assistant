const SET_AUTH_STATUS = "SET_AUTH_STATUS";

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
        default:
            return state
    }
}

export const setAuthorizationStatus = (status: any) => ({type: SET_AUTH_STATUS, payload: status});