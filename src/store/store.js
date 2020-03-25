import React from 'react';
import {models} from './models';
import { reducer } from './reducer';
export const Store = React.createContext();

// initial object of models
// get the current state from localstorage or model default values 
//you don't need to do any changes in this file 'everything works dynamically'

const initialState = getModels();

function getModels(){
  const state = {};
  const modelKeys = models.map(x=> x.name);
  modelKeys.forEach(item => {
    state[item] = getCurrentData(item);
  });
  return state;
}
function getCurrentData(model){
  const item = models.find(x=> x.name === model);
  return (item.storage ?
    localStorage.getItem(model) !== undefined && localStorage.getItem(model) != null ?
    JSON.parse(localStorage.getItem(model))
    : item.model
  : item.model);
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}