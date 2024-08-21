import 'bootstrap/dist/css/bootstrap.min.css';

import Sidebar from '../sidebar/Sidebar';
import './Container.css';

function Container({ children }) {
  return (
    <div className='main-container row align-items-center'>
      <div className="col-2 d-lg-block d-none">
        <Sidebar />
      </div>

      <div className="col-lg-10 col-12">{children}</div>
    </div>
  );
}

export default Container;
