import { RESULTS_LOADED, RESULTS_LOADING, UPDATE_CURRENT, UPDATE_FILTERS } from "../constants/action-types";

export function getResults(queryString = "") {
  return async function(dispatch) {
    const apiPath = drupalSettings.searchReact.url;
    let i=0;
    let results=[];
    const response = await fetch(`${apiPath}/api/search/json${queryString}`);
    const json = await response.json();
    results.push(...json);
    return dispatch({ type: RESULTS_LOADED, payload: results });
  };
}

export function updateResults() {
  return function(dispatch) {
    return dispatch({ type: RESULTS_LOADING, payload: false });
  }
}

export function updateCurrent(page) {
  return function(dispatch) {
    return dispatch({ type: UPDATE_CURRENT, payload: page });
  }
}

export function updateFilters(query) {
  return function(dispatch) {
    return dispatch({ type: UPDATE_FILTERS, payload: query });
  }
}

// ToDo: Helper function, should move to own file
export function objectToQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}