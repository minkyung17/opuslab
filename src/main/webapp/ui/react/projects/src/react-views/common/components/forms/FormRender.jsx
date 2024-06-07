import React from "react";
import PropTypes from "prop-types";

//My imports
import {FormAutoComplete, FormSelect, FormNumber, FormDate, FormInput,
  FormTextArea, FormDebounceNumber, FormSelectSearch, FormSelectOption,
  FormLocationOption, FormDepartmentOption, FormTitleOption, FormSearchOption} from "./FormElements.jsx";

/******************************************************************************
 * FormShell
 *
 * @desc - Renders the outer shell of the form
 * @param {Object} props - incoming props
 *
 * @return {JSX}
 *
 ******************************************************************************/
export const FormShell = ({children, className }) =>
  <form {...{className}}> {children} </form>;
FormShell.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.node,
        PropTypes.array
    ]),
    className: PropTypes.string
};
FormShell.defaultProps = {
    className: "form-section list-unstyled form-horizontal"
};

/*******************************************************************************
*
* @desc - Choose which element type
* @return {JSX}
*
*******************************************************************************/
export class FormElement extends React.Component {

    static propTypes = {
        dataType: PropTypes.string,
        name: PropTypes.string,
        displayName: PropTypes.string,
        descriptionText: PropTypes.string,
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        error: PropTypes.string,
        classText: PropTypes.string,
        onChange: PropTypes.func,
        onSearchClick: PropTypes.func,
        onBlur: PropTypes.func,
        default_text: PropTypes.string,
        edit: PropTypes.bool,
        editable: PropTypes.bool,
        inputProps: PropTypes.object,
        elementProps: PropTypes.object,
        options: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        // searchOptions: PropTypes.oneOfType([
        //     PropTypes.array,
        //     PropTypes.object
        // ]),
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        selected: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ])
    };

    static defaultProps = {
        value: "",
        classText: "",
        editable: true,
        inputProps: {},
        onBlur: () => {},
        onChange: () => {},
        onSearchClick: () => {},
        default_text: "N/A"
    };

    constructor(props = {}) {
        super(props);
    }

  /**
   *
   * @desc - Update the value
   * @param {Event} event - click or type event
   * @param {Object} props - props sent into element that contains lots of info
   * @return {void}
   *
   **/
    onChange = (event) => {
    //event.persist();
        return this.props.onChange(event, this.props);
    }

    /**
     *
     * @desc - Update the value
     * @param {Event} event - click or type event
     * @param {Object} props - props sent into element that contains lots of info
     * @return {void}
     *
     **/
      onSearchClick = (event) => {
      //event.persist();
          return this.props.onSearchClick(event, this.props);
      }

  /**
   *
   * @desc - Update the value onBlur
   * @param {Event} event - click or type event
   * @return {void}
   *
   **/
    onBlur = (event) => {
        return this.props.onBlur(event, this.props);
    }

  /**
   *
   * @desc - JSX
   * @return {JSX} - jsx
   *
   **/
    render() {
        let result = null;
        let {onChange, onSearchClick, onBlur, props} = this;
        let {dataType, type = dataType, helpMessage, optionsInfo} = props;

        switch(type) {
        case "select-search": {
            result = (
        <FormSelectSearch {...props} {...optionsInfo} {...{onChange, onBlur}} />);
            break;
        }
        case "autocomplete": {
            result = (
        <FormAutoComplete {...props} {...{onChange, onBlur}} />);
            break;
        }
        case "options": {
            result = (
        <FormSelect {...props} {...optionsInfo} {...{onChange, onBlur}} />);
            break;
        }
        case "searchoptions": {
            result = (
        <FormSearchOption {...props} {...optionsInfo} {...{onChange, onSearchClick, onBlur }} />);
            break;
        }
        case "number": {
            result = <FormNumber {...props} {...{onChange, onBlur}} />;
            break;
        }
        case "debounce-number": {
            result = <FormDebounceNumber {...props} {...{onChange, onBlur}} />;
            break;
        }
        case "date": {
            result = <FormDate {...props} {...{helpMessage}} {...{onChange, onBlur}} />;
            break;
        }
        case "textarea": {
            result = <FormTextArea {...props} {...{onChange, onBlur}} />;
            break;
        }
        case "locationOptions": {
            result = (<FormLocationOption {...props} {...{onChange, onBlur}} />);
            break;
        }
        case "departmentOptions": {
            result = (<FormDepartmentOption {...props} {...{onChange, onBlur, onSearchClick }} />);
            break;
        }
        case "titleOptions": {
            result = (<FormTitleOption {...props} {...{onChange, onBlur}} />);
            break;
        }
        default: {
            result = <FormInput {...props} {...{onChange, onBlur}} />;
            break;
        }
        }
        return result;
    }
}

/**
 * FormGroup
 *
 * @desc - Renders a group of input elements
 * @param {Object} - all props
 * @return {JSX}
 *
 **/
export const FormGroup = ({fields, onChange, onSearchClick, onBlur, ...props}) => {
    return (
    <div>
      {Object.keys(fields).map((key, index) => {
          let field = fields[key];
          let args = {onChange, onSearchClick, onBlur, ...props};
          return (<FormElement key={index} {...args} {...field}/>);
      })}
    </div>
  );
};
FormGroup.propTypes = {
    onChange: PropTypes.func,
    onSearchClick: PropTypes.func,
    onBlur: PropTypes.func,
    fields: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};
FormGroup.defaultProps = {
    fields: []
};



/**
 * FormGroup
 *
 * @desc - Renders a group of input elements but only if they are visible
 * @param {Object} - all props
 * @return {JSX}
 *
 **/
export const VisibleFormGroup = ({fields, visibilityKey, onChange, onSearchClick, onBlur, ...props}) => {
    return (
    <div>
      {Object.keys(fields).map((key, index) => {
          let field = fields[key];
          let args = {onChange, onSearchClick, onBlur, ...props};
          let visible = field[visibilityKey];
          return visible ? <FormElement key={index} {...args} {...field}/> : null;
      })}
    </div>
  );
};
VisibleFormGroup.propTypes = {
    visibilityKey: PropTypes.string,
    onChange: PropTypes.func,
    onSearchClick: PropTypes.func,
    onBlur: PropTypes.func,
    fields: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};
VisibleFormGroup.defaultProps = {
    fields: [],
    visibilityKey: "visibility"
};
