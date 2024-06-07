import React from 'react';
import PropTypes from 'prop-types';

/*******************************************************************************
 *
 * @desc -
 * @returns {JSX}
 *
 ******************************************************************************/
// export const ToolTip = ({text, placement, iconClass}) => {
//   if(!text) {
//     return null;
//   }
//
//   return (
//     <a role="button" aria-label="help tip" data-original-title=""
//       data-trigger="hover" className="ttip" title="" data-html="true"
//       data-container="body" data-placement={placement} data-toggle="popover"
//       data-content={text}>
//       <span aria-hidden="true" className={iconClass + ' help ttip '} />
//     </a>);
// };
// ToolTip.defaultProps = {
//   placement: 'top',
//   iconClass: 'icon-help-circled'
// };
// ToolTip.propTypes = {
//   iconClass: PropTypes.string,
//   placement: PropTypes.string,
//   text: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.bool
//   ])
// };
export const ToolTip = ({text, placement, iconClass}) => {
  if(!text) {
    return null;
  }

  return (
    // <p data-tip='' data-for='test'></p>
    // <ReactTooltip id='test'>{text}</ReactTooltip>
    <a role="button" aria-label="help tip" data-original-title=""
      data-trigger="hover" className="ttip" title="" data-html="true"
      data-container="body" data-placement={placement} data-toggle="popover"
      data-content={text}>
      <span aria-hidden="true" className={iconClass + ' help ttip '} />
    </a>
  );
};
ToolTip.defaultProps = {
  placement: 'top',
  iconClass: 'icon-help-circled'
};
ToolTip.propTypes = {
  iconClass: PropTypes.string,
  placement: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
};


/*******************************************************************************
 *
 * @desc -
 * @return {JSX}
 *
 ******************************************************************************/
export const ToolTipWrapper = ({text, placement, className, ...props})=>{
  if(!text) {
    return props.children;
  }

  return (
    <span role="button" aria-label="help tip" data-original-title="" title=""
      data-trigger="hover" className={`ttip ${className}`} data-html="true"
      data-container="body" data-placement={placement} data-toggle="popover"
      data-content={text}>
      {props.children}
    </span>);
};
ToolTipWrapper.defaultProps = {
  placement: 'top',
  className: ''
};
ToolTipWrapper.propTypes = {
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  className: PropTypes.string,
  placement: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
};
