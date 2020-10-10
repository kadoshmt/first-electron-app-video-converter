import React from 'react';

import { VideoProvider } from './video';

const AppProvider = ({ children }) => (
  <VideoProvider> {children} </VideoProvider>
);

export default AppProvider;
