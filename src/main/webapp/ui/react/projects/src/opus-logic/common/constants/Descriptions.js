
/**********************************************************************
*
* @desc - Descriptions for Opus. Used mainly for tooltips
*
*
************************************************************************/
export const descriptions = {

  //General Tooltips
    affiliation: `Primary indicates that your department is the appointee's home
    department.  Additional (may be Joint or Split) means the appointee has an
    additional appointment in your department with a primary appointment elsewhere.`,

    otherAffiliations: "Other appointments held by the person, if applicable.",

    positionNbr: `The Position in UCPath that is linked to the Opus Appointment.
      If this field is empty, please go to the Link UCPath Position page in Opus
      to create the link.`,

    affiliation_status: `Whether the appointment is Joint or Split.
    If it is N/A, the appointment is either a primary appointment or an additional that is neither joint nor split.`,

    appointment_status: "Indicates status of appointment (prospective or appointed).",

    appointmentStatus: `Indicates the status of the appointment. An appointment is "Prospective"
  if the effective date is in the future. An appointment is "Appointed" when it is currently active.
  An appointment is "Archived" if the appointment has ended.`,

    apu_id: "The appointee's APU (Academic Programmatic Unit).",

    area: `Opus uses this term to represent recognized sub-groups within a Department.
    Some schools call these divisions, some call them sections. For most departments,
    the Area field will be N/A.`,

    actionStatus: `If the case has been closed, but the effective date has not
    passed, the status will display as "Completed". Once the effective date has
    passed, the status will be "Effective".`,

    case_location: "Where the case is in the review process.",

    dentistry_base_supplement: `A supplement to the base salary as part of Dentistry's compensation plan.
    This amount is not represented in the base salary, nor is it part of the range adjustment calculation.`,

    department_code: "Campus Department Code - also known as the Administrative Code.",

    edit: "Edit",

    end_date: `The end date of the current appointment (e.g., when the appointment will be renewed).
    If the appointee has tenure or security of employment (SOE) or an Emeritus, Continuing, or Career Status appointment, this date field will be blank.`,

    employeeStatus: `Employee Status indicates whether the person is active, retired, terminated, or on leave.
    This field is pulled from UCPath and may be labeled Payroll status in the Path interface.`,

    delete: "Delete the case when there are substantial errors.",

    deleteAndWithdraw: `Delete the case when there are substantial errors.
    Withdraw it if the candidate has decided not to proceed with the case while departmental review is in progress.`,

    fsph_salary_scale: "Salary scale for the School of Public Health.",

    hr_status: "Status in UC Path",

    hscp_addl_base_incr: `The difference between the appointee's Base Salary,
    as determined by APU, and what the Scale 0 salary would be.`,

    hscp_base_salaryX_X: "Appointee's total Base Salary.",

    hscp_scale0_9: `HSCP salary scale as determined by the appointee's APU.
    If the scale is Unknown, please contact your School's Academic Personnel Coordinator.`,

    hscp_scale0_X: "This scale is equivalent to UCOP's Professor Series Fiscal Year Scale.",

    inactiveTitleCode: "UC has discontinued this title code.",

    inactiveDeptCode: "UC has discontinued this department code",

    indefinite_flag: `Opus populates this column based on Title Code. Tenured
    titles or those with security of employment (SOE) are automatically
    flagged as indefinite.`,

    interfolioLink: `Go directly to the Interfolio case linked to this case.
    If there is no link, the Opus case is not linked to a case in Interfolio.
    The usual permissions apply--you will not be able to see a case that has left your unit.`,
    //date of last advancement
    last_adv_action: `The date of the appointee\'s last advancement in rank or step.
    Range Adjustments made to a salary scale and paid to all appointees on
    that scale do not count as advancement actions.`,

    location: `The Location column is used by the School of Medicine. For non-Medicine appointees, the column will display "UCLA Campus" 
      and the location percent time will match the appointment percent time. For Medicine appointees, the column will show the percentage of the 
      appointment at UCLA/CHS and the percentage at any affiliate locations. `,

    offscale_percent: "Off-scale percent for the title/step.",

    oldApuDesc: "UC has discontinued this APU ID.",

    opus_status: `People are active in Opus when they are active in the payroll system,
    or brought in as a candidate from Recruit. People become inactive in Opus when they are no
    longer active in the payroll system. You are still able to start a case for an inactive person.`,

    payroll_salary: "Regular salary in UCPath.",

    percent_time: `The percentage of full time the faculty member will work in the given unit.  
    For faculty based at affiliate locations this includes the percentage worked at affiliates. `,

    on_scale_amount: "On-Scale amount for the title/step.",

    proposed_effective_date: `The date the proposed changes would take effect
    if the action is approved.`,

    proposed_off_scale_amount: "Off-Scale amount for the proposed title/step.",

    proposed_off_scale_percentage: "Off-Scale percent for the proposed title/step.",

    salary: `The salary approved for the Academic Appointee by the Dean or VC.
    If the appointment is Without Salary (WOS), this value will be 0.  For
    Health Sciences Compensation Plan participants, we will display their
    base compensation determined by their APU scale.`,

    salary_scale_effective_date: `The Effective Date of the UCOP salary scale
    used to calculate any off-scale percentage.`,

    service_unit_type: `If the appointee is paid on an Academic Year (AY) basis,
    the appointee should accrue service based on semesters or quarters. If
    the appointee is paid on a Fiscal Year (FY) basis, accrual will be by month.`,

    specialty: `Opus uses this term to represent recognized sub-groups within an Area.
      For most departments, the Specialty field will be N/A.`,

    start_date_at_rank: `The date the appointee started in their current rank -
    cumulative since their start date at any UC.`,

    start_date_at_series: `The date the appointee started in their current
    series - cumulative since their start date at any UC.`,

    start_date_at_step: `The date the appointee started at their current step
    within their current series - cumulative since their start date at any UC.`,

    waiver_expiration_date: `The end date of the waiver. Waiver term length may
    not exceed three years.`,

    years_accelerated: `The number of years ahead of schedule a proposal for an
    advancement action is (based on The CALL’s eligibility schedule for the
    appointee’s current rank and step).`,

    years_at_current_rank: `Years the appointee has been in their current rank
    and is cumulative since their start date at any UC.`,

    years_at_current_step: `Years the appointee has been in their current step
    and is cumulative since their start date at any UC.`,

    years_deferred: `The number of years behind schedule a proposal for an
    advancement action is (based on The CALL’s eligibility schedule for the
    appointee’s current rank and step).`,

  // Excellence Review Clock
    credited_service_units_ay_exc: `The number of quarters, semesters, or months
    the appointee accrued toward an excellence review for the current academic
    year (e.g, 3 quarters, 2 semesters, or 12 months).`,

    credited_service_units_total_exc: `The total number of quarters, semesters,
    or months the appointee has accrued toward an excellence review since
    they were hired by your department.`,

    credited_service_years_total_exc: `The total number of years toward the
    excellence review that the appointee has accrued since they were hired
    by your department.`,

    eligible_date_excellence_review: `The estimated date of excellence review
    based on the academic appointee\'s current accrual rate of service years.`,

    effective_date_excellence_review: `If the appointee is deemed Excellent, the
    date the appointee\'s continuing appointment goes into effect. If the
    appointee is deemed not qualified to perform at an Excellent level, the
    date the appointee is released from their appointment.`,

  // Eight Year Clock
    credited_service_units_ay: `The number of quarters, semesters, or months the
    appointee accrued toward the Eight-Year Limit for the current academic
    year (e.g., 3 quarters, 2 semesters, or 12 months).`,

    credited_service_units_total: `The total number of quarters, semesters, or
    months the appointee has accrued since they were hired by the UC. This
    includes any service credit they may have accrued at another UC prior to
    their appointment at UCLA.`,

    credited_service_years_total: `The total number of years toward the
    Eight-Year Limit the appointee has accrued since they were hired by the
    UC. This includes any service credit they may have accrued at another UC
    prior to their appointment at UCLA.`,

    toc_credited: `This field will be populated from APO records. If you feel
    this data is in error, please contact opushelp@ucla.edu.`,

    toc_taken: `The number of TOC years the appointee has opted to take. For
    example, they may have one TOC Credited Service Year (due to childbirth),
    but they have not exercised their option to "take" the credited year.
    In this case, the Eight Year Review will proceed on time. If the
    appointee has decided to "take" the credit, enter a value of "1" and the
    Eight Year Review date will be moved back one year.`,

    eligible_4th_year_appraisal: `The estimated date of the 4th Year Appraisal
    based on the academic appointee\'s current accrual rate of service years.`,

    effective_4th_year_appraisal: `The date the appointee\'s completed 4th Year
    Appraisal goes into effect.`,

    eligible_8_year_limit: `The estimated date of the Eight-Year Limit based on
    the academic appointee\'s current accrual rate of service years.`,

    effective_8_year_limit: `The date the appointee\'s completed Eight-Year Limit
    goes into effect.`,
  // Salary Report
  //  increase_in_salary: `Between the current and proposed salary.`,

    approved_off_scale_amount: "Off-Scale amount for the approved title/step.",

    approved_off_scale_percent: "Off-Scale percent for the approved title/step.",

    increase_in_salary_current_approved: `Increase between the current and
    approved salary.`,

    percent_increase_in_salary_current_approved: `Percent increase between the
    current and approved salary.`,

  //approved on-scale salary
    on_scale_salary: "On-Scale amount for the title/step.",

  //current on-scale amount
    onscale_amount: "On-Scale amount for the title/step.",

  //current off-scale salary
    current_off_scale_amount: "Off-Scale amount for the title/step. If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the off scale. ",

    current_off_scale_percentage: "Off-Scale percent for the title/step. If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the off scale.",

    changeInSalaryProposed: "If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the increase.",

    percentChangeInSalaryProposed: "If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the increase.",

    changeInSalaryApproved: "If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the increase.",

    percentChangeInSalaryApproved: "If the faculty member is on the NSTP, the NSTP amount is deducted from the payroll salary prior to calculating the increase.",

    comment: "Please explain why there were changes to this appointment.",

  // Start a Case modals
    appointment_set: `When an appointee has Joint or Split appointments, these
    multiple appointments may be selected here as a Set so that the proposed
    action affects all appointments in the Set. When a proposed action is only
    relevant to one appointment, please select that single appointment rather
    than propose the action for the Set of appointments.`,

    newApptInstructions: `This person doesn't have a current academic appointment
    in Opus, so the only action you can take is an initial appointment.  If you
    feel this is in error, please contact opushelp@ucla.edu.`,

    recruit: `Candidates from a job posting in Recruit can be imported to start an
    Appointment case provided they're at the "Recommend for Interview" status
    or higher. <br> Candidates from a Waiver or Exemption in Recruit can be
    added to Opus to start an Appointment case at any time during the Waiver or
    Exemption approval process in Recruit.`,

    recruit_tracking: `The Recruit Tracking Number has three possible formats:<br>
              JPF##### - for Recruitments<br>
              SWR##### - for Waivers<br>
              EXR##### - for Exemptions`,

  //Eligibility
    waiver: `Checking this box will display only appointees eligible for review by
    your department (i.e., it will filter out joint appointees with review waivers).`,

    pendingCases: "This person has an active case.",

    service_unit_type_excellence_review: `If the appointee is paid on an Academic
    Year (AY) basis, the appointee should accrue service toward an excellence
    review based on semesters or quarters. If the appointee is paid on a
    Fiscal Year (FY) basis, accrual will be by month.`,

    hireDt: "Earliest hire date (a break in service resets this date).",

  //Appointment Set Page on Profile
    activeSet: `Each appointee can have up to one active appointment set. Appointments
    are eligible for inclusion in a set only if they are themselves active.<br><br>
    To add existing appointments to the set or to edit details for appointments already
    in the set, click the pencil icon in the set’s header (if present).
    If you do not see this icon,  please contact opushelp@ucla.edu if you need to make changes.`,

    appointmentSetCrudModal: "If you remove all appointments from the set and click Save, the set will be deleted.",

    appointmentSetCrudModalCategory: "Indicates whether the appointment is a Joint (WOS), Split, or Primary appointment.",

    appointmentSetSaveSuccessMessage: "You have updated the appointment set.",

    categoryError: "Each appointment in the set must have a Category.",

    notEnoughAppointmentsDisplay: "An appointment set is deleted when it no longer combines multiple appointments. To retain active status, add another appointment before saving. To delete the set, remove the remaining appointment. To discard your edits, click Cancel.",

  // Profile Summary Page
    eppn: "A person&apos;s UCLA Logon ID or Mednet user name. EPPN stands for \"eduPersonPrincipalName\" and is one of the credentials used by the university to authenticate individuals for both internal and external systems.",

    hrStatus: "Status in UC Path",

    activeCases: "The number of cases currently active for this profile.",

    latestCompletedCase: "The Action and Effective Date for the completed case with the latest Effective Date.",

    employeeId: "Empl ID from UCPath",

    rptUserId: "The user ID from Interfolio",

//Permissions Page

    opus_roles: "Faculty users are not included in Opus (except for faculty with chair/director/dean duties).",

    interfolio_roles: "This only includes the staff roles in Interfolio.  It does not include committees or candidates.",

    interfolio_committee_roles: "This only includes the committee roles in Interfolio.  It does not include committees or candidates.",

    interfolio_committees : "These are administrative committees assigned to each step of the review process, so they can have access.  This list does not include review committees.",

    committeeError: "Please select a committee.",

    //Off-Scale Page

    change_in_off_scale: `Compares the proposed off-scale salary to the currrent off-scale salary.
    For example, if the appointee is currently at 10% off-scale at Step 3, a proposed 10% off-scale for Step 4 would be a 0% change.`,

    max_salary_thresh : "A proposed salary exceeding this threshold requires approval from UCOP.",

    //UCPath Compensation Report

    payroll_status: "Indicates whether the person is active, retired, terminated, or on leave. This field is pulled from UCPath.",

    scale_plus_off_scale: "The on-scale rate (UCANNL rate code) plus the appointee's off-scale (UCOFF1).",

    on_scale_amt: "The on-scale rate (PATH rate code UCANNL)",

    off_scale_amt: "The appointee's off-scale rate (PATH rate code UCOFF1).",

    off_scale_percent:"The appointee's off-scale rate divided by their on-scale rate.",

    above_scale: "Pay rate for appointee above Step 9 (PATH rate code UCABVE).",

    NSTP: "The Negotiated Salary Trial Program",

    NSTP_not_firm: "Pay rate above the approved salary that an NSTP participant has negotiated (PATH rate code UCGCYN).",

    HSCP_X_X: "The X component rate (Scale 0) plus the X' component rate (determined by appointee's APU).",

    HSCP_X: "X component of Health Comp Plan (PATH rate code UCHSX)",

    HSCP_X_prime: "X' component of Health Comp Plan (PATH rate code UCHSP)",

    HSCP_above_scale_X: "X component for appointee above Step 9 (PATH rate code UCHSAX)",

    HSCP_above_scale_X_prime: "X' component for appointee above Step 9 (PATH rate code UCHSAP)",

    HSCP_Y: "Y component of Health Comp Plan (PATH rate code UCHSY)",

    HSCP_Y_not_firm: "Y component (not firm) of Health Comp Plan (PATH rate code UCHSN)",

    effective_date_last_advancement: "The date of the appointee's last advancement in rank or step. Range Adjustments made to a salary scale and paid to all appointees on that scale do not count as advancement actions.",

  // Admin Comp
  // Allocations
    organizationNameForAllocations: "The name of the unit receiving funds. This may be a unit within a school or department that is not a traditional academic unit.",

    titleForAllocations: "The administrative role that is being funded.",

    stipendForAllocations: "The amount allocated to this unit/role by the EVCP for stipends.",

    ninthsForAllocations: "The number of 9ths allocated to this unit/role by the EVCP.",

    ninthsAmountForAllocations: "The amount allocated to this unit/role by the EVCP for 9ths.",

    fullTimeEquivalentForAllocations: "The percentage of the FTE funded by the EVCP.",

    organizationNameForAllocationsInAddModal: "We have autopopulated the field with the unit name based on your selection above. If the administrative duties are for a campus-level unit or for a center or unit that was not available in the search, please edit the field with the correct unit name.",

    unitForAllocationsInAddModal: "The unit receiving funds from the EVCP. If the allocations are for a campus-level unit, choose campus. If the allocations are for a unit or center that is not available,choose the school or division the unit is most closely related to, then update the Organization Name field.",

  // Proposals
    organizationNameForProposalsDatatable: "The organization for which administrative duties are performed. This may not be a traditional academic unit (e.g., service on CAP, Director of the Botanical Garden).",

    organizationNameForProposalsModal: "Populated with the unit name based on your selection above. If the administrative duties are for a campus-level unit or for a center or unit that was not available in the search (e.g., Graduate Division or CAP), please edit the field with the correct unit name.",

    organizationNameForProposalsFinalDecision:"Populated with the unit name based on the selected unit. If the administrative duties are for a campus-level unit or for a center or unit that was not available, the correct unit name should be displayed here.",

    titleCodeForProposals: "The administrative title code. If compensation is for duties that do not require an administrative appt. (e.g., committee service), use the professorial title code.",

    approvedTitleCode: "The approved administrative title code. If compensation is for duties that do not require an administrative appt. (e.g., committee service), this may reflect the professorial title code.",

    ucPathEffectiveDt: "Denotes when the transaction became or becomes formally active or operational.",

    totalApprovedStipendAmt: "Approved stipends from each source and the total stipend amount.",

    totalApproved9thsAmt: "Approved 9ths from each source and the total 9ths amount (number of 9ths x 9ths rate).",

    ucPathTotalYTDAdminComp: "Sum of the stipends and 9ths paid out for the Job in the given fiscal year.",

    ucPathTotalYTD9thsAmt: "The total amount paid out on the ACA (Additional Comp-Admin) earn code for the Job in the given fiscal year.",

    ucPathTotalYTDStipendAmt: "The total amount paid out on the STP (Stipend-Admin-Academic) earn code for the Job in the given fiscal year.",

    workingTitleForProposals: "If the compensation is for administrative duties that do not require an administrative appt. (e.g., committee service), clarify the role of the faculty member (e.g., Committee Chair). Otherwise, specify the working title of the administrative appt.",

    workingTitleForProposalsTable: "The working title if the compensation is for administrative duties that do not require an administrative appt. (e.g., committee service).",

    justificationForProposals: "This field is only required if compensation applies to a non-administrative appointment.",

    multipleAdminApptsForProposals: "If there are multiple appts. that will have administrative compensation, APO will need to ensure the total across all of the appointments does not go over the Indexed Compensation Level.",

    proposedFTE: "The proposed amount of the FTE that will be funded by the Chancellor&apos;s Office and other sources.",

    approvedFTE: "The approved amount of the FTE that will be funded by the Chancellor&apos;s Office and other sources.",

    proposedStipends: "Proposed stipends from each source and the total stipend amount.",

    approvedStipends: "Approved stipends from each source and the total stipend amount.",

    proposedAdministrativeNinths: "Proposed 9ths from each source and the total 9ths amount (number of 9ths x 9ths rate).",

    approvedAdministrativeNinths: "Approved 9ths from each source and the total 9ths amount (number of 9ths x 9ths rate).",

    baseSalary: "This amount may be manually entered, rather than pulled from Path, if the faculty member will have a new base salary at the time of the administrative appointment. This amount does not include NSTP.",

    baseSalaryEdit: "Prepopulated with the faculty member’s annual rate. It does not include NSTP. Update the amount to reflect the scale+offscale rate if not reflected. You should also update the amount  if the faculty member has been approved for a salary increase effective on or before the start of the administrative appointment.",

    totalAdminComp: "Sum of stipends and administrative 9ths. Does not include base salary.",

    totalApprovedAdminComp: "Sum of approved stipends and 9ths. Does not include base salary.",

    totalComp: "Sum of administrative compensation and base salary.",

    totalProposedComp: "Sum of proposed administrative compensation and base salary.",

    totalApprovedComp: "Sum of approved administrative compensation and base salary.",

    overICL: "If there is no approved compensation, this field shows whether the Total Proposed Compensation is above the Indexed Compensation Level (ICL) or not. If there is approved compensation, this field shows if the Total Approved Compensation is above the ICL or not.",
	
    nstp: "Marked as “Yes” if the faculty member will participate, or is considering participating in the NSTP at the same time as their administrative appointment.",
	
    deanSubmissionDate: "The most recent date the Dean&apos;s office submitted the proposal.",

    revisionRequestedDate: "The most recent date APO requested revisions.",

    eVCPApprovalDate: "The date the EVCP approved the proposal.",

    uCOPApprovalDate: "The date UCOP approved the proposal (if applicable).",

    completedDate: "The date APO approved the proposal in the system.",

    AYcompleted: "The academic year in which the case was completed.",

    AYeffective: "The academic year for which the case was effective.",

    commentsForProposals: "Comments entered by APO on the approval.",

    typeOfAppointment: "If the stipend amount or the # of 9ths increased, this is a reappointment with change in compensation. If only the amount for the 9ths increased due to an increase in base salary, but the stipend and # of 9ths stayed the same, this is a reappointment, no change in compensation.",

    endDate: "Administrative appointments are considered  year-to-year appointments.",

    unitOfProposals: "Search for the unit the candidate will be appointed to. If the administrative duties are for a campus level unit, choose campus. If the administrative duties are for a unit or center that is not available, choose the school or division the unit is most closely related to, then update the Organization Name field.",

    FTEEVCP:"The portion of the FTE that will be supported by the EVCP.",

    FTEOther: "The portion of the FTE that will be supported by units other than the EVCP.",

    StipendForProposal: "Allocated funds from the EVCP for the selected unit.",

    proposedStipendOther: "Enter the name of any other units providing stipends for these administrative duties.",

    // StipendOtherAmount: "The amount of the stipend provided by the unit.",

    NSTPforProposals: "Select “Yes” if the faculty member will participate, or is considering participating, in the NSTP at the same time as their administrative appointment. APO will follow up with the Dean’s Office for more information.",

    ninthsAllocated: "Allocated Administrative 9ths from the EVCP for the selected unit.",

    ninthsRateForProposal: "Enter the rate based on the faculty member’s base salary (scale + offscale). The rate should not include NSTP.",

    ninthsRateOtherSourceForProposal: "Enter the name of any other units providing 9ths for these administrative duties.",

    proposedNinthsOther: "Enter the name of any other units providing 9ths for these administrative duties.",

    numOfNinthsAdmin: "The number of 9ths provided by the unit.",

    estCostToSchool: "If your school has a standard rate it assigns for course releases, enter it here",

    totalProposedAdminCompForProposal: "Sum of proposed stipends and administrative 9ths. Does not include base salary.",

    numberCourses:"The number of classes the faculty member is being released from due to administrative service.",

    estimatedCostSchool: "If your school has a standard rate it assigns for course releases, enter it here.",

    unitSearch: "Search for the unit the candidate will be appointed to. If the administrative duties are for a campus-level unit, choose Campus. If the administrative duties are for a unit or center that is not available, choose the school or division the unit is most closely related to, then update the Organization Name field.",

    unitSelected: "The unit the candidate will be appointed to. If the administrative duties are for a campus-level unit, Campus will be displayed. If the administrative duties are for a unit or center that is not available, the school or division the unit is most closely related to should be displayed and the Organization Name field should show the correct unit.",

    deanSubmission: "The date the Dean's office submitted the proposal.",

    EVCPApproval: "The date the EVCP approved the proposal.",

    UCOPApproval: "The date UCOP approved the proposal (if applicable).",

    completed: "The date APO approved the proposal in the system.",

    ucPathdepartment: "The department associated with the Job for which administrative compensation is being paid.",
	
    ucPathDept: "The faculty member's primary department in UCPath. ",

    department: "If the UCPath position is based in a sub-unit or affiliate of an Academic Department, Opus will display the Academic Department associated with that sub-unit's department code.",

    activity: "The type of compliance activity being reported, e.g., required training courses or certifications.",

    activityStatus: "Indicates whether the faculty member is in or out of compliance for a specific requirement.",

    activityLastCompletedDt: "The date the faculty member last completed the required activity.",

    personnelActions: "List of salary-impacting actions with an effective date prior to or within the same academic year as the proposal.",
	

  // Conditional tooltips for Admin Comp
    otherSourceStipendName: "Enter the name of any other units providing stipends for these administrative duties.",

    otherSourceNinthsName: "Enter the name of any other units providing 9ths for these administrative duties.",

    proposedSourceDisabledWithApprovedSource: "The proposed funding from this source was deleted after final approval. You can no longer edit this row.",

    proposedSourceWithoutApprovedSource: "The proposed funding from this source was disapproved. We have retained the proposed value for our records.",

    approvedSourceDisabled: "The proposed funding from this source was disapproved. We have retained the proposed value for our records.",

  // approvedSourceWithoutProposedSource: '',
    prepopulateDisabled: `Once you start editing the form, the pre-populate button is disabled.
    If you want to pre-populate the form, close this modal and reopen it. You will lose any changes you've made.`,

  // Multiple Locations
    additionalLocations: "",

  //Endowed Chairs
  endowedChairName: "The name of the Endowed Chair.",
  unitSearchForEndowedChairModaL: "Search for the unit the Endowed Chair is related to. If the Chair is related to a unit or center that is not available, choose the school or division the Chair is most closely related to, then update the Organization Name field.",
  organizationNameForEndowedChairModal: "The name of the unit responsible for the Chair. This may not be a traditional academic unit. This field is pre-populated with a unit name based on your selection above. If the Chair is related to a campus-level unit or for a center or unit that was not available in the search (e.g., Graduate Division, or CAP), please edit the field with the correct unit name.",
  designationForEndowedModal: "A description of the Chair. If the Chair is Administrative, the designation may include the Administrative title associated with the Chair. Summarize the most important details - departments should check with their dean’s office or development office for further details about the Chair.",
  lastOccupiedForEndowedModal: `The date a faculty member last held the Chair.<br>    
  <br>If there is a current Chair Holder, this field will be blank. Otherwise, this field will display the end date of the last incumbent’s term. If no one has ever held the Chair, this field will display the establishment date. This field is updated nightly and when Chair Holder information is edited.`,
  yearsUnoccupiedForEndowedModal: `If the Chair is not currently filled, this field will calculate the number of years the Chair has been unfilled based on the end date of the last incumbent’s term. <br>
  <br>If there is a current Chair Holder, this field will be blank. This field is updated nightly and when Chair Holder information is edited.`,
  ecActiveCases: "The case icon is visible if there is an Endowed Chair action in progress for this Chair. The case icon will disappear when the appointment is effective. Click into the Endowed Chair record to find a link to the case in Opus.",
  orgName: "The name of the unit responsible for the Chair. This may not be a traditional academic unit.",
  chairStatus: `<b>Active </b>
              <br> The Chair is currently established.
              
              <br><br><b>Pending</b>
              <br>The Chair is in the process of being established and is not yet active.
              
              <br><br><b>Modification Request</b>
              <br>A change to the Chair is being reviewed.
              
              <br><br><b>Disestablished</b>
              <br>The Chair is no longer active and has been disestablished.

              <br><br><b>Inactive</b>
              <br>The Chair is not active currently, but may become active again.
              
              <br><br><b>Incomplete</b>
              <br>The establishment process was initiated, but the Chair was never approved.`,
  dateEstablished: "The date the request to name and establish the Chair was approved.",
  dateDisestablished: "The date the Chancellor approved the disestablishment of the Chair.",
  chairTypeForModal: `<b>Administrative Chair </b>
              <br> An Administrative Chair is linked to a specific admin. position as stipulated in the establishment paperwork. Appt. to an Administrative Chair is limited to the faculty member who holds the designated admin. position.
              <br> <b>Dean's Chair</b>
              <br>An Endowed Chair linked to a Deanship. The payout from the endowment is to be used for the teaching, research and service activities of the department, research unit, school or college.
              
              <br><b>Limited Time-Appointment Chair</b>
              <br>Appt. to a Limited Time Chair is for the timeframe predetermined by the establishment paperwork. The Chair will automatically disestablish at the predetermined time.
              
              <br><b>Permanent-Appointment Chair</b>
              <br>Appt. to a Permanent Chair is for the faculty member’s term as an active faculty member.
              
              <br><b>Term-Appointment Chair</b>
              <br>Appt. to a Term Chair is for a period of five years unless otherwise stipulated in the establishment paperwork, as agreed upon by the donor and departmental faculty.
              
              <br><b>Other</b>
              <br>The Chair is not one of the types listed above (e.g., Presidential or Prof. Name Chair). Please add a comment if selecting Other.`,
  chairTerm: "The length of time (in years) a faculty member is appointed to a Chair as stipulated in the establishment paperwork.",
  termRenewableForModal: `<b>Limited </b>
              <br>A Chair Holder may be reappointed, in accordance with University policy and procedures, for a limited number of terms as stipulated in the establishment paperwork.
              
              <br><b>Non-Renewable</b>
              <br>A Chair Holder may not be reappointed as stipulated in the establishment paperwork.
              
              <br><b>Renewable</b> 
              <br>A Chair Holder may be reappointed in accordance with University policy and procedures.
              
              <br><b>Other </b>
              <br>The terms of the Chair describe an arrangement other than one of the above. Please add a comment if selecting Other.`,
  fundingTypeForModal: `<b>Presidential Matching Program</b>
              <br>Funding provided by UCOP to match donor funds in support of an Endowed Chair.
                
              <br><b>Presidential Retention</b>
              <br>Chair established to retain a faculty member and, in general, will disestablish when it is vacant. The Chair is funded locally.
                
              <br><b>Regents Presidential</b>
              <br>Funding provided by the UC Regents in support of a Presidential Chair.
                
              <br><b>Other </b>
              <br>The terms of the Chair describe an arrangement other than one of the above. Please add a comment if selecting Other.`,
  designation: "A description of the Chair. If the Chair is Administrative, the designation may include the Administrative title associated with the Chair. Please note, this is a summary. Check with your dean’s office or development office for further details about the Chair.",
  lastOccupied: `The date a faculty member last held the Chair.<br>    
  <br>If there is a current Chair Holder, this field will be blank. Otherwise, this field will display the end date of the last incumbent’s term. If no one has ever held the Chair, this field will display the establishment date.`,
  yearsUnoccupied: `If the Chair is not currently filled, this field will calculate the number of years the Chair has been unfilled based on the end date of the last incumbent’s term. <br>
  <br>If there is a current Chair Holder, this field will be blank.`,
  chairHolder: "The name of the faculty member currently appointed to the Chair. This field will be blank if no one currently holds the Chair.",
  empStatus: `Employee Status indicates whether the person is active, retired, terminated, or on leave. This field is pulled from UCPath and may be labeled Payroll Status in the UCPath interface. <br>
  <br>Once someone is retired or terminated, they may no longer hold an Endowed Chair.`,
  chairApptEffDate: "The date the appointee started serving as Chair. If an appointee serves multiple terms, this date will show the effective date of their most recent term.",
  chairApptEndDate: "The date the appointee’s term as Chair is set to end. If an appointee has served multiple terms, this date will show the end date of the current term.",
  ecSeries: "The series the Chair Holder was in at the time of their appointment to the Endowed Chair.",
  ecRank: "The rank the Chair Holder held at the time of their appointment to the Endowed Chair.",
  chairTypeForTables: `<b>Administrative Chair </b>
              <br> An Administrative Chair is linked to a specific admin. position as stipulated in the establishment paperwork. Appt. to an Administrative Chair is limited to the faculty member who holds the designated admin. position.
              <br> <b>Dean's Chair</b>
              <br>An Endowed Chair linked to a Deanship. The payout from the endowment is to be used for the teaching, research and service activities of the department, research unit, school or college.
              
              <br><b>Limited Time-Appointment Chair</b>
              <br>Appt. to a Limited Time Chair is for the timeframe predetermined by the establishment paperwork. The Chair will automatically disestablish at the predetermined time.
              
              <br><b>Permanent-Appointment Chair</b>
              <br>Appt. to a Permanent Chair is for the faculty member’s term as an active faculty member.
              
              <br><b>Term-Appointment Chair</b>
              <br>Appt. to a Term Chair is for a period of five years unless otherwise stipulated in the establishment paperwork, as agreed upon by the donor and departmental faculty.
              
              <br><b>Other</b>
              <br>The Chair is not one of the types listed above (e.g., Presidential or Prof. Name Chair). See Comments.`,
  termRenewableForTables: `<b>Limited </b>
              <br>A Chair Holder may be reappointed, in accordance with University policy and procedures, for a limited number of terms as stipulated in the establishment paperwork.
              
              <br><b>Non-Renewable</b>
              <br>A Chair Holder may not be reappointed as stipulated in the establishment paperwork.
              
              <br><b>Renewable</b> 
              <br>A Chair Holder may be reappointed in accordance with University policy and procedures.
              
              <br><b>Other </b>
              <br>The terms of the Chair describe an arrangement other than one of the above. See Comments.`,
  fundingTypeForTables: `<b>Presidential Matching Program</b>
              <br>Funding provided by UCOP to match donor funds in support of an Endowed Chair.
                
              <br><b>Presidential Retention</b>
              <br>Chair established to retain a faculty member and, in general, will disestablish when it is vacant. The Chair is funded locally.
                
              <br><b>Regents Presidential</b>
              <br>Funding provided by the UC Regents in support of a Presidential Chair.
                
              <br><b>Other </b>
              <br>The terms of the Chair describe an arrangement other than one of the above. See Comments.`,
  chChairHolderForTables: "The name of the faculty member who has a current, past, or pending appointment for the selected Endowed Chair.",
  chEmpStatusForTables: `Employee Status indicates whether the person is active, retired, terminated, or on leave. This field is pulled from UCPath and may be labeled Payroll Status in the UCPath interface. <br>
              Endowed Chairs are for active faculty members.`,
  chairApptStatusForTables: `The status of the Endowed Chair appointment. 
              <br><b> Prospective</b>
              <br>The Chair appointment is pending. The status will be updated to "appointed" on the effective date, or "removed" if the case is withdrawn, or "archived" on the appointment end date. A person with a "prospective" Endowed Chair appointment will not be displayed on the main Endowed Chair report page.
              
              <br><b>Appointed</b>
              <br>The Chair appointment is active. The status will be updated to "archived" on the appointment end date. A person with an "active" Endowed Chair appointment will be displayed on the main Endowed Chair report page. 
              
              <br><b>Archived</b>
              <br>The Chair appointment has ended. A person with an "archived" Endowed Chair appointment will not be displayed on the main Endowed Chair report page.
              
              <br><b>Removed</b>
              <br>The Chair appointment case was withdrawn or the appointment was removed by an administrator. A person with a "removed" Endowed Chair appointment will be displayed on the main Endowed Chair report page. `,

  chChairApptEffDateForTables: "The date the appointee started serving as Chair. If an appointee served multiple terms, you should see one row for each term. If the Chair appointment is pending, the effective date may be in the future. ",
  chchairApptEndDateForTables: "The date the appointee’s term as Chair ended or is set to end. If an appointee served multiple terms, you should see one row for each term.",
  chSeriesForTables: "The series the Chair Holder was in at the time of their appointment to the Endowed Chair. If the Chair appointment is pending, this field will continue to be updated until the Endowed Chair appointment is approved. ",
  chRankForTables: "The rank the Chair Holder held at the time of their appointment to the Endowed Chair. If the Chair appointment is pending, this field will continue to be updated until the Endowed Chair appointment is approved.",
  linkToOpusCase: "Link to the Endowed Chair case in Opus for the selected appointee and Chair term. ",
  chCommentsForTables: "Comments entered by APO.",
  activeAppointmentForECHoldersTable:"The case icon is visible if there is an Endowed Chair action in progress for this person for the selected Endowed Chair. The case icon will disappear when the appointment is effective.",

  // EC Holders Modal
  chChairHolderForModal: "The name of the faculty member who has a current, past, or pending appointment for the selected Endowed Chair. Names may only be edited through UCPath.",
  chEmpStatusForModal: `Employee Status indicates whether the person is active, retired, terminated, or on leave. This field is pulled from UCPath and may be labeled Payroll Status in the UCPath interface. <br>
                Endowed Chairs are for active faculty members.`,
  chairApptStatusForModal: `The status of the Endowed Chair appointment. This field is automatically updated by Opus and should only be edited manually if a correction is needed or if adding historical appointments.
                <br><b> Prospective</b>
                <br>The Chair appointment is pending. The status will be updated to "appointed" on the effective date, or "removed" if the case is withdrawn, or "archived" on the appointment end date. A person with a "prospective" Endowed Chair appointment will not be displayed on the main Endowed Chair report page.
                
                <br><b>Appointed</b>
                <br>The Chair appointment is active. The status will be updated to "archived" on the appointment end date. A person with an "active" Endowed Chair appointment will be displayed on the main Endowed Chair report page. 
                
                <br><b>Archived</b>
                <br>The Chair appointment has ended. A person with an "archived" Endowed Chair appointment will not be displayed on the main Endowed Chair report page, but will be visible on the Chair Holder table.
                
                <br><b>Removed</b>
                <br>The Chair appointment case was withdrawn or the appointment was removed by an administrator.  A person with a "removed" Endowed Chair appointment will NOT be displayed on the main Endowed Chair report page or on the Chair Holder table.  `,
  chChairApptEffDateForModal: `The date the appointee started serving as Chair. If an appointee served multiple terms, you should see one row for each term. If the Chair appointment is pending, the effective date may be in the future. 
                This field is populated from the action. If there is an error and the action is not yet effective, correct the data on the action and Opus will update the Chair Holder data. If the action is already effective, please correct the action AND the Chair Holder data.`,
  chchairApptEndDateForModal: `The date the appointee’s term as Chair ended or is set to end. If an appointee served multiple terms, you should see one row for each term. This field is populated from the action. 
                If there is an error and the action is not yet effective, correct the data on the action and Opus will update the Chair Holder data. If the action is already effective, please correct the action AND the Chair Holder data.`,
  chSeriesForModal: `The series the Chair Holder was in at the time of their appointment to the Endowed Chair. If the Chair appointment is pending, this field will continue to be updated until the Endowed Chair appointment is approved. 
                This field is populated from the action. If there is an error and the action is not yet effective, correct the data on the action and Opus will update the Chair Holder data. If the action is already effective, please correct the action AND the Chair Holder data.`,
  chRankForModal: `The rank the Chair Holder held at the time of their appointment to the Endowed Chair. If the Chair appointment is pending, this field will continue to be updated until the Endowed Chair appointment is approved. 
                This field is populated from the action. If there is an error and the action is not yet effective, correct the data on the action and Opus will update the Chair Holder data. If the action is already effective, please correct the action AND the Chair Holder data.`,
  chCommentsForModal: "Comments will be visible to department and dean's office staff.",

  // Export to Excel exportData default message (Also in Datatable.js 'findExportData')
  exportDataDefaultMessage: "There is no data available for export. Please check your datatable settings and try again.",

};

