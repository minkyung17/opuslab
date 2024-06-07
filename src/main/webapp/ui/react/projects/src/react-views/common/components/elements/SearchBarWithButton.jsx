import React from 'react';
import PropTypes from 'prop-types';

export class SearchBarWithButton extends React.Component {
  /**
   *
   * @desc -
   * @param {Event} evt - event from onClick
   * @return {void}
   *
   **/
  onClick = (event) => {
    event.preventDefault();
    let inputValue = this.refs.searchField.value;
    this.props.onClick(inputValue);
  }

  /**
   *
   * @desc -
   *
   **/
  render() {
    let {title, buttonCss, pattern, placeholder, buttonText, statusText} = this.props;

    return (
      <div className="form-group search">
        <form role="form">
          <div className="input-group">
            <input type="text" ref="searchField" className="form-control"
              {...{title, pattern, placeholder}} required />
              <span className="input-group-btn">
                <button onClick={this.onClick} className={buttonCss}>
                  {buttonText}
                </button>
              </span>
            </div>
            <p>{statusText}</p>
        </form>
      </div>
    );
  }
}
SearchBarWithButton.propTypes = {
  title: PropTypes.string,
  pattern: PropTypes.string,
  buttonCss: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  statusText: PropTypes.string
};
SearchBarWithButton.defaultProps = {
  pattern: '[a-zA-Z0-9]{3,}',
  buttonCss: 'search btn btn-default',
  title: 'Minimum of 3 characters required.',
  placeholder: '',
  buttonText: 'Go',
  statusText: ''
};
