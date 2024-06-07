import React from 'react';
import PropTypes from 'prop-types';

//My imports
import EndowedChairSummaryPage from './EndowedChairSummaryPage.jsx';

/**
 *
 * @desc - Outside wrapper and sidebar for case summar page
 * @return {JSX} - Case Summary Page
 *
**/
export default class EndowedChairSummaryWrapper extends React.Component {
  static propTypes = {

  }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Case Summary Wrapper
   *
   **/
  constructor(props) {
    super(props);
  }

  state = {

  };

  /**
   *
   * @desc - initializes sidebar and get url arguments on mount
   * @return {void}
   *
   **/
  componentWillMount() {

  }

  /**
   *
   * @desc - Reloads case summary page
   * @param {Object} endowedChairSummaryDataFromAPI - props for this Component
   * @return {void}
   *
   **/
  componentWillReceiveProps = (props) => {
    // console.log(props)
  }

  /**
  * Set up the Logic class w/ passed in props immediately
  *
  **/
  // Logic = new AdminCompSummary(this.props);


  /**
  *
  * @desc - Get outside border, sidebar and page
  * @return {JSX} jsx
  *
  **/
  render() {


    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <EndowedChairSummaryPage {...{...this.props}}/>
          </div>
        </div>
      </div>
    );
  }
}
