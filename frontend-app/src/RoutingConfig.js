import { BrowserRouter as Router, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';

const RoutingConfig = () => {
    return(
      <Router>
        <div>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
        </div>
      </Router>
    )
  }

export default RoutingConfig;