import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from '../sidebar/Sidebar';
import './Container.scss';

function Container({ children }) {
  return (
    <div className='row align-items-center main_container'>
      <div className="col-2"><Sidebar /></div>

      <div className='col-10'>{children}</div>
    </div>
  );
}

export default Container;
