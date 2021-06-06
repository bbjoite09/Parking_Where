import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Main from './views/Main'
import Location from './views/Location'
import Result from './views/Result'

function App() {
  return (
      <Router>
          <div className="App">
              <Switch>
                  <Route exact path="/" component={Main}/>
                  <Route exact path="/location" component={Location}/>
                  <Route path="/result" component={Result}/>
              </Switch>
          </div>
      </Router>

  );
}

export default App;
