import React from 'react';

import { log } from '../../shared/logger';

// TAGS
const TAG_TableLists = 'TableLists_FC';

function TableLists(props) {
  log(TAG_TableLists);

  const { children } = props;

  return <div className="TableLists">{children}</div>;
}

export default TableLists;
