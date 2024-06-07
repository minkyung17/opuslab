import React from 'react';
import PropTypes from 'prop-types';
import {chunk, compact} from 'lodash';

/**
* My imports
*
**/
import {ToolTip} from '../elements/ToolTip.jsx';
import * as util from '../../../../opus-logic/common/helpers/';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  './ReactBootstrapModal.jsx';


/**
 *
 * @desc - Each button on the modal that you see
 * @param {Object} props -
 * @return {JSX} - jsx button
 *
 **/
const CheckBox = ({text, checked, name, onClick, spacing,
  checkbox_state: disabled, className} = {}) => {
  if(!text) {
    return null;
  }

  return (
    <div className={` col-md-${spacing} `}>
      <div className="checkbox">
        <label>
          <input type="checkbox" {...{name, onChange: onClick,
            defaultValue: text, checked, disabled, className}} />
          {text}
        </label>
      </div>
    </div>
  );
};
CheckBox.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  spacing: PropTypes.number,
  checkbox_state: PropTypes.string,
  isChecked: PropTypes.bool,
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

/**
 *
 * @desc - Modal that you see when clicking on the 'Change Columns' button
 *
 **/
export class BootStrapModalCheckboxList extends React.Component {
  /**
   *
   * @desc - Proptypes with their defaults
   *
  **/
  static propTypes = {
    showModal: PropTypes.bool,
    nameKey: PropTypes.string,
    modalSize: PropTypes.string,
    resetNumber: PropTypes.number,
    numOfColumns: PropTypes.number,
    options: PropTypes.array.isRequired,
    isCheckedKey: PropTypes.string,
    displayNameKey: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    onClickCheckbox: PropTypes.func.isRequired
  };
  static defaultProps = {
    numOfColumns: 2,
    showModal: false,
    modalSize: 'large',
    options: []
  };

  /**
   * @desc - Configuration constant for Eligibility
   * @param {Object} props - properties passed in
   *
  **/
  constructor(props = {}) {
    super(props);
  }

  /**
   *
   * @desc - State variables
   *
  **/
  state = {
    showModal: this.props.showModal,
    checkedAllIsChecked: false
  };


  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentDidMount() {}


  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @param {Object} - showModal
   * @return {void}
   *
  **/
  componentWillReceiveProps({showModal, resetNumber, options} = {}) {
    this.setState({showModal});

    if(showModal!==this.state.showModal){
      this.setCheckAllStatus(options);
    }

    this.onNewResetNumber(resetNumber);
  }

  /**
   *
   * @desc - Set check all status on the visibility of the options coming in
   * @desc - OPUSDEV-3131 OPUSDEV-3416 
   * @param {Object} options - options for the checkboxes
   * @return {void}
   *
  **/
  setCheckAllStatus(options){

    let shouldCheckAllBeChecked = true;
    for(let each of options){
      if(each.visible===false){
        shouldCheckAllBeChecked = false;
        break;
      }
    }

    // OPUSDEV-3131 Check all should be checked (eg. UC Path Compensation Report)
    if(shouldCheckAllBeChecked!==this.state.checkedAllIsChecked){
      // Mimic check all event
      let evt = {target: {checked: shouldCheckAllBeChecked}}
      this.onClickAll(evt)
    }

    this.setState({options, checkedAllIsChecked: shouldCheckAllBeChecked})
  }

  /**
   *
   * @desc - If reset signal has been given uncheck checkall button #checkAllReset
   * @param {Object} resetNumber - # times "Reset Table" button was clicked
   * @return {void}
   *
  **/
  onNewResetNumber(resetNumber) {
    if(resetNumber !== this.props.resetNumber) {
      this.setState({checkedAllIsChecked: false});
    }
  }

  /**
   *
   * @desc - Class variables
   *
  **/
  numOfGrids = 12;
  cbox = 'checkbox-';
  optionsBeforeCheckAll = null;

  /**
   *
   * getNumOfRows() -
   * @desc - Lifecycle method for when component is fully rendered
   * @param {Number} length -
   * @param {Number} numOfColumns -
   * @return {Number} - number of rows
   *
  **/
  getNumOfRows(length, numOfColumns = this.props.numOfColumns) {
    return Math.ceil(length / numOfColumns);
  }

  /**
   * reformatOptionsIntoArrayColumns() -
   * @desc - transposed the list of lists into how its seen on screen
   * @param {Array} options -
   * @param {Array} numOfColumns -
   * @return {Object} transposedArray - self-explanatory
   *
  **/
  reformatOptionsIntoArrayColumns(options = []) {
    if(!options || !options.length) {
      return [];
    }

    //filter falsey values i.e. "", undefined, false
    let filtered_options = compact(options);
    let {length} = filtered_options;
    let num_of_rows = this.getNumOfRows(length);
    let chunkedArray = chunk(options, num_of_rows);
    let transposedArray = util.transpose(chunkedArray);
    return transposedArray;
  }

  /**
   *
   * @desc - Show spinner and disable checkboxes while onClickFunc is inProgress
   * @param {Object} evt -
   * @param {Function} onClickFunc -
   * @return {void}
   *
  **/
  closeModal = () => this.setState({ showModal: false })

  /**
   *
   * @desc - creates a name to checked hash and returns it
   * @param {Object} evt -
   * @return {void}
   *
  **/
  onClickCheckbox = (evt) => {
    const {target: {checked, name}} = evt;
    let checkedHash = {[name]: checked};
    this.props.onClickCheckbox(evt, checkedHash);
  }

  /**
   *
   * @desc - If checkAll is checked return a hash of object with all option
   *  names with values as true.  If not save the last options' state and use
   *  that to create the checked hash that has the state of the checkboxes before
   *  Check All was clicked
   * @param {Bool} checkAllBoxIsChecked -
   * @return {Object} checkedHash - if the hash is checked
   *
  **/
  getCheckAllHash(checkAllBoxIsChecked) {
    let {options} = this.props;
    let checkedHash = {};

    if(checkAllBoxIsChecked) {
      //Save current version of checkbox state
      this.optionsBeforeCheckAll = util.cloneObject(options);

      //Create hash of objects with value(visibility as true)
      let allNames = options.map(({name}) => name);
      checkedHash = util.fillObject(allNames, true);
    } else {
      //Get old checkbox
      options = this.optionsBeforeCheckAll;

      //Create object with name to visibility of previous checkboxes before checking
      //Check All
      checkedHash = util.arrayOfObjectsToKVObject(options, 'name', 'visible');
    }

    return checkedHash;
  }

  /**
   *
   * @desc
   * @param {Object} evt -
   * @return {void}
   *
  **/
  onClickAll = (evt) => {
    const {target: {checked}} = evt;

    let checkedHash = this.getCheckAllHash(checked);
    this.setState({checkedAllIsChecked: checked});
    this.props.onClickCheckbox(evt, checkedHash);
  }

  /**
   *
   * @desc
   * @return {JSX} - jsx
   *
  **/
  render() {
    let {props: {isCheckedKey, nameKey, displayNameKey, numOfColumns,
      options, closeModal}, state: {checkbox_state, showModal}} = this;
    const spacing = this.numOfGrids / numOfColumns;
    let transposedOptionsArray = this.reformatOptionsIntoArrayColumns(options);

    return (
      <Modal show={showModal} onHide={closeModal} className="modal-lg">
        <Header closeButton>
          <Title className="modal-title" id="gridSystemModalLabel">
            Change Columns
          </Title>
        </Header>
        <Body>

          <CheckBox name="all" text="Check All" className="check-all" spacing={0}
            onClick={this.onClickAll} checked={this.state.checkedAllIsChecked} />

          <div className="modal-body change-columns">
            {transposedOptionsArray.map((array, rowIndex) => {
              return (<div className="row" key={rowIndex}>
                {array.map((each, index) => {
                  if(!each) {
                    return null;
                  }
                  let {
                    [nameKey]: name,
                    [isCheckedKey]: checked,
                    [displayNameKey]: displayName
                  } = each;
                  return (
                    <div key={index}>
                      <CheckBox key={this.cbox + index} text={displayName}
                        {...{name, checkbox_state, checked, spacing}}
                        onClick={this.onClickCheckbox} />
                      <ToolTip />
                    </div>);
                })
                }
              </div>);
            })
            }
          </div>
        </Body>
        <Footer>
          <Dismiss onClick={closeModal} className="btn btn-primary left">
            Close
          </Dismiss>
        </Footer>
      </Modal>
    );
  }
}
