const SET_COUNT = "SET_COUNT";

const defaultState = {
    count: 0
}

export default function reposReducer(state = defaultState, action: any) {
    switch (action.type) {
        case SET_COUNT:
            return {
                ...state,
                count: action.payload
            }
        default:
            return state
    }
}

export const setCount = (count: any) => ({type: SET_COUNT, payload: count});