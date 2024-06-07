

/*******************************************************************************
 *
 * @desc - This file ONLY deals with the view layer for how the columns should
 *  look.
 *
 ******************************************************************************/
let baseColumnViewOptions = {//Change this to an object
  edit: {
    name: 'edit',
    width: 50
  },
  pendingCases: {
    name: 'pendingCases',
    width: 60
  },
  uid: {
    name: 'uid',
    width: 125
  },
  name: {
    name: 'name',
    width: 250
  },
  opusPersonId: {
    name: 'opusPersonId',
    width: 150
  },
  email: {
    name: 'email',
    width: 200
  },
  schoolName: {
    name: 'schoolName',
    width: 300
  },
  approvedSalaryAmt: {
    name: 'approvedSalaryAmt'
  },
  divisionName: {
    name: 'divisionName'
  },
  departmentName: {
    name: 'departmentName',
    width: 250
  },
  areaName: {
    name: 'areaName'
  },
  specialtyName: {
    name: 'specialtyName'
  },
  affiliation: {
    name: 'affiliation',
    width: 175
  },
  appointmentPctTime: {
    name: 'appointmentPctTime',
    width: 150
  },
  appointmentBasis: {
    name: 'appointmentBasis'
  },
  series: {
    name: 'series'
  },
  rank: {
    name: 'rank'
  },
  step: {
    name: 'step'
  },
  titleName: {
    name: 'titleName'
  },
  titleCode: {
    name: 'titleCode'
  },
  currentSalaryAmt: {
    name: 'currentSalaryAmt'
  },
  appointmentEndDt: {
    name: 'appointmentEndDt'
  },
  waiverEndDt: {
    name: 'waiverEndDt'
  },
  fullName: {
    name: 'fullName',
    width: 250
  },
  currentSeries: {
    name: 'currentSeries'
  },
  currentRank: {
    name: 'currentRank',
    width: 175
  },
  currentStep: {
    name: 'currentStep',
    width: 150
  },
  onScaleAmount: {
    name: 'onScaleAmount'
  },
  currentBaseSalary: {
    name: 'currentBaseSalary',
    width: 175
  },
  lastAdvancementActionEffectiveDt: {
    name: 'lastAdvancementActionEffectiveDt',
    width: 200
  },
  offScaleAmount: {
    name: 'offScaleAmount'
  },
  offScalePercent: {
    name: 'offScalePercent'
  },
  changeInOffScaleAmount: {
    name: 'changeInOffScaleAmount',
    width: 200
  },
  changeInOffScalePercent: {
    name: 'changeInOffScalePercent'
  },
  proposedSeries: {
    name: 'proposedSeries',
    width: 200
  },
  proposedRank: {
    name: 'proposedRank',
    width: 175
  },
  proposedStep: {
    name: 'proposedStep',
    width: 175
  },
  proposedOnScaleSalary: {
    name: 'proposedOnScaleSalary',
    width: 175
  },
  proposedBaseSalary: {
    name: 'proposedBaseSalary',
    width: 175
  },
  proposedOffScaleAmount: {
    name: 'proposedOffScaleAmount'
  },
  proposedOffScalePercent: {
    name: 'proposedOffScalePercent'
  },
  approvedSeries: {
    name: 'approvedSeries'
  },
  approvedOnScaleSalary: {
    name: 'approvedOnScaleSalary'
  },
  approvedRank: {
    name: 'approvedRank'
  },
  approvedStep: {
    name: 'approvedStep'
  },
  approvedSalary: {
    name: 'approvedSalary'
  },
  approvedSalaryEffectiveDt: {
    name: 'approvedSalaryEffectiveDt',
    width: 275
  },
  onScaleSalary: {
    name: 'onScaleSalary',
    isMoney: true
  },
  approvedOffScaleAmount: {
    name: 'approvedOffScaleAmount'
  },
  approvedOffScalePercent: {
    name: 'approvedOffScalePercent'
  },
  approvedChangeInOffScaleAmount: {
    name: 'approvedChangeInOffScaleAmount'
  },
  approvedChangeInOffScalePercent: {
    name: 'approvedChangeInOffScalePercent'
  },
  academicYear: {
    name: 'academicYear',
    width: 175
  },
  actionType: {
    name: 'actionType'
  },
  yearsAccelerated: {
    name: 'yearsAccelerated'
  },
  yearsDeferred: {
    name: 'yearsDeferred'
  },
  currentRankStep: {
    name: 'currentRankStep'
  },
  eligibleRankStep: {
    name: 'eligibleRankStep'
  },
  eligibleRank: {
    name: 'eligibleRank'
  },
  eligibleStep: {
    name: 'eligibleStep'
  },
  proposedEffectiveLaunchDate: {
    name: 'proposedEffectiveLaunchDate'
  },
  proposedEffectiveDate: {
    name: 'proposedEffectiveDate'
  },
  effectiveDate: {
    name: 'effectiveDate'
  },
  approvedEffectiveDate: {
    name: 'approvedEffectiveDate'
  },
  actionCompletedAcademicYear: {
    name: 'actionCompletedAcademicYear'
  },
  approvedEffectiveAcademicYear: {
    name: 'approvedEffectiveAcademicYear'
  },
  location: {
    name: 'location'
  },
  caseLocation: {
    name: 'location'
  },
  eligibleTitleCode: {
    name: 'eligibleTitleCode'
  },
  mandatoryActionFlag: {
    name: 'mandatoryActionFlag'
  },
  deferrableActionFlag: {
    name: 'deferrableActionFlag'
  },
  waiverFlag: {
    name: 'waiverFlag'
  },
  yearsAtCurrentRank: {
    name: 'yearsAtCurrentRank'
  },
  yearsAtCurrentStep: {
    name: 'yearsAtCurrentStep'
  },
  apoAnalyst: {
    name: 'apoAnalyst'
  },
  outcomeType: {
    name: 'outcomeType'
  },
  waiverExpirationDate: {
    name: 'waiverExpirationDate'
  },
  eightYearLimitEffDt: {
    name: 'eightYearLimitEffDt'
  },
  eightYearLimitElgEffDt: {
    name: 'eightYearLimitElgEffDt'
  },
  fourthYearAppraisalEffDt: {
    name: 'fourthYearAppraisalEffDt'
  },
  fourthYearAppraisalElgEffDt: {
    name: 'fourthYearAppraisalElgEffDt',
    width: 175
  },
  unitAYCount: {
    name: 'unitAYCount'
  },
  unitAYTotalCount: {
    name: 'unitAYTotalCount'
  },
  unitTOCTakenCount: {
    name: 'unitTOCTakenCount'
  },
  unitTOCYearCount: {
    name: 'unitTOCYearCount',
    dataType: 'number'
  },
  unitYearsTotalCount: {
    name: 'unitYearsTotalCount',
    dataType: 'number'
  },
  serviceUnitType: {
    name: 'serviceUnitType',
    dataType: 'select',
    edit: true
  },
  continuingUnit18ElgEffDt: {
    name: 'continuingUnit18ElgEffDt',
    editable: false,
    dataType: 'date'
  },
  continuingUnit18ReviewEffDt: {
    name: 'continuingUnit18ReviewEffDt',
    editable: false,
    dataType: 'date',
    visible: true
  },
  continuingUnit18Outcome: {
    name: 'continuingUnit18Outcome',
    dataType: 'input',
    editable: false
  },
  fourthYearAppraisalOutcome: {
    name: 'fourthYearAppraisalOutcome',
    dataType: 'input',
    editable: false
  },
  eightYearLimitOutcome: {
    name: 'eightYearLimitOutcome',
    dataType: 'input',
    editable: false
  }
};

export let columnViewOptions = baseColumnViewOptions;
