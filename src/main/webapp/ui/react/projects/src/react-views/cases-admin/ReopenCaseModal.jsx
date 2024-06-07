import React from "react";
import PropTypes from "prop-types";

//My imports
import Modal, {Header, Title, Body, Dismiss, Footer} from
  "../common/components/bootstrap/ReactBootstrapModal.jsx";

/******************************************************************************
 *
 * @desc - Reopen case modal
 *
 ******************************************************************************/
export default class ReopenCaseModal extends React.Component {

  /**
   *
   * @desc - Static variables. Only one value throughout all instances
   *
   **/
    static propTypes = {
        showReopenCaseModal: PropTypes.bool,
        reopenData: PropTypes.object,
        changeStateOfReopenModal: PropTypes.func
    }

    static defaultProps = {
        showReopenCaseModal: false,
        reopenData: {}
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
        showReopenCaseModal: false,
        reopenData: {
            fullName: "",
            actionType: "",
            displayValue_approvedEffectiveDate: ""
        }
    };

  /**
   *
   * @desc - Lifecycle hook when receiving newProps
   * @param {Object} props - props
   * @return {void}
   *
   **/
    componentWillReceiveProps(props) {
        this.setState({showReopenCaseModal: props.showReopenCaseModal});
        this.setState({reopenData: props.reopenData});
    }

  /**
   *
   * @desc - Closes ReopenCase Modal
   * @returns {void}
   *
   **/
    closeReopenCaseModal = () => {
        this.props.changeStateOfReopenModal();
    };

  /**
   *
   * @desc - Renders the modal
   * @returns {void}
   *
   **/
    render() {

        return (
      <Modal show={this.state.showReopenCaseModal}
        onHide={this.closeReopenCaseModal}>
        <Header className=" modal-info " closeButton>
          <h1 className="modal-title" id="ModalHeader">
          <img src="../images/case.png" className="modal-header-icon" alt="case icon" />
              &nbsp; &nbsp; Reopen the Case in Interfolio?
          </h1>
        </Header>
        <Body>
          <h2 className="flush-top text-capitalize">{this.state.reopenData.fullName}</h2>
          <p className="small">
            {this.state.reopenData.actionType} <br />
            Effective Date: {this.state.reopenData.displayValue_approvedEffectiveDate}
          </p>
          <p>
            Would you like to also reopen this case in Interfolio?
            <br /><br />
          </p>
        </Body>
        <Footer>
          <button className="left btn btn-primary"
            onClick={() => this.props.reopenOpusCaseAndInterfolioCase("yes", {})}>
            Yes</button>
          <button className="left btn btn-primary"
            onClick={() => this.props.reopenOpusCaseAndInterfolioCase("no", {})}>
            No</button>
          <Dismiss onClick={this.closeReopenCaseModal} className=" left btn btn-link">
            Cancel
          </Dismiss>
        </Footer>
      </Modal>
    );
    }
}
