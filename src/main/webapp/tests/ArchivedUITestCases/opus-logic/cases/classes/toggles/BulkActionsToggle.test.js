import {assert} from 'chai';

//My import
import '../../../../test-utility/setup-tests';
import BulkActionsToggle from
  '../../../../../opus-logic/cases/classes/toggles/BulkActionsToggle';

describe('Bulk Actions Toggle Logic Class', () => {
  let Logic = new BulkActionsToggle();

  it('updateHSCPFromAPU() updates HSCP values', () => {
    let fieldData = {
      apuCode: {
        value: 99026
      },
      hscpScale1to9: {
        value: null
      }
    };
    let formattedCommonCallLists = {
      apuToHscp: {
        99026: 6
      }
    };
    let toggledFieldData = Logic.updateHSCPFromAPU(fieldData, formattedCommonCallLists);
    assert.equal(toggledFieldData.hscpScale1to9.value, 6);
  });
});
