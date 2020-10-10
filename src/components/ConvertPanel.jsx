import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';



const ConvertPanel = ({ handleConvertVideos, removeAllVideos }) => {

  const {push} = useHistory();
  
  const onCancelPressed = useCallback(() => {
    removeAllVideos();
    push('/')
  }, [push, removeAllVideos]);

  
  return (
    <div className="convert-panel">
      <button className="btn red" onClick={onCancelPressed}>
        Cancel
      </button>
      <button className="btn green" onClick={handleConvertVideos}>
        Convert!
      </button>
    </div>
  );
  
}

export default ConvertPanel;
