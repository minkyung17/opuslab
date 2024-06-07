//Subtable Action Types and Outcomes

/*var APPOINTMENT = "1";*/
var MERIT = "2-7"; 
var PROMOTION = "2-9";
var CONTINUING_APPT = "1-10";
var RENEWAL = "1-13";
var REAPPOINTMENT = "1-14";
// Used for Unit 18
var UNIT18_FOURTH_YEAR_INCREASE = "1-8";
var CHANGE_IN_SERIES = "3-11";
var CHANGE_OF_DEPARTMENT = "3-4";
var OFF_SCALE_SALARY = "3-15";
var CHANGE_PERCENT_TIME = "3-16";
var FIVE_YEAR_REVIEW = "1-17";
var FOUR_YEAR_REVIEW = "1-18";
var FOURTH_YEAR_APPRAISAL = "1-21";
var EIGHT_YEAR_LIMIT = "1-22"; 
var MANDATORY_REVIEW = "1-19";
var APPOINTMENT = "3-1";
var JOINT_APPOINTMENT = "3-2";
var SPLIT_APPOINTMENT = "3-3";
var ACADEMIC_ADMINISTRATIVE_APPOINTMENT="3-6";
var ENDOWED_CHAIR_APPT = "3-5";
var UNIT_18_NEED_ASSESSMENT = "1-20";
var EIGHT_YEAR_LIMIT_PRELIMINARY_ASSESSMENT = "3-23";
var EIGHT_YEAR_LIMIT_RECONSIDERATION = "3-24";
var MERIT_EQUITY_REVIEW = "3-25";
var WAIVER_RENEWAL = "3-28";
var CONVERT_HSCP = "3-29";
var STEP_UNSTEP = "3-30";
var NON_RENEWAL = "3-31";
var RECALL = "3-32";
var INITIAL_WAIVER_REQUEST = "3-33";
var CHANGE_PRIMARY_DEPT = "3-12";
var UNIT18_TEMP_AUGMENTATION = "3-27";
var RANGE_ADJUSTMENT = "3-34";//Range Adjustment action category id-action type id

var ADVANCEMENT = "1";
var APPROVED = "2";
var COMPLETED = "3";
var DISAPPROVED = "5";
// get the StepId of stepText "N/A"
var STEP_NOT_APPLICABLE = "0"; 
var STEP_WOS = "54"; 
var STEP_EMPTY = "-1"; 

//Roles
var APO_ROLE = "apo_director";
var OA_ROLE = "opus_admin";

//Tooltip text 

var currentAppointmentHeaderTooltip = "Please enter information that is current at the time of entry. If the appointee has an action in progress, please enter it on the Cases page under the Active Cases tab. If an appointee was recently approved (with final approval) for an action that changed the appointee's series, rank, step, salary, etc., please provide the approved new information.";
var waiverHeaderTooltip = "The faculty member has requested and been approved for having your department waive participation in his/her personnel actions. Primary departments cannot waive participation. If you are the primary department, this section is not editable.";
var tenureClockHeaderTooltip = "Records time on the clock towards an 8 year limit.";
var appraisalAndEightOrFiveYearLimitActionsHeaderTooltip = "The Law School conducts its appraisals in the 3rd year and its tenure review in the 5th. The majority of schools conduct the appraisal in the 4th year and the 8 year limit review in the 7th.";
var lastAdvancementActionHeaderTooltip = "The appointee\'s last change in rank or step.";
var renewalsAndReappointmentsHeaderTooltip = "All appointments that have specified end dates should be included here.";
var fiveYearReviewHeaderTooltip = "Please leave these columns blank if the appointee has not had a 5 year review since their last advancement action.";
var fourYearReviewHeaderTooltip = "Documents 4 year review actions for Associate and Full Professors in the HS Clinical and Adjunct Professors Series within the School of Medicine, who have appointments at less than or equal to 50% time, or are WOS (Without Step).";
var continuingAppointmentClockHeaderTooltip = "Records pre six-year service to determine when the appointee is due for their 4th year increase, needs assessment, and continuing appointment review.";
var actionsInProgressHeaderTooltip = "This section is for documenting data about any Actions in Progress. The purpose of tracking these actions here is so that we don\'t need to collect the information from DAT; instead we can track your actions here and ensure the correct data gets into Opus. When you receive notification that an action has been approved, please update the information in Current Appointment, Advancement Actions, Renewals, Five Year Reviews, and Other Completed Actions as appropriate.";

var areaTooltip = "We are using this term to represent sub-departments. Some schools call these divisions, some call them sections. We agreed on this term so as not be confused with the Divisions in the College of L&S. For most departments, these will be N/A.";
var specialtyTooltip = "We are using this term to represent entities that are a subset of an Area.  These specialties may represent topical groupings within the Area.";
//IUI
var affiliationTooltip = "Primary indicates that your department is the appointee\'s home department.  Additional means the appointee has a joint or split appointment in your department, with a primary appointment elsewhere. If you are the primary and only department for an appointee, you will not be able to switch to additional, because that would leave the appointee without a primary department.";
var affiliationGeneralTooltip = "Primary indicates that your department is the appointee\'s home department.  Additional means the appointee has a joint or split appointment in your department, with a primary appointment elsewhere.";
var removeFromListTooltip = "Check this box if this person is in your department erroneously, or to remove them from your department due to retirement, separation, etc.";
var hasWaiverTooltip = "As long as the waiver has not yet expired, please add this information."; 
var waiverTermLengthTooltip = "The total number of years the waiver will be in effect before it expires (not years remaining).  Waiver term length may not exceed 3 years.";
var titleCodeTooltip = "The Title Code associated with the appointee\'s current appointment.  If the tool won\'t let you add a title code, it is probably because that title code doesn\'t belong to this series.  Choose the correct series from the left-hand menu.";
//IUI
var salaryTooltip = "The salary approved for the Academic Appointee by the Dean or VC.  If the appointment is Without Salary (WOS), please enter 0 in the field. We are using this term to distinguish the salary that is based on the academic salary scales from salary components established by the Health Sciences Compensation Plan.";
var salaryTooltip = "The salary approved for the Academic Appointee by the Dean or VC.  If the appointment is Without Salary (WOS), please enter 0 in the field. We are using this term to distinguish the salary that is based on the academic salary scales from salary components established by the Health Sciences Compensation Plan.";
var appointmentEndDateGeneralTooltip  = "The end date of the current appointment (e.g. when the appointment will be renewed).";
//IUI
var appointmentEndDateTooltip = "The end date of the current appointment (e.g. when the appointment will be renewed). If the appointee has Tenure or Security of Employment (SOE), leave the date field blank and check Indefinite.";
var appointmentBasisTooltip = "The pay basis for the appointment Academic Year (AY) or Fiscal Year (FY). HSCP appointees should be marked as FY.";
//IUI
var appointmentPercentTimeTooltip = "Please enter the percent FTE of the appointee\'s current appointment in YOUR department";
var startDateSeriesTooltip = "The date the appointee started in their current series - cumulative since their start date at any UC.";
var startDateRankTooltip = "The date the appointee started in their current rank - cumulative since their start date at any UC.";
var startDateStepTooltip = "The date the appointee started at their current step, within their current rank - cumulative since their start date at any UC.";
var advancementActionTypeTooltip = "The appointee\'s last action that resulted in a change in series, rank, or step. Actions included are: Appointments, Merits, Promotions, Change in Series.";
var fiveYearEffectiveDateTooltip = "The Effective Date of the appointee\'s last 5 Year Review since their last advancement.";
var tenureServiceUnitTypeTooltip = "If the appointee is paid on an Academic Year (AY) basis, please select whether the appointee should accrue service based on semesters or quarters. If the appointee is paid on a Fiscal Year (FY) basis, please select Month.";
var tenureServiceUnitsAYTooltip = "Please enter the number of quarters, semesters, or months the appointee accrued toward the 8 year limit for the current academic year. If the appointee has a full time appointment, they would accrue 3 quarters, 2 semesters, or 12 months.";
var tenureServiceUnitsTotalTooltip = "Please enter the total number of quarters, semesters, or months the appointee has accrued since they were hired by the UC. This includes any service credit they may have accrued at another UC prior to their appointment at UCLA (if known).";
var tenureServiceYearsTotalTooltip = "Please enter the total number of years toward the 8 year limit the appointee has accrued since they were hired by the UC. This includes any service credit they may have accrued at another UC prior to their appointment at UCLA (if known).";
var tocYearsTooltip = "This field will be populated from APO\'s records. If you feel this data is in error please contact opushelp@ucla.edu.";
var tocTakenTooltip = "The number of TOC years the appointee has opted to take. For example, they may have 1 TOC Credited Service Year (due to childbirth), but they have not exercised their option to \'take\' the credited year. In this case, the 8 year limit review will proceed on time. If the appointee has decided to \'take\' the credit, enter a value of \'1\' and the 8 year limit review date will be moved back one year.";
var performanceReviewTooltip = "Please record the effective date of the appointee\'s last Mandatory Review (required every 4 years for Administrators and every 3 years for Coordinators (Appendix 31, the CALL).";
var contApptServiceUnitTypeTooltip = "If the appointee is paid on an Academic Year (AY) basis, please select whether the appointee should accrue service toward a Continuing Appointment based on semesters or quarters. If the appointee is paid on a Fiscal Year (FY) basis, please select Month.";
var contApptServiceUnitsAYTooltip = "Please enter the number of quarters, semesters, or months the appointee accrued toward a Continuing Appointment for the current academic year. If the appointee has a full time appointment, they would accrue 3 quarters, 2 semesters, or 12 months.";
var contApptServiceUnitsTotalTooltip = "Please enter the total number of quarters, semesters, or months the appointee has accrued toward Continuing Appointment since they were hired by your department.";
var contApptServiceYearsTotalTooltip = "Please enter the total number of years toward Continuing Appointment the appointee has accrued since they were hired by your department.";
var validateTooltip = "The system will check to see if there are any errors. If the row turns green, you\'re good to go! Once all your rows are green, you\'re done!";
var actionIsCompleteTooltip = "Check this box when you receive notification that an action has been approved.";
var effectiveDateTooltip = "The date the appointment change based on the action outcome will take effect.";
var onScaleSalaryTooltip = "The annual salary rate for a given series/rank/step or title/grade per UCOP's salary scales.";
var yearsAcceleratedTooltip = "The number of years ahead of schedule a proposal for an advancement action is (based on The CALL’s eligibility schedule for an appointee’s current rank and step).";
var yearsDeferredTooltip = "The number of years behind schedule a proposal for an advancement action is (based on The CALL’s eligibility schedule for an appointee’s current rank and step).";
var locationDatesTooltip = "The annual salary rate for a given series/rank/step or title/grade per UCOP's salary scales.";
var temporaryPlaceholderTooltip = "This is a test.";

function fillBlanks(tooltipText) {
	return tooltipText.replace(/ /g, "&thinsp;");
}