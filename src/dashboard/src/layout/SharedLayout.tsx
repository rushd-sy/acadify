import './SharedLayout.css';
import { Link, Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import UpperNavbar from './UpperNavbar';
export default function SharedLayout() {
  return (
    <div className="shared-layout">
      <div className="title">
        <Link to="">
          <h1>A C A D Y F I</h1>
        </Link>
      </div>
      <div className="bg-white ">
        <UpperNavbar />
      </div>
      <div className="h-full min-h-0">
        <LeftNavbar />
      </div>
      <div style={{ backgroundColor: 'rgb(203, 203, 203)' }}>
        <Outlet />
      </div>
    </div>
  );
}
