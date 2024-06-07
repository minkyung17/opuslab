import {keys, get, set, intersection} from 'lodash';

//My imports
import * as util from '../helpers/';

/**
 *
 * @classdesc This is a module that generates field data especially from attribute
 *   properties which can be used to make formFields that a view layer can use.
 *   Based on the data that comes from the backend API and the variable names for
 *   the frontend.
 * @module FieldData
 *
 */
export default class FieldData {
  valueKey = 'value';
  visibilityKey = 'visibility';
  editableKey = 'editable';
  keys = {visibility: 'visibility', editable: 'editable'};

  /**
  *
  * @desc - Get specific object that tells about these two form fields properties.
  *   Helpful when the visibility or editable of a fields have to change
  * @param {Boolean} visibility - whether visible or not
  * @return {Object} - visibility and show key
  *
  **/
  getVisibilityField(visibility) {
    return {
      [this.visibilityKey]: visibility
    };
  }

  /**
  *
  * @desc -
  * @param {String} editable -
  * @return {Object}
  *
  **/
  getEditabilityField(editable) {
    return {
      [this.editableKey]: editable
    };
  }

  /**
  *
  * @desc - gets visibility and editable attributes
  * @param {String} attrProps - visibility, editable
  * @return {Object}
  *
  **/
  getVisEditFromAttrProps({visibility, editable} = {}) {
    let attributes = {
      ...this.getEditabilityField(editable),
      ...this.getVisibilityField(visibility)
    };

    return attributes;
  }

  /**
  *
  * @desc - Gets value path from field data, extract the value from  "data"
  *   then set it in the fieldData
  * @param {Object} data - attr props for all possible fields
  * @param {String} fieldData -
  * @return {Object}
  *
  **/
  setValuesInFieldDataFromDataByPath(data = {}, fieldData = {}, {setValueKey =
    this.valueKey, pathToValueInDataKey} = {}) {
    for(let name in fieldData) {
      let path = get(fieldData[name], pathToValueInDataKey);
      let value = get(data, path);
      set(fieldData[name], setValueKey, value);
    }

    return fieldData;
  }


  /**
  *
  * @desc - Creates an object of objects filled with field data(titleCode,
  *   deptName etc).
  * @param {Object} allAttributeProperties - attr props for all possible fields
  * @param {String} editable -
  * @return {Object} fieldData - all fields
  *
  **/
  createFieldDataByAttributeProperties(allAttributeProperties = {},
    {fieldNames = keys(allAttributeProperties), fieldDataOptions = {} } = {}) {
    let fieldData = {};

    //Iterate thru field names and add field to 'fieldData'
    for(let name of fieldNames) {
      let attributeProperties = allAttributeProperties[name];
      //Get visibility and editable
      let visEdit = this.getVisEditFromAttrProps(attributeProperties);
      let field = {attributeProperties, ...visEdit, ...fieldDataOptions[name]};

      fieldData[name] = field;
    }

    return fieldData;
  }


  /**
  *
  * @desc - Creates an object of objects filled with field data(titleCode,
  *   deptName etc).
  * @param {Object} allAttributeProperties - attr props for all possible fields
  * @param {String} editable -
  * @return {Object} fieldData - all fields
  *
  **/
  createFieldDataBySingleAttributeProperty(attributeProperty = {}, fieldNames = [],
    fieldPool = {}) {
    let fieldData = {};

    //Iterate thru field names and add field to 'fieldData'
    for(let name of fieldNames) {
      let attributeProperties = attributeProperty;
      //Get visibility and editable
      let visEdit = this.getVisEditFromAttrProps(attributeProperties);
      let field = {attributeProperties, ...visEdit, ...fieldPool[name]};

      fieldData[name] = field;
    }

    return fieldData;
  }

  /**
  *
  * @desc - Updates single field by attributePropery passed in
  * @param {Object} field - attr props for all possible fields
  * @param {Object} attributeProperties -
  * @return {Object} field
  *
  **/
  updateSingleFieldByAttributeProperties(field = {}, attributeProperties) {
    //Get visibility and editable
    let visEdit = this.getVisEditFromAttrProps(attributeProperties);

    //Must use 'Object.assign' so pointer to this object is not lost
    Object.assign(field, {...visEdit});

    return field;
  }

  /**
  *
  * @desc - Creates an object of objects filled with field data(titleCode,
  *   deptName etc).
  * @param {Object} fieldData - attr props for all possible fields
  * @param {Object} allAttributeProperties -
  * @return {Object}
  *
  **/
  updateFieldDataByAttributeProperties(fieldData = {}, allAttributeProperties = {}) {
    let fieldNames = intersection(keys(fieldData), keys(allAttributeProperties));
    for(let name of fieldNames) {
      //Get this fields's attribute properties
      let attributeProperties = allAttributeProperties[name];

      this.updateSingleFieldByAttributeProperties(fieldData[name],
        attributeProperties);
    }

    return fieldData;
  }
}
