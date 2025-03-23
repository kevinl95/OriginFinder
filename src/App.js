import React, { useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import BarcodeReader from 'react-barcode-reader';
import './index.scss';
import './App.css'

function App() {

  const [data, setData] = useState('Not Found');

  const handleScan = (result) => {
    if (result) {
      setData(result);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="App">
      <AppBar>
        <AppBarSection>
          <h1>Origin Finder</h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>

      <div className="content">
        <Card style={{ backgroundSize: 'cover', color: 'white' }}>
          <CardHeader>
            <h2>Welcome to Origin Finder</h2>
          </CardHeader>
          <CardBody>
            <p>Find the country of origin of a product from its UPC code.</p>
            <BarcodeReader
              onError={handleError}
              onScan={handleScan}
            />
            <p>Scanned Code: {data}</p>
          </CardBody>
        </Card>
      </div>

      <AppBar position="bottom">
        <AppBarSection>
          <p>Origin Finder</p>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
    </div>
  );
}

export default App;
