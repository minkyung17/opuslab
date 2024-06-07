/**
 * Created by mosesjung on 8/15/19.
 **/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import APIFailureModal from '../../cases-admin/APIFailureModal.jsx';
import {StarIcon, OutlinedStarIcon, EditIcon, DeleteIcon}
  from '../../common/components/elements/Icon.jsx';
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../../common/components/bootstrap/ReactBootstrapModal.jsx';
import {DropdownButton, FormControl, FormGroup, MenuItem, Glyphicon
  } from 'react-bootstrap';
import {ShowIf, HideIf} from '../../common/components/elements/DisplayIf.jsx';
import {timePeriods} from '../../../opus-logic/datatables/constants/CompletedCasesConstants.js'

import * as util from '../../../opus-logic/common/helpers/';
import {filteredViewConstants} from '../constants/FilteredViewConstants.js';
import {proposedActionFlags} from '../../../opus-logic/datatables/constants/DatatableConstants'

/*******************************************************************************
 *
 * FilteredView()
 * @desc - React FilteredView
 *
 ******************************************************************************/
export default class FilteredView extends React.Component {
  constructor(props) {
    super(props);

  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    title: 'Loading Views...',
    openCrudModal: false,
    filters: [],
    formattedColumnOptions: [],
    currentView: {},
    dataColumnFilters: {},
    showOnlyFilters: {},
    views: [],
    errorMessage: null,
    maxViews: false,
    pageName: '',
    showShowOnlyFilters: true,
    showTimePeriodFilter: false,
    timePeriod: '',
    timePeriodDisplay: null,
    showOKModal: false,
    loadedOnce: false,
    hideAddNewButton: false
  };

  componentWillReceiveProps(props) {
    // console.log(props.dataTableConfiguration.dataColumnFilters.outsideFilters)
    if(props.dataTableConfiguration){
      this.setState({dataTableConfiguration: props.dataTableConfiguration})
      // console.log(props.dataTableConfiguration.timePeriod)
      if(props.dataTableConfiguration.pageName==="Completed"){
        this.setState({showTimePeriodFilter: true, timePeriod: props.dataTableConfiguration.timePeriod})
      }else if(props.dataTableConfiguration.pageName==="Salary" ||
        props.dataTableConfiguration.pageName==="ExcellenceReviewClockSummary" ||
        props.dataTableConfiguration.pageName==="eightYearClockSummary"){
        this.setState({showShowOnlyFilters: false})
      }
    }
    if(props.dataTableConfiguration.dataColumnFilters!==this.state.dataColumnFilters){
      this.setState({dataColumnFilters: props.dataTableConfiguration.dataColumnFilters})
      // console.log(props.dataTableConfiguration.dataColumnFilters)
    }
    if(props.formattedColumnOptions!==this.state.formattedColumnOptions){
      this.setState({formattedColumnOptions: props.formattedColumnOptions})
      // console.log(props.formattedColumnOptions)
    }
    if(props.showOnlyFilters!==this.state.showOnlyFilters){
      this.setState({showOnlyFilters: props.showOnlyFilters})
      // console.log(props.showOnlyFilters)
    }
    if(props.logicData){
      if(props.logicData.filterViews && props.logicData.filterViews!==this.state.filters){
        // console.log(props.logicData.filterViews)
        this.setUpFiltersFromProps(props.dataTableConfiguration, props.logicData.filterViews)
      }
      if(props.logicData.adminData.adminName!==this.state.adminName){
        this.setState({adminName: props.logicData.adminData.adminName,
          loggedInOpusId: props.logicData.adminData.adminOpusId})
      }
    }
    if(props.hideAddNewButton){
      this.setState({hideAddNewButton: props.hideAddNewButton})
    }
    // console.log('********************************************')
  }

  setUpFiltersFromProps(dataTableConfiguration, filters){
    let views = [dataTableConfiguration.defaultFilterView];
    let isDefaultSet, hasFilters = false;
    let title, maxViews;

    // Check to see if filters has a default custom filter
    if(filters && filters.length>0){
      hasFilters = true;
      for(let each in filters){
        filters[each].filters = JSON.parse(filters[each].preferenceStringDesc);
        if(filters[each].defaultPref){
          isDefaultSet = true;
          title = filters[each].savedPreferenceName;
          this.setView(filters[each], dataTableConfiguration);
        }
      }
    }

    // Set default filter if no default custom filter
    if(!isDefaultSet){
      views[0].defaultPref = true;
      this.setView(views[0], dataTableConfiguration);
      title = views[0].savedPreferenceName;
    }

    // combine Opus default views with custom filter views
    let combinedViews = views;
    if(hasFilters){
      combinedViews = views.concat(filters);
    }
    if(combinedViews.length===21){
      maxViews = true;
    }

    this.setState({views: combinedViews, filters, title, maxViews,
      pageName: dataTableConfiguration.pageName, loadedOnce: true})
  }

  setView(view, dataTableConfiguration = this.state.dataTableConfiguration){
    let {showTimePeriodFilter} = this.state;
    let currentView = util.cloneObject(view);
    let visibleColumns = currentView.filters.formattedColumnOptions;
    let pageName = dataTableConfiguration.pageName;

    // Set current view into dataTableConfiguration
    dataTableConfiguration.currentView = currentView;
    dataTableConfiguration.dataColumnFilters = currentView.filters.dataColumnFilters;
    if(showTimePeriodFilter){
      dataTableConfiguration.timePeriod = currentView.filters.timePeriod;
    }
    let shouldShowFilterModal = true;
    // This is to prevent loading Opus Standard View again if it is the default view when first visiting page
    if(view.savedPreferenceName==="Opus Standard View" || !this.state.loadedOnce){
      shouldShowFilterModal = false;
    }

    this.props.updateFromFilteredView(visibleColumns, dataTableConfiguration, shouldShowFilterModal);
    this.setState({title: view.savedPreferenceName, dispPrefId: view.dispPrefId})
  }

  /**
   *
   * @desc - Handles defaulting to opus default
   * @param {Object} view - selected view
   * @param {String} typeOfReq - type of request (default/undefault)
   *
   **/
   handleOpusDefault(typeOfReq, views = this.state.views){
      typeOfReq==='default' ? views[0].defaultPref = true : views[0].defaultPref = false;
      return views;
    }

    /**
     *
     * @desc - Finds and sets default view
     * @param {Object} view - selected view
     *
     **/
     resetToDefaultView(views){
        let customViewIsDefault = false;
        for(let each in views){
          if(views[each].defaultPref){
            this.setView(views[each]);
            customViewIsDefault = true;
            break;
          }
        }
        if(!customViewIsDefault){
          views = this.handleOpusDefault('default', views);
          this.setView(views[0]);
        }
        return views;
      }

    /**
     *
     * @desc - Handles api call for views
     * @param {String} url - url for save api
     * @param {Object} OpusDisplayPreference - view object
     *
     **/
   async handleApiCall(url, OpusDisplayPreference){
     let stringifiedTemplate = JSON.stringify(OpusDisplayPreference);
     let access_token = this.props.logicData.access_token;
     return util.jqueryPostJson(url + access_token, stringifiedTemplate);
    }

    /**
     *
     * @desc - Find index of view
     * @param {Object} view - view input
     * @param {Array} views - array of all views
     *
     **/
   findIndexOfView(view, views = this.state.views){
     let viewIndex;
     if(view.savedPreferenceName==="Opus Standard View"){
       viewIndex = 0;
     }else{
       for(let index in views){
         if(views[index].dispPrefId===view.dispPrefId){
           viewIndex = index;
           break;
         }
       }
     }
     return viewIndex;
    }

    /**
     *
     * @desc - Handles toggling default views
     *
     **/
    async toggleDefaultView(view, typeOfReq){
      let views = this.state.views;
      let viewIndex = this.findIndexOfView(view, views);
      let url = filteredViewConstants.saveAPI;

      if(view.opusDefault){
        views = this.handleOpusDefault(typeOfReq, views);
      }else{
        // First api call to save
        if(typeOfReq==='default'){
          views[viewIndex].defaultPref = true;
        }else{
          views[viewIndex].defaultPref = false;
        }
        delete views[viewIndex].filters;
        let promise = this.handleApiCall(url, views[viewIndex]);
        try{
          await promise;
          views[viewIndex].filters = JSON.parse(views[viewIndex].preferenceStringDesc)
          console.log('1st api call')
        }catch(e){
          console.log("ERROR: api call #1 in 'toggleDefaultView' in FilteredView.jsx")
          console.log(e)
        }

      }

      if(typeOfReq==='undefault'){
        // This means you are undefaulting a custom view (or opus default)
        views = this.handleOpusDefault('default', views);
      }else{
        // Second api call to undefault if there is current default
        for(let index in views){
          if(views[index].opusDefault && views[index].defaultPref
            && index!==viewIndex.toString()){
            // This means opus default was old default
            views = this.handleOpusDefault('undefault', views);
            break;
          }else if(views[index].defaultPref && index!==viewIndex.toString()){
            // This means custom view was old default
            viewIndex = index;
            views[index].defaultPref = false;
            let filters = views[index].filters;
            delete views[index].filters;
            let promise2 = this.handleApiCall(url, views[index]);
            try{
              await promise2;
              views[index].filters = filters;
              console.log('2nd api call')
              break;
            }catch(e){
              console.log("ERROR: api call #2 in 'toggleDefaultView' in FilteredView.jsx")
              console.log(e)
            }


          }
        }
      }
      this.setState({views})
    }

  crudAction(view, typeOfReq, index){
    // Find the correct filters data
    let columns = this.state.formattedColumnOptions;
    let dataColumns = this.state.dataColumnFilters;
    let {pageName} = this.state;

    if(typeOfReq!=='Add'){
      columns = view.filters.formattedColumnOptions;
      dataColumns = view.filters.dataColumnFilters;
    }

    // This finds the visible columns, sort order and column value filters
    let visibleColumnsArray = [];
    let columnFiltersArray = [];
    let sortOrderArray = [];

    for(let columnsIndex in columns){
      if(columns[columnsIndex].visible){
        visibleColumnsArray.push(columns[columnsIndex].displayName);

        // This finds the column value filters if applicable
        Object.keys(dataColumns['columnValueOptions']).map(function(key, index) {
          if(key===columns[columnsIndex].name){
            columnFiltersArray.push(columns[columnsIndex].displayName);
          }
        });

        // This finds the sort order for columns
        Object.keys(dataColumns['columnSortOrder']).map(function(key, index) {
          if(key===columns[columnsIndex].name){
            let sortText = columns[columnsIndex].displayName+': '+dataColumns['columnSortOrder'][key];
            sortOrderArray.push(sortText)
          }
        });

      }
    }
    let visibleColumnsDisplayText = visibleColumnsArray.join(", ");
    let columnFiltersDisplayText = columnFiltersArray.join(", ");
    let columnSortOrderDisplayText = sortOrderArray.join(", ");

    // This finds the show only filters
    let dataColumnsArray = Object.keys(dataColumns['outsideFilters']);

    let showOnlyArray = [];
    let showOnlyFilters = this.state.showOnlyFilters;

    // Appointments and Inactive Appointments Datatables:
    if(pageName==="Roster" || pageName==="InactiveRoster" || pageName==="SalaryCompensation"){
      for(let index in dataColumnsArray){
        for(let showFilter in showOnlyFilters){
          if(dataColumnsArray[index]===showFilter){
            showOnlyArray.push(showOnlyFilters[showFilter].displayName)
          }
        }
      }
    }else if(pageName==="Active" || pageName==="Completed" || pageName==="Withdrawn"){
    // Cases Datatables (Active/Completed/Withdrawn)
      for(let index in dataColumnsArray){
        let actionFlagsIndex = parseInt(dataColumnsArray[index])
        showOnlyArray.push(proposedActionFlags[actionFlagsIndex].displayName)
      }

      // Find time period for Completed Cases
      if(pageName==="Completed"){
        let timePeriodDisplay = this.state.dataTableConfiguration.timePeriod;
        if(typeOfReq!=="Add"){
          timePeriodDisplay = view.filters.timePeriod;
        }

        for(let each of timePeriods){
          if(each.value===timePeriodDisplay){
            timePeriodDisplay = each.name;
          }
        }

        // Need to capitalize the first letter in every word
        let splitStr = timePeriodDisplay.toLowerCase().split(' ');
         for (let i in splitStr) {
           splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
         }
         timePeriodDisplay = splitStr.join(' ');

        this.setState({timePeriodDisplay})
      }
    }

    let showOnlyFiltersDisplayText = showOnlyArray.join(", ");

    this.setState({typeOfReq, columnFiltersDisplayText, visibleColumnsDisplayText,
      showOnlyFiltersDisplayText, columnSortOrderDisplayText})

    if(typeOfReq==='Add'){
      this.setState({currentView: {}, openCrudModal: true,
        viewName: '', viewIndex: index, modalButtonText: 'Save',
        modalHeaderText: 'Save Current View'})
    }else if(typeOfReq==='Edit' || typeOfReq==='Delete'){
      this.setState({currentView: view, openCrudModal: true,
        viewName: view.savedPreferenceName, viewIndex: index})
        if(typeOfReq==='Edit'){
          this.setState({modalHeaderText: 'Rename', modalButtonText: 'Save'})
        }else{
          this.setState({modalHeaderText: 'Delete View',  modalButtonText: 'Delete'})
        }
    }
  }

  viewNameChange(e){
    if(e.target.value.length<=60 && e.target.value!=="Opus Standard View"){
      this.setState({viewName: e.target.value, errorMessage: null});
    }else if(e.target.value==="Opus Standard View"){
      this.setState({errorMessage: "Current view cannot be named as 'Opus Standard View'"});
    }
  }

  hideCrudModal(){
    this.setState({openCrudModal: false, errorMessage: null})
  }

  checkFilterNameForDuplicates(viewName, views){
    let validName = true;
    for(let each of views){
      if(each.savedPreferenceName.toLowerCase().trim()===viewName.toLowerCase().trim()){
        validName = false;
        break;
      }
    }
    return validName;
  }

  async saveView(){
    let {currentView, views, viewName, viewIndex, typeOfReq, adminName,
      loggedInOpusId, dataColumnFilters, formattedColumnOptions, maxViews} = this.state;
    let dtConfig = this.state.dataTableConfiguration;

    let validName = true;
    // Check filter name for duplicates if adding or editing a view
    if(typeOfReq=="Add" || typeOfReq==="Edit"){
      validName = this.checkFilterNameForDuplicates(viewName, views);
    }

    // Saves only when filter name is valid
    if(validName){
      this.setState({errorMessage: null})
      // Created filters object
      let filters = {
        dataColumnFilters: dataColumnFilters,
        formattedColumnOptions: formattedColumnOptions
      }
      if(dtConfig.pageName==="Completed"){
        filters.timePeriod = dtConfig.timePeriod;
      }

      // Initialize API object for add
      let OpusDisplayPreference = {
        dispPrefId: null,
        loggedInOpusId: loggedInOpusId,
        savedPreferenceName: viewName,
        defaultPref: false,
        opusCreateDt: null,
        opusCreatedById: adminName,
        opusLastUpdateDt: null,
        opusLastUpdatedById: adminName,
        opusScreenName: dtConfig.pageName,
        preferenceStringDesc: JSON.stringify(filters)
      }

      // Set API Object to current view
      if(typeOfReq!=='Add'){
        OpusDisplayPreference = currentView;
        delete OpusDisplayPreference.filters;
        if(typeOfReq==='Edit'){
          OpusDisplayPreference.savedPreferenceName = viewName;
        }
      }

      // API Call for Add & edit
      let url = filteredViewConstants.saveAPI;
      if(typeOfReq==='Delete'){
        url = filteredViewConstants.deleteAPI;
      }

      let promise = this.handleApiCall(url, OpusDisplayPreference);

      try{
        let response = await promise;

        if(typeOfReq==='Add'){
          // Adding a view
          if(response.dispPrefId){
            OpusDisplayPreference.filters =
              JSON.parse(OpusDisplayPreference.preferenceStringDesc);
            OpusDisplayPreference.dispPrefId = response.dispPrefId;
            views.push(OpusDisplayPreference);
            this.setView(OpusDisplayPreference);
          }else{
            // Failed to save
            console.log("Failed to save")
          }
        }else if(typeOfReq==='Edit'){
          // Editing a view
          if(response.dispPrefId){
            views[viewIndex].savedPreferenceName = viewName;
            OpusDisplayPreference.filters =
              JSON.parse(OpusDisplayPreference.preferenceStringDesc);
            if(this.state.dispPrefId===views[viewIndex].dispPrefId){
              this.setState({title: viewName})
            }
          }else{
            // Failed to save
            console.log("Failed to save")
          }
        }else{
          // Deleting a view
          views.splice(viewIndex, 1);
          views = this.resetToDefaultView(views);
        }

        if(views.length===21){
          maxViews = true;
        }

        this.setState({views, maxViews})
      }catch(e){
        console.log("ERROR: api call in 'saveView' in FilteredView.jsx")
        console.log(e)
      }

      this.hideCrudModal();
    }else{
      this.setState({errorMessage: "Current view has the same name as a filter already saved."})
    }
  }

  /**
  *
  * @desc - Gets CRUD modal
  * @return {JSX} - JSX
  *
  **/
  getCrudModal() {
    let {openCrudModal, currentView, typeOfReq, filters, viewName, timePeriodDisplay, columnFiltersDisplayText,
      visibleColumnsDisplayText, showOnlyFiltersDisplayText, showTimePeriodFilter, showShowOnlyFilters,
      columnSortOrderDisplayText, modalHeaderText, modalButtonText, errorMessage} = this.state;
    return (
      <Modal show={openCrudModal}
        backdrop="static" onHide={() => this.hideCrudModal()}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title">
            {modalHeaderText}
          </h1>
        </Header>
        <Body>
          {typeOfReq==='Add' || typeOfReq==='Edit' ?
            <span>
              <label>
                Name (Maximum 60 characters)
              </label>
              <form>
                <FormControl
                  type="text"
                  value={viewName}
                  onChange={(e) => this.viewNameChange(e)}
                />
              </form>
              <span className='red'>{errorMessage}</span>
              <br/>
            </span>
          :
            <span>
              {viewName}
            </span>
          }

          <div>
            <ShowIf show={showShowOnlyFilters}>
              <span>
                <b>Show Only: </b> {showOnlyFiltersDisplayText ?
                  showOnlyFiltersDisplayText : 'None Selected'}<br/><br/>
              </span>
            </ShowIf>
            <b>Showing Columns: </b> {visibleColumnsDisplayText?
              visibleColumnsDisplayText : 'None Selected'}<br/><br/>
            <b>Sort By: </b> {columnSortOrderDisplayText?
              columnSortOrderDisplayText : 'None Selected'}<br/><br/>
            <span>
              <b>Column Dropdown Filters Specified: </b> {columnFiltersDisplayText?
                columnFiltersDisplayText : 'None Selected'}<br/><br/>
            </span>
            <ShowIf show={showTimePeriodFilter}>
              <span>
                <b>Time Period: </b> {timePeriodDisplay}<br/><br/>
              </span>
            </ShowIf>
          </div>

        </Body>
        <Footer>
          <button type="button" className='btn btn-primary left'
            onClick={() => this.saveView()}>
            {modalButtonText}
          </button>
          <Dismiss onClick={() => this.hideCrudModal()} className="left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
  }


  render() {
    const { title, savingNewView, views, maxViews, hideAddNewButton} = this.state;
    return (
      <span>
        <DropdownButton
          bsStyle={'default'}
          title={title}
          key={0}
          id={`dropdown-basic-${0}`}
          className={'btn-sm table-top form-group dropdown btn-gray '}
        >

        {views.map((view, index) => (
          <MenuItem key={index} eventKey={index} className="filtered-view" >
            <span className="filter-view" onClick={() => this.setView(view)} >{view.savedPreferenceName}</span>
            {view.defaultPref ?
              <StarIcon onClick={() => this.toggleDefaultView(view, 'undefault')} />
              :
              <OutlinedStarIcon onClick={() => this.toggleDefaultView(view, 'default')} />
            }
            {view.savedPreferenceName!=='Opus Standard View' ?
              <span>
                <DeleteIcon onClick={() => this.crudAction(view, 'Delete', index)}
                  className="margin-left-15 margin-right-15 gray"/>
                <EditIcon onClick={() => this.crudAction(view, 'Edit', index)} className="gray" />
              </span>
              :
              null
            }
          </MenuItem>

        ))}
          {hideAddNewButton?
            null
          :
            <span>
              <MenuItem divider />
              {maxViews ?
                  <span>You already have the maximum number of views saved.</span>
                :
                  <li><span><a href='#' onClick={() => this.crudAction({}, 'Add')} className="indent" >
                    Save Table Settings as New View
                  </a></span></li>
              }
            </span>
          }
      </DropdownButton>
      {this.getCrudModal()}
      <APIFailureModal {...{failurePromise: this.state.promise}} />
    </span>
    );
  }
}
