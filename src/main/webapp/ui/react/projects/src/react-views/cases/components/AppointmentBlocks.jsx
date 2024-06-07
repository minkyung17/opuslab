import React from 'react';
import PropTypes from 'prop-types';

import {ToolTip} from '../../common/components/elements/ToolTip.jsx';
import ToggleView from '../../common/components/elements/ToggleView.jsx';
import {ULDisplay} from '../../common/components/elements/SimpleDisplays.jsx';

/********************************************************************************
*
* @desc - Title Html for Appointment Sections
* @return {JSX}
*
********************************************************************************/
export const AppointmentHeader = ({title, instructionProps, titleProps, instructionText,
  tooltip_text}) => (
  <div>
    <h2 {...titleProps}>{title} <ToolTip text={tooltip_text} /></h2>
    {instructionText ? <p {...instructionProps}>{instructionText}</p> : null}
  </div>
);
AppointmentHeader.propTypes = {
  title: PropTypes.string,
  tooltip_text: PropTypes.string,
  instructionProps: PropTypes.object,
  instructionText: PropTypes.string,
  titleProps: PropTypes.object
};
AppointmentHeader.defaultProps = {
  title: 'Single Appointment',
  titleProps: {},
  instructionProps: {
    className: ' '
  }
};

/********************************************************************************
*
* @desc - Base Block for showing a single appt. or one of the appts in a set
*
*
********************************************************************************/
const defaultAppointmentBlockProps = {
  fields: {},
  ulBaseClass: ' noBullet ',
  showToggleLink: true,
  showOnStart: false,
  apptDisplay: []
};

const defaultAppointBlockPropTypes = {
  showToggleLink: PropTypes.bool,
  showOnStart: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  ulBaseClass: PropTypes.string,
  ulStyleClass: PropTypes.string,
  apptDisplay: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};


export class SingleAppointmentBlock extends React.Component {
  /**
  *
  * @desc -
  *
  **/
  static propTypes = {
    ...defaultAppointBlockPropTypes
  };
  static defaultProps = {
    ...defaultAppointmentBlockProps
  };

  /**
  *
  * @desc -
  * @param {Object} fields - hash of field descriptions
  * @return {JSX} -
  *
  **/
  getBody() {
    let {props: {apptDisplay, ulStyleClass, ulBaseClass}} = this;
    let {title, subtitle, list} = apptDisplay;
    return (<div>
              <p></p>
              <ul className= {`${ulStyleClass} ${ulBaseClass} caseSummaryHeaderDetails noBullet`}>
                <li className="strong"> {title} </li>
                <li> {subtitle} </li>
                <li>
                  <ToggleView showText={'View Appointment Details'}
                    hideText={'Hide Appointment Details'}>
                    <div className="small">
                      <ULDisplay plainText bullets fields={list} />
                    </div>
                  </ToggleView>
                </li>
              </ul>
            </div>);
  }

  /**
  *
  * @desc -
  * @return {JSX} -
  *
  **/
  render() {
    return this.getBody(this.props.fields);
  }
}

/**
*
* @classdesc - Base Block for showing a single appt. or one of the appts in a set
* @module MultipleAppointmentsBlock
* @extends SingleAppointmentBlock
*
*/
export class MultipleAppointmentsBlock extends SingleAppointmentBlock {
  /**
  *
  * @desc -
  *
  **/
  static propTypes = {
    ...defaultAppointBlockPropTypes,
    appointments: PropTypes.array
  };
  static defaultProps = {
    ...defaultAppointmentBlockProps
  };

  /**
  *
  * @desc -
  * @param {Object} props
  * @return {void}
  *
  **/
  constructor(props = {}) {
    super(props);

    this.state = {
      hasIcon: false
    }
  }

  componentWillReceiveProps(props) {
    if(props.apptDisplays && props.apptDisplays !==this.state.apptDisplays){
      this.setUpAppointmentBlocks(props);
    }
  }

  setUpAppointmentBlocks(props){
    if(props.apptDisplays.length>0){
      let hasIcon = false;
      let apptDisplays = props.apptDisplays;
      for(let each in apptDisplays){
        if(apptDisplays[each].showIcon || apptDisplays[each].secondShowIcon){
          hasIcon = true;
          break;
        }
      }
      if(hasIcon){
        this.setState({hasIcon})
      }
    }
    this.setState({apptDisplays: props.apptDisplays})
  }

  hasIconComponent(appointment){
    let {ulBaseClass, ulStyleClass} = this.props;
    return(
      <span>
        {appointment.showIcon ?
          <span>
            <div className='col-md-1 align-right'>
              <a role="button" aria-label="help tip" data-original-title=""
                data-trigger="hover" className="ttip" title="" data-html="true"
                data-container="body" data-placement="top" data-toggle="popover"
                data-content="This appointment is a part of this case.">
                <img className= 'align-right' src='../images/case-tiny.png' />
              </a>
            </div>
            <div className='col-md-5'>
              <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                <li className="strong">
                  {appointment.title}
                </li>
                <li> {appointment.subtitle} </li>
                <div className="small"> <br/>
                  <ULDisplay plainText bullets fields={appointment.list} />
                </div>
              </ul>
            </div>
          </span>
        :
        <div>
          {appointment.secondTitle ?
            <span>
              <div className='col-md-1'/>
              <div className='col-md-5'>
                <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                  <li className="strong">
                    {appointment.title}
                  </li>
                  <li> {appointment.subtitle} </li>
                  <div className="small"> <br/>
                    <ULDisplay plainText bullets fields={appointment.list} />
                  </div>
                </ul>
              </div>
            </span>
            :
            <span>
              <div className='col-md-1'/>
              <div className='col-md-11'>
                <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                  <li className="strong">
                    {appointment.title}
                  </li>
                  <li> {appointment.subtitle} </li>
                  <div className="small"> <br/>
                    <ULDisplay plainText bullets fields={appointment.list} />
                  </div>
                </ul>
              </div>
            </span>
            }
          </div>
        }
        {appointment.secondTitle ?
          <span>
            {appointment.secondShowIcon ?
              <span>
                <div className='col-md-1 align-right'>
                  <a role="button" aria-label="help tip" data-original-title=""
                    data-trigger="hover" className="ttip" title="" data-html="true"
                    data-container="body" data-placement="top" data-toggle="popover"
                    data-content="This appointment is part of this case">
                    <img src='../images/case-tiny.png' />
                  </a>
                </div>
                <div className='col-md-5'>
                  <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                    <li className="strong">
                      {appointment.secondTitle}
                    </li>
                    <li> {appointment.secondSubtitle} </li>
                    <div className="small"> <br/>
                      <ULDisplay plainText bullets fields={appointment.secondList} />
                    </div>
                  </ul>
                </div>
              </span>
            :
            <span>
              <div className='col-md-1'/>
              <div className='col-md-5'>
                <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                  <li className="strong">
                    {appointment.secondTitle}
                  </li>
                  <li> {appointment.secondSubtitle} </li>
                  <div className="small"> <br/>
                    <ULDisplay plainText bullets fields={appointment.secondList} />
                  </div>
                </ul>
              </div>
            </span>
            }
          </span>
        :
          null
        }
      </span>
    )
  }

  hasNoIconComponent(appointment){
    let {ulBaseClass, ulStyleClass} = this.props;
    return(
      <span>
        {appointment.secondTitle ?
          <span>
            <div className='col-md-6'>
              <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                <li className="strong">
                  {appointment.title}
                </li>
                <li> {appointment.subtitle} </li>
                <div className="small"> <br/>
                  <ULDisplay plainText bullets fields={appointment.list} />
                </div>
              </ul>
            </div>
            <div className='col-md-6'>
              <ul className={`${ulStyleClass} ${ulBaseClass}`} >
                <li className="strong">
                  {appointment.secondTitle}
                </li>
                <li> {appointment.secondSubtitle} </li>
                <div className="small"> <br/>
                  <ULDisplay plainText bullets fields={appointment.secondList} />
                </div>
              </ul>
            </div>
          </span>
          :
          <div className='col-md-12'>
            <ul className={`${ulStyleClass} ${ulBaseClass}`} >
              <li className="strong">
                {appointment.title}
              </li>
              <li> {appointment.subtitle} </li>
              <div className="small"> <br/>
                <ULDisplay plainText bullets fields={appointment.list} />
              </div>
            </ul>
          </div>
          }
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
    let {apptDisplays} = this.props;
    let {hasIcon} = this.state;

    return (
      <span>
      {apptDisplays.length>0 ?
        <ToggleView showText={'View Appointment Details'}
          hideText={'Hide Appointment Details'} >
          <div>Appointments that are part of this case have a case icon beside them.</div><br/>
          {apptDisplays.map((appointment, index) => {
            //JSX for this section
            return (
              <div key={index} className='col-md-12'>
                {hasIcon ?
                  this.hasIconComponent(appointment)
                  :
                  this.hasNoIconComponent(appointment)
                }
              </div>);
            })}
          </ToggleView>
          :
          null
        }
      </span>
    );
  }
}

/********************************************************************************
*
* @desc - Title plus Single Appointment block
* @return {JSX}
*
********************************************************************************/
export const SingleAppointment = ({title, fields, ...props}) => (
  <div className={props.className}>
    <SingleAppointmentBlock {...{fields, title}} {...props}/>
  </div>
);
SingleAppointment.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  fields: PropTypes.object
};
SingleAppointment.defaultProps = {
  title: 'Single Appointment'
};

/********************************************************************************
*
* @desc - Multiple blocks of single appointments grouped as one
* @return {Object}
*
********************************************************************************/
export const AppointmentSet = ({apptDisplays, ...props}) => {
  return (
    <div>
      {apptDisplays.map((each, idx) =>
        <SingleAppointmentBlock key={idx} apptDisplay={each} fields={each}
          {...props}/>
      )}
    </div>);
};
AppointmentSet.propTypes = {
  title: PropTypes.string,
  radioOnClick: PropTypes.func.isRequired,
  apptDisplays: PropTypes.array
};
AppointmentSet.defaultProps = {
  apptDisplays: [],
  title: 'Appointment Set',
  radioOnClick: () => {
    print('No radioOnClick function given to Appointment Set');
  }
};
