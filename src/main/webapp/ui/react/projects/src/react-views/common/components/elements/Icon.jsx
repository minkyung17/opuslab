import React from "react";
import PropTypes from "prop-types";
import {ToolTipWrapper} from "./ToolTip.jsx";


export const DeleteIcon = ({text, src, position, onClick, className, uiProps}) =>
  (<ToolTipWrapper className={position} {...{text}}>
    <img {...{onClick, ...uiProps, src, className}} />
   </ToolTipWrapper>);
DeleteIcon.propTypes = {
    src: PropTypes.string,
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
DeleteIcon.defaultProps = {
    uiProps: {},
    text: " Delete ",
    position: " right ",
    src: "../images/trash-lrg.png",
    className: " button delete-icon icon-trash "
};

export const EditIcon = ({text, position, src, onClick, className, uiProps}) =>
  (<ToolTipWrapper className={position} {...{text}}>
    <img {...{onClick, ...uiProps, src, className}} />
   </ToolTipWrapper>);
EditIcon.propTypes = {
    src: PropTypes.string,
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
EditIcon.defaultProps = {
    uiProps: {},
    text: " Edit ",
    position: " right ",
    src: "../images/edit-pencil-lrg.png",
    className: " button edit-icon icon-pencil right edit-case-button "
};


export const CommentIcon = ({text, position, placeholder, onClick, src, className, uiProps, className1, className2}) =>
  (<div className={className1}>
   <ToolTipWrapper className={position} {...{text}}>
    <img {...{onClick, ...uiProps, src, className}} />
    <div className={className2} {...{onClick}}>{placeholder}</div>
   </ToolTipWrapper>
  </div>);

CommentIcon.propTypes = {
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
CommentIcon.defaultProps = {
    uiProps: {},
    text: " Comment ",
    position: " right ",
    src: "../images/comment-active.png",
    className: " button edit-icon icon-pencil right edit-case-button ",
    className1: " comment-icon-container-profile-cases ",
    className2: " comment-icon-centered "
};

export const ECCommentIcon = ({text, position, placeholder, onClick, src, uiProps, className, className1, className2}) =>
  (<div className={className1}>
   <ToolTipWrapper className={position} {...{text}}><br/>
    <img {...{onClick, ...uiProps, className, src}} />
    <div className={className2} {...{onClick}}><br/>{placeholder}</div>
   </ToolTipWrapper>
  </div>);

ECCommentIcon.propTypes = {
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
ECCommentIcon.defaultProps = {
    uiProps: {},
    text: " View Comments ",
    position: " right ",
    src: "../images/comment-active.png",
    className: " button edit-icon icon-pencil right edit-case-button ",
    className1: " comment-icon-container ", 
    className2: " comment-icon-centered "
};

const OperationIcon = ({onClick, icon, elementProps, toolTipText}) => {
    return (
    <ToolTipWrapper text={toolTipText}>
      <span className={icon} aria-hidden="true" {...elementProps} {...{onClick}} />
    </ToolTipWrapper>);
};
OperationIcon.defaultProps = {
    onClick: () => {},
    elementProps: {},
    icon: "icon-pencil",
    toolTipText: ""
};
OperationIcon.propTypes = {
    toolTipText: PropTypes.string,
    onClick: PropTypes.func,
    elementProps: PropTypes.object,
    icon: PropTypes.string
};

export const StarIcon = ({text, position, src, onClick, className, uiProps}) =>
  (<ToolTipWrapper className={position} {...{text}}>
    <img {...{onClick, ...uiProps, src, className}} />
   </ToolTipWrapper>);
StarIcon.propTypes = {
    src: PropTypes.string,
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
StarIcon.defaultProps = {
    uiProps: {},
    position: " right ",
    src: "../images/star.png",
    className: " button edit-icon icon-pencil right edit-case-button "
};

export const OutlinedStarIcon = ({text, position, src, onClick, className, uiProps}) =>
  (<ToolTipWrapper className={position} {...{text}}>
    <img {...{onClick, ...uiProps, src, className}} />
   </ToolTipWrapper>);
OutlinedStarIcon.propTypes = {
    src: PropTypes.string,
    onClick: PropTypes.func,
    uiProps: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string
};
OutlinedStarIcon.defaultProps = {
    uiProps: {},
    position: " right ",
    src: "../images/star-outlined.png",
    className: " button edit-icon icon-pencil right edit-case-button "
};
