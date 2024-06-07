import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

//My imports
import {TextArea} from '../forms/InputFields.jsx';
import Modal, {Header, Title, Body} from './ReactBootstrapModal.jsx';
export {Body as CommentBody};

export const CommentTitle = ({closeButton = true, children}) =>
  (<Header className=" modal-info " {...{closeButton}}>
      <h1 id="ModalHeader" className="comments-title modal-title">{children}</h1>
  </Header>);
CommentTitle.propTypes = {
  closeButton: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export const Comment = ({comment, nameKey, dateKey, commentKey}) => {
  return (
    <div>
      <div className="panel panel-default" >
        <div className="panel-heading">
          {comment[nameKey]} - {comment[dateKey]}
        </div>
        <div className="panel-body">
          {comment[commentKey]}
        </div>
      </div>
    </div>
  );
};
Comment.propTypes = {
  comment: PropTypes.object,
  nameKey: PropTypes.string,
  dateKey: PropTypes.string,
  commentKey: PropTypes.string
};
Comment.defaultProps = {
  comment: {},
  nameKey: 'createdBy',
  dateKey: 'createDt',
  commentKey: 'commentsText'
};

export const CommentList = ({comments, ...props}) => {
  let commentList = comments.map((each, idx) =>
    <Comment {...props} key={idx} comment={each}/>);

  return (
    <div>
      <br/><br/>
      {comments.length ? <h2> Comment History </h2> : null}
      {commentList}
    </div>);
};
CommentList.defaultProps = {
  comments: []
};
CommentList.propTypes = {
  comments: PropTypes.array
};

export const EndowedChairCommentList = ({comments, ...props}) => {
  let commentList = comments.map((each, idx) =>
    <Comment {...props} key={idx} comment={each}/>);
  if(comments.length != 0){
    return (
      <div>
        {comments.length ? <h2> Comment History </h2> : null}
        {commentList}
      </div>);
  }else{
    return (
      <div>
          There are no comments to display. <br/><br/>
      </div>);    
  }
};
EndowedChairCommentList.defaultProps = {
  comments: []
};
EndowedChairCommentList.propTypes = {
  comments: PropTypes.array
};


export const CommentTextArea = ({value, onChange, ...props}) =>
  <div>
    <form className="form-horizontal">
      <div className="comment-form-group form-group">
        <label className=" comment-label">
          Add a New Comment.  (Maximum 250 characters.)
        </label>
        <TextArea className=" comment-wide " {...{value, onChange, ...props}} />
      </div>
    </form>
  </div>
      ;

CommentTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};


export const CommentSave = ({disabled, onClick, ...props}) => {
  return (
    <Button {...{onClick, disabled, ...props}} bsStyle="primary" className="left">
      Save Comment
    </Button>);
};
CommentSave.propTypes = {
  onClick: PropTypes.func.isRequired
};

/**
 *
 * @desc - Modal that you see when clicking on the 'Change Columns' button
 *
 **/
export const CommentsModal = ({show = false, onHide, children}) => {
  return <Modal {...{show, onHide}}> {children} </Modal>;
};
CommentsModal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired
};
