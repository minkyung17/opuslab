/**
 *
 * @desc - If value in "blank" it is regarded as blank. Only meant for internal
 *  use
 * @param {Number} value -
 * @param {Object} blank -
 * @returns {Bool|Object} -
 *
 **/
export function isBlank(value, blank = {"": true, null: true, undefined: true}) {
    return value in blank;
}

/**
 *
 * @name isAtLeastZero
 * @desc - Number is zero.
 * @param {Number} number -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 **/
export function isAtLeastZero(number, returnMessage = false) {
    let isNumber = !isNaN(parseFloat(number)) && !isNaN(number);
    isNumber = number >= 0;

    if(returnMessage) {
        isNumber = {isValid: isNumber, message: "Please enter a positive number."};
    }
    return isNumber;
}


/**
 *
 * @name isAtLeastZero_BlankOk
 * @desc - Number is zero, but blank is allowed
 * @param {Number} number -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 **/
export function isAtLeastZero_BlankOk(number, returnMessage = false) {
  //Get the regular validation
    let isMatch = isAtLeastZero(number, returnMessage);

  //If its blank then it is valid
    if(isBlank(number)) {
        isMatch.isValid = true;
    }

    return isMatch;
}

/**
 *
 * @name isValidDate
 * @desc - checks if date has the format DD/MM/YYYY or MM/DD/YYYY
 * @param {String} date - date string
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 **/
export function isValidDate(date, returnMessage = false) {
    let dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
    let isMatch = dateRegex.test(date);

    if(returnMessage) {
        isMatch = {message: "Date entered does not match MM/DD/YYYY format",
      isValid: isMatch};
    }
    return isMatch;
}


/**
 *
 * @name stringNotBlank
 * @desc - really? ;-)
 * @param {String} string -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function stringNotBlank(string = "", returnMessage = false) {
    let notBlank = (string || "").trim().length > 0;
    if(returnMessage) {
        notBlank = {isValid: notBlank, message: "Please fill out this required field."};
    }

    return notBlank;
}

/**
 *
 * @desc - really? ;-)
 * @param {Number} number -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isNumberPresent(number, returnMessage = false) {
    let isNumber = !isNaN(parseFloat(number)) && !isNaN(number);
    if(returnMessage) {
        isNumber = {isValid: isNumber, message: "Please fill out this required field."};
    }

    return isNumber;
}

/**
 *
 * @name isYearBefore1900
 * @desc - tests if year entered is before 1900
 * @param {String} _date -
 * @param {Bool} returnMessage - Do you want to return a message
 * @param {Bool} year -
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isYearBefore1900(_date, returnMessage = false, year = 1900) {
    let date = _date || "";
    let [parsedYear] = date.match(/\d{4}/) || [];

    let isAValidDate = Number(parsedYear) >= year;
    if(returnMessage) {
        isAValidDate = {message: `Please enter a year after ${year}.`,
      isValid: isAValidDate};
    }

    return isAValidDate;
}

/**
 *
 * @name isYearAfter2100
 * @desc - tests if year entered is after 2100
 * @param {String} _date -
 * @param {Bool} returnMessage - Do you want to return a message
 * @param {Bool} year - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isYearAfter2100(_date = "", returnMessage = false, year = 2100) {
    let date = _date || "";
    let [parsedYear] = date.match(/\d{4}/) || [];

    let isAValidDate = Number(parsedYear) <= year;
    if(returnMessage) {
        isAValidDate = {message: `Please enter a year before ${year}.`,
      isValid: isAValidDate};
    }

    return isAValidDate;
}


/**
 *
 * @name isValidNumber
 * @desc -
 * @param {String} number -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isValidNumber(number, returnMessage = false) {
    let isValidNumber = !isNaN(number);
    if(returnMessage) {
        isValidNumber = {isValid: isValidNumber, message: "Number entered is not valid"};
    }

    return isValidNumber;
}

/**
 *
 * isPositiveNumber()
 *
 * @desc -
 * @param {String} number -
 * @param {Bool} returnMessage - Do you want to return a message
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isPositiveNumber(number, returnMessage = false) {
    let isPositiveNumber = false;
    if (number >= 0) {
        isPositiveNumber = true;
    }
    if(returnMessage) {
        isPositiveNumber = {isValid: isPositiveNumber, message: "Please enter a positive number."};
    }

    return isPositiveNumber;
}


/**
 *
 * @name isWholeNumber
 * @desc -
 * @param {String} number -
 * @param {Bool} returnMessage - json
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isWholeNumber(number, returnMessage = false) {
    let isWholeNumber = Number.isInteger(Number(number));
    if(returnMessage) {
        isWholeNumber = {isValid: isWholeNumber, message: "Please enter a whole number."};
    }

    return isWholeNumber;
}

/**
 *
 * @name isDecimalNumber
 * @desc -
 * @param {String} number -
 * @param {Bool} returnMessage - json
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isDecimalNumber(number, returnMessage = false) {
    var num = /^[-+]?[0-9]+$/;
    let isDecimalNumber = number.toString().match(num);
    if(returnMessage) {
        isDecimalNumber = {isValid: isDecimalNumber, message: "Please enter a whole number."};
    }

    return isDecimalNumber;
}


/**
 *
 * @name isWholeNumber
 * @desc -
 * @param {String} number -
 * @param {Bool} returnMessage - json
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isWholeNumber_BlankOk(number, returnMessage = false) {
    let _isWholeNumber = isWholeNumber(number, returnMessage);

    if(isBlank(number)) {
        _isWholeNumber.isValid = true;
    }

    return _isWholeNumber;
}


/**
 *
 * @name isValidPercent
 * @desc - 11/22/22 IOK-502 In case flow, CS: proposed and CS: final decision, for any action that displays Percent Time, update the validation rule to allow a max of 150%. Changed from 100%.
 * @param {String} num -
 * @param {Bool} returnMessage - json
 * @returns {Bool|Object} - will return if it passes.  If it doesnt will have an error message
 *
 */
export function isValidPercent(num, returnMessage = false) {
    let number = Number(num);
    let isAValidPercent = (number >= 0 && number <= 150);
    if(returnMessage) {
        isAValidPercent = {message: "Please enter a number between 0 and 150.",
      isValid: isAValidPercent};
    }

    return isAValidPercent;
}
