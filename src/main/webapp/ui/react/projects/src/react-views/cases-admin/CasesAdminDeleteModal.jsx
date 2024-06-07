import React from 'react';
import PropTypes from 'prop-types';
import ToggleView from '../common/components/elements/ToggleView.jsx';
import moment from "moment";
import {ShowIf} from "../common/components/elements/DisplayIf.jsx";


//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  '../common/components/bootstrap/ReactBootstrapModal.jsx';

/******************************************************************************
 *
 * @desc - Delete Danger Modal
 *
 ******************************************************************************/
export default class CasesAdminDeleteModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
  static propTypes = {
    showCasesAdminDeleteModal: PropTypes.bool, 
    changeStateOfCasesAdminDeleteModal: PropTypes.func,
    isDeleteOrWithdrawButtonDisabled: PropTypes.bool
  }

  static defaultProps = {
  }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Modal
   *
   **/
  constructor(props = {}) {
    super(props);
  }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
  state = {
    ...this.state,
    showCasesAdminDeleteModal: false,
    deleteOrWithdrawSelection: 'delete',
    deleteOrWithdrawSelectionCapitalized: 'Delete',
    interfolioSelection: 'no',
    modalData: {
      adminName: "",
      adminFirstName: "",
      emplName: "",
      actionType: "",
      proposedEffDate: "",
      today: moment().format("MM/DD/YYYY")
    },
    comments: ""
  };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props coming in
   * @return {void}
   *
   **/
  componentWillReceiveProps(props) {
    this.setState({showCasesAdminDeleteModal: props.showCasesAdminDeleteModal,
    isDeleteOrWithdrawButtonDisabled: props.isDeleteOrWithdrawButtonDisabled})
    if(props.deleteOrWithdrawSelection==='withdraw'){
      this.setState({
        deleteOrWithdrawSelection: 'withdraw',
        deleteOrWithdrawSelectionCapitalized: 'Withdraw'
      })
    }else{
      this.setState({
        deleteOrWithdrawSelection: 'delete',
        deleteOrWithdrawSelectionCapitalized: 'Delete'
      })
    }
    if(props.interfolioSelection!==this.state.interfolioSelection){
      this.setState({interfolioSelection: props.interfolioSelection})
    }
    this.setModalData(props);
  }

  /**
  *
  * @desc - Hides delete modal
  * @return {void}
  *
  **/
  closeCasesAdminDeleteModal = () => {
    this.setState({errorMessage: ''});
    this.props.changeStateOfCasesAdminDeleteModal()
  };

  /**
  *
  * @desc - Back button
  * @return {void}
  *
  **/
  goBack = () => {
      this.setState({errorMessage: ''});
      this.props.back()
  };

  editCommentFields = (e) => {
    let {comments} = this.state;
    comments = e.target.value;
    this.setState({comments});
  }
  setModalData = (props) => {
    let {modalData} = this.state;
    if (props.deleteOrWithdrawData != undefined) {
      modalData.actionType = props.deleteOrWithdrawData.actionType;
      modalData.proposedEffDate = props.deleteOrWithdrawData.effectiveDateForDisplayInModal;
      modalData.emplName = props.deleteOrWithdrawData.fullName;      
      modalData.adminName = props.adminName;
      modalData.adminFirstName = props.adminFirstName;
      modalData.caseLocation = props.deleteOrWithdrawData.caseLocationForDisplayInModal;
      if(modalData.caseLocation == null){
        modalData.caseLocation = 'Unknown';
      }
    }    
    this.setState({modalData, comments: ""});
  }
  saveCommentsAndWithdrawCase = () => {
    let {comments, deleteOrWithdrawSelection} = this.state;
    if(deleteOrWithdrawSelection=='withdraw' && comments.trim() == ''){
      let errorMessage = "Please add a comment to withdraw.";
      this.setState({errorMessage});
    } else {
      this.props.deleteOrWithdrawOpusCaseAndInterfolioCase(comments);
    }    
  }
  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
  render() {
    let {commentName, modalData, comments, errorMessage} = this.state;
    return (
      <Modal show={this.state.showCasesAdminDeleteModal}
        onHide={this.closeCasesAdminDeleteModal}>
        <Header className=" modal-danger " closeButton>
          <h1 className="white" id="ModalHeader">
            {this.state.deleteOrWithdrawSelectionCapitalized+' this Case in Opus'}
            {this.state.interfolioSelection==='yes' ? ' and Interfolio' : ''}
          </h1>
        </Header>
        <Body>
          <ShowIf show={this.state.deleteOrWithdrawSelection=='withdraw'}>
          <p>
            Please enter the reason the case will be withdrawn.
          </p>      
          </ShowIf>   
          <ShowIf show={this.state.deleteOrWithdrawSelection=='withdraw'}>
          <p>
            <textarea {...{id: commentName, name: commentName, value: comments, disabled: false, onChange: this.editCommentFields, onBlur: this.onBlur}}
              className={` form-control  `}/>
          </p>
          </ShowIf>
          <ShowIf show={errorMessage && this.state.deleteOrWithdrawSelection=='withdraw'}>
              <p className="error_message">
                {errorMessage}
              </p>
          </ShowIf>
          <ShowIf show={this.state.deleteOrWithdrawSelection=='withdraw'}>
          <p>
            The case is at {modalData.caseLocation}.<br/>
            A notification will be sent to all offices who have reviewed the case.
          </p>
          </ShowIf>
          <ShowIf show={this.state.deleteOrWithdrawSelection=='withdraw'}>
          <p>
            <ToggleView showText={'Preview of Case Withdrawn Notification'} 
              hideText={'Hide Preview of Case Withdrawn Notification'}>
              <div className="small" style={{marginLeft: "40px"}}>
                Dear Administrator, 
                <br/><br/>
                On {modalData.today}, {modalData.emplName}'s {modalData.actionType} case effective {modalData.proposedEffDate} was withdrawn by {modalData.adminName}.
                <br/><br/>
                {modalData.adminFirstName} added the following note:
                <br/><br/>
                {comments}
                <br/><br/>
                Thank you,
                <br/><br/>
                Opus
                <br/><br/>
                UCLA's Academic Information System
                <br/>
                opus.ucla.edu
              </div>
            </ToggleView>
            <br/>
          </p>
          </ShowIf> 
          <ShowIf show={this.state.deleteOrWithdrawSelection=='withdraw'}>
          <p><b> Are you sure you want to {this.state.deleteOrWithdrawSelection} this case in Opus
            {this.state.interfolioSelection==='yes' ? ' and Interfolio' : ''}
            ? You cannot undo this.</b></p>
          </ShowIf>
          <ShowIf show={this.state.deleteOrWithdrawSelection=='delete'}>
            <p>Are you sure you want to {this.state.deleteOrWithdrawSelection} this case in Opus
              {this.state.interfolioSelection==='yes' ? ' and Interfolio' : ''}
              ? You cannot undo this.<br/><br/>
                The case is at {modalData.caseLocation}. If the case is with your Dean's Office or APO, make sure to notify them of the error.
            </p>
          </ShowIf>
        </Body>
        <Footer>
          <button className={"left btn btn-danger"}
            onClick={this.saveCommentsAndWithdrawCase}
            disabled={this.state.isDeleteOrWithdrawButtonDisabled}>
            {this.state.deleteOrWithdrawSelectionCapitalized}
          </button>
          <button onClick={this.goBack}
            className=" left btn btn-link">
            Back
          </button>  &nbsp; &nbsp;
          <a className=" left btn btn-link" target="_blank"
            onClick={this.closeCasesAdminDeleteModal}>
            Cancel
          </a>
        </Footer>
      </Modal>
    );
  }
}
