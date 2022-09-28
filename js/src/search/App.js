import React, { Component } from 'react';
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { getResults, updateFilters } from "./redux/actions/actions";
import queryString from 'query-string';
import Landing from  "./Pages/Landing";
import ScrollToTop from "./components/ScrollToTop"
import { basePath } from "./data/constants";

class App extends Component {

  constructor(props) {
    super(props);

    this.history = createBrowserHistory();
  }

  render() {
    let params = queryString.parse(window.location.search)
    let query = {};
    document.body.classList.add('document-library');
    Object.keys(params).forEach(key => {
      query[key] = params[key];
    });
    this.props.updateFilters(query);
    if (Object.entries(query).length > 0) {
      this.props.getResults(`?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`);
    }
    return (
      <BrowserRouter>
        <ScrollToTop>
          <div className='search-wrapper'>
            <Switch>
              <Route
                exact
                path={`${basePath}`}
                render={() => 
                  <Landing query={query}/>
                } />
            </Switch>
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    loaded: state.dataLoaded
  };
}

export default connect(
  mapStateToProps,
  { getResults, updateFilters }
)(App);
