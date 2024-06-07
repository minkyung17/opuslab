import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @desc - Header that wraps the page
 * @param {Function} done - when 'done' is executed all the tests will start
 * @return {Object}
 *
 **/
export const Header = ({name, results, children, headerUIDText, headerEmailText}) => {
  return (
    <div className="page-header ">
      <div className="row-fluid">
        <div className=" ">
          <h1 className="no-margin-bottom	">
            <img src="../images/profile-sm.png" alt="profile pic" />
            Profiles {name} &nbsp; &nbsp;
            <div className="ui input icon search-profile hidden-print">
              {children} {results}
            </div>
          </h1>
          {name!=='' ?
            <div className='small indent-50'>
              {headerUIDText ? 'UID: '+headerUIDText : null}
              {headerUIDText ? <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> : null}
              {headerEmailText ? headerEmailText : null}
            </div>
          :
            null
          }
        </div>
      </div>
    </div>
  );
};
Header.propTypes = {
  name: PropTypes.string,
  results: PropTypes.string,
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

/**
 *
 * @desc - Lets get access token, globalData, and adminData before tests start
 * @param {Function} done - when 'done' is executed all the tests will start
 * @return {JSX}
 *
 **/
export const Sidebar = ({sideBarLinks = [], onClick}) => {
  return (
    <ul id="leftnav" className="nav nav-pills nav-stacked">
      {sideBarLinks.map(({name, title}) =>
        <li key={title} className=" sidebar-link ">
          <a {...{name, id: name, onClick}} href="#"> {title} </a>
        </li>)}
    </ul>);
};
Sidebar.propTypes = {
  sideBarLinks: PropTypes.array,
  onClick: PropTypes.func.isRequired
};
