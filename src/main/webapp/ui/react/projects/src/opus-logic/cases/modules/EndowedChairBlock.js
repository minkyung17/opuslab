import {get, pick, omit} from "lodash";

//My imports
import * as util from "../../common/helpers/";
import {fieldsInAPI} from "../constants/FieldDataConstants";

/**
*
* Creates Endowed Chair block you see in CaseFlow and Case Summary
* @author - Satish Polasi
* @class EndowedChairBlock
*
**/
export default class EndowedChairBlock {
    
    // IOK-1026 Removed null: true from invalid values
    invalid = {undefined: true};
    allInvalid = {"": true, null: true, undefined: true};

    locationFieldsToShow = ["school", "division", "department", "area",
    "specialty", "organizationName"]

    endowedChairFieldsToShow = ["chairType", "endowedChairTerm",
    "endowedChairTermRenewable", "endowedChairFundingType", "designation"]

    apptFieldsToShow = ["seriesType", "rankType"]


  /**
  *
  * @desc - If value of field is valid get display string
  * @param {Object} field - single field
  * @param {Object} invalid - invalid values to check against
  * @return {String} - display string of field
  *
  **/
    getDisplayTextIfValueIsValid = (field = {}, invalid = this.invalid) =>
    field.value in invalid ? "" : this.getDisplayString(field);
    //this.getDisplayString(field);

  /**
  *
  * @desc - If value of field is valid get display string
  * @param {Object} field - single field
  * @param {Object} invalid - invalid values to check against
  * @return {String} - display string of field
  *
  **/
    getDisplayTextIfDisplayTextIsValid = (field = {}, invalid = this.invalid) =>
    field.displayText in invalid ? "" : this.getDisplayString(field);
    //this.getDisplayString(field);


  /**
  *
  * @desc - displayName and displayText concatted
  * @param {Object} - displayText, displayName
  * IOK-1026 Added null condition to display blank string
  * @return {String} - display string of field
  *
  **/
    getDisplayString = ({displayText, displayName}) => `${displayName}: ${displayText!==null? displayText : ""}`;


  /**
  *
  * @desc - get certain formatted fields from fieldData
  * @param {Object} fieldData -
  * @param {Object} invalid - invalid value definitions
  * @return {Object} - different string fields with school, endowedChairType, endowedChairFundingType,
  *   etc
  *
  **/
  formatLocationDisplayFields(fieldData) {

      let school = this.getDisplayTextIfDisplayTextIsValid(fieldData.school);
    	let division = this.getDisplayTextIfDisplayTextIsValid(fieldData.division);
    	let department = this.getDisplayTextIfDisplayTextIsValid(fieldData.department);
    	let area = this.getDisplayTextIfDisplayTextIsValid(fieldData.area);
    	let specialty = this.getDisplayTextIfDisplayTextIsValid(fieldData.specialty);
    	let organizationName = this.getDisplayTextIfDisplayTextIsValid(fieldData.organizationName);

      let data = {
    	    school,
    	    division,
    	    department,
    	    area,
    	    specialty,
    	    organizationName
      };

      return data;
  }

  formatChairDisplayFields(fieldData) {

      let endowedChairType = this.getDisplayTextIfValueIsValid(fieldData.chairType);
      let endowedChairTerm = this.getDisplayTextIfValueIsValid(fieldData.endowedChairTerm);
      let endowedChairTermRenewable = this.getDisplayTextIfValueIsValid(fieldData.endowedChairTermRenewable);
      let endowedChairFundingType = this.getDisplayTextIfValueIsValid(fieldData.endowedChairFundingType);
      let designation = this.getDisplayTextIfValueIsValid(fieldData.designation);

      let data = {
          endowedChairType,
          endowedChairTerm,
          endowedChairTermRenewable,
          endowedChairFundingType,
          designation
      };

      return data;
  }

  formatFacultyApptDisplayFields(fieldData) {

      let rankType = this.getDisplayTextIfDisplayTextIsValid(fieldData.rankType);
      let seriesType = this.getDisplayTextIfValueIsValid(fieldData.seriesType);

      let data = {
          seriesType,
          rankType
      };

      return data;
  }

  /**
  *
  * @desc - Get the relevant field values to display in endowed chair
  * @param {Array} endowedChair - endowed chair to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getClonedlocationDisplayData(endowedChair, fields) {
        //Clone used to save values
        let clone = pick(util.cloneObject(fieldsInAPI), fields);

        //Iterate through the name fields and get text data and value
        fields.map(name => {
            let {pathsInAPI: {endowedChair: {displayText, value} = {}} = {}} = fieldsInAPI[name];
            clone[name].value = get(endowedChair, value);
            clone[name].displayText = get(endowedChair, displayText);
        });
        clone.endowedChair = endowedChair;//Add the endowedchair to use for later

        return clone;
    }

  /**
  *
  * @desc - Get the relevant field values just for displaying the col-md-6
  * @param {Array} endowedChair - endowedchair to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChair) {

        let apptFields = [];
        let appt = {};
        //Clone appointment and get display and value text
        let clonedDisplayBlock = this.getClonedlocationDisplayData(endowedChair, this.locationFieldsToShow);
        if(clonedDisplayBlock.division.displayText==="N/A"){
            delete clonedDisplayBlock.division;
        }
        if(clonedDisplayBlock.department.displayText==="N/A"){
            delete clonedDisplayBlock.department;
        }
        if(clonedDisplayBlock.area.displayText==="N/A"){
            delete clonedDisplayBlock.area;
        }
        if(clonedDisplayBlock.specialty.displayText==="N/A"){
            delete clonedDisplayBlock.specialty;
        }
        //Now format and extract the text
        let locationDisplay = this.formatLocationDisplayFields(clonedDisplayBlock);
        let locationList = Object.values(locationDisplay);
        appt.locationList = locationList;

        //Clone appointment and get display and value text
        let clonedChairDisplayBlock = this.getClonedlocationDisplayData(endowedChair, this.endowedChairFieldsToShow);
        //Now format and extract the text
        let chairDisplay = this.formatChairDisplayFields(clonedChairDisplayBlock);
        let endowedChairList = Object.values(chairDisplay);
        appt.endowedChairList = endowedChairList;

        //Clone appointment and get display and value text
        let clonedFacultyApptDisplayBlock = this.getClonedlocationDisplayData(endowedChair, this.apptFieldsToShow);
        //Now format and extract the text
        let facultyDisplay = this.formatFacultyApptDisplayFields(clonedFacultyApptDisplayBlock);
        let facultyList = Object.values(facultyDisplay);
        appt.facultyList = facultyList;

        apptFields.push(appt);

        return apptFields;
    }
}
