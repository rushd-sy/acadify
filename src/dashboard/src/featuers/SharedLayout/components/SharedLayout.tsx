import Title from './Title';
import '../../../style.css';
import LeftNav from './LeftNav';
export default function SharedLayout() {
  return (
    <div className="SharedLayout">
      <div
        style={{
          border: '2px solid black',
          alignContent: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Title />
      </div>
      <div style={{ backgroundColor: 'black' }}>
        Upper Nav Bar :Will be add later
      </div>
      <div style={{ width: '100%', backgroundColor: 'black' }}>
        <LeftNav />
      </div>
      <div style={{ backgroundColor: 'rgb(203, 203, 203)' }}></div>
    </div>
  );
}
