import React from 'react';

export const PrePopulateButton = ({onClick, disabled = false, id, name = id} = {}) =>
  <div>
    <button {...{onClick, id, name}} className="btn btn-primary" disabled={disabled}>
      Pre-Populate the Fields Below
    </button>
    <p></p>
    <p className="small">
      Click this button to fill in the fields below with the proposed status.
    </p>
  </div>;
