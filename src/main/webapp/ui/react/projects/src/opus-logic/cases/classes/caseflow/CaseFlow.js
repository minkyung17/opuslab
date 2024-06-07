import CasesDossier from '../CasesDossier';

/**
*
* @classdesc SuperClass for CaseFlow that has common functions CaseFlow
*   needs
* @author - Leon Aburime
* @class CaseFlow
* @extends Cases
*
**/
export default class CaseFlow extends CasesDossier {
  /*
  *
  * @desc - Instance variables
  *
  **/
  constructor({adminData, access_token, globalData, ...args}) {
    super({adminData, access_token, globalData, ...args});
    this.initClassVariables({adminData, access_token, globalData});
  }
}
