import React from "react";
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getResults, updateResults, updateCurrent, updateFilters, objectToQueryString } from "../redux/actions/actions";
import ReactPaginate from 'react-paginate';
import { stringify } from "query-string";

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
];

/**
 * Lists out persons.
 */
class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    currentSearch: this.props.query.search,
    query: this.props.query,
    order: this.initialSort(this.props.query.sort_by), // sortOptions[0]
    filters: {
      country: this.findTerm(drupalSettings.searchReact.country, this.props.query.country),
      language: this.findTerm(drupalSettings.searchReact.language, this.props.query.language),
      process: this.findTerm(drupalSettings.searchReact.process, this.props.query.process),
      substance: this.findTerm(drupalSettings.searchReact.substance, this.props.query.substance),
    },
  }

  initialSort(sort) {
    if (typeof sort !== 'undefined') {
      let finding = sortOptions.find(x => x.value === sort);
      return finding;
    }
    else {
      return sortOptions[0];
    }
  }

  changeSearch = (e) => {
    let query = this.state.query;
    query['search'] = e.target.value;
    this.setState({currentSearch: e.target.value, filter: query});
  }

  handlePageClick = (e) => {
    let query = this.state.query;
    var queryString = objectToQueryString(query);
    this.props.history.push(`?${queryString}&page=${e.selected}`);
    this.props.updateCurrent(e.selected);
  }

  handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      this.updateResults(query);
    }
  }

  handleSearchButton = (e) => {
    this.updateResults(query);
  }

  handleSelect = (e, filter) => {
    let query = this.state.query;
    let filters = this.state.filters;
    if (e === null) {
      if (query.hasOwnProperty(filter)) {
        delete query[filter];
        delete filters[filter];
      }
    }
    else {
      query[filter] = e.value;
      if (filter !== 'sort_by') {
        filters[filter] = e;
      }
    }
    if (filter === 'sort_by') {
      this.setState ({
        order: e,
      });
    }
    else {
      this.setState ({
        filters: filters,
      });
    }
    this.props.updateFilters(query);
    this.setState ({
      query: query,
    });
    this.updateResults(query);
  }

  updateResults = (query) => {
    var queryString = objectToQueryString(query);
    this.props.history.push(`?${queryString}`);
    this.props.getResults(`?${queryString}`);
  }

  clearquery = () => {
    this.setState ({
      query: {},
      filters: [],
      currentSearch: '',
      order: sortOptions[0],
    });
    this.updateResults([]);
  }

  findTerm(arr, value) {
    if (typeof value !== 'undefined'){
      let finding = arr.find(x => x.tid == value);
      return {'value': value, 'label': finding.name};
    }
    else {
      return 'undefined';
    }
  }

  resultsCount(number, page, itemsPerPage = 20) {
    let last = itemsPerPage*page + 20 < number ? itemsPerPage*page + 20 : number;
    let first = last == 0 ? 0 :itemsPerPage*page + 1;
    return (
      <div className="total-results">
        Displaying {first} - {last} of {number} documents
      </div>
    );
  }

  render() {
    let strSearch = this.state.currentSearch == null ? '' : this.state.currentSearch;
    let query = this.state.query;
    document.title = `Document Library | UN Peacemaker`;

    // Display main page.
    return (
      <div className="search-list">
        { typeof this.props.results !== 'undefined' &&
          <div className="search-container mb-5">
            <div className="search-search mb-5 p-3 bg-light">
              <div className="container">
                <div className="input-wrapper row">
                  <input 
                    type="text" 
                    id="edit-search" 
                    name="search" 
                    size="30" 
                    maxLength="128"
                    value={strSearch}
                    onChange={this.changeSearch}
                    onKeyUp={this.handleSearchKeyUp.bind(this)}
                    ref="SearchInput"
                    placeholder="Search by keywords"
                    className="col"
                    />
                  <span
                    className="btn btn-primary col"
                    onClick={() => {
                      this.updateResults(query)
                    }}>
                    Search
                  </span>
                </div>
                <div className="query-container row">
                  <div className="query-wrapper col">
                    <div className="row">
                      <Select 
                        onChange={event => this.handleSelect(event, 'country')} 
                        options={drupalSettings.searchReact.country.map( 
                          term => ({value: term.tid, label: term.name})
                        )}
                        placeholder="By Country/Territory"
                        isClearable='true'
                        name="country"
                        value={this.state.filters.country}
                        className="col"
                        classNamePrefix="select"
                      />
                      <Select 
                        onChange={event => this.handleSelect(event, 'language')} 
                        options={drupalSettings.searchReact.language.map( 
                          term => ({value: term.tid, label: term.name})
                        )}
                        placeholder="By Language"
                        isClearable='true'
                        name="language"
                        value={this.state.filters.language}
                        className="col"
                        classNamePrefix="select"
                      />
                      <Select 
                        onChange={event => this.handleSelect(event, 'process')} 
                        options={drupalSettings.searchReact.process.map( 
                          term => ({value: term.tid, label: term.name})
                        )}
                        placeholder="By Process"
                        isClearable='true'
                        name="process"
                        value={this.state.filters.process}
                        className="col"
                        classNamePrefix="select"
                      />
                      <Select 
                        onChange={event => this.handleSelect(event, 'substance')} 
                        options={drupalSettings.searchReact.substance.map( 
                          term => ({value: term.tid, label: term.name})
                        )}
                        placeholder="By Substance"
                        isClearable='true'
                        name="substance"
                        value={this.state.filters.substance}
                        className="col"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                  <span
                    className="btn search-clear col"
                    onClick={() => {this.clearquery()}}>
                    Clear All
                  </span>
                </div>
              </div>
            </div>
            { Object.entries(query).length > 0 ? 
              <>
                { this.props.loaded ? 
                  <>
                    <div className="search-list">
                      <div className="search-list-header justify-content-between d-flex mb-3">
                        {this.resultsCount(this.props.pager.count, this.props.pager.page)}
                        <div className="row">
                          <div className="col-auto">
                            <label htmlFor="sort-select" className="col-form-label">Sort by:</label>
                          </div>
                          <div className="col-auto">
                            <Select
                              id="sort-select"
                              onChange={event => this.handleSelect(event, 'sort_by')} 
                              options={sortOptions}
                              name="sort"
                              value={this.state.order}
                              classNamePrefix="select"
                            />
                          </div>
                        </div>
                    </div>
                      {this.props.results.map( (result, index) =>{
                        var smallHTML = [];
                        var i=0;
                        if (result.field_date !== "") {smallHTML[i++] = result.field_date.substring(0,4)}
                        if (result.field_author !== "") {smallHTML[i++] = 'Author: ' + result.field_author}
                        if (result.field_language !== "") {smallHTML[i++] = result.field_language}
                        smallHTML = smallHTML.join(' | ');
                        return (
                        <div className={`search-item mb-3 ${index%2 == 0 ? 'even' : 'odd'}`} key={index}>
                          <small>{smallHTML}</small>
                          <h3><a href={`/node/${result.nid}`} target="_blank">{result.title}</a></h3>
                          <div dangerouslySetInnerHTML={{__html: result.body}} />
                        </div>);
                        }
                      )}
                    </div>
                    <nav className="search-pager"  aria-label="Page navigation">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={this.handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={this.props.pager.pages}
                        forcePage={this.props.pager.page}
                        previousLabel="< Prev"
                        renderOnZeroPageCount={null}
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        disabledClassName="disabled"
                      />
                    </nav>
                  </>
                :
                  <div>Loading...</div>
                    }
                  </>
              :
                <div
                  dangerouslySetInnerHTML={{__html: drupalSettings.searchReact.intro}}
                /> 
            }
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pager: state.pager,
    results: state.currentResults,
    search: state.search,
    query: state.query,
    loaded: state.dataLoaded
  };
}

export default connect(
  mapStateToProps,
  { getResults, updateResults, updateCurrent, updateFilters }
)(withRouter(Landing));
