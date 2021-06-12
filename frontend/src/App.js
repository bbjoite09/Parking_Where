import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Main from './views/Main'
import Selects from './views/Selects'
import Result from './views/Result'

function App() {
  return (
      <Router>
          <div className="App">
              <Switch>
                  <Route exact path="/" component={Main}/>
                  <Route path="/selects/:content" component={Selects}/>
                  <Route path="/result/:location" component={Result}/>
              </Switch>
          </div>
      </Router>

  );
}

export default App;
