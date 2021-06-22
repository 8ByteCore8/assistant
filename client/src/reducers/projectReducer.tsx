const SET_PROJECT_LIST = 'SET_PROJECT_LIST';

const defaultState = {
    list: []
}

export default function projectReducer(state = defaultState, action: any) {
    switch (action.type) {
        case SET_PROJECT_LIST:
            return {
                ...state,
                list: action.payload
            }
        default:
            return state
    }
}

export const setProjectList = (payload: any) => ({type: SET_PROJECT_LIST, payload});