/**
 * Created by leonaburime on 7/24/17.
 **/
import React from "react";
import {Column, Cell} from "fixed-data-table-2";
import DebounceInput from "react-debounce-input";

//My imports
import * as TableCell from "./DataTableCells.jsx";
import {cssSortClassNames} from "../constants/DatatableConstants";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {ToolTip, ToolTipWrapper} from "../../common/components/elements/ToolTip.jsx";
import {JQueryUIMultiSelect} from "../../common/components/jquery-ui/MultiSelect.jsx";
import {dataViewTypes} from "../../../opus-logic/datatables/constants/DatatableConstants";

/*******************************************************************************
 *
 * @desc - Each column in the datatable
 *
 ******************************************************************************/
export default class DataTableColumns extends React.Component {
    default_sort_css = cssSortClassNames.none;

  /**
   *
   * @desc - returns input tag that is searchable and filterable after n milliseconds(debounced)
   * @param {Object} - various args
   * @returns {JSX} - jsx
   *
   */
  // getColumnHeaderTextInput({textSearch = false, debounceTimeout = 750, onSearchTextFilter,
  //   name, value = ''}) {
  //   return (
  //     <ShowIf show={textSearch}>
  //       <div className="ui input fluid icon">
  //         <DebounceInput placeholder="Search" className=" full-column-input "
  //           {...{debounceTimeout, name, onChange: onSearchTextFilter, value}} />
  //       </div>
  //     </ShowIf>);
  // }

  // getColumnHeaderCheckboxInput({selectAll = false, onToggleSelectAll}) {
  //   return selectAll ? (<input type="checkbox" onClick={onToggleSelectAll} />)
  //     : null;
  // }

  /**
   *
   * @desc -  gets the column data and options
   * @param {Object} eachColumn - data associated w/ each column
   * @param {Array} rowData - array of data shown onscreen
   * @param {String} columnName - name of column
   * @returns {JSX} cellContents - determines what celltype each column is for display
   *
   **/
    getCellContents(eachColumn, rowData, columnName) {
        let cellContent = null;
        let {iconProps, viewType, onClick, elementProps, uiProps} = eachColumn;
        let props = {...eachColumn, data: rowData, columnName, iconProps, uiProps};
    // debugger
    // console.log(viewType);
        switch(viewType) {
        case dataViewTypes.icon_only:
            cellContent = (<TableCell.IconCell {...props} />);
            break;
        case dataViewTypes.money:
            cellContent = (<TableCell.DisplayCell {...props} />);
            break;
        case dataViewTypes.displayByKey:
            cellContent = (<TableCell.DisplayCell {...props} />);
            break;
        case dataViewTypes.percent:
            cellContent = (<TableCell.DisplayCell {...props} />);
            break;
        case dataViewTypes.round2DecimalPercent:
            cellContent = (<TableCell.DisplayCell {...props} />);
            break;
        case dataViewTypes.link:
            cellContent = (<TableCell.LinkCell {...props} />);
            break;
        case dataViewTypes.imageLink:
            cellContent = (<TableCell.ImageLinkCell {...props} />);
            break;
        case dataViewTypes.image:
            cellContent = (<TableCell.ImageCell {...props} {...eachColumn}/>);
            break;
        case dataViewTypes.imageClick: {
            let addlProps = {elementProps, onClick, columnConfig: eachColumn};
            cellContent = (<TableCell.ImageClick {...props} {...addlProps} />);
            break;
        }
        case dataViewTypes.commentClick: {
            let addlProps = {elementProps, onClick, columnConfig: eachColumn};
            cellContent = (<TableCell.CommentClick {...props} {...addlProps} />);
            break;
        }        
        case dataViewTypes.disableImageClick: {
            let addlProps = {elementProps, onClick, columnConfig: eachColumn};
            cellContent = (<TableCell.DisableImageClick {...props} {...addlProps} />);
            break;
        }
        case dataViewTypes.checkbox: {
            cellContent = (<TableCell.CheckboxCell {...props} />);
            break;
        }
        case dataViewTypes.tooltip: {
            cellContent = (<TableCell.ToolTipCell {...props} />);
            break;
        }
        case dataViewTypes.button: {
            cellContent = (<TableCell.ButtonCell {...props} />);
            break;
        }
        case dataViewTypes.deleteButton: {
            cellContent = (<TableCell.DeleteButtonCell {...props} />);
            break;
        }
        case dataViewTypes.interfolioLink: {
            cellContent = (<TableCell.InterfolioLinkCell {...props} />);
            break;
        }
        case dataViewTypes.linkToOpusCase: {
            cellContent = (<TableCell.OpusCaseLinkCell {...props} />);
            break;
        }
        case dataViewTypes.multilineAction: {
            cellContent = (<TableCell.MultiLineActionCell {...props} />);
            break;
        }
        case dataViewTypes.multiline: {
            cellContent = (<TableCell.MultiLineCell {...props} />);
            break;
        }
        case dataViewTypes.multilineWithColumns: {
            cellContent = (<TableCell.MultiLineWithColumnsCell {...props} />);
            break;
        }
        case dataViewTypes.radio: {
            cellContent = (<TableCell.RadioCell {...props} />);
            break;
        }
        case dataViewTypes.linkButton: {
            cellContent = (<TableCell.LinkButton {...props} />);
            break;
        }
        case dataViewTypes.linkManualButton: {
            cellContent = (<TableCell.LinkManualButton {...props} />);
            break;
        }
        case dataViewTypes.sortingText: {
            cellContent = (<TableCell.DisplayCell {...props} />);
            break;
        }
        case dataViewTypes.nameLink: {
            cellContent = (<TableCell.LinkCell {...props} />);
            break;
        }
        case dataViewTypes.number: {
            cellContent = (<TableCell.TextCell {...props} />);
            break;
        }
        case dataViewTypes.datetime: {
            cellContent = (<TableCell.TextCell {...props} />);
            break;
        }
        case dataViewTypes.mixedString: {
            cellContent = (<TableCell.TextCell {...props} />);
            break;
        }
        default:
            cellContent = (<TableCell.TextCell {...props} />);
        }

        return cellContent;
    }

  /**
   *
   * @desc -  Creates MultiSelect dropdown if there are array options to populate
   *  the dropdown
   * @param {Object} columnData -
   * @returns {JSX} - JQueryUIMultiSelect JSX Component
   *
   **/
  // getMultiSelectHeader({resetNumber, name, valueOptions = [],
  //   onMultiSelectClick, checkedSelectOptions = {}, ...options} = {}) {
  //   let hasMultiSelect = valueOptions && valueOptions.length;
  //   if(!hasMultiSelect) {
  //     return null;
  //   }
  //
  //   //Create unique key for MultiSelect in case we have multiple tables
  //   let {table_number} = options;
  //   let table_number_suffix = table_number ? `-${table_number}` : '';
  //   let key = `jquery-ms-${name}${table_number_suffix}`;
  //   return (<JQueryUIMultiSelect prepopulate {...{name: key, key,
  //     checkedSelectOptions, resetNumber, columnName: name,
  //     selectOptions: valueOptions, onSelectInputChange: onMultiSelectClick}} />);
  // }

  /**
   *
   * @desc -  Title to be shown
   * @param {Object} columnData -
   * @returns {String | JSX} - String title or image
   *
   **/
  // getTitle({showImageAsColumnTitle, displayName, headerImageSrc, imageTitleHoverText} = {}) {
  //   return showImageAsColumnTitle ?
  //     <ToolTipWrapper text={imageTitleHoverText}>
  //       <img {...{src: headerImageSrc}} />
  //     </ToolTipWrapper> :
  //     displayName;
  // }

  /**
   *
   * @desc - Figures out the what sort css should be
   * @param {Object} sortable -
   * @param {Number} sortDirection -
   * @returns {JSX} - Column JSX
   *
   **/
  // getSortCss({name, sortable, columnSortOrder} = {}) {
  //   let sortDirection = columnSortOrder[name];
  //   return sortable ? cssSortClassNames[sortDirection] || this.default_sort_css
  //     : '';
  // }

  /**
   *
   * @desc -  Formats the column with header name, select options(if any) etc
   *
   * @param {Object} columnData -
   * @param {Object} rowData -
   * @param {Number} index -
   * @returns {JSX} - Column JSX
   *
   **/
    getColumn({columnData = {}, rowData = [], onClickSort, resetNumber,
    onSearchTextFilter, columnSortOrder, columnStringMatch, columnValueOptions,
    onToggleSelectAll, ...options} = {}) {
        let {name, fixed, displayName, valueOptions, sortable, visible, width,
      descriptionText, headerDescriptionText = descriptionText} = columnData;

        if(!visible) {//If column is not visible dont show
            return null;
        }

        let cellContent = this.getCellContents(columnData, rowData, name);

    //Show image or text
        let {showImageAsColumnTitle, headerImageSrc} = columnData;
        let dataColumnTitle = this.getTitle({showImageAsColumnTitle, displayName,
      headerImageSrc, ...columnData});
      //showImageAsColumnTitle ? displayHeaderImage : displayName;

    //Gets Text Search Header
        let TextSearch = this.getColumnHeaderTextInput({onSearchTextFilter, name,
      value: columnStringMatch[name], ...columnData});

    //Should the arrow be up, down, or none
        let sortCss = this.getSortCss({name, sortable, columnSortOrder});

    //Gets MultiSelect dropdown if there is one
        let MultiSelect = this.getMultiSelectHeader({name, valueOptions, resetNumber,
      ...columnData, ...options, checkedSelectOptions: columnValueOptions[name]});

    //When sort icon is clicked
        let onSort = () => onClickSort(name);

        let Checkbox = this.getColumnHeaderCheckboxInput({onToggleSelectAll, ...columnData});

        return (
      <Column key={`column-${name}`} {...{fixed, width}}
        cell={cellContent}
        header={
          <Cell key={name} className=" highlight " >
            <div className={` ${sortCss} `} onClick={onSort}>
              <ShowIf show={dataColumnTitle}>
                <span>
                  {dataColumnTitle} <ToolTip text={headerDescriptionText}/>   
                </span>
              </ShowIf>
            </div>
            {MultiSelect} {TextSearch} {Checkbox}
          </Cell>}/>);
    }

  /**
   *
   * @desc - Gets all the columns for the table
   * @param {Object} columnKeys -
   * @param {Object} columnConfiguration -
   * @returns {Array} - Array of columns
   *
   **/
    getColumns({columnKeys = [], columnViewConfiguration, columnConfiguration,
    rowData, columnSortOrder, columnStringMatch, columnValueOptions, ...options} = {}) {
        let columns = columnKeys.map(columnName => {
            let columnData = columnConfiguration[columnName];
            let columnViewData = columnViewConfiguration[columnName];
            return this.getColumn(columnData, {columnData, rowData, columnViewData,
        columnSortOrder, columnStringMatch, columnValueOptions, ...options});
        });

        return columns;
    }
}
