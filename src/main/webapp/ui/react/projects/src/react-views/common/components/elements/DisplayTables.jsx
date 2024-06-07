import React from "react";
import PropTypes from "prop-types";
import {keys} from "lodash";
import {Button} from "react-bootstrap";

//My imports
import {ToolTip} from "./ToolTip.jsx";
import { ShowIf } from "./DisplayIf.jsx";


export const DisplayTableHeader = ({...props, columnTitles, children}) => {
    return (
    <thead>
      <tr>
        <th colSpan={props.colSpan}>
          {children}
        </th>
      </tr>
      <tr>
        {columnTitles.map(column => <th key={column}>{column}</th>)}
      </tr>
    </thead>
  );
};
DisplayTableHeader.propTypes = {
    children: PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node
    ]),
    colSpan: PropTypes.string,
    columnTitles: PropTypes.array
};
DisplayTableHeader.defaultProps = {
    colSpan: "2",
    columnTitles: []
};

export const DisplayTableRow = ({field, displayNameKey, valueKey, visibleKey,
  leftColumnCss, rightColumnCss, ...props}) =>
  <tr>
    <td className={` label-column ${leftColumnCss} `} >
      {field[displayNameKey]} <ToolTip text={field[props.descriptionKey]} />
    </td>
    <td className={` data-column ${rightColumnCss} `}>
      {field[valueKey]}
      <ShowIf show={field.showButton && field.value ? true : false}>
        <span>
         &nbsp; &nbsp;
          <Button className="btn btn-primary btn-link" onClick={props.onClick}
            disabled={field.buttonDisabled ? true: false}>{field.buttonMessage}</Button>
        </span>
      </ShowIf>
      </td>
  </tr>;

DisplayTableRow.propTypes = {
    field: PropTypes.object,
    leftColumnCss: PropTypes.string,
    rightColumnCss: PropTypes.string,
    valueKey: PropTypes.string,
    displayNameKey: PropTypes.string,
    descriptionKey: PropTypes.string
};
DisplayTableRow.defaultProps = {
    field: {},
    valueKey: "value",
    leftColumnCss: "col-md-5 ",
    rightColumnCss: "col-md-7 ",
    displayNameKey: "displayName",
    descriptionKey: "descriptionText"
};

export const DisplayTableBody = ({fieldOptions, fieldNames = keys(fieldOptions),
  valueKey, displayNameKey, ...props}) => {
    return (
    <tbody>
      {fieldNames.map((name, index) =>
        (<DisplayTableRow key={index} {...{displayNameKey, valueKey,
          field: fieldOptions[name], ...props}} />)
      )}
    </tbody>
  );
};
DisplayTableBody.propTypes = {
    fieldOptions: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    fieldNames: PropTypes.array,
    valueKey: PropTypes.string,
    displayNameKey: PropTypes.string
};
DisplayTableBody.defaultProps = {
    fieldOptions: {},
    valueKey: "value",
    displayNameKey: "displayName"
};

export const VisibleDisplayTableBody = ({fieldOptions, fieldNames = keys(fieldOptions),
  valueKey, visibleKey, displayNameKey, ...props}) => {
    return (
    <tbody>
      {fieldNames.map((name, index) => fieldOptions[name][visibleKey] ?
        (<DisplayTableRow key={index} {...{displayNameKey, valueKey,
          field: fieldOptions[name], ...props}} />) : null
      )}
    </tbody>
  );
};
VisibleDisplayTableBody.propTypes = {
    fieldOptions: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    fieldNames: PropTypes.array,
    valueKey: PropTypes.string,
    visibleKey: PropTypes.string,
    displayNameKey: PropTypes.string
};
VisibleDisplayTableBody.defaultProps = {
    fieldOptions: {},
    valueKey: "value",
    visibleKey: "visibility",
    displayNameKey: "displayName"
};

export const DisplayTable = ({className, baseCss, children}) => {
    return (
    <div>
      <table className={` ${className} ${baseCss} `}>
        {children}
      </table>
    </div>
  );
};
DisplayTable.propTypes = {
    children: PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node
    ]),
    baseCss: PropTypes.string,
    className: PropTypes.string
};
DisplayTable.defaultProps = {
    baseCss: " fixed-layout ",
    className: " table table-bordered table-responsive "
};
