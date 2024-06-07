import React from 'react';
import PropTypes from 'prop-types';
import {every, values} from 'lodash';

/******************************************************************************
*
* @desc - Jquery UI Dropdown
*
*******************************************************************************/
export class JQueryUIMultiSelect extends React.Component {
  static propTypes = {
    uiConfig: PropTypes.object,
    prepopulate: PropTypes.bool,
    widgetWidth: PropTypes.string,
    selectOptions: PropTypes.array,
    resetNumber: PropTypes.number,
    tableClassName: PropTypes.string,
    name: PropTypes.string.isRequired,
    closeMultiSelect: PropTypes.string,
    checkedSelectOptions: PropTypes.object,
    columnName: PropTypes.string.isRequired,
    initialCheckState: PropTypes.bool,
    onSelectInputChange: PropTypes.func.isRequired,
    modalId: PropTypes.string
  };

  static defaultProps = {
    prepopulate: true,
    selectOptions: [],
    widgetWidth: '75',
    tableClassName: '',
    initialCheckState: true,
    checkedSelectOptions: {},
    onSelectInputChange: ()=>{},
    closeMultiSelect: 'isScrollingSideWays',
    modalId: ''
  };

  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentWillMount() {
    //Lets keep track of the whether the select options are true or false
    this.setInitialCheckboxMap();
  }

  /**
   *
   * @desc - Lifecycle method for when component is fully rendered
   * @return {void}
   *
  **/
  componentDidMount() {
    this.activateMultiSelect();

    //If the datatable is scrolling sideways lets close all the modals
    $(this.component_selector).on(this.props.closeMultiSelect, () =>{
      if(this.$widget) {
        this.$widget.multiselect('close');
      }
    });
  }

  /**
   *
   * @desc -
   * @param {Object} - checkedSelectOptions
   * @return {void}
   *
  **/
  componentWillReceiveProps({checkedSelectOptions} = {}) {
    this.checkedSelectOptions = checkedSelectOptions;

    if(this.props.prepopulate) {
      this.checkedSelectOptions = this.fillBlankCheckBoxOptions(
        this.checkedSelectOptions);
    }
  }

  /**
   *
   * @desc - If not destroyed, multiselect will rerender multiple times
   *  ** Disabling this because it screws up with Bulk Appointments going to next page
   *  and messing up active tables
   * @return {void}
   *
  **/
  componentWillUnmount() {
    // $(this.component_selector).map((index, each) => {
    //   try{
    //     $(each).multiselect('destroy');
    //   }catch(e) {
    //     //
    //   }
    // });
  }

  /**
  *
  * @desc - Instance variables
  *
  **/
  checkedSelectOptions = this.props.checkedSelectOptions;

  /**
   *
   * @desc - If selectOptionsClicked doesnt have values prepopulate them
   * @param {Object} checkbox -
   * @param {Array} options -
   * @param {Boolean} prefillValue -
   * @return {Object} checkbox
   *
  **/
  fillBlankCheckBoxOptions(checkbox, options = this.props.selectOptions,
    {prefillValue = true} = {}) {

    for(let option of options) {
      //If it's not defined prefill it
      if(checkbox[option] === undefined) {
        checkbox[option] = prefillValue;
      }
    }
    return checkbox;
  }

  /**
   *
   * @desc - If selectOptionsClicked has values
   * @return {Object} this.checkedSelectOption -
   *
  **/
  setInitialCheckboxMap() {
    let {checkedSelectOptions = {}, selectOptions, initialCheckState} = this.props;
    this.fillBlankCheckBoxOptions(this.checkedSelectOptions, selectOptions, {
      prefillValue: initialCheckState});

    return this.checkedSelectOptions;
  }

  /**
   *
   * @desc - get all the checkboxes options that are true
   * @param {Object} currentSelectValues - Current boolean values telling
   *  whether an select option is clicked or not
   * @return {void}
   *
  **/
  getCheckedSelectOptionValues(currentSelectValues) {
    let positive_values = [];

    for(let key in currentSelectValues) {
      if(currentSelectValues[key] === true) {
        positive_values.push(key);
      }
    }
    return positive_values;
  }

  /**
   *
   * @desc - Get filterMap for the opotions that have been checked
   * @param {Event} event - click event
   * @return {Object} filterMap - Key Value of options whether they were
   *   clicked(true) or not clicked(false)
   *
  **/
  getFilterMap(event) {
    //Turn HTMLOptionsCollection into Array
    let options = Array.from(event.target.options);
    let filterMap = {};

    //Lets gather up all options and set if they were checked
    options.map((each) => {
      filterMap[each.value] = each.selected;
    });

    return filterMap;
  }//end function getFilterMap(eve...

  /**
   *
   * @desc - initialize jqeury MultiSelect
   * @return {void}
   *
  **/
  activateMultiSelect() {
    //let _this = this;
    const {columnName, widgetWidth, tableClassName, name, modalId} = this.props;
    let tableSelector = tableClassName ? `.${tableClassName}` : '';
    this.component_selector = `${tableSelector} select#${columnName}`;

    //If we have multiple tables change the selector
    if(this.props.name) {
      this.component_selector = `${tableSelector} select[name=${name}]`;
    }

    if (modalId !== '') {
      this.createModalMultiSelect({columnName, widgetWidth,
        component_selector: this.component_selector, modalId});
    }
    else {
      this.createMultiSelect({columnName, widgetWidth,
        component_selector: this.component_selector});
    }
  }

  /**
   *
   * @desc - Generate the actual select
   * @param {Object} - args
   * @return {JSX}
   *
  **/
  createMultiSelect = ({component_selector, widgetWidth, columnName} = {}) => {
    //Creates multiselect capability
    let $widget = this.$widget = $(this.component_selector).multiselect({
      minWidth: widgetWidth,
      //When clicking EACH select option
      click: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);

        //The current options for whatever was clicked are not correctly set in
        //'event.target.options' so making sure they are set with code below
        this.checkedSelectOptions[ui.value] = ui.checked;

        this.prepareSelectData(columnName, this.checkedSelectOptions);
      },
      //When we want 'ALL' select options
      checkAll: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);
        let filterBoolArray = values(this.checkedSelectOptions);
        //If all values are checked send false so we dont filter on this column.
        //Else send checkboxes w/ correct bool
        let filter_values = every(filterBoolArray) ? false : this.checkedSelectOptions;

        //Send 'false' as 'filter_values' to signal there are
        //no filters for this column
        this.prepareSelectData(columnName, filter_values);
      },
      //When we want 'NONE' select options
      uncheckAll: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);

        //Get all the people who dont have values for the option
        //this.checkedSelectOptions[null] = true;

        this.prepareSelectData(columnName, this.checkedSelectOptions);
      }
    }).multiselectfilter();

    return $widget;
  }

  /**
   *
   * @desc - Generate the actual select
   * @param {Object} - args
   * @return {JSX}
   *
  **/
  createModalMultiSelect = ({component_selector, widgetWidth, columnName, modalId} = {}) => {
    //Creates multiselect capability
    let $widget = this.$widget = $(this.component_selector).multiselect({
      minWidth: widgetWidth,
      //When clicking EACH select option
      click: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);

        //The current options for whatever was clicked are not correctly set in
        //'event.target.options' so making sure they are set with code below
        this.checkedSelectOptions[ui.value] = ui.checked;

        this.prepareSelectData(columnName, this.checkedSelectOptions);
      },
      //When we want 'ALL' select options
      checkAll: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);
        let filterBoolArray = values(this.checkedSelectOptions);
        //If all values are checked send false so we dont filter on this column.
        //Else send checkboxes w/ correct bool
        let filter_values = every(filterBoolArray) ? false : this.checkedSelectOptions;

        //Send 'false' as 'filter_values' to signal there are
        //no filters for this column
        this.prepareSelectData(columnName, filter_values);
      },
      //When we want 'NONE' select options
      uncheckAll: (event, ui) => {
        //Getting values for the select options
        this.checkedSelectOptions = this.getFilterMap(event, ui);

        //Get all the people who dont have values for the option
        //this.checkedSelectOptions[null] = true;

        this.prepareSelectData(columnName, this.checkedSelectOptions);
      },
      appendTo: '#' + modalId
    }).multiselectfilter();

    return $widget;
  }


  /**
   *
   * @desc - Prepares data for multiselect options then hands data to parent
   *  select function to run the filter
   * @param {String} columnName - name of column for which options are checked
   * @param {Object} filterMap - object of options telling us which options are checked
   * @param {Function} parentOnSelectFunc - function from parentthats called when
   *  this function is executed
   * @return {void}
   *
  **/
  prepareSelectData(columnName, filterMap, parentOnSelectFunc = this.props.onSelectInputChange) {
    //Pass the data we generated back to the parent component to be handled
    parentOnSelectFunc(columnName, filterMap);
  }

  render() {
    //If array is empty then there are no options
    let {selectOptions = [], resetNumber} = this.props;
    if(!selectOptions || selectOptions.length === 0) {
      return null;
    }

    let {columnName, name, tableClassName} = this.props;
    let currentSelectOptions = this.getCheckedSelectOptionValues(
      this.checkedSelectOptions);

    return (
      <div className={`${tableClassName}`}>
        <select key={`${columnName}-${resetNumber}`} multiple id={columnName}
          {...{name}} className=" form-control " defaultValue={currentSelectOptions}>

          {selectOptions.map((option_text) =>
            (<option key={`${columnName}-${option_text}`} value={option_text}>
              {option_text}
            </option>)
          )}
        </select>
      </div>
    );
  }
}
