import React from 'react';

/**
 *
 * @desc - Only display children if "show" is true
 * @param {Boolean} show - whether to show
 * @param {Node} children - children of element
 * @return {void} -
 *
 **/
export const ShowIf = ({show, children} = {}) =>
  show ? children : null;

/**
 *
 * @desc - Only hide children if "hide" is true
 * @param {Boolean} hide - whether to hide
 * @param {Node} children - children of element
 * @return {Object} -
 *
 **/
export const HideIf = ({hide, children} = {}) => {
  return hide ? null : children;
};
