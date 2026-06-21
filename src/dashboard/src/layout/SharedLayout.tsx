import './SharedLayout.css';
import { Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
export default function SharedLayout() {
  return (
    <div className="shared-layout">
      <div className="title">
        <h1>A C A D Y F I</h1>
      </div>
      <div style={{ backgroundColor: 'black' }}>
        Upper Nav Bar :Will be add later
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
