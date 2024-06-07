import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @desc - Header that wraps the page
 * @param {Function} done - when 'done' is executed all the tests will start
 * @return {Object}
 *
 **/
export const Header = ({name, results, children}) => {
  return (
    <div className="tab-header">
      <div className="row-fluid"> 
        <div className=" ">
          <h1> {name} &nbsp; &nbsp;
            <div className="ui input icon search-profile hidden-print">
              {children} {results}
            </div>
          </h1>
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
