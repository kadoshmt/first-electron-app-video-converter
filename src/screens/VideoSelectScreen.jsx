import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ipcRenderer } from "electron";
import {useDropzone} from 'react-dropzone'
import _ from 'lodash';
import {useVideo} from '../hooks/video';

const VideoSelectScreen = ({small}) => {
  // const [hovering, setHovering] = useState(false);
  const {push} = useHistory();
  const {addVideos} = useVideo();

  const handleAddVideos = useCallback((videos) => {
    ipcRenderer.send('videos:added', videos);

    ipcRenderer.on('metadata:complete', (event, videosWithData) => {
      addVideos(videosWithData);
      // console.log('videoSelectScreen.js@handleAddVideos', videosWithData)
      push('/convert');
    })        
  },[addVideos, push] );

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
    
  

  const onDrop = useCallback((files) => {
    // invalid file types are not added to files object
    const videos = _.map(files, ({ name, path, size, type }) => {
      return { name, path, size, type };
    });    

    if (videos.length) {
      handleAddVideos(videos);
      
      if (!small) {
        push('/convert');
      }
    }

  }, [handleAddVideos, small, push]);

  const {getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept} = useDropzone({
    onDrop,
    accept: "video/*",    
  })

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [baseStyle, isDragActive, activeStyle, isDragAccept, acceptStyle, isDragReject, rejectStyle]);

  // function renderChildren({ isDragActive, isDragReject }) {
  //   if (isDragActive) {
  //     return <h4 className="drop-message">Omnomnom, let me have those videos!</h4>;
  //   } else if (isDragReject) {
  //     return <h4 className="drop-message">Uh oh, I don't know how to deal with that type of file!</h4>;
  //   } else {
  //     return <h4 className="drop-message">Drag and drop some files on me, or click to select.</h4>
  //   }
  // 

  
    return (
      // <div className={small ? "video-select-screen-small" : "video-select-screen"}>
      //   <Dropzone
      //     onDrop={onDrop}
      //     multiple
      //     accept="video/*"
      //     className="dropzone"
      //     activeClassName="dropzone-active"
      //     rejectClassName="dropzone-reject"
      //   >
      //     {renderChildren}
      //   </Dropzone>
      // </div>
      <div className={small ? "video-select-screen-small" : "video-select-screen"}>
      <div {...getRootProps({className:"dropzone", style})}>
        <input {...getInputProps()} />
        {isDragAccept && (<h4 className="drop-message">Omnomnom, let me have those videos!</h4>)}
        {isDragReject && (<h4 className="drop-message">Uh oh, I don't know how to deal with that type of file!</h4>)}
        {!isDragActive && (<h4 className="drop-message">Drag and drop some files on me, or click to select.</h4>)}
    </div>
    </div>
    );
  
}

export default VideoSelectScreen;
