// import e from "cors";
import {keys, get, pick, values, filter, orderBy, chain, isNull, intersection,
  difference} from "lodash";

/************************************************************************
*
* @desc - Operations that have to do with manipulation of data within
*   arrays and objects
*
************************************************************************/

/**
 *
 * @desc - Takes an object and an array of key names. Returns the values of the 'picked' Object
 * @param {Object} first - first array
 * @param {Object} second - second array
 * @returns {Array} - intersection
 *
 */
export function getCommonKeysOfObjects(first = {}, second = {}) {
    return intersection(keys(first), keys(second));
}

export const comparator = (a, b) => {
    return a.toString().localeCompare(b.toString(), "en", { numeric: true });
};

// export const sorted = arr.sort((a, b) => {
//   return a.localeCompare(b, undefined, {sensitivity: 'base'});
// });

/**
 *
 * @name extractToArray
 * @desc - Takes an object and an array of key names. Returns the values of the 'picked' Object
 * @param {Object} object -
 * @param {Array} key_names -
 * @returns {Array} -
 *
 */
export function extractToArray(object = {}, key_names = []) {
    const arr = pick(object, key_names);
    return values(arr);
}

/**
 *
 * @desc - Copies array 'num_of_times' over and concatenates it into one
 * @param array
 * @param num_of_times
 * @returns {Array}
 *
 */
export function copyArray(array, num_of_times = 1) {
    let new_array = [];
    for(let i = 0; i < num_of_times; i++) {
        new_array = new_array.concat(array.slice(0));
    }
    return new_array;
}

/**
 * filterCollectionByObject()
 *
 * @desc - Return the array of objects in 'objectArray' that have been filtered by 'objectFilter'
 * @param objectArray
 * @param objectFilter
 *
 * @returns {Array | Objects}
 *
 */
export function filterCollectionByObject(objectArray = [], objectFilter = {}) {
    return filter(objectArray, objectFilter);
}


/**
 *
 * @name filterCollectionByObjectBoolean
 * @desc - Return the array of objects in 'objectArray' that have been filtered by 'objectFilter'
 * @param {Array} objectArray - objects to be filtered
 * @param {Object} objectFilter - filter rules
 * @param {Boolean} filterBoolean -
 * @returns {Array} array - filtered array
 *
 */
export function filterCollectionByObjectBoolean(objectArray = [], objectFilter = {},
  filterBoolean = true) {

    const objectFilterKeys = Object.keys(objectFilter);
    let array = [];

    //Iterate through list of objects
    objectArray.map(each => {
        //Keep track of each resulting meeting all filter requirements
        let meetsFilterRequirements = true;

        //Loop through keys of the objectFilter to determine whether each key
        //is positively present i.e. == true in the objectFilter
        objectFilterKeys.map(key => {
            //Each results value
            const filter_value = each[key];
   
            // OPUS-7365 object Location field should match all location fields
            if(key==="location"){
                let meetsLocationRequirements = false;
                let objectLocationArray = [];
                if(filter_value!==null){
                    // object locations
                    objectLocationArray = filter_value.split(",");
                }

                // Loop through each row's location field and find location names
                for(let eachLocation of objectLocationArray){
                    let locationNameArray = eachLocation.split(":");
                    let locationName = locationNameArray[0];
                    // Need to remove spaces created by : split except for UCLA Campus
                    if(locationNameArray[0]!=="UCLA Campus"){
                        locationName = locationNameArray[0].slice(1);
                    }

                    // Loop through location filters and find the correct location filter
                    for(let [id, objectFilterValue] of Object.entries(objectFilter[key])) {
                        if(id===locationName){
                            // objectFilterValue has to be true to match requirements
                            if(objectFilterValue){
                                meetsLocationRequirements = true;
                            }
                        }
                    }
        

                }
                if(!meetsLocationRequirements){
                    meetsFilterRequirements = false;
                }
  
            }else{
                //Is 'each's' results doesnt match the filterBoolean it doesnt meet the
                //filter requirements
                if(objectFilter[key][filter_value] !== filterBoolean) {
                    meetsFilterRequirements = false;
                }
            }
        });

    //All the filter requirements have been met so lets add 'each' to
    //list of results
        if(meetsFilterRequirements) {
            array.push(each);
        }
    });

    return array;
}


/**
 * filterCollectionWithSpecifiedKeysByStringArray()
 *
 * @desc - Too many problems with this !!!!
 * @param {Array} objectArray
 * @param value
 *
 * @returns {Array | Objects}
 *
 */
export function filterCollectionWithSpecifiedKeysByStringArray(
  objectArray = [], stringsArray = [], selectedKeys) {
  //Remove empty strings from array
    let filteredStringsArray = stringsArray.filter(Boolean);
    let regex = new RegExp(stringsArray.join("|"), "i");

    return filter(objectArray, (obj) => {
    //1. Select specific keys of object
        let selected = pick(obj, selectedKeys);
    //2. Concatenate all values of an object into a string
        return (values(selected).join()
    //3. Perform case insensitive string match of 'matchme'
      .toLowerCase().match(regex) || []).length === filteredStringsArray.length;
    });
}

/**
 *
 * @desc - Searches for singular value in selected keys of array of objects
 *   and returns those objects
 * @param {Array} objectArray
 * @param {String} matchme
 * @param {Array} selectedKeys
 * @returns {Array | Objects}
 *
 */
export function filterCollectionWithSpecifiedKeysByValue(objectArray = [],
  matchme, selectedKeys) {
    let formattedMatchme = matchme.toLowerCase();//Case Insensitive search

    return filter(objectArray, (obj) => {
    //1. Select specific keys of object
        let selected = pick(obj, selectedKeys);
    //2. Concatenate all values of an object into a string
        return values(selected).join()
    //3. Perform case insensitive string match of 'matchme'
            .toLowerCase().match(formattedMatchme);
    });
}

/**
 *
 * @name orderByObjectArray
 * @desc -
 * @param objectArray
 * @param filterKeys
 * @param orderAscDesc
 * @returns {Array}
 *
 */
export function orderByObjectArray(objectArray = [], filterKeys = [],
  orderAscDesc = []) {
    return orderBy(objectArray, filterKeys, orderAscDesc);
}

/**
 *
 * @name stringMatchCollectionByKeyValue
 * @desc - Take an array of objects [{},{},{}] and if the object[key] === 'value'
 *    then that object is returned
 * @param {Array} objectArray -
 * @param {Array} key - name of key in each object
 * @param {Array} value - name of value to map key to
 * @returns {Array} - Array of Objects
 *
 */
export function stringMatchCollectionByKeyValue(objectArray = [], key, value) {
    let newValue = value.toLowerCase();

    return filter(objectArray, (each) =>{
    //Blank or null string so nothing to return
        if(each[key] === null || each[key].length === 0) {
            return false;
        }

    //Case insensitive string match for object array
        return each[key].toLowerCase().match(newValue);
    });
}

/**
 *
 * @desc - Object w/ invalid values that will be deleted
 * @param {Object} object -
 * @param {Object} invalidValues -
 * @returns {Object} object - clean object
 *
 **/
export function deleteKeysWithInvalidValues(object, invalidValues = {null: true, undefined: true}) {

    for(let key in object) {
        if(object[key] in invalidValues) {
            delete object[key];
        }
    }

    return object;
}


/**
 *
 * @desc - Separates object into key array and value array
 * @param {Object} object -
 * @returns {Arrays} -
 *
 */
export function destructureObjectIntoKeyValueArrays(object = {}) {
    let keys = [];
    let saveValues = [];

    for(let key in object) {
        keys.push(key);
        saveValues.push(object[key]);
    }
    return [keys, saveValues];
}

/**
 *
 * @name isArraySubsetOfArray
 * @desc -
 * @param {Array} subset -
 * @param {Array} set -
 * @returns {Array} - Array of Objects
 *
 */
export function isArraySubsetOfArray(subset = [], set = []) {
    return (subset.length === intersection(subset, set).length);
}

/**
 *
 * @name stringMatchCollectionByKeyValue
 * @desc - Take an array of objects [{},{},{}] and if the object[key] === 'value' then that
 *    object is returned.  Strip out comma
 * @param {Array} objectArray -
 * @param {String} key -
 * @param {String} value -
 * @return {Array} - Array of Objects
 *
 */
export function arrayStringMatchCollectionByKeyValue(objectArray = [], key, value) {
    let newValue = value.toLowerCase().replace(/,/g, "").trim();
    let subset = newValue.split(" ");

    return filter(objectArray, (each) =>{
    //Blank or null string so nothing to return
        if(each[key] === null || each[key].length === 0) {
            return false;
        }

    //Case insensitive string match of values for object array
        let full_string = each[key].toLowerCase().replace(/,/g, "");
        let value_pool = full_string.toLowerCase().split(" ");
    //Partial match?            Array subset match?
        return full_string.match(newValue) || isArraySubsetOfArray(subset, value_pool);
    });
}


/**
 *
 * @desc - Turn array of objects into a single object with a key value pair.
 *  Ex. arr = [{'name':Leon,job:'Programmer'},{name:'Barry', job:'The Flash'}] into
 *   arrayOfObjectsToKVObject(arr, 'name','job') = {Leon:Programmer, Barry:'The Flash'}
 * @param {Array} objectArray -
 * @param {Array} key_name - name of key in each object
 * @param {Array} value_name - name of value to map key to
 * @return {Object} -
 *
 */
export function arrayOfObjectsToKVObject(objectArray = [], key_name, value_name) {
    let newObj = {};
    for(let obj of objectArray) {
        newObj[obj[key_name]] = obj[value_name];
    }
    return newObj;
}

/**
  *
  * @desc - Turn array of objects into a single object with a key value pair.
  *  Ex. arr = [{'name':Leon,job:'Programmer', location:'Westwood'},
  *     {name:'Barry', job:'The Flash', location:'Central City'}] into
  *     arrayOfObjectsToArrayOfKVObjects(arr, 'name','job') =
  *     [{Leon:Programmer}, {Barry:'The Flash'}]
  * @param {Array} objectArray -
  * @param {Array} key_name - name of key in each object
  * @param {Array} value_name - name of value to map key to
  * @return {Array} -
  *
  **/
export function arrayOfObjectsToArrayOfKVObjects(objectArray = [], key_name,
  value_name) {
    let newArr = [];
    for(let obj of objectArray) {
        newArr.push({[obj[key_name]]: obj[value_name]});
    }
    return newArr;
}

/**
  *
  * @desc - Turn array of objects into a single object with a key value pair.
  *  Ex. arr = [{'name':Leon}, {job:'Programmer'}] into
  *     arrayOfObjectsToArrayOfKVObjects(arr) =
  *     {Leon:Programmer, {Barry:'The Flash'}
  * @param {Array} arrayOfSimpleObjects - ex [{'name':Leon}, {job:'Programmer'}]
  * @return {Object} - simple Object keyed by keys of each object in array
  **/
export function arrayOfObjectToObject(arrayOfSimpleObjects) {
    return Object.assign({}, ...arrayOfSimpleObjects);
}


 /**
  *
  * @name objectToArrayOfKVObjects
  * @desc - Turn single object into an array of objects with a key value pair.
  *  Ex. arr = {Leon:Programmer, Barry:'The Flash'} = [{'name':Leon,job:'Programmer'},
  *    {name:'Barry', job:'The Flash'}] into arrayOfObjectsToKVObject(arr, 'name','job')
  * @param {Object} object -
  * @param {Array} key_name - name of key in each object
  * @param {Array} value_name - name of value to map key to
  * @return {Array} -
  */
export function objectToArrayOfKVObjects(object = {}, key_name, value_name) {
    let arr = [];
    for(let key in object) {
        let obj = {[key_name]: key, [value_name]: object[key] };
        arr.push(obj);
    }
    return arr;
}


/**
 * @desc - Turn single object into an array of objects with a key value pair.
 *  Ex. arr = {Leon:Programmer, Barry:'The Flash'} = [{'name':Leon,job:'Programmer'},
 *    {name:'Barry', job:'The Flash'}] into arrayOfObjectsToKVObject(arr, 'name','job')
 * @param {Object} object -
 * @param {Array} key_name - name of key in each object
 * @param {Array} value_name - name of value to map key to
 * @return {Array} -
 */
export function objectToArrayOfSimpleKVObjects(object = {}) {
    let arr = [];
    for(let key in object) {
        let obj = {[key]: object[key] };
        arr.push(obj);
    }
    return arr;
}

 /**
  *
  * @name arrayOfObjectsToObjectByKey
  * @desc - Turn array of objects into a single object with a key value pair.
  *  Ex. arr = [{'name':Leon,job:'Programmer'},{name:'Barry', job:'The Flash'}] into
  *   arrayOfObjectsToObjectByKey(arr, 'name') = {Leon:{'name':Leon,job:'Programmer'},
        Barry:{name:'Barry', job:'The Flash'}}
  * @param {Array} objectArray -
  * @param {Array} key_name - name of key in each object
  * @param {Array} isKeyAPath - key is a path to nested object
  * @return {Object} newObj -
  *
  **/
export function arrayOfObjectsToObjectByKey(objectArray = [], key_name,
  isKeyAPath = false) {
    let newObj = {};
    for(let obj of objectArray) {
        let key = obj[key_name];
        if(isKeyAPath) {//If the key is nested
            key = get(obj, key_name);
        }

        newObj[key] = obj;
    }
    return newObj;
}

/**
 * @desc - Plucks values in 'object' by 'keys' in array
 *  Ex. obj = {a:1, b:2, c:3} & arr = ['a','c'] -> getObjectValuesByArray(obj, arr) =
 *
 * @param {Object} object -
 * @param {Array} array - name of key in each object
 * @param {Object} - name of key in each object
 * @return {Array} -
 **/
export function getObjectValuesByArray(object = {}, array = [], {join = false,
  separator = " "}) {
    let result = [];
    array.map(key => {
        if(key in object) {
            result.push(object[key]);
        }
    });

    if(join) {
        result = result.join(separator);
    }

    return result;
}


/**
 *
 * @name stringMatchCollectionByObject
 * @desc - Exactly like 'stringMatchCollectionByKeyValue' above but instead of
 *  'key','value' passed n separately they are passed in as one object.
 *   i This allows for multiple key-value pairs
 * @param {Array} objectArray -
 * @param {Object} object -
 * @returns {Array} newObjectArray -
 *
 */
export function stringMatchCollectionByObject(objectArray = [], object = {}) {
    let newObjectArray = null;
    for(let key in object) {
        newObjectArray = arrayStringMatchCollectionByKeyValue(objectArray, key, object[key]);
    }
    return newObjectArray;
}


/**
 *
 * @desc - Plucks values in 'object' by 'keys' in array
 *  Ex. obj = {a:1, b:2, c:3} & arr = ['a','c'] -> getObjectValuesByArray(obj, arr) =
 * @param {Array} arrayOfObjects -
 * @param {Array} array - name of key in each object
 * @param {Object} object - name of key in each object
 * @return {Array} -
 *
 **/
export function sortObjectArray(arrayOfObjects = [], {default_sort_direction = "asc",
  sort_key, sortOrder = [], sortDirection = []} = {}) {
    let newSortOrder = sort_key ? [sort_key] : sortOrder;
    let newSortDirection = sort_key ? [default_sort_direction] : sortDirection;

    return orderBy(arrayOfObjects, newSortOrder, newSortDirection);
}

/**
 *
 * @desc -
 * @param {Array} arrayOfObjects -
 * @return {Object} answer -
 *
 **/
export function flattenArrayOfObjects(arrayOfObjects = []) {
    let answer = {};
    for(let array of arrayOfObjects) {
        answer = {...answer, ...array};
    }

    return answer;
}

/**
 *
 * @desc - If object[key] == value in objectArray return the object[wanted]
 *  in the object Array
 * @param {Array} objectArray -
 * @param {String} wanted -
 * @param {String} key -
 * @param {String} value -
 * @returns {Array} - Array of Objects
 *
 */
export function pluckObjectKeysByObject(objectArray = [], wanted, key,
  value = true) {
    let array = chain(objectArray)
    //If key == value return the 'wanted' key
    .map(object => object[key] === value ? object[wanted] : null)
    .omitBy(isNull)//filter out undefined
    .toArray()
    .value();

    return array;
}

/**
 *
 * @name keySimpleObjectByValue
 * @desc - turns {a: 1, b: 2} into {1: {a:1}, 2: {b: 2}}
 * @param {Object} object -
 * @returns {Object} keyedObject - object keyed by value
 *
 **/
export function keySimpleObjectByValue(object = {}) {
    let keyedObject = {};
    for(let [key, value] of Object.entries(object)) {
        keyedObject[value] = {[key]: value};
    }
    return keyedObject;
}

/**
 *
 * @name reformatObjectIntoCollectionNotSortedByValue
 * @desc - keeps original sort {1: 'zz', 3: 'gg'} to [{1: 'zz', 3: 'gg'}]
 * @param {Object} object -
 * @returns {Array} -
 *
 **/
export function reformatObjectIntoCollectionNotSortedByValue(object = {}) {
    let keyedObject = keySimpleObjectByValue(object);
    let sortedValues = Object.keys(keyedObject);
    let sortedSimpleCollection = sortedValues.map(each => keyedObject[each]);
    return sortedSimpleCollection;
}

/**
 *
 * @name reformatObjectIntoCollectionSortedByValue
 * @desc - sorts by value {1: 'zz', 3: 'gg'} to [{3: 'gg'}, {1: 'zz'}]
 * @param {Object} object -
 * @returns {Array} -
 *
 **/
export function reformatObjectIntoCollectionSortedByValue(object = {}) {
    let keyedObject = keySimpleObjectByValue(object);
    let sortedValues = Object.keys(keyedObject).sort();
    let sortedSimpleCollection = sortedValues.map(each => keyedObject[each]);
    return sortedSimpleCollection;
}

/**
 *
 * @name getObjectValues
 * @desc - Gets the values of an object
 * @param {Object} object -
 * @returns {Array} -
 *
 **/
export function getObjectValues(object = {}) {
    return values(object);
}

/**
 *
 * @name allArrayValuesEqualToFunction
 * @desc - Checks that all array values are equal to 'equal' function
 * @param {Array} array -
 * @param {Function} equal -
 * @returns {Array} -
 *
 */
export function allArrayValuesEqualToFunction(array = [],
  equal = (v) => { return v === true; }) {
    return array.every(equal);
}


/**
 * @desc - takes an Object with several other objects and combines it into a
 *   single object
 *   1. Will overwrite for duplicate keys.
 *   2. If key is a string it will just add to object
 *   3. Does not return keynames in a concatenated manner i.e. {'mainkey.subkey': value}
 * @param {Object} obj - Object to flatten
 * @param {Boolean} recursive - If false only pull data from one level inside the object
 *          If true keep unnesting inifinitely
 * @return {Array} - transposed array
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */
export function flattenObjectofObjectsToSingleLevel(obj = {}, recursive = true) {
    let newObj = {};
    for(let key in obj) {
        if(obj[key] instanceof Object) {
            if(recursive) {
                flattenObjectofObjectsToSingleLevel(obj[key], newObj, recursive);
            }
            newObj = {...newObj, ...obj[key]};
        }
        newObj[key] = obj[key];//Lets keep the original key value pair also
    }
    return newObj;
}

/**
 *
 * @desc - Turns an array into an object all having the same default values.
 *  Add an object in if you want to fill missing keys into that object w/
 *  default value
 * @param {Array} array - keys to be used to create new object
 * @param {Any} default_value -
 * @param {Object} object(optional) - Use object already created
 * @return {Object}
 *
 **/
export function fillObject(array = [], default_value = true, object = {}) {
  //Get missing keys in 'object' by diffing from 'array'. Fill w/ default value
    let diffKeys = difference(array, Object.keys(object));
    for(let key of diffKeys) {
        object[key] = default_value;
    }
    return object;
}


/**
 * @desc
 * @param {Array} a - array to transpose
 * @return {Array} - transposed array
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */
export function transpose(a = []) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}
