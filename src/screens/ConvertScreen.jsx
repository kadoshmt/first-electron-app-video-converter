import React, { useCallback } from 'react';
import { ipcRenderer } from "electron";
import VideoList from '../components/VideoList';
import ConvertPanel from '../components/ConvertPanel';
import VideoSelectScreen from './VideoSelectScreen';
import { useVideo } from '../hooks/video'

const ConvertScreen = () => {
  const {
    videos,
    setFormat,
    setVideoProgress,
    removeAllVideos,
    removeVideo,
    setVideoComplete,
  } = useVideo();

  const handleConvertVideos = useCallback(() => {
    // console.log('chamou convertVideos', videos)
    ipcRenderer.send('conversion:start', videos);

    ipcRenderer.on('conversion:progress', (event, { video, timemark }) => {
      // console.log('setar para true o video', video.name);
      setVideoProgress(video, timemark);
    });

    ipcRenderer.on('conversion:end', (event, { video, outputPath }) => {
      setVideoComplete(video, outputPath);
    });
  }, [setVideoComplete, setVideoProgress, videos])


  const handleShowInFolder = useCallback((outputPath) => {
    ipcRenderer.send('folder:open', outputPath);
  }, [])


  return (
    <div className="container">
      <VideoSelectScreen small />
      <VideoList
        videos={videos}
        onFormatChange={setFormat}
        onFolderOpen={handleShowInFolder}
        removeVideo={removeVideo}

      />
      <ConvertPanel
        handleConvertVideos={handleConvertVideos}
        removeAllVideos={removeAllVideos}
      />
    </div>
  );
}

export default ConvertScreen;
