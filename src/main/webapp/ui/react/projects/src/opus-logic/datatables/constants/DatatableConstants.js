/**
 * Created by leonaburime on 7/8/16.
 **/
export const image_folder = "../images/";


export const text = {
    name_key: "name",
    visible_key: "visible",
    display_name_key: "displayName"
};

export const dataViewTypes = {
    icon_only: "icon-only",
    money: "money",
    text: "text",
    date_slash: "date-slash",
    date_timestamp: "date_timestamp",
    image: "image",
    clickable_image: "clickable_image",
    percent: "percent",
    round2DecimalPercent: "round2DecimalPercent",
    tooltip: "tooltip",
    link: "link",
    interfolioLink: "interfolioLink",
    linkToOpusCase: "linkToOpusCase",
    imageClick: "imageClick", //attach an onClick
    disableImageClick: "disableImageClick", //attach an onClick
    commentClick: "commentClick", //attach an onClick
    imageLink: "imageLink",
    displayByKey: "displayByKey",
    checkbox: "checkbox",
    button: "button",
    multiline: "multiline",
    multilineAction: "multilineAction",
    radio: "radio",
    linkButton: "linkButton",
    linkManualButton: "linkManualButton",
    date: "date",
    textArea: "textArea",
    deleteButton: "deleteButton",
    sortingText: "sortingText",
    number: "number",
    datetime: "datetime",
    mixedString: "mixedString",
    nameLink: "nameLink"
};


export const constants = {
    image_folder,
    sortOrder: ["none", "asc", "desc"],
    default_sort_type: "none",
    sortOrderHash: {none: 0, asc: 1, desc: 2},
    adminDeptFieldToNameOfList: {
        areaName: "areaList",
        departmentName: "departmentList",
        divisionName: "divisionList",
        schoolName: "schoolList",
        specialtyName: "specialtyList"
    }
};

// 4/23/19 Be aware that if you change the order of these filters,
// it will affect some functions and you will need to change them
// such as: filterOnClickCheckbox and specialShowOnlyAPICall in CasesTable.jsx
// and filterRowDataByFlags in Cases.js because they are index/key based
// Why did I do this?  Because I had to build functions on top of existing
// complicated, nested functions
export const proposedActionFlags = [
    {
        displayName: "Retention Cases",
        name: "retentionFlag"
    },
    {
        displayName: "Retroactive Cases",
        name: "retroactiveFlag"
    },
    {
        displayName: "Accelerated Cases",
        name: "acceleratedActionFlag"
    },
    {
        displayName: "Deferred Cases",
        name: "deferrableActionFlag"
    },
    {
        displayName: "Interfolio Cases",
        name: "interfolioCaseFlag"
    },
    {
        displayName: "Cases for Active Appointments",
        name: "activeAppointments"
    },
    {
        displayName: "Cases for Inactive Appointments",
        name: "inactiveAppointments"
    },
    {
        displayName: "Cases for HSCP faculty",
        name: "hscpFlag"
    },
    {
        displayName: "Cases for Non-HSCP faculty",
        name: "nonHscpFlag"
    }
];
