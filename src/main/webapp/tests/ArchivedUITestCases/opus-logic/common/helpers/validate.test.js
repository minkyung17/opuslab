import {assert} from 'chai';
import moment from 'moment';

import * as validations from '../../../../opus-logic/common/helpers/validations';

describe('Validations Functions', () => {

  it('isBlank()', () => {
    let isBlank = validations.isBlank();
    assert.isTrue(isBlank);

    isBlank = validations.isBlank('');
    assert.isTrue(isBlank);

    isBlank = validations.isBlank(null);
    assert.isTrue(isBlank);
  });

  it('isAtLeastZero() returns isValid as true for numbers >= 0', () => {
    let numbers = [0, 1];
    for(let number of numbers) {
      let returnMessage = true;
      let {isValid, message} = validations.isAtLeastZero(number, returnMessage);
      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });

  it('isAtLeastZero() returns isValid as false for bad numbers', () => {
    //let invalids = [null, '', -1, -0.5, 'words', /dads/, undefined];
    let invalids = [undefined, -1, -0.5, 'words', /dads/];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isAtLeastZero(invalid, returnMessage);
      assert.isNotTrue(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });

  it('isAtLeastZero_BlankOk() returns false for invalid inputs which arent blank',
  () => {
    let invalids = [-1, -0.5, 'words', /dads/];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isAtLeastZero_BlankOk(invalid, returnMessage);
      assert.isNotTrue(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });

  it('isAtLeastZero_BlankOk() returns true for valid numbers which arent blank',
  () => {
    let invalids = ['', ' ', 0, 0.01, 1];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isAtLeastZero_BlankOk(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });

  it('isValidDate() returns true - must be "MM/DD/YYYY"', () => {
    let invalids = ['11/12/2012', '11/12/0890', '65/12/0890'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidDate(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Date entered does not match MM/DD/YYYY format');
    }
  });

  it('isValidDate() returns false since dates must be "MM/DD/YYYY"', () => {
    let invalids = ['', '02/0220', '1/1/2001', '2001/11/11', '111/12/2012',
      'MK/12/2001', '12/12/200P'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidDate(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Date entered does not match MM/DD/YYYY format');
    }
  });

  it('stringNotBlank() returns false for invalid strings', () => {
    let invalids = ['', ' ', '     ', null, undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.stringNotBlank(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please fill out this required field.');
    }
  });


  it('stringNotBlank() returns true for string that are not blank', () => {
    let invalids = ['a string', 'a', 'two'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.stringNotBlank(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please fill out this required field.');
    }
  });

  it('isNumberPresent() returns false for invalid numbers', () => {
    let invalids = ['', 'word', null, undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isNumberPresent(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please fill out this required field.');
    }
  });


  it('isNumberPresent() returns true for valid numbers', () => {
    let invalids = [-1, 0, -0.5, 0.33333, 2001];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isNumberPresent(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please fill out this required field.');
    }
  });


  it('isYearBefore1900() returns false for invalid years', () => {
    //let invalids = [1899.99, 0, 1500, '', 'word', null, undefined, ];
    let invalids = ['1899.99', '0', '1500', '', 'word', null, undefined, ];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isYearBefore1900(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a year after 1900.');
    }
  });

  it('isYearBefore1900() returns true for valid years', () => {
    let invalids = ['1900', '1950', '2001', '3000000'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isYearBefore1900(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a year after 1900.');
    }
  });


  it('isYearAfter2100() returns false for invalid years', () => {
    //let invalids = ['15000', 1899.99, 0, 1500, '', 'word', null, undefined, ];
    let invalids = ['2200', '', 'word', null, undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isYearAfter2100(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a year before 2100.');
    }
  });


  it('isYearAfter2100() returns true valid number strings', () => {
    //let invalids = ['160'];
    let invalids = ['1900', '1950', '2001', '0160'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isYearAfter2100(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a year before 2100.');
    }
  });

  it('isValidNumber() returns false for invalid years', () => {
    //let invalids = [null, undefined, ];
    let invalids = ['1.3i', 'word',  undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidNumber(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Number entered is not valid');
    }
  });


  it('isValidNumber() returns true valid number strings', () => {
    let invalids = [0, -12, 10, 100000];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidNumber(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Number entered is not valid');
    }
  });

  it('isPositiveNumber() returns false for invalid years', () => {
    //let invalids = [null];
    let invalids = [-0.5, -1000, 'word', undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isPositiveNumber(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });


  it('isPositiveNumber() returns true valid number strings', () => {
    let invalids = [0, 1.342, '2', 10, 100000];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isPositiveNumber(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a positive number.');
    }
  });


  it('isWholeNumber() returns false for non-whole numbers', () => {
    //let invalids = [null];
    let invalids = [-0.5, -1000 + 1 / 3, '0.5', 'word', undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isWholeNumber(invalid, returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a whole number.');
    }
  });


  it('isWholeNumber() returns true valid whole numbers', () => {
    let invalids = [0, 1, -1, '-2', '2', 10, 100000];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isWholeNumber(invalid, returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a whole number.');
    }
  });

  it('isWholeNumber_BlankOk() returns false for non-whole numbers', () => {
    //let invalids = [null, undefined]; - retest
    let invalids = [-0.5, -1000 + 1 / 3, '0.5', 'word'];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isWholeNumber_BlankOk(invalid,
        returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a whole number.');
    }
  });


  it('isWholeNumber_BlankOk() returns true valid whole numbers', () => {
    let invalids = ['', ' ', 0, 1, -1, '-2', '2', 10, 100000];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isWholeNumber_BlankOk(invalid,
        returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a whole number.');
    }
  });

  it('isValidPercent() returns false for bad percents', () => {
    //let invalids = [null];
    let invalids = [-0.5, -1000 + (1 / 3), '103', 'word', undefined];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidPercent(invalid,
        returnMessage);

      assert.isFalse(isValid);
      assert.equal(message, 'Please enter a number between 0 and 100.');
    }
  });


  it('isValidPercent() returns true valid percent', () => {
    let invalids = [100, '100', 0, 1, '2', 10];

    for(let invalid of invalids) {
      let returnMessage = true;
      let {isValid, message} = validations.isValidPercent(invalid,
        returnMessage);

      assert.isTrue(isValid);
      assert.equal(message, 'Please enter a number between 0 and 100.');
    }
  });
});
