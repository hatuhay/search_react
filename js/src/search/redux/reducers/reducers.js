import { RESULTS_LOADED, RESULTS_LOADING, UPDATE_CURRENT, UPDATE_FILTERS } from "../constants/action-types";

const initialState = {
  pager: [],
  results: [],
  currentResults: [],
  query: [],
  dataLoaded: false,
};

function rootReducer(state = initialState, action) {
  var results;
  var lastItem;
  var page;
  var pages;
  var count;
  var currentResults;
  const pageSize = 20;
  switch (action.type) {
    case RESULTS_LOADED:
      results = action.payload;
      results.sort(function (a, b) {
        if (a.changed > b.changed) {
          return -1;
        }
        if (a.changed < b.changed) {
          return 1;
        }
        return 0;
      });
      count = results.length;
      pages = count / pageSize;
      page = 0;
      lastItem = (page+1)*pageSize < count ? (page+1)*pageSize : count;
      currentResults = results.slice(page*pageSize, lastItem);
      return Object.assign({}, state, {
        results: results,
        currentResults: currentResults,
        dataLoaded: true,
        pager: {
          page: 0,
          pages: Math.trunc(pages)+1,
          count: count,
        },
      });
    case UPDATE_CURRENT:
      results = state.results;
      page = action.payload;
      lastItem = (page+1)*pageSize < results.length ? (page+1)*pageSize : results.length;
      currentResults = results.slice(page*pageSize, lastItem);
      return Object.assign({}, state, {
        currentResults: currentResults,
        pager: {
          page: page,
          pages: state.pager.pages,
          count: results.length,
        },
      });
    case RESULTS_LOADING:
      return Object.assign({}, state, {
        dataLoaded: false,
      });
    case UPDATE_FILTERS:
      return Object.assign({}, state, {
        query: action.payload,
      });
  }
  return state;
};

export default rootReducer;
