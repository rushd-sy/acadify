import './SharedLayout.css';
import LeftNavbar from './LeftNavbar';
import UpperNavbar from './UpperNavbar';
export default function SharedLayout() {
  return (
    <div className="shared-layout">
      <div className="title">
        <h1>A C A D Y F I</h1>
      </div>
      <div className="bg-white ">
        <UpperNavbar/> 
      </div>
      <div className="h-full min-h-0">
        <LeftNavbar />
      </div>
      <div style={{ backgroundColor: 'rgb(203, 203, 203)' }}></div>
    </div>
  );
}
