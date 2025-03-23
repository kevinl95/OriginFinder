import React, { useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import './index.scss';
import './App.css'

function App() {

  const [data, setData] = useState('Not Found');

  const handleUpdate = (err, result) => {
    if (result) {
      setData(result.text);
    } else {
      setData('Not Found');
    }
  };

  return (
    <div className="App">
      <AppBar>
        <AppBarSection>
          <h1>Origin Tracker</h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>

      <div className="content">
        <Card style={{ backgroundSize: 'cover', color: 'white' }}>
          <CardHeader>
            <h2>Welcome to Origin Trackr</h2>
          </CardHeader>
          <CardBody>
            <p>Find the country of origin of a product from its UPC code.</p>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={handleUpdate}
            />
            <p>Scanned Code: {data}</p>
          </CardBody>
        </Card>
      </div>

      <AppBar position="bottom">
        <AppBarSection>
          <p>Origin Trackr</p>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
    </div>
  );
}

export default App;
