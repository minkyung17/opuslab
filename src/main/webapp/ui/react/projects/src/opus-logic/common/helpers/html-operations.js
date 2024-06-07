/********************************************************
* @desc -
*
*
*********************************************************/


/**
 *
 * @desc - Reset the tooltips
 * @param - {Object} el
 * @param - {Object} attrs
 *
 */
export function setElementAttributes(el, attrs) {
  for(let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
