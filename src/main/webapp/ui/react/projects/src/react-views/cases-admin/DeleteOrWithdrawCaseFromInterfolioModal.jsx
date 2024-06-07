import React from "react";
import PropTypes from "prop-types";

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";

/******************************************************************************
 *
 * @desc -Selection for deleteing or withdrawing a conneceted
 * interfolio case
 *
 ******************************************************************************/
export default class DeleteOrWithdrawCaseFromInterfolioModal extends React.Component {

    /**
     *
     * @desc - Static variables. Only one value throughout all instances
     *
     **/
    static propTypes = {
        showDeleteOrWithdrawCaseFromInterfolioModal: PropTypes.bool,
        deleteOrWithdrawData: PropTypes.object,
        changeStateOfDeleteOrWithdrawFromInterfolioModal: PropTypes.func,
        deleteOrWithdrawSelection: PropTypes.string,
        isDeleteOrWithdrawButtonDisabled: PropTypes.bool
    }

    static defaultProps = {
        showDeleteOrWithdrawCaseFromInterfolioModal: false,
        deleteOrWithdrawData: {}
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
        showDeleteOrWithdrawCaseFromInterfolioModal: false,
        deleteOrWithdrawData: {},
        deleteOrWithdrawSelection: "",
        isDeleteOrWithdrawButtonDisabled: false
    };

    /**
     *
     * @desc - Lifecycle hook when receiving newProps
     * @param {Object} props - props
     * @return {void}
     *
     **/
    componentWillReceiveProps(props) {
        this.setState({showDeleteOrWithdrawCaseFromInterfolioModal: props.showDeleteOrWithdrawCaseFromInterfolioModal,
        deleteOrWithdrawData: props.deleteOrWithdrawData,
        isDeleteOrWithdrawButtonDisabled: props.isDeleteOrWithdrawButtonDisabled});
        let CasesAdminTypeActionObject = {
            delete: "Delete",
            withdraw: "Withdraw"
        };
        this.setState({casesAdminTypeAction: CasesAdminTypeActionObject[props.deleteOrWithdrawSelection]});
    }


  /**
   *
   * @desc - Closes DeleteOrWithdrawCaseFromInterfolio Modal
   * @returns {void}
   *
   **/
    closeDeleteOrWithdrawCaseFromInterfolioModal = () => {
        this.props.changeStateOfDeleteOrWithdrawCaseFromInterfolioModal();
    };

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {

        return (
      <Modal show={this.state.showDeleteOrWithdrawCaseFromInterfolioModal}
        onHide={this.closeDeleteOrWithdrawCaseFromInterfolioModal}
        className='modal-lg'>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title" id="ModalHeader">
          <img src="../images/case.png" className="modal-header-icon" alt="case icon" />
            &nbsp; &nbsp; Also {this.state.casesAdminTypeAction} the Case in Interfolio?
          </h1>
        </Header>
        <Body>
          <h2 className="flush-top text-capitalize">{this.state.deleteOrWithdrawData.fullName}</h2>
          <p className="small">
            {this.state.deleteOrWithdrawData.actionType} <br />
            {this.state.deleteOrWithdrawData.effectiveTypeForDisplayInModal==="approved" ?
              "Effective Date: "
              :
              "Proposed Effective Date: "
            }
            {this.state.deleteOrWithdrawData.effectiveDateForDisplayInModal}
          </p>
          {this.state.casesAdminTypeAction==="Delete"?
            <div>
              Would you like to delete this case in Interfolio? Deleting the case in
              Interfolio will delete the case from the Interfolio system.
            </div>
            :
            <div>
              Would you like to withdraw this case in Interfolio? Withdrawing will close the case in Interfolio
              and update the status to "Withdrawn".
            </div>
          }
          <br/>
          <div>
            <b>Interfolio Case:</b>
          </div>
          <div>
            {this.state.deleteOrWithdrawData.unitValueForDisplayInModal ?
            <span>
              Unit: {this.state.deleteOrWithdrawData.unitValueForDisplayInModal}
            <br/></span>
              :
            <span/>
            }
            Case Location:
            {" "+this.state.deleteOrWithdrawData.caseLocationForDisplayInModal}
          </div>
          <br/>
          {this.state.deleteOrWithdrawData.actionLinkedToByCCase ?
            <div>
              <div>
                These actions in Opus are linked to this Interfolio case.
                If the Interfolio case is linked to other actions in Opus, you may not want to {this.props.deleteOrWithdrawSelection} it.
              </div>
              <br/>
              <div>
                <b>Linked Opus Cases:</b>
              </div>
              {this.state.deleteOrWithdrawData.actionLinkedToByCCase.map((linkedAction, index) =>
                <div key={index}>
                  <span>
                    Action: {linkedAction.action}
                  </span>
                  <br/>
                  <span>
                    {linkedAction.effectiveDate!=="N/A" ?
                    "Effective Date: "+linkedAction.effectiveDate
                    :
                    "Proposed Effective Date: "+linkedAction.proposedEffectiveDate
                    }
                  </span>
                  <br/>
                  <span>
                    Status: {linkedAction.status}
                  </span>
                  <br/><br/>
                </div>
              )}
            </div>
            :
            <span/>
          }
        </Body>
        <Footer>
          <button onClick=
            {() => this.props.interfolioSelection("yes")} className="left btn btn-sm btn-primary margin-right-20"
            disabled={this.state.isDeleteOrWithdrawButtonDisabled}>
            {this.state.casesAdminTypeAction} the Case in Opus AND Interfolio
          </button>  &nbsp; &nbsp;
          <button onClick=
            {() => this.props.interfolioSelection("no")} className="left btn btn-sm btn-primary"
              disabled={this.state.isDeleteOrWithdrawButtonDisabled}>
            {this.state.casesAdminTypeAction} the Case ONLY in Opus
          </button>  &nbsp; &nbsp;
          <button onClick={() => this.props.back()}
            className=" left btn btn-link">
            Back
          </button>  &nbsp; &nbsp;
          <Dismiss onClick={this.closeDeleteOrWithdrawCaseFromInterfolioModal} className=" left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }
}
