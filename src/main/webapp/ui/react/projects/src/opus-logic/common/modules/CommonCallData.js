import {flattenDeep, values, get, reduce, sortBy} from "lodash";

//My imports
import * as util from "../../common/helpers/";

/**
*
* Used to parse out options for globalData and adminData
* @author - Leon Aburime
* @module CommonCallData
*
*/
export default class CommonCallData {
  //State variables
    formattedCommonCallLists = null;

  /**
  *
  * @desc - sets adminData and globalData
  * @param {Object} - adminData and globalData
  * @return {void}
  *
  **/
    constructor({adminData, globalData} = {}) {
    //Try to bind this with decorators later

        Object.assign(this, {adminData, globalData});
        this.setCommonCallData();
    }

  /**
  *
  * @desc - set data for common call lists
  * @param {Object} - adminData and globalData
  * @return {Object} - all the api lists from adminData and globalData
  *
  **/
    setCommonCallData({adminData, globalData} = this) {
        this.formattedCommonCallLists = this.getFormattedListsFromCommonCallData({
            adminData, globalData});
        return this.formattedCommonCallLists;
    }

  /**
  *
  * @desc - get all lists from adminData and globalData
  * @param {Object} - adminData and globalData
  * @return {Object} - all the api lists from adminData and globalData
  *
  **/
    getAPIListsFromCommonCallData({adminData, globalData} = this) {
        let {titleCodeList, titleCodesMapList, orgLocations, actionTypes, actionOutcomes,
      affiliationTypeList, commonTypeReferences, restrictedTitleCodesMapList,
      apuListByDeptcodeMap, profileApuListByDeptcodeMap, salaryEffectiveDtList}
      = globalData;

        let allActionTypes = flattenDeep(values(actionTypes));
        let {adminDepartments} = adminData;
        let {FSPHScaleTypes, HSCPScaleTypes, EndowedChairType, AppointmentStatusType} = commonTypeReferences;

        return {titleCodeList, titleCodesMapList, orgLocations, actionTypes, actionOutcomes,
      affiliationTypeList, commonTypeReferences, restrictedTitleCodesMapList,
      adminDepartments, FSPHScaleTypes, HSCPScaleTypes, allActionTypes,
      EndowedChairType, AppointmentStatusType, apuListByDeptcodeMap, profileApuListByDeptcodeMap,
      salaryEffectiveDtList};
    }

  /**
  *
  * @desc - Create dropdowns options, keyed lists etc
  * @param {Object} data -
  * @return {Object} formattedLists - formatted lists created from adminData &
  *   & globalData
  *
  **/
    getFormattedListsFromCommonCallData({globalData, adminData} = this) {
        let parseArgs = ["commonTypeId", "commonTypeValue"];

        let {titleCodeList, orgLocations, actionTypes, actionOutcomes, adminDepartments,
      EndowedChairType, AppointmentStatusType, FSPHScaleTypes, HSCPScaleTypes,
      allActionTypes, apuListByDeptcodeMap, profileApuListByDeptcodeMap, salaryEffectiveDtList}
        = this.getAPIListsFromCommonCallData({globalData, adminData});

        let nonNullDeptCodeToAPUList
      = this.formatNonNullCasesAPUList(apuListByDeptcodeMap);
        let nonNullProfileDeptCodeToAPUList
      = this.formatNonNullProfileAPUList(profileApuListByDeptcodeMap);

    //Create programs relevant lists
        let casesDeptCodeToAPU = reduce(nonNullDeptCodeToAPUList, (result, value, key) => (
      {...result, [key]: util.arrayOfObjectsToKVObject(value, "apuId", "apuDesc")}), {});
        let profileDeptCodeToAPU = reduce(nonNullProfileDeptCodeToAPUList, (result, value, key) => (
      {...result, [key]: util.arrayOfObjectsToKVObject(value, "apuId", "apuDesc")}), {});
        let sortedTitleCodeList = sortBy(titleCodeList, ["payrollTitle"]);
        let ahPathToDepartment = util.arrayOfObjectsToObjectByKey(adminDepartments,
      "academicHierarchyPathId");
        let departmentOptions = util.arrayOfObjectsToArrayOfKVObjects(adminDepartments,
      "academicHierarchyPathId", "deptCodeAndName");
        let titleCodeIdsToNames = util.arrayOfObjectsToKVObject(titleCodeList,
      "titleCodeId", "titleName");
        let scaleTypeOptions = util.arrayOfObjectsToKVObject(FSPHScaleTypes, ...parseArgs);
        scaleTypeOptions = util.reformatObjectIntoCollectionSortedByValue(scaleTypeOptions);
        let hscpScaleOptions = util.arrayOfObjectsToKVObject(HSCPScaleTypes, ...parseArgs);
    // let apuCodeToId = util.arrayOfObjectsToKVObject(APUTypes, 'commonTypeCode',
    //   'commonTypeId');
        let apuIdToCode = util.arrayOfObjectsToKVObject(apuListByDeptcodeMap["All"], "apuId",
      "apuCode");
        let apuIdToCodeWithPast = util.arrayOfObjectsToKVObject(apuListByDeptcodeMap["AllIncludingPast"], "apuId",
      "apuCode");
        let apuToHscp = util.arrayOfObjectsToKVObject(apuListByDeptcodeMap["All"],
      "apuId", "scaleType");
        let actionTypeTextToCode = util.arrayOfObjectsToKVObject(allActionTypes,
      "actionTypeDisplayText", "code");
        let actionTypeCodeToText = util.arrayOfObjectsToKVObject(allActionTypes, "code",
      "actionTypeDisplayText");
        let actionTypeCodeToData = util.arrayOfObjectsToObjectByKey(allActionTypes,
      "code");
        let endowedChairType = util.arrayOfObjectsToKVObject(EndowedChairType,
      "commonTypeId", "commonTypeValue");
        let deptCodeToAHPathIds = util.arrayOfObjectsToKVObject(adminDepartments,
      "departmentCode", "academicHierarchyPathId");
        let aHPathIdsToDeptCode = util.arrayOfObjectsToKVObject(adminDepartments,
      "academicHierarchyPathId", "departmentCode");
        let actionTypesToOutcomeOptions = reduce(actionOutcomes, (result, value, key) => (
      {...result, [key]: util.arrayOfObjectsToKVObject(value, "code", "name")}), {});
        let actionTypesToOutcomeSortedOptions = reduce(actionOutcomes, (result, value, key) => (
      {...result, [key]: util.arrayOfObjectsToArrayOfKVObjects(value, "code", "name")}), {});
        let sortedTitleCodeIdsToNamesList = util.arrayOfObjectsToArrayOfKVObjects(
      sortedTitleCodeList, "titleCodeId", "titleName");

        let emeritusTitleCodes = titleCodeList.filter(e => e.emeritusFlag);
        let emeritusTitleCodeIdsToNamesHash = util.arrayOfObjectsToKVObject(emeritusTitleCodes,
      "titleCodeId", "titleName");
        let emeritusTitleCodeIdsToNamesArray = util.reformatObjectIntoCollectionSortedByValue(
      emeritusTitleCodeIdsToNamesHash);
        let variedTitleCodeLists = this.formatTitleCodeToStepOptions(titleCodeList);
    // let restrictedTitleCodeList = this.getRestrictedTitleCodeLists(titleCodeIdsToNames,
    //   sortedTitleCodeList);
        let orgLocationList = util.reformatObjectIntoCollectionSortedByValue(orgLocations,
      "key", "value");
        let appointmentStatusType = util.arrayOfObjectsToKVObject(AppointmentStatusType, ...parseArgs);
        let salaryEffectiveDateList = util.reformatObjectIntoCollectionSortedByValue(salaryEffectiveDtList,
      "key", "value");

        let formattedLists = {
            casesDeptCodeToAPU,
            profileDeptCodeToAPU,
      //apuCodeToId,
            apuIdToCode,
            apuIdToCodeWithPast,
            apuToHscp,
            actionTypes,
            orgLocations,
            titleCodeList,
            actionOutcomes,
            endowedChairType,
            appointmentStatusType,
            salaryEffectiveDateList,
            scaleTypeOptions,
            hscpScaleOptions,
            departmentOptions,
            ahPathToDepartment,
            sortedTitleCodeList,
            deptCodeToAHPathIds,
            aHPathIdsToDeptCode,
            titleCodeIdsToNames,
            actionTypeTextToCode,
            actionTypeCodeToText,
            actionTypeCodeToData,
      // restrictedTitleCodeList,
            ...variedTitleCodeLists,
            actionTypesToOutcomeOptions,
            actionTypesToOutcomeSortedOptions,
            sortedTitleCodeIdsToNamesList,
            locationList: orgLocationList,
            emeritusTitleCodeIdsToNamesArray,
            departmentCode: ahPathToDepartment,
            titleCodeOptions: sortedTitleCodeIdsToNamesList,
            titleCodesByName: util.arrayOfObjectsToObjectByKey(titleCodeList, "titleName"),
            titleCodesByCode: util.arrayOfObjectsToObjectByKey(titleCodeList, "titleCode"),
            titleCodesById: util.arrayOfObjectsToObjectByKey(titleCodeList, "titleCodeId")
        };

        return formattedLists;
    }

  /**
  *
  * @desc - Give us varied data needed for titleCode dependency fields
  * @param {Object} titleCodeList -
  * @param {Object} stepArgs -
  * @return {Object}
  *
  **/
    formatTitleCodeToStepOptions(titleCodeList, stepArgs = ["stepTypeId", "stepName"]) {
        let titleCodeToStepOptions = {};
        let titleCodeIdToStepOptions = {};
        let titleCodeIdToActiveStepOptions = {};

        for(let titleCodeObj of titleCodeList) {
            let {steps} = titleCodeObj;
            let stepOptionsHash = util.arrayOfObjectsToKVObject(steps, ...stepArgs);
            let stepOptions = util.arrayOfObjectsToArrayOfKVObjects(steps, ...stepArgs);

            let {titleCodeId, titleCode} = titleCodeObj;
            titleCodeToStepOptions[titleCode] = stepOptionsHash;
            titleCodeIdToStepOptions[titleCodeId] = stepOptions;
            let activeSteps = [];
            for(let each of steps){
                if(each.isActive==="Y"){
                    activeSteps.push(each);
                }
            }
            let activeStepOptions = util.arrayOfObjectsToArrayOfKVObjects(activeSteps, ...stepArgs);
            titleCodeIdToActiveStepOptions[titleCodeId] = activeStepOptions;
        }

        return {titleCodeToStepOptions, titleCodeIdToStepOptions, titleCodeIdToActiveStepOptions};
    }

  /**
  *
  * @desc - Remove the deptCode entries that have a null APU list for Cases
  * @param {Object} apuListByDeptcodeMap -
  * @return {Object}
  *
  **/
    formatNonNullCasesAPUList(apuListByDeptcodeMap) {
        let nonNullDeptCodeToAPUList = {};
        for (let record in apuListByDeptcodeMap) {
            if (apuListByDeptcodeMap[record] !== null) {
                nonNullDeptCodeToAPUList[record] = apuListByDeptcodeMap[record];
            }
        }
        return nonNullDeptCodeToAPUList;
    }

  /**
  *
  * @desc - Remove the deptCode entries that have a null APU list for Profile
  * @param {Object} profileApuListByDeptcodeMap -
  * @return {Object}
  *
  **/
    formatNonNullProfileAPUList(profileApuListByDeptcodeMap) {
        let nonNullProfileDeptCodeToAPUList = {};
        for (let profileRecord in profileApuListByDeptcodeMap) {
            if (profileApuListByDeptcodeMap[profileRecord] !== null) {
                nonNullProfileDeptCodeToAPUList[profileRecord] = profileApuListByDeptcodeMap[profileRecord];
            }
        }
        return nonNullProfileDeptCodeToAPUList;
    }
}
