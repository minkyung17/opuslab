

/**
 *
 *
 * @desc - Posts json to url
 * @param {String} - url
 * @param {Object} - json
 * @returns {Promise}
 */
export function jqueryPostJson(url, data = {}, options = {}) {
  return $.ajax(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
    ...options
  });
}

/**
 *
 *
 * @desc - Posts json to url
 * @param {String} - url
 * @param {Object} - json
 * @returns {Promise}
 */
export function jqueryGetJson(url, data = {}, options = {}) {
  return $.ajax(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
    ...options
  });
}

/**
 *
 * @desc - Parses and returns url args
 * @param {Object} selector -
 */
export function clearTextArea(selector) {
  $(selector).val('');
}


/**
 *
 * @desc -
 * @param {Object} selector -
 */
export function hideModal(selector) {
  $(selector).modal('hide');
}

/**
 *
 * @desc -
 * @param {Object} selector -
 */
export function showModal(selector) {
  $(selector).modal('show');
}

/**
 *
 * @desc - Reset the tooltips
 *
 */
export function initJQueryBootStrapToolTipandPopover() {
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover', placement: 'top'},
    {container: 'body'});
  $('[data-toggle="popover"]').popover({trigger: 'hover'}, {container: 'body'});
  // loads popovers, otherwise they are only initialized upon opening the edit case modal
  $('.js_popover').popover({ html: true });
  $().popover({container: 'body'});
  $('[data-toggle=popover]').popover({container: 'body'}, {html: true});
}
