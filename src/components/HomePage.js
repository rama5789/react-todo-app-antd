import React from 'react';

import LayoutTabs from './Layout/LayoutTabs';

import { log } from '../shared/logger';

// TAGS
const TAG_HomePage = 'HomePage_FC';

function HomePage() {
  log(TAG_HomePage);

  return (
    <div className="App-Home">
      <h2>Todos Users</h2>
      <LayoutTabs />
    </div>
  );
}

export default HomePage;
