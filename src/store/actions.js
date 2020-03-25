// with this file you can do any changes in the state from hook components
// you can use (set, reset) arrow functions
// or create your custom arrow functions for each model with following the rules
import {models} from './models';

export const set = (model, payload, dispatch) => {
    return dispatch({
        type: `SET_${model.toString().toUpperCase()}`,
        payload: payload
    });
};
export const reset = (modelName, dispatch) => {
    const model = models.find(x=> x.name === modelName).model;
    dispatch({
        type: `RESET_${modelName.toString().toUpperCase()}`,
        payload: model
    });
    return model;
};

export const setTasks = (payload, dispatch) => {
    return dispatch({
        type: 'SET_TASKS',
        payload: payload
    });
};
export const resetTasks = (dispatch) => {
    const model = models.find(x=> x.name === 'tasks').model;
    dispatch({
        type: 'RESET_TASKS',
        payload: model
    });
    return model;
};


export const setGeneral = (payload, dispatch) => {
    return dispatch({
        type: 'SET_GENERAL',
        payload: payload
    });
};
export const resetGeneral = (dispatch) => {
    const model = models.find(x=> x.name === 'general').model;
    dispatch({
        type: 'RESET_GENERAL',
        payload: model
    });
    return model;
};

