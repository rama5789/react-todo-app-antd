import React from 'react';
import { Button } from 'antd';

import { log } from '../../shared/logger';

// TAGS
const TAG_CreateModal = 'CreateModal_FC';

function CreateModal(props) {
  log(TAG_CreateModal);

  const { setModalVisible, buttonText, children } = props;

  return (
    <div className="CreateModal">
      <div className="CreateModalButton">
        <Button
          type="primary"
          size="large"
          onClick={() => setModalVisible(true)}>
          {buttonText}
        </Button>
      </div>
      {children}
    </div>
  );
}

export default CreateModal;
