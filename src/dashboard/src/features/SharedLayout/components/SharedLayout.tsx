import Title from './Title';
import '../../../style.css';
import UpperNav from './UpperNav';
import LeftNav from './LeftNav';
export default function SharedLayout() {
  console.log('fdasadfsafds');
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
      <div className=" flex justify-end" style={{ backgroundColor: 'blue' }}>
        <UpperNav />
      </div>
      <div className="SharedSection" style={{ backgroundColor: 'black' }}>
        <LeftNav />
      </div>
      <div className="SharedSection" style={{ backgroundColor: 'green' }}></div>
    </div>
  );
}
