import React from "react";
import {Cell} from "fixed-data-table-2";
import DebounceInput from "react-debounce-input";


//My imports
import {cssSortClassNames} from "../constants/DatatableConstants";
import {ShowIf} from "../../common/components/elements/DisplayIf.jsx";
import {ToolTip, ToolTipWrapper} from "../../common/components/elements/ToolTip.jsx";
import {JQueryUIMultiSelect} from "../../common/components/jquery-ui/MultiSelect.jsx";

export default class DataTableHeader {
  /**
   *
   * @desc - returns input tag that is searchable and filterable after n milliseconds(debounced)
   * @param {Object} - various args
   * @returns {JSX} - jsx
   *
   **/
    getColumnHeaderTextInput({textSearch = false, debounceTimeout = 750, onSearchTextFilter,
    name, value = ""}) {
        return (
      <ShowIf show={textSearch}>
        <div className="">
          <DebounceInput placeholder="Search" className="form-control search-field search-name  "
            {...{debounceTimeout, name, onChange: onSearchTextFilter, value}} />
        </div>
      </ShowIf>);
    }

  /**
   *
   * @desc - Figures out the what sort css should be
   * @param {Object} sortable -
   * @param {Number} sortDirection -
   * @returns {JSX} - Column JSX
   *
   **/
    getSortCss({name, sortable, columnSortOrder} = {}) {
        let sortDirection = columnSortOrder[name];
        return sortable ? cssSortClassNames[sortDirection] || cssSortClassNames.none
      : "";
    }

  /**
   *
   * @desc -  Creates MultiSelect dropdown if there are array options to populate
   *  the dropdown
   * @param {Object} columnData -
   * @returns {JSX} - JQueryUIMultiSelect JSX Component
   *
   **/
    getMultiSelectHeader({resetNumber, name, valueOptions = [], tableClassName,
    onMultiSelectClick, checkedSelectOptions = {}, modalId, ...options} = {}) {
        let hasMultiSelect = valueOptions && valueOptions.length;
        if(!hasMultiSelect) {
            return null;
        }

    //Create unique key for MultiSelect in case we have multiple tables
        let {table_number} = options;
        let table_number_suffix = table_number ? `-${table_number}` : "";
        let key = `jquery-ms-${name}${table_number_suffix}`;
        return (<JQueryUIMultiSelect prepopulate {...{name: key, key, resetNumber,
      checkedSelectOptions, tableClassName, columnName: name,
      selectOptions: valueOptions, onSelectInputChange: onMultiSelectClick, modalId}} />);
    }

  /**
   *
   * @desc -  Title to be shown
   * @param {Object} columnData -
   * @returns {String | JSX} - String title or image
   *
   **/
    getTitle({showImageAsColumnTitle, displayName, headerImageSrc, imageTitleHoverText} = {}) {
        return showImageAsColumnTitle ?
      <ToolTipWrapper text={imageTitleHoverText}>
        <img {...{src: headerImageSrc}} />
      </ToolTipWrapper> :
      displayName;
    }

    getColumnHeaderCheckboxInput({selectAll = false, onToggleSelectAll}) {
        return selectAll ? (<input type="checkbox" onClick={onToggleSelectAll} />)
      : null;
    }

  /**
   *
   * @desc - Gets the header for each column
   * @param {Object} columnData -
   * @param {Object} - args
   * @returns {String | JSX} - String title or image
   *
   **/
    getHeader(columnData = {}, {onClickSort, resetNumber, onSearchTextFilter,
    columnSortOrder, columnStringMatch, columnValueOptions, ...options} = {}) {
    //All variables needed for headers
        let {name, displayName, valueOptions, sortable, descriptionText,
      headerDescriptionText = descriptionText} = columnData;

    //Show image or text
        let dataColumnTitle = this.getTitle(columnData);
    //Gets Text Search Header
        let TextSearch = this.getColumnHeaderTextInput({onSearchTextFilter, name,
      value: columnStringMatch[name], ...columnData});

    //Should the arrow be up, down, or none
        let sortCss = this.getSortCss({name, sortable, columnSortOrder});
    //When sort icon is clicked
        let onSort = () => onClickSort(name);

    //Gets MultiSelect dropdown if there is one
        let MultiSelect = this.getMultiSelectHeader({name, valueOptions, resetNumber,
      ...columnData, ...options, checkedSelectOptions: columnValueOptions[name]});

        let Checkbox = this.getColumnHeaderCheckboxInput({...options, ...columnData});

        let placement = "top";
        if(columnData.placement){
            placement = columnData.placement;
        }

        return (
      <Cell key={name} className=" highlight " >
        <div className={` ${sortCss} `} onClick={name === "otherAffiliations" || name === "location" ? "" : onSort}>
          <ShowIf show={dataColumnTitle}>
            <span>
              {dataColumnTitle} <ToolTip text={headerDescriptionText} placement={placement}/>
            </span>
          </ShowIf>
        </div>
        {MultiSelect} {TextSearch} {Checkbox}
      </Cell>
    );
    }
}
