/**
 * Created by leonaburime on 7/25/16.
 */

// import * as helpers from '../../../opus-logic/common/helpers/';
// import {assert, expect} from 'chai';
//
//
// let sampleObject = { 'user': 'barney', 'age': 36, 'active': false };
// let sampleCollection = [
//     { 'user': 'barney', 'age': 36, 'active': false },
//     { 'user': 'fred',   'age': 40, 'active': false }
// ];
// let sampleMatrix = [[1,2],[3,4]];
//
// describe(`utility.js module \n`, () => {
//
//     it(`extractArray returns values of object from specified input keys`, ()=> {
//         let question = helpers.extractToArray(sampleObject, ['user','age']);
//         let answer = ['barney',36];
//         assert.deepEqual(question, answer);
//     });
//
//     it(`copyArray(array, n) copies input array 'n' times over`, () => {
//         let question = helpers.copyArray([2,5], 2);
//         let answer = [2,5,2,5];
//         assert.deepEqual(question, answer);
//     });
//
//     it(`filterCollectionByObject(sampleCollection,filterObject) should return objects ` +
//         `from 'sampleCollection' that match the 'filterObject' k-v pair` , ()=>{
//
//         let question = helpers.filterCollectionByObject(sampleCollection,
//           { 'user': 'fred'});
//         let answer = [{ 'user': 'fred',   'age': 40, 'active': false }];
//         assert.deepEqual(question, answer);
//     });
//
//     it( `filterCollectionWithSpecifiedKeysByValue`, () => {
//        //No test written yet'
//     });
//
//     it(`destructureObjectIntoKeyValueArrays should separate keys and values into separate arrays`, () => {
//         let [keys, values] = helpers.destructureObjectIntoKeyValueArrays(sampleObject);
//         assert.deepEqual(keys, ['user','age','active']);
//         assert.deepEqual(values, ['barney', 36, false]);
//     });
//
//     it('transpose should turn rows of array into columns and columns of array into rows',() => {
//       let transposedMatrix = helpers.transpose(sampleMatrix);
//       assert.deepEqual(transposedMatrix,[[1,3],[2,4]]);
//     });
//
// });
