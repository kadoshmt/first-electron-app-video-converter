import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppProvider from './hooks';
import VideoSelectScreen from './screens/VideoSelectScreen';
import ConvertScreen from './screens/ConvertScreen';

const App = () => {
  return (
  <AppProvider>
    <Router>
      <Switch>
        <Route path="/convert" component={ConvertScreen} />
        <Route path="/" component={VideoSelectScreen} />
      </Switch>
    </Router>
  </AppProvider>    
  );
}

export default App;
