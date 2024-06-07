import React from "react";
import {get} from "lodash";
import PropTypes from "prop-types";
import {Cell} from "fixed-data-table-2";
import {Radio, FormGroup} from "react-bootstrap";

//My imports
import {ToolTipWrapper} from "../../common/components/elements/ToolTip.jsx";
import {HideIf, ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {CommentIcon, ECCommentIcon} from '../../common/components/elements/Icon.jsx';

/**
 *
 * @desc - Cell that displays and attaches a hyperlink
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const LinkCell = ({rowIndex, columnName, data, displayKey = columnName}) => {
    let {link} = data[rowIndex];
    // let text = data[rowIndex][columnName];
    let text = data[rowIndex][displayKey];
    let jsx = link ? <a href={link} tabIndex="-1" target="_blank"> {text} </a> :
    text;

    return <Cell> {jsx} </Cell>;
};
LinkCell.propTypes = {
    columnName: PropTypes.string,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 * @name ImageLinkCell
 * @desc - Cell that displays an attaches a link and an image. MUST HAVE A link
 *  TO SHOW IMAGE
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const ImageLinkCell = ({rowIndex, data, ...props}) => {
    let {descriptionText, uiLayer: {imageProps, classText} = {}, imagePath} = props;
    let rowData = data[rowIndex];
    let {link} = rowData;
    let path = rowData.imagePath || imagePath;
    let image = path ? (<img src={path} {...imageProps} />) : null;
    let imageLink = (
    <Cell>
      <ToolTipWrapper text={descriptionText}>
        <a className={classText} href={link} tabIndex="-1" target="_blank">
          {image}
        </a>
      </ToolTipWrapper>
    </Cell>
  );

    return link && path ? imageLink : null;
};
ImageLinkCell.propTypes = {
    url: PropTypes.string,
    descriptionText: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
    imagePath: PropTypes.string,
    columnName: PropTypes.string,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    imageProps: PropTypes.object,
    uiLayer: PropTypes.object,
    data: PropTypes.array.isRequired
};

/**
 * ImageCell
 *
 * @desc - Regular Cell that displays an image
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - Cell with image inside
 *
 **/
export const ImageCell = ({rowIndex, descriptionText, data, imagePath, imageProps}) => {
    let rowData = data[rowIndex];
    let src = rowData.imagePath || imagePath;
    return (
    <Cell>
      <ToolTipWrapper text={descriptionText}>
        <img {...{src, ...imageProps}} />
      </ToolTipWrapper>
    </Cell>);
};
ImageCell.propTypes = {
    imagePath: PropTypes.string,
    classText: PropTypes.string,
    text: PropTypes.string,
    descriptionText: PropTypes.string,
    onClick: PropTypes.func,
    imageChooser: PropTypes.func,
    rowData: PropTypes.object,
    imageProps: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};


/**
 * ToolTipCell
 *
 * @desc - ToolTip Cell that displays text
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - Cell with image inside
 *
 **/
export const ToolTipCell = ({rowIndex, columnName, data}) => {
    let text = data[rowIndex][columnName] || null;

    return (
    <Cell>
      <ToolTipWrapper {...{text}}>
        {text}
      </ToolTipWrapper>
    </Cell>);
};
ToolTipCell.propTypes = {
    classText: PropTypes.string,
    text: PropTypes.string,
    columnName: PropTypes.string,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const ImageClick = ({rowIndex, imagePath, data, descriptionText, ...props}) => {
    let rowData = data[rowIndex];
    let src = imagePath || rowData.imagePath;
    let onClick = (event) => {
        props.onClick(event, {...props, rowData, rowIndex});
    };
    return (
    <Cell>
      <ToolTipWrapper text={descriptionText}>
        <img {...{src, onClick}}/>
      </ToolTipWrapper>
    </Cell>
  );
};
ImageClick.propTypes = {
    imagePath: PropTypes.string,
    elementProps: PropTypes.object,
    iconProps: PropTypes.object,
    descriptionText: PropTypes.string,
    classText: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    columnConfig: PropTypes.object,
    imageUrlPicker: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const CommentClick = ({rowIndex, data, ...props}) => {
  let rowData = data[rowIndex];
  let commentsCount = 0;
  if(data[rowIndex] && data[rowIndex].commentsCounter>0){
    commentsCount = data[rowIndex].commentsCounter;
  }
  let onClick = (event) => {
      props.onClick(event, {...props, rowData, rowIndex});
  };
  return (  
    <ECCommentIcon onClick={onClick} placeholder={commentsCount} />
  );
};
CommentClick.propTypes = {
  imagePath: PropTypes.string,
  elementProps: PropTypes.object,
  iconProps: PropTypes.object,
  descriptionText: PropTypes.string,
  classText: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  columnConfig: PropTypes.object,
  imageUrlPicker: PropTypes.func,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const DisableImageClick = ({rowIndex, imagePath, data, descriptionText, ...props}) => {
    let rowData = data[rowIndex];
    let src = imagePath || rowData.imagePath;
    let onClick = (event) => {
        props.onClick(event, {...props, rowData, rowIndex});
    };
    return (
    <Cell>
    <ShowIf show={!rowData.disabled}>
      <ToolTipWrapper text={descriptionText}>
        <img {...{src, onClick}}/>
      </ToolTipWrapper>
    </ShowIf>
    </Cell>
  );
};
DisableImageClick.propTypes = {
    imagePath: PropTypes.string,
    elementProps: PropTypes.object,
    iconProps: PropTypes.object,
    descriptionText: PropTypes.string,
    classText: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    columnConfig: PropTypes.object,
    imageUrlPicker: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 * IconCell
 *
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const IconCell = ({data, rowIndex, iconProps, text}) => {
    let onClick = () => {
        iconProps.onClick(data[rowIndex], rowIndex);
    };

    return (
    <Cell>
      <span {...iconProps} className={iconProps.classText}
        data-rowData={data[rowIndex]} onClick={onClick}>
        {text}
      </span>
    </Cell>
  );
};
IconCell.propTypes = {
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    iconProps: PropTypes.object,
    classText: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 *
 * @desc - Regular Cell that simply displays text
 * @desc - Cell that displays an attaches a link and an image
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const TextCell = ({rowIndex, columnName, data}) => {
    return <Cell className= {data[rowIndex][columnName+"Highlight"] ? " light-red cell-padding " : " row-cells " }>{data[rowIndex][columnName]}</Cell>;
};
TextCell.propTypes = {
    rowIndex: PropTypes.number,
    columnName: PropTypes.string,
    data: PropTypes.array.isRequired
};


/**
 *
 * @desc - Gets display value by path rather than the regular 'columnName'
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} path - path to extract data from 'data[rowIndex]'
 * @return {JSX} - jsx for cell
 *
 **/
export const DisplayCell = ({rowIndex, columnName, data, displayKey = columnName}) => {
    return <Cell className={data[rowIndex][columnName+"Highlight"] ? " light-red cell-padding " : " row-cells " }>{data[rowIndex][displayKey]}</Cell>;
};
DisplayCell.propTypes = {
    rowIndex: PropTypes.number,
    path: PropTypes.string,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Gets display value by path rather than the regular 'columnName'
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} path - path to extract data from 'data[rowIndex]'
 * @return {JSX} - jsx for cell
 *
 **/
export const DisplayByPathCell = ({rowIndex, data, displayKey}) => {
    let value = get(data[rowIndex], displayKey);
    return <Cell className=" row-cells ">{value}</Cell>;
};
DisplayByPathCell.propTypes = {
    rowIndex: PropTypes.number,
    path: PropTypes.string,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Checkbox
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} path - path to extract data from 'data[rowIndex]'
 * @return {JSX} - jsx for cell
 *
 **/
export const CheckboxCell = ({rowIndex, data, ...props}) => {
    let rowData = data[rowIndex];
    let {uiProps: {checked}} = rowData;

    let onClick = (event) => {
        props.onClick(event, {...props, rowData, rowIndex});
    };

    return (
   <Cell>
     <input {...{onClick, checked}} type="checkbox" />
   </Cell>
  );
};
CheckboxCell.propTypes = {
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    checkboxProps: PropTypes.object,
    onClick: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired,
    uiProps: PropTypes.object
};

/**
 *
 * @desc - Button
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} path - path to extract data from 'data[rowIndex]'
 * @return {JSX} - jsx for cell
 *
 **/
export const ButtonCell = ({data, rowIndex, buttonText, ...props}) => {
    let rowData = data[rowIndex];

    let onClick = (event) => {
        props.onClick(event, {...props, rowData, rowIndex});
    };

    return (
   <Cell>
     <ShowIf show={rowData.disabled && buttonText === "Reopen"}>
      <div role="button" aria-label="help tip" data-original-title=""
       data-trigger="hover" className="ttip" title="" data-html="true"
       data-container="body" data-placement={"top"} data-toggle="popover"
       data-content={rowData.descriptionText}>
        <button type="button" className={"btn btn-primary "+rowData.buttonClass}>
          {buttonText}
        </button>
      </div>
    </ShowIf>
    <ShowIf show={!rowData.disabled || buttonText !== "Reopen"}>
      <button type="button" className={"btn btn-primary "}
          onClick={onClick}>
        {buttonText}
      </button>
    </ShowIf>
  </Cell>
 );
};
ButtonCell.propTypes = {
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Button
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} path - path to extract data from 'data[rowIndex]'
 * @return {JSX} - jsx for cell
 *
 **/
export const DeleteButtonCell = ({data, rowIndex, buttonText, ...props}) => {
    let rowData = data[rowIndex];
    let onClick = (event) => {
        props.onClick(event, {...props, rowData, rowIndex});
    };

    return (
   <Cell>
     <ShowIf show={rowData.disabled && buttonText === "Delete"}>
      <div role="button" aria-label="help tip" data-original-title=""
       data-trigger="hover" className="ttip" title="" data-html="true"
       data-container="body" data-placement={"top"} data-toggle="popover"
       data-content={rowData.descriptionText}>
        <button type="button" className={"btn btn-primary "+rowData.buttonClass}>
          {buttonText}
        </button>
      </div>
    </ShowIf>
    <ShowIf show={!rowData.disabled || buttonText !== "Delete"}>
      <button type="button" className={"btn btn-primary "}
          onClick={onClick}>
        {buttonText}
      </button>
    </ShowIf>
  </Cell>
 );
};
DeleteButtonCell.propTypes = {
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
    rowData: PropTypes.object,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Cell that displays and attaches a hyperlink
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const InterfolioLinkCell = ({rowIndex, data}) => {
    let interfolioLink;
    if(data[rowIndex] && data[rowIndex].originalData && data[rowIndex].originalData.bycCaseUrl){
        interfolioLink = data[rowIndex].originalData.bycCaseUrl;
    }
    let jsx = interfolioLink ? <a href={interfolioLink} tabIndex="-1" target="_blank"> Go To Interfolio </a> :
    "" ;

    return <Cell> {jsx} </Cell>;
};
InterfolioLinkCell.propTypes = {
    columnName: PropTypes.string,
    rowIndex: PropTypes.number,
    data: PropTypes.array.isRequired
};

export const MultiLineActionCell = ({rowIndex, data}) => {
  let actionDetails = "";
  if(data[rowIndex] && data[rowIndex].originalData && data[rowIndex].originalData.actionDetails){
    actionDetails = data[rowIndex].originalData.actionDetails;

  } 
  return <Cell className=" row-cells ">
    {actionDetails.split("  ").map((i,key) => {
      return <div key={key}>{i}</div>;
    })}</Cell>;
};
MultiLineActionCell.propTypes = {
  columnName: PropTypes.string,
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired
};

/**
 *
 * @desc - Cell that displays and attaches a hyperlink
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 *
 * @return {JSX} - jsx for cell
 *
 **/
export const OpusCaseLinkCell = ({rowIndex, data}) => {
  let opusCaseLink = '/opusWeb/ui/admin/case-summary.shtml?';
  let linkToOpus, caseId, actionCategoryId, actionTypeId;
  if(data[rowIndex] && data[rowIndex].originalData && data[rowIndex].originalData.linkedToOpusCase){
    linkToOpus = data[rowIndex].originalData.linkedToOpusCase;
    caseId = data[rowIndex].originalData.caseId;
    actionCategoryId = data[rowIndex].originalData.actionCategoryId;
    actionTypeId = data[rowIndex].originalData.actionTypeId;
    opusCaseLink =  opusCaseLink + "caseId=" + caseId + "&actionCategoryId=" + actionCategoryId + "&actionTypeId=" + actionTypeId;  
  }
  let jsx = opusCaseLink ? <a href={opusCaseLink} tabIndex="-1" target="_blank"> {linkToOpus} </a> :
  "" ;

  return <Cell> {jsx} </Cell>;
};
InterfolioLinkCell.propTypes = {
  columnName: PropTypes.string,
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired
};

/**
 *
 *
 * @desc - Regular Cell that simply displays multi lined text
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const MultiLineCell = ({rowIndex, columnName, data}) => {
    let rowData = data[rowIndex][columnName];
    return <Cell className=" row-cells ">
      {rowData.map((value, index) => {
          return <span key={index}>{value} <br /></span>;
      })}</Cell>;
};
MultiLineCell.propTypes = {
    rowIndex: PropTypes.number,
    columnName: PropTypes.string,
    data: PropTypes.array.isRequired
};

/**
 *
 *
 * @desc - Regular Cell that simply displays multi lined text
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const MultiLineWithColumnsCell = ({rowIndex, columnName, data}) => {
    let rowData = data[rowIndex][columnName];
    return <Cell className=" row-cells ">
      {rowData.map((value, index) => {
          return <div key={index} className=" col-sm-3 ">{value} <br /></div>;
      })}</Cell>;
};
MultiLineWithColumnsCell.propTypes = {
    rowIndex: PropTypes.number,
    columnName: PropTypes.string,
    data: PropTypes.array.isRequired
};

/**
 *
 *
 * @desc - Radio cell with radio button options
 * @desc - Specific to link ucpath position table
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const RadioCell = ({rowIndex, columnName, data, ...props}) => {
    let rowData = data[rowIndex];
    let rowDataColumn = data[rowIndex][columnName];
  // Exception for no uc path positions:
    if(rowDataColumn==="No UCPath Positions"){
        return <Cell className=" row-cells ">{rowDataColumn} <br /></Cell>;
    }else if(rowData.originalData.tabName==="confirmed"){
        return <Cell className=" row-cells ">
      {rowDataColumn.map((mainRadioGroup, mainRadioGroupIndex) => {
          return <FormGroup key={mainRadioGroupIndex}>
            {mainRadioGroup.map((radioText, radioTextIndex) => {
                return <span key={radioTextIndex}>{radioText}<br /></span>;}
              )
            }
        </FormGroup>;
      })}
    </Cell>;
    }

    let onClick = (mainRadioGroupIndex, event) => {
        props.onClick(event, {...props, rowData, mainRadioGroupIndex, rowIndex});
    };

    return <Cell className=" row-cells ">
        {rowDataColumn.map((mainRadioGroup, mainRadioGroupIndex) => {
            return <FormGroup key={mainRadioGroupIndex}>
            <Radio name={rowData.uniqueKey} inline
              defaultChecked={mainRadioGroupIndex===0}
              onChange={(e)=>onClick(mainRadioGroupIndex, e)}>
              {mainRadioGroup.map((radioText, radioTextIndex) => {
                  return <span key={radioTextIndex}>{radioText}<br /></span>;}
                )
              }
            </Radio>
          </FormGroup>;
        })}
        </Cell>;
};
RadioCell.propTypes = {
    rowIndex: PropTypes.number,
    columnName: PropTypes.string,
    data: PropTypes.array.isRequired
};

/**
 *
 *
 * @desc - Cell that displays a link but acts like a button
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const LinkManualButton = ({rowIndex, columnName, data, ...props}) => {
  let rowData = data[rowIndex];

  let onClick = (event) => {
      event.preventDefault();
      props.onClick(event, {...props, rowData, rowIndex});
  };

  return <Cell className=" row-cells ">
    <div>No matching UCPath Position found</div>
    <a href={''} tabIndex="-1" target="_blank" onClick={onClick}>{columnName}</a>
  </Cell>;
};

/**
 *
 *
 * @desc - Cell that displays a link but acts like a button
 * @param {Number} rowIndex - array index of cell to array of rowData
 * @param {String} data - rowData
 * @param {String} columnName - name of column
 * @param {Object} props - all data passed into cell
 * @return {JSX} - jsx for cell
 *
 **/
export const LinkButton = ({rowIndex, columnName, data, ...props}) => {
    let rowData = data[rowIndex];

    let onClick = (event) => {
        event.preventDefault();
        props.onClick(event, {...props, rowData, rowIndex});
    };

    return <Cell className=" row-cells ">
      <a href={''} tabIndex="-1" target="_blank" onClick={onClick}>{columnName}</a>
    </Cell>;
};
RadioCell.propTypes = {
    rowIndex: PropTypes.number,
    columnName: PropTypes.string,
    data: PropTypes.array.isRequired
};
