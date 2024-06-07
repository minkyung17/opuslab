import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import moment from 'moment';

//My imports
import ToggleView from '../../common/components/elements/ToggleView.jsx';
/******************************************************************************
 *
 * @desc - Admin Comp Header
 *
 ******************************************************************************/
export const AdminCompHeader = ({adminCompSummaryData, adminCompSummaryDataFromAPI}) => {
    return (
        <div>
            <h2>{adminCompSummaryData.emplName}</h2>

            <div className="small">
            Status: {adminCompSummaryData.status}
            <br/>
            UID: {adminCompSummaryData.uid}
            <br/>
            {adminCompSummaryData.email}
            <br/>
            Hire Date: {adminCompSummaryData.hireDate}
            </div>

            <ToggleView contentClassName=" col-md-offset-1 "
                showText="Show Details" hideText="Hide Details">

                <div>
                <span>
                    <span className="strong">Faculty Appointments</span>
                    <div className="small">
                    {adminCompSummaryDataFromAPI.headerFacultyAppointment && adminCompSummaryDataFromAPI.headerFacultyAppointment.length>0 ?
                    <span>
                    {adminCompSummaryDataFromAPI.headerFacultyAppointment.map((source, index) => (
                        <span key={index}>
                        {source}
                        <br/>
                        </span>

                    ))}
                    </span>
                    :
                    <div>
                        None
                    </div>
                }
                </div>
                </span>
                </div>

                <div>
                    <span>
                        <span className="strong">Actions in Progress</span>
                        <div className="small">
                        {adminCompSummaryDataFromAPI.headerActionInProgress && adminCompSummaryDataFromAPI.headerActionInProgress.length>0 ?
                            <span>
                            {adminCompSummaryDataFromAPI.headerActionInProgress.map((source, index) => (
                                <span key={index}>
                                {source}
                                <br/>
                                </span>
                            ))}
                            </span>
                            :
                            <div>
                                None
                            </div>
                        }
                        </div>
                    </span>
                </div>

                <div>
                <span>
                    <span className="strong">Completed Actions with Effective Date: {moment(adminCompSummaryData.proposedEffectiveDT).format('L')}</span>
                    <div className="small">
                        {adminCompSummaryDataFromAPI.headerActionApproved && adminCompSummaryDataFromAPI.headerActionApproved.length>0 ?
                            <span>
                            {adminCompSummaryDataFromAPI.headerActionApproved.map((source, index) => (
                                <span key={index}>
                                {source}
                                <br/>
                                </span>
                            ))}
                            </span>
                            :
                            <div>
                                None
                            </div>
                        }
                    </div>
                </span>
                </div>

            </ToggleView>
            <br/>
        </div>
    );
  };


/******************************************************************************
 *
 * @desc - Stipend or 9ths Other Header
 *
 ******************************************************************************/

export const OtherHeader = ({headers}) => {
    return (
        <span>
            {headers.map((header, index) => (
                <span key={index} className="no-bold">
                &nbsp;&nbsp;{header}
                {index!==headers.length-1 ? <br/> : null }
                </span>
                ))}
        </span>
    );
  };
