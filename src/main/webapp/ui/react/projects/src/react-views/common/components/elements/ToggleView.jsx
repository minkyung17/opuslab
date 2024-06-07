import React from 'react';
import PropTypes from 'prop-types';


/**
*
*
**/
export default class ToggleView extends React.Component {

  /**
  *
  * @desc - Default static props
  *
  **/
  static defaultProps = {
    showToggleLink: true,
    showOnStart: false,
    showText: 'View ',
    hideText: 'Hide ',
    hideIconClass: 'icon-right-open-big',
    showIconClass: 'icon-down-open-big',
    hideClick: {
      icon_class: 'icon-right-open-big',
      css: ' hide '
    },
    showClick: {
      icon_class: 'icon-down-open-big',
      css: ''
    }
  }
  static propTypes = {
    showToggleLink: PropTypes.bool,
    showOnStart: PropTypes.bool,
    showText: PropTypes.string,
    hideText: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    hideClick: PropTypes.object,
    showClick: PropTypes.object,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    hideIconClass: PropTypes.string,
    showIconClass: PropTypes.string
  };

  /**
   *
   * @desc - Setup toggle and start the initialization process
   * @param {Object} props - component props
   * @return {void}
   *
   **/
  constructor(props = {}) {
    super(props);
    this.attachClassVariables();
  }

  state = {
    show: this.props.showOnStart
  };

  /**
   *
   * @desc - Initialize whether toggle is shown or not
   * @return {void}
   *
   **/
  attachClassVariables() {
    let {showOnStart, hideClick, showClick, showText, hideText, hideIconClass,
      showIconClass} = this.props;
    let mode = showOnStart ? showClick : hideClick;
    let icon_class = showOnStart ? showIconClass : hideIconClass;
    let toggle_text = showOnStart ? hideText : showText;
    this.state = {...this.state, mode, toggle_text, icon_class };
  }

  /**
   *
   * @desc - Show/Hide content controlled by onclick
   * @return {void}
   *
   **/
  toggleView = () => {
    let {hideClick, showClick, showText, hideText, hideIconClass,
      showIconClass} = this.props;
    let show = !this.state.show;
    let mode = show ? showClick : hideClick;
    let toggle_text = show ? hideText : showText;
    let icon_class = show ? showIconClass : hideIconClass;
    this.setState({show, mode, toggle_text, icon_class});
  }

  /**
   *
   * @desc - Toggle layer that has content inside
   * @return {JSX} - JSX content
   *
   **/
  render() {
    let {props: {contentClassName}, state: {mode}} = this;
    return(
      <div className={this.props.className}>
        {this.props.showToggleLink ?
          <a className=" toggle-message " onClick={this.toggleView}
              href="javascript:void(0)" >
            {this.state.toggle_text}
            <span aria-hidden="true" className={this.state.icon_class} />
          </a> : null}
        <div className={`${contentClassName} ${mode.css}`} > <br/>
          {this.props.children}
        </div>
      </div>
    );
  }
}
