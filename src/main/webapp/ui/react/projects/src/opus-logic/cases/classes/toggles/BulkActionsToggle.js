//My imports
import CaseDossierFieldDataToggle from './CaseDossierFieldDataToggle';

/**
*
* @desc Handles calls for updating field data for Bulk Actions
*
**/
export default class BulkActionsToggle extends CaseDossierFieldDataToggle {

  invalidValues = {null: true, '': true, undefined: true};

  updateHSCPFromAPU(fieldData, formattedCommonCallLists) {
    let {apuCode: {value}} = fieldData;
    let hscpValue = !(value in this.invalidValues) ? formattedCommonCallLists.apuToHscp[value] : {};

    fieldData.hscpScale1to9.value = hscpValue;
    return fieldData;
  }
}
