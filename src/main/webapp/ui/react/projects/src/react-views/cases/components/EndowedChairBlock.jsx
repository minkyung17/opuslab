import React from 'react';
import PropTypes from 'prop-types';

import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import ToggleView from '../../common/components/elements/ToggleView.jsx';
import {ULDisplay} from '../../common/components/elements/SimpleDisplays.jsx';

/********************************************************************************
*
* @desc - Title Html for Endowed Chair Details
* @return {JSX}
*
********************************************************************************/
export const EndowedChairHeader = ({title, instructionProps, titleProps, instructionText,
  tooltip_text}) => (
  <div>
    <h2 {...titleProps}>{title} <ToolTip text={tooltip_text} /></h2>
    {instructionText ? <p {...instructionProps}>{instructionText}</p> : null}
  </div>
);
EndowedChairHeader.propTypes = {
  title: PropTypes.string,
  tooltip_text: PropTypes.string,
  instructionProps: PropTypes.object,
  instructionText: PropTypes.string,
  titleProps: PropTypes.object
};
EndowedChairHeader.defaultProps = {
  title: 'Endowed Chair Details',
  titleProps: {},
  instructionProps: {
    className: ' '
  }
};

/********************************************************************************
*
* @desc - Base Block for showing a Endowed Chair
*
*
********************************************************************************/
const defaultEndowedChairBlockProps = {
  fields: {},
  ulBaseClass: ' noBullet ',
  showToggleLink: true,
  showOnStart: false,
  endowedChairDisplays: []
};

const defaultEndowedChairBlockPropTypes = {
  showToggleLink: PropTypes.bool,
  showOnStart: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  ulBaseClass: PropTypes.string,
  ulStyleClass: PropTypes.string,
  endowedChairDisplays: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};


export class EndowedChairBlock extends React.Component {
  /**
  *
  * @desc -
  *
  **/
  static propTypes = {
    ...defaultEndowedChairBlockPropTypes,
    endowedChairs: PropTypes.array
  };
  static defaultProps = {
    ...defaultEndowedChairBlockProps
  };

  state = {
    ...this.state,
    endowedChairDisplays: []
}

  /**
  *
  * @desc -
  * @param {Object} props
  * @return {void}
  *
  **/
  constructor(props = {}) {
    super(props);
  }

  componentWillReceiveProps(props) {
    if(props.endowedChairDisplays && props.endowedChairDisplays !==this.state.endowedChairDisplays){
      this.setState({endowedChairDisplays: props.endowedChairDisplays})
    }
  }

  locationInfoDisplay(endowedChair){
    let {ulBaseClass, ulStyleClass} = this.props;
    return(
      <span>
        <div className='col-md-12'>
          <ul className={`${ulStyleClass} ${ulBaseClass}`} >
            <li className="strong">Location</li>
            <div className="small"> <br/>
              <ULDisplay plainText bullets fields={endowedChair.locationList} />
            </div>
          </ul>
        </div>
      </span>
    )
  }

  endowedChairInfoDisplay(endowedChair){
    let {ulBaseClass, ulStyleClass} = this.props;
    return(
      <span>
        <div className='col-md-12'>
          <ul className={`${ulStyleClass} ${ulBaseClass}`} >
            <li className="strong">Chair Details</li>
            <div className="small"> <br/>
              <ULDisplay plainText bullets fields={endowedChair.endowedChairList} />
            </div>
          </ul>
        </div>
      </span>
    )
  }

  facultyInfoDisplay(endowedChair){
    let {ulBaseClass, ulStyleClass} = this.props;
    return(
      <span>
        <div className='col-md-12'>
          <ul className={`${ulStyleClass} ${ulBaseClass}`} >
            <li className="strong">Faculty Appointment</li>
            <div className="small"> <br/>
              <ULDisplay plainText bullets fields={endowedChair.facultyList} />
            </div>
          </ul>
        </div>
      </span>
    )
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
  render() {
    let {endowedChairDisplays} = this.state;
    return (
      <div>
      {endowedChairDisplays.length>0 ?
          <ToggleView showText={'View Endowed Chair & Faculty Appt. Details'}
          hideText={'Hide Endowed Chair & Faculty Appt Details'}>
            <div style={{paddingBottom: "350px"}}>
              <div><b>Endowed Chair</b></div><br/>
              {endowedChairDisplays.map((endowedChair, index) => {
                //JSX for this section
                return (
                  <div key={index} className='col-md-12'>
                    {this.locationInfoDisplay(endowedChair)}
                    {this.endowedChairInfoDisplay(endowedChair)}
                    {this.facultyInfoDisplay(endowedChair)}
                  </div>);
                })}
            </div>
          </ToggleView>
          :
          <div style={{paddingBottom: "5px"}}/>
        }
      </div>
    );
  }
}
