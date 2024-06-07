import React from "react";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";

//My imports
import { DateField } from "./DateField.jsx";
import { ToolTip } from "../elements/ToolTip.jsx";
import { DeleteIcon } from "../elements/Icon.jsx";
import AutoComplete from "../jquery-ui/AutoComplete.jsx";
import { SelectRadioSearch } from "./SelectRadioSearch.jsx";
import { Select as SelectComponent } from "./SelectOption.jsx";
import { SelectOptionComponent } from "./SelectOptionSearch.jsx";
import { NumberInput, CurrencyInput, TextArea, TextAreaMaxChar, DebounceNumberInput } from "./InputFields.jsx";
import { ShowIf, HideIf } from "../elements/DisplayIf.jsx";


/**
 *
 * @name FormElementWrapper
 * @desc - Wrapper for each form field line
 * @param {Object} props - input props
 * @return {JSX}
 *
**/
export const FormElementWrapper = ({ displayName, descriptionText, otherDescText, helpText,
  left_field_css, right_field_css, topText, hasError, children, error, secondError = false,
  base_css, showLabel = true }) => {
    let has_error_text = hasError ? " has-error " : "";
  //let has_error_text = hasError ? ' has-error ' : null;
  // topText: removed on 7/2/18 due to React 15+ already creating react-text for us
  // <label> {topText} </label>

    return (
    <div className={` ${base_css} ${has_error_text}`}>
      <ShowIf show={showLabel}>
        <label className={`${left_field_css} form-control-static control-label `}>
          {displayName}
          <ToolTip text={otherDescText ? otherDescText : descriptionText} />
        </label>
      </ShowIf>
      <div className={`${right_field_css} form-control-static `}>
        {children}
        <div className="col-sm-12 error_message "> {error} </div>
        <ShowIf show={secondError}>
          <div className="col-sm-12 error_message "> {secondError} </div>
        </ShowIf>

      </div>
      <ShowIf show={helpText}>
        <p className=" help-block ">{helpText}</p>
      </ShowIf>
    </div>
  );
};
FormElementWrapper.propTypes = {
    descriptionText: PropTypes.string,
    left_field_css: PropTypes.string,
    right_field_css: PropTypes.string,
    base_css: PropTypes.string,
    error: PropTypes.string,
    classText: PropTypes.string,
    displayName: PropTypes.string,
    helpText: PropTypes.string,
    hasError: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
FormElementWrapper.defaultProps = {
    helpText: "",
    hasError: false,
    has_error_text: "",
    base_css: "form-group",
    left_field_css: " col-sm-4 ",
    right_field_css: " col-sm-8 "
};

/**
*
* @desc - Choose which element type
* @return {JSX}
*
**/
export const TextAreaFormElementWrapper = ({ displayName, error, children, ...props }) => {
    return (
    <div className=" comment-form-group form-group ">
      <label className=" comment-label col-sm-12 "> {displayName} </label>
      {children}
      <div className=" error_message "> {error} </div>
    </div>);
};
TextAreaFormElementWrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    displayName: PropTypes.string,
    error: PropTypes.string
};
TextAreaFormElementWrapper.defaultProps = {};

/**
 *
 * @name FormAutoComplete
 * @desc - Autocomplete element with FormElementWrapper
 * @param {Object} onChange & other props
 * @return {JSX}
 *
**/
export const FormAutoComplete = ({ onChange, ...props } = {}) =>
  <FormElementWrapper {...props}>
    <AutoComplete {...props} {...{ onChange }} />
  </FormElementWrapper>;

/**
 *
 * @name FormSelect
 * @desc -
 * @param {Object} - onChange, optionsInfo & other props
 * @return {JSX}
 *
**/
export const FormSelect = ({ onChange, optionsInfo, editable = true, disabled = !editable,
  ...props } = {}) =>
  <FormElementWrapper {...props}>
    <SelectComponent {...props} {...optionsInfo} {...{ onChange, disabled }} />
  </FormElementWrapper>;


  /**
   *
   * @name FormSelect
   * @desc -
   * @param {Object} - onChange, optionsInfo & other props
   * @return {JSX}
   *
  **/
export const FormSelectOption = ({ onChange, optionsInfo, editable = true, disabled = !editable,
    ...props } = {}) =>
    <FormElementWrapper {...props}>
      <SelectOptionComponent {...props} {...optionsInfo} {...{ onChange, disabled }} />
    </FormElementWrapper>;

/**
 *
 * @name FormSelectSearch
 * @desc -
 * @param {Object} - onChange, optionsInfo & other props
 * @return {JSX}
 *
**/
export const FormSelectSearch = ({ onChange, optionsInfo, editable = true, disabled = !editable,
  ...props } = {}) =>
<FormElementWrapper {...props}>
  <SelectRadioSearch {...props} {...optionsInfo} {...{ onChange, disabled }} />
</FormElementWrapper>;


/**
 *
 * @name FormNumber
 * @desc - Number input element with FormElementWrapper
 * @param {Object} - error, id, props
 * @return {JSX}
 *
**/
export const FormNumber = ({ name, id, value, editable = true, disabled = !editable,
  onChange, onBlur, inputProps, ...props } = {}) =>
  <FormElementWrapper {...props}>
    <NumberInput {...{ id, name, value, disabled, onChange, onBlur, ...inputProps }} />
  </FormElementWrapper>;


/**
 *
 * @name FormNumber
 * @desc - Number input element with FormElementWrapper
 * @param {Object} - error, id, props
 * @return {JSX}
 *
**/
export const FormDebounceNumber = ({ id, editable = true, disabled = !editable, ...props } = {}) =>
  <FormElementWrapper {...props} >
    <DebounceNumberInput key={id} {...{ id, ...props, disabled }} />
  </FormElementWrapper>;

/**
 *
 * @name FormCurrency
 * @desc - Currency input element with FormElementWrapper
 * @param {Object} - error, id, props
 * @return {JSX}
 *
**/
export const FormCurrency = ({ displayName, descriptionText, helpText, children, error, name, id,
  value, editable = true, disabled = !editable, base_css, showLabel = true,
  left_field_css, right_field_css, onChange, onBlur, inputProps, hasError, ...props } = {}) => {
    let has_error_text = hasError ? " has-error " : "";
    return (
    <div className={` ${base_css} ${has_error_text}`}>
      <ShowIf show={showLabel}>
        <label className={`${left_field_css} form-control-static control-label `}>
          {displayName}
          <ToolTip text={descriptionText} />
        </label>
      </ShowIf>
      <div className={`${right_field_css} form-inline form-control-static `}>
        <div className={`${base_css}`}>
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <CurrencyInput {...{ id, name, value, disabled, onChange, onBlur, ...inputProps }} />
          </div>
        </div>
        <div className=" error_message "> {error} </div>
      </div>
      <ShowIf show={helpText}>
        <p className=" help-block ">{helpText}</p>
      </ShowIf>
    </div>);
};
FormCurrency.defaultProps = {
    helpText: "",
    hasError: false,
    has_error_text: "",
    base_css: "form-group",
    left_field_css: " col-sm-4 ",
    right_field_css: " col-sm-8 "
};


/**
 *
 * @name FormDate
 * @desc - FormDate element with FormElementWrapper
 * @param {Object} - helpMessagec & other props
 * @return {JSX}
 *
**/
export const FormDate = ({ helpMessage, editable = true, disabled = !editable, ...props } = {}) =>
  <FormElementWrapper {...props} >
    <DateField {...props} {...{ disabled }} />
    <p className="help-block">{helpMessage}</p>
  </FormElementWrapper>;


/**
 *
 * @name FormInput
 * @desc -
 * @param {Object} onChange & other props
 * @return {JSX}
 *
**/
export const FormInput = ({ helpMessageBottom, value, id, name, editable = true,
  disabled = !editable, onChange, onBlur, inputProps, ...props } = {}) =>
  <FormElementWrapper {...props} >
    <input className=" form-control " autoComplete="off" {...{
        id, name,
        value: value || "", disabled, onChange, onBlur, ...inputProps
    }} />
    <p className=" help-block input-bottom ">{helpMessageBottom}</p>
  </FormElementWrapper>;

/**
 *
 * @name FormTextArea
 * @desc -
 * @param {Object} props - passed in props
 * @tag TODO: take label out. This is only for Recommendattions
 * @return {JSX}
 *
**/
export const FormTextArea = ({ label, ...props } = {}) =>
  <TextAreaFormElementWrapper>
    <p className="comment-label col-sm-12"> {label} </p>
    <TextArea {...props} />
  </TextAreaFormElementWrapper>;

/**
*
* @name FormTextAreaMaxChar
* @desc -
* @param {Object} props - passed in props
* @tag textArea max char.
* @return {JSX}
*
**/
export const FormTextAreaMaxChar = ({ descriptionText, label, hasError, ...props, base_css = " form-group ", showLabel = true,
  left_field_css, right_field_css} = {}) => {
    let has_error_text = hasError ? " has-error " : "";
    return(
  <div className={` comment-form-group ${base_css} ${has_error_text}`}>
    <ShowIf show={showLabel}>
      <label className="comment-label col-sm-4 ">
        {label}
        <ToolTip text={descriptionText} />
      </label>
    </ShowIf>
    <div className={` ${right_field_css}`}>
      <TextAreaMaxChar {...props} />
    </div>
    {hasError ?
      <p>
        <div className={` ${left_field_css} `} />
        <div className={` ${right_field_css} error_message`}> {props.error} </div>
      </p>
      :
      null
    }
  </div>);};
FormTextAreaMaxChar.defaultProps = {
    left_field_css: " col-sm-4 ",
    right_field_css: " col-sm-8 "
};

/**
 *
 * @name FormDualInput
 * @desc -
 * @param {Object} onChange & other props
 * @return {JSX}
 *
**/
export const FormDualInput = ({ displayName, descriptionText, helpText, children, error, name, id,
  firstValue, secondValue, editable = true, disabled = !editable, base_css, showLabel = true,
  left_field_css, right_field_css, onChange, onBlur, inputProps, hasError, ...props } = {}) => {
    let has_error_text = hasError ? " has-error " : "";
    return (
    <div className={` ${base_css} ${has_error_text}`}>
      <ShowIf show={showLabel}>
        <label className={`${left_field_css} form-control-static control-label `}>
          {displayName}
          <ToolTip text={descriptionText} />
          <input className=" form-inline " autoComplete="off" {...{
              id, name,
              value: firstValue || "", disabled, onChange, onBlur, ...inputProps
          }} />
        </label>
      </ShowIf>
      <div className={`${right_field_css} form-inline form-control-static `}>
        <div className={` ${base_css} `}>
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <CurrencyInput {...{ id, name, value: secondValue, disabled, onChange, onBlur, ...inputProps }} />
          </div>
        </div>
        <div className=" error_message "> {error} </div>
      </div>
      <ShowIf show={helpText}>
        <p className=" help-block ">{helpText}</p>
      </ShowIf>
    </div>);};
FormDualInput.defaultProps = {
    helpText: "",
    hasError: false,
    has_error_text: "",
    base_css: "form-group",
    left_field_css: " col-sm-4 ",
    right_field_css: " col-sm-8 "
};

  /**
   *
   * @name FormSelect
   * @desc -
   * @param {Object} - 1 row for location name, percent time, add and delete functionalities
   * @return {JSX}
   *
  **/
export const FormLocationOption = ({ helpMessageBottom, value, numberValue, id, name, nameOfNumberValue, editable = true,
    disabled = !editable, isNumberDisabled, onChange, optionsInfo, onBlur, inputProps, showAdd = true, showDelete = true, isAddDisabled, isDeleteDisabled,
    ...props } = {}) =>
    <FormElementWrapper {...props}>
      <div className="col-sm-1 right-input-align">
        Name:
      </div>
      <div className="col-sm-4">
        <SelectComponent {...props} {...optionsInfo} {...{ name, value, onChange, disabled }} />
      </div>
      <div className="col-sm-3">
        <NumberInput {...{ id, name: nameOfNumberValue, value: numberValue, disabled: isNumberDisabled, onChange, onBlur, ...inputProps}} />
      </div>
      <div className="col-sm-1 pull-left left-input-align negative-indent">
        %
      </div>
      <div className="col-sm-1">
        <ShowIf show={showAdd}>
          <button className={"left btn btn-primary"} onClick={onChange} name="add" value={name}
            disabled={isAddDisabled}>Add</button>
        </ShowIf>
      </div>
      <div className="col-sm-2">
        <ShowIf show={showDelete}>
          <button className={"left btn btn-primary indent"} onClick={onChange} name="delete" value={name}
            disabled={isDeleteDisabled}>
            Delete
          </button>
        </ShowIf>
      </div>
    </FormElementWrapper>;

    /**
     *
     * @name FormSelect
     * @desc -
     * @param {Object}
     * @return {JSX}
     *
    **/
  export const FormDepartmentOption = ({ helpMessageBottom, value, numberValue, id, name, nameOfNumberValue, editable = true,
      disabled = !editable, isNumberDisabled, onChange, optionsInfo, onSearchClick, onBlur, inputProps, ...props } = {}) =>
      <FormElementWrapper {...props}>
        <div>
            <AutoComplete {...props} {...{ onChange, onSearchClick }} id="deptSearch" placeholder={'Search for department code or name (minimum 3 characters)'} name={name} />
        </div>
      </FormElementWrapper>;

    /**
     *
     * @name FormSelect
     * @desc -
     * @param {Object} -
     * @return {JSX}
     *
    **/
    export const FormTitleOption = ({ helpMessageBottom, value, numberValue, id, name, nameOfNumberValue, editable = true,
        disabled = !editable, isNumberDisabled, onChange, optionsInfo, onSearchClick, onBlur, inputProps, ...props } = {}) =>
        <FormElementWrapper {...props}>
          <div>
              <AutoComplete {...props} {...{ onChange }} id="titleSearch" placeholder={'Search for title code or name (minimum 3 characters)'} name={name} />
          </div>
          <div>
              <div className={' label-column col-md-4 '}>
                  Title Selected
              </div>
              <div className={' col-md-8 '}>
                <TextAreaMaxChar name="unit" rows = "2"
                    disabled={true}
                    right_field_css={' col-sm-12 '}
                    base_css={''} left_field_css={''} showLabel={false}/>
              </div>
          </div>
        </FormElementWrapper>;

        /**
         *
         * @name FormSelect
         * @desc -
         * @param {Object} -
         * @return {JSX}
         *
        **/
        export const FormSearchOption = ({ helpMessageBottom, value, numberValue, id, name, nameOfNumberValue, editable = true,
            disabled = !editable, isNumberDisabled, onChange, optionsInfo, onSearchClick, onBlur, inputProps, ...props } = {}) =>
            <FormElementWrapper {...props}>
              <div>
                  <AutoComplete {...props} {...{ onChange, onSearchClick }} id="endowedChairSearch" placeholder={'Search for endowed chair (minimum 3 characters)'} name={name} />
              </div>
            </FormElementWrapper>;
