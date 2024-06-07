import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';

export const TableHeader = ({columnTitles}) => {
  return (
    <thead>
      <tr>
        {columnTitles.map((column) =>
          <th key={column}>{column}</th>)
        }
      </tr>
    </thead>
  );
};
TableHeader.propTypes = {
  columnTitles: PropTypes.array
};
TableHeader.defaultProps = {
  columnTitles: []
};

export const TableElement = ({row, valueKeys}) => {
  return (
    <tr>
      {valueKeys.map((key) => {
        let value = get(row, key);
        return (<td key={key}>{value}</td>);
      })
      }
    </tr>
  );
};
TableElement.propTypes = {
  row: PropTypes.object,
  value_key: PropTypes.string,
  valueKeys: PropTypes.array,
  descriptionKey: PropTypes.string
};
TableElement.defaultProps = {
  row: {},
  valueKeys: [],
  value_key: 'value',
  descriptionKey: 'descriptionText'
};


export class MultiColumnTables extends Component {
  render() {
    let {columnTitles, css_class_name, valueKeys, rows} = this.props;

    return (
      <div>
        <table className={css_class_name}>
          <TableHeader {...{columnTitles}}/>
          <tbody>
          {rows.map((row, index) =>
            <TableElement row={row} valueKeys={valueKeys} key={index} />)
          }
          </tbody>
        </table>
      </div>
    );
  }
}

MultiColumnTables.propTypes = {
  columnTitles: PropTypes.array,
  css_class_name: PropTypes.string,
  rows: PropTypes.array.isRequired,
  onClickEdit: PropTypes.func,
  onClickDelete: PropTypes.func,
  valueKeys: PropTypes.array,
  tableHeader: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};
MultiColumnTables.defaultProps = {
  rows: [],
  columnTitles: [],
  tableHeader: '',
  valueKeys: [],
  editIcon: '../images/edit-pencil.png',
  deleteIcon: '../images/trash.png',
  css_class_name: ' table table-bordered '
};
