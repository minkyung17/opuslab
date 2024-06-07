import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

//My imports
import {CommentsModal, CommentTitle, CommentList, CommentTextArea, CommentSave,
  CommentBody} from './CommentComponents.jsx';

export default class CommentModal extends React.Component {
  /**
  *
  * @desc - Proptypes for element
  *
  **/
  static propTypes = {
    show: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
    comments: PropTypes.array,
    onHide: PropTypes.func.isRequired,
    onClickSave: PropTypes.func.isRequired
  }
  state = {
  }

  componentWillReceiveProps({comments}) {
    if(comments !== this.props.comments) {
      this.setState({isCommentSaveButtonDisabled: false});
    }
  }

  /**
   *
   * @desc - On Change that updates comments text to be save
   * @param {String} evt - comments that user wants to save
   * @return {void}
   *
   **/
  saveComment = () => {
    let {text} = this.props;
    this.props.onClickSave(text);
    this.setState({isCommentSaveButtonDisabled: true});
  }


  /**
  *
  * @desc - Class variables
  * @return {void}
  *
  **/
  render() {
    let {state: {isCommentSaveButtonDisabled}, props: {text, title, show, comments,
      onHide, updateComment}} = this;

    return (
      <CommentsModal {...{show, onHide}}>

        <CommentTitle> {title} </CommentTitle>

        <CommentBody>
          <CommentTextArea {...{value: text}} onChange={updateComment} />

          <CommentSave disabled={isCommentSaveButtonDisabled}
            onClick={this.saveComment} />

          <br />
          <CommentList {...{comments}} />
        </CommentBody>

      </CommentsModal>);
  }
}
