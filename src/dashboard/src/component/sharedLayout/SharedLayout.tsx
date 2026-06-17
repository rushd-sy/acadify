import '../sharedLayout.css';
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
      <div style={{ width: '100%', backgroundColor: 'black' }}>
        <LeftNavbar />
      </div>
      <div style={{ backgroundColor: 'rgb(203, 203, 203)' }}></div>
    </div>
  );
}
