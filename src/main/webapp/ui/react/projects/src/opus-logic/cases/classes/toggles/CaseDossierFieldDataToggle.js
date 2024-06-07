
//My imports
import FieldDataToggle from "./FieldDataToggle";

/**
*
* @desc Only updates fields for toggles specifically related to CaseFlow and
*   Case Summary
* @author Leon Aburime
* @module CaseDossierFieldDataToggle
*
**/
export default class CaseDossierFieldDataToggle extends FieldDataToggle {

  /**
  *
  * @desc - Used to update dependent fields generally when field data changes
  * @param {Object} fieldData - all field data
  * @param {Object} nameOfChangedField - name of field that was changed
  * @param {Object} formattedCommonCallLists - common call lists
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldData(fieldData = {}, nameOfChangedField, formattedCommonCallLists, typeOfReq) {
        super.updateFieldData(fieldData, nameOfChangedField, formattedCommonCallLists, typeOfReq);

        if(nameOfChangedField === "endowedChairType") {
            this.updateFieldDataByEndowedChairType(fieldData);
        }
        if(nameOfChangedField === "departmentCode") {
            let {departmentCode: {value}} = fieldData;
            let deptCode = formattedCommonCallLists.aHPathIdsToDeptCode[value] || {};
            this.updateCasesAPUOptionsFromGlobalData(fieldData, deptCode, formattedCommonCallLists);
        }

        return fieldData;
    }


  /**
  *
  * @desc - Only show 'Term End Date' if EndowedChairType is
  *   'Permanent-Appointment Chair' i.e. value of 2
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldDataByEndowedChairType(fieldData = {}, comingFrom) {
        let {endowedChairType, termEndDate, endowedChair, chairApptEndDate, selectedEndowedChair} = fieldData;
        if(!endowedChairType || !termEndDate || !endowedChair || !chairApptEndDate) {
            return fieldData;
        }

        if (endowedChair.value !== null)
        {
          endowedChairType.visibility = false;
          termEndDate.visibility = false;
          return fieldData;
        }

        // TODO: Possibly remove this [if] logic if redundant
        if (endowedChairType.value !== null || endowedChairType.value === null){
          let termApptChairValue = 2;
          let isTermApptChair = Number(endowedChairType.value) === termApptChairValue;
          termEndDate.visibility = isTermApptChair;
          endowedChairType.visibility = true;
          endowedChair.visibility = false;
          selectedEndowedChair.visibility = false;
          chairApptEndDate.visibility = false;
        }

        // IOK-834 Disable EC search on FD
        comingFrom==="finalDecision" && endowedChair.visibility ? endowedChair.visibility = false : null;
        
        return fieldData;
    }

  /**
  *
  * @desc - Updates the APU dropdown options to only show those relevant for the
  * selected AH Path (i.e. Dept Code)
  * @param {Object} fieldData - all field data
  * @param {String} departmentCode - the departmentCode that is being toggled
  * @param {Object} formattedCommonCallLists - global data
  * @return {Object} - the modified fieldData
  *
  **/
    updateCasesAPUOptionsFromGlobalData(fieldData, departmentCode, formattedCommonCallLists) {
        let {casesDeptCodeToAPU} = formattedCommonCallLists;

        if (fieldData.apuCode) {
            if (casesDeptCodeToAPU[departmentCode]) {
        //If there is a selected value, and it is no longer relevant (i.e. we've toggled to another
        //deptCode with an APU list which does not contain the original selected value), then we
        //should clear it so that apuId doesn't get invisibly sent to the Save API
                let keys = Object.keys(casesDeptCodeToAPU[departmentCode]);
                if (!(keys.includes(String(fieldData.apuCode.value)))) {
                    fieldData.apuCode.value = null;
                }

                fieldData.apuCode.options = casesDeptCodeToAPU[departmentCode];
            }
            else {
        //Clear value and options list
                fieldData.apuCode.value = null;
                fieldData.apuCode.options = null;
            }
        }
        return fieldData;
    }
}
