import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from '../sidebar/Sidebar';
import './Container.scss';

function Container({ children }) {
  return (
    <div className='row main_container'>
      <div className="col-2"><Sidebar /></div>

      <div className='col-10 container'>{children}</div>
    </div>
  );
}

export default Container;
