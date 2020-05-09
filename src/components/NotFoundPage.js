import React from 'react';

import { log } from '../shared/logger';

// TAGS
const TAG_NotFoundPage = 'NotFoundPage_FC';

const NotFoundPage = () => {
  log(TAG_NotFoundPage);

  return (
    <div className="App-NotFound">
      <center>
        <br />
        <h1 style={{ color: 'red' }}>404</h1>
        <h2>Page Not Found</h2>
        <p>Make sure the address is correct and the page hasn't moved.</p>
      </center>
    </div>
  );
};

export default NotFoundPage;
