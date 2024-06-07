import {assert} from 'chai';
import {difference} from 'lodash';

import AppointmentBlock from '../../../../opus-logic/cases/modules/AppointmentBlock';

describe('AppointmentBlock Logic Class', () => {
  let Logic = new AppointmentBlock();

  it('getDeptCodeAffiliationApptStatusTypeTitle()', () => {
    let appointment = {
      affiliationType: {affiliation: 'Primary'}, appointmentStatusType: 'Prospective',
      academicHierarchyInfo: {departmentName: 'Art'}
    };

    let title = Logic.getDeptCodeAffiliationApptStatusTypeTitle(appointment);

    assert.equal(title, 'Art - Primary - Prospective');
  });

  it('getTitleCodePayrollText()', () => {
    let appointment = {titleInformation: {titleCode: '001100' ,
      payrollTitle: 'Continuing Lecturer'}};

    let titleText = Logic.getTitleCodePayrollText(appointment);

    assert.equal(titleText, '001100 - Continuing Lecturer');
  });

  it('getDisplayTextIfValueIsValid()', () => {
    let step = {value: 3, displayName: 'Step', displayText: '4'};

    let display = Logic.getDisplayTextIfValueIsValid(step);

    assert.equal(display, 'Step: 4');
  });

  it('getDisplayTextIfValueIsValid() invalid value returns null empty string', () => {
    let step = {value: null, displayName: 'Step', displayText: '4'};

    let display = Logic.getDisplayTextIfValueIsValid(step);

    assert.equal(display, '');
  });

  it('getDisplayTextIfDisplayTextIsValid()', () => {
    let step = {displayName: 'Step', displayText: '4'};

    let display = Logic.getDisplayTextIfDisplayTextIsValid(step);

    assert.equal(display, 'Step: 4');
  });

  it('getDisplayTextIfDisplayTextIsValid()', () => {
    let step = {displayName: 'Step', displayText: null};

    let display = Logic.getDisplayTextIfDisplayTextIsValid(step);

    assert.equal(display, '');
  });

  it('getDisplayString()', () => {
    let step = {displayName: 'Step', displayText: 'anything'};
    let display = Logic.getDisplayString(step);

    assert.equal(display, 'Step: anything');
  });

  it('adjustScaleTypeField() removes scaleType if displayText is null', () => {
    let fieldData = {scaleType: {displayName: 'Step', displayText: null}};
    let stringFields = {scaleType: {}};

    Logic.adjustScaleTypeField(fieldData, stringFields);

    assert.notExists(stringFields.scaleType);
  });

  it('adjustScaleTypeField() makes no changes if scaleType diplayText is valid',
  () => {
    let fieldData = {scaleType: {displayName: 'Step', displayText: '4'}};
    let stringFields = {scaleType: {}};

    Logic.adjustScaleTypeField(fieldData, stringFields);

    assert.equal(fieldData.scaleType.displayText, 4);
  });

  it('formatApptDisplayFields()', () => {
    let appt = {
      affiliationType: {affiliation: 'Primary'}, appointmentStatusType: 'Prospective',
      academicHierarchyInfo: {departmentName: 'Art'}, salaryInfo: {
        academicProgramUnit: {}}, titleInformation: {titleCode: '001100',
      payrollTitle: 'Continuing Lecturer'}
    };

    let apptDisplays = Logic.getDisplayFieldsFromAppointments([appt]);


    //let {fields, appointment} = apptDisplays[0];

    let data = Logic.formatApptDisplayFields({appointment: appt});

    //Must remove scaletype since im not using valid values
    let array = difference(Logic.fieldsToShow, ['scaleType']);
    assert.containsAllKeys(data, array);

  });

  it('getClonedApptDisplayData() creates fields', () => {
    let appointment = {appointmentPctTime: 10};
    let apptDisplay = Logic.getClonedApptDisplayData(appointment);

    assert.equal(apptDisplay.appointmentPctTime.displayText, '10%');

    assert.deepEqual(apptDisplay.appointment, appointment);
    assert.containsAllKeys(apptDisplay, Logic.fieldsToShow);
  });

  it('formatDisplayText()', () => {
    let fieldData = {
      salary: {displayType: 'money', displayText: '40000'},
      appointmentPctTime: {displayType: 'percent', displayText: '10'}
    };

    Logic.formatDisplayText(fieldData.salary);
    Logic.formatDisplayText(fieldData.appointmentPctTime);

    assert.equal(fieldData.salary.displayText, '$40,000.00');
    assert.equal(fieldData.appointmentPctTime.displayText, '10%');
  });

  it('getDisplayFieldsFromAppointments()', () => { });


  // it('getDisplayFieldsFromAppointments()', () => {
  //   let appointment = {
  //     affiliationType: {affiliation: 'Primary'}, appointmentStatusType: 'Prospective',
  //     academicHierarchyInfo: {departmentName: 'Art'}, salaryInfo: {},
  //     titleInformation: {titleCode: '001100', payrollTitle: 'Continuing Lecturer'}
  //   };
  //
  //   let apptDisplays = Logic.getDisplayFieldsFromAppointments([appointment]);
  //   let example = apptDisplays[0];
  //
  //   assert.containsAllKeys(example, ['appointment', 'fields', 'list', 'subtitle',
  //     'title']);
  //   assert.equal(example.appointment, appointment);
  //   assert.equal(example.subtitle, '001100 - Continuing Lecturer');
  //   assert.equal(example.title, 'Art - Primary - Prospective');
  //   assert.isArray(example.list);
  //   assert.isObject(example.fields);
  // });
});
