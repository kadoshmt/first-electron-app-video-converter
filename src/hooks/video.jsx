import React, { createContext, useCallback, useState, useContext } from 'react';

const VideoContext = createContext({});

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);

  const addVideos = useCallback((data) => {    
    setVideos(...videos, data);
    console.log(`setou ${data.length} video(s). Agora existem ${videos.length} video(s)` )
    
  }, [videos]);  

  const setFormat = useCallback((video, format) => {
    setVideos(videos.map(filterVideo => {
      if (video.name === filterVideo.name) {
        return { ...filterVideo, format, err: "" }
      } else {
        return filterVideo;
      }
    }))
  }, [videos]);

  const setVideoProgress = useCallback((video, timemark) => {

    const newVideos = videos.map(itemVideo => {
      if (video.name === itemVideo.name) {
        return { ...video, timemark }
      } else {
        return itemVideo;
      }
    })
    setVideos(newVideos);
  }, [videos]);

  const setVideoComplete = useCallback((video, outputPath) => {

    const newVideos = videos.map(itemVideo => {
      if (video.name === itemVideo.name) {
        return { ...video, outputPath, complete: true }
      } else {
        return itemVideo;
      }
    })
    setVideos(newVideos);
  }, [videos]);


  const removeVideo = useCallback(video => {
    setVideos(videos.filter(item => video.name !== item.name))
  }, [videos]);

  const removeAllVideos = useCallback(() => {
    setVideos([]);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos: videos,
        addVideos,
        setFormat,
        setVideoProgress,
        setVideoComplete,
        removeVideo,
        removeAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export function useVideo() {
  const context = useContext(VideoContext);

  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }

  return context;
}
