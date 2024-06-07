import React from "react";
import PropTypes from "prop-types";

//My imports
import {ShowIf} from "../common/components/elements/DisplayIf.jsx";
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";

/******************************************************************************
 *
 * @desc - Selection for Delete or Withdraw Case Modal
 *
 ******************************************************************************/
export default class DeleteOrWithdrawCaseModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        showDeleteOrWithdrawCaseModal: PropTypes.bool,
        deleteOrWithdrawData: PropTypes.object,
        deleteOrWithdrawCase: PropTypes.func,
        changeStateOfDeleteOrWithdrawModal: PropTypes.func,
        deleteOrWithdrawStringValue: PropTypes.string,
        isDeleteOrWithdrawButtonDisabled: PropTypes.bool
    }

    static defaultProps = {
        showDeleteOrWithdrawCaseModal: false,
        deleteOrWithdrawData: {}
    }

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Datatable
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
        showDeleteOrWithdrawCaseModal: false,
        deleteOrWithdrawData: {},
        deleteOrWithdrawStringValue: "",
        isDeleteOrWithdrawButtonDisabled: false,
        deleteOnly: false
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        this.setState({showDeleteOrWithdrawCaseModal: props.showDeleteOrWithdrawCaseModal,
      deleteOrWithdrawData: props.deleteOrWithdrawData,
      isDeleteOrWithdrawButtonDisabled: props.isDeleteOrWithdrawButtonDisabled});
        if(props.deleteOnly){
            this.setState({deleteOnly: props.deleteOnly});
        }
    }

  /**
   *
   * @desc - Closes DeleteOrWithdrawCase Modal
   * @returns {void}
   *
   **/
    closeDeleteOrWithdrawCaseModal = () => {
        this.props.changeStateOfDeleteOrWithdrawModal();
    };

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {
        return (
      <Modal show={this.state.showDeleteOrWithdrawCaseModal}
        onHide={this.closeDeleteOrWithdrawCaseModal}
        className='modal-lg'>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title" id="ModalHeader">
            <img src="../images/case.png" className="modal-header-icon" alt="case icon" />
            &nbsp; &nbsp;
            {this.state.deleteOnly ?
              "Delete a Case"
              :
              "Delete or Withdraw a Case"
            }
          </h1>
        </Header>
        <Body>
          <h2 className="flush-top">{this.state.deleteOrWithdrawData.fullName}</h2>
          <p className="small">
            {this.state.deleteOrWithdrawData.actionType} <br />
            {this.state.deleteOrWithdrawData && this.state.deleteOrWithdrawData.effectiveTypeForDisplayInModal==="approved" ?
              "Effective Date: "
              :
              "Proposed Effective Date: "
            }
            {this.state.deleteOrWithdrawData.effectiveDateForDisplayInModal}
          </p>
          <p>
            <b>Delete</b> the case if it was created with errors (e.g. the wrong Interfolio template was selected),
            or the candidate has decided not to proceed with the case while the departmental review is still in progress.
            You will be able to choose whether the case should also be deleted from Interfolio, if applicable.
            If you Delete, this case will be deleted permanently.
            {this.state.deleteOnly ?
              null
              :
              <span>
                <br /><br />
                <b>Withdraw</b> the case if the candidate decided not to proceed with the case AFTER the departmental review phase.
                You will be able to choose whether the case should also be deleted from Interfolio, if applicable.  If you Withdraw,
                the case will be closed in Opus with a status of "Withdrawn" and will be visible on the Completed Cases page.
                <br /> <br />
              </span>
            }
          </p>
        </Body>
        <Footer>
          <button onClick=
            {() => this.props.deleteOrWithdrawCase("delete")} className="left btn btn-primary margin-right-20"
            disabled={this.state.isDeleteOrWithdrawButtonDisabled}>
            Delete</button>  &nbsp; &nbsp;
            {this.state.deleteOnly ?
              null
            :
              <button onClick=
              {() => this.props.deleteOrWithdrawCase("withdraw")} className="left btn btn-primary"
              disabled={this.state.isDeleteOrWithdrawButtonDisabled}>
              Withdraw</button>
            }
          &nbsp; &nbsp;
          <Dismiss onClick={this.closeDeleteOrWithdrawCaseModal} className=" left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }
}
