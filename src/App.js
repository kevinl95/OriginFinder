import React, { useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Typography } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import './index.scss';
import './App.css'

function App() {

  const [data, setData] = useState('Not Found');
  const [scanning, setScanning] = useState(false);

  const startScanning = () => {
    setScanning(true);
  };

  return (
    <div className="App">
      <AppBar>
        <AppBarSection>
          <Typography.h1>Origin Trackr</Typography.h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>

      <div className="content">
        <Typography.p>Find the country of origin of a product from its UPC code.</Typography.p>
        <Card style={{ backgroundSize: 'cover', color: 'white' }}>
          <CardHeader>
          <Typography.h2>Welcome to Origin Trackr</Typography.h2>
          </CardHeader>
          <CardBody>
            <Button onClick={startScanning}>Start Scanning</Button>
            {scanning && (
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) setData(result.text);
                  else setData("Not Found");
                }}
              />
            )}
          </CardBody>
        </Card>
        <Typography.p>Scanned Code: {data}</Typography.p>
      </div>

      <AppBar position="bottom">
        <AppBarSection>
          <Typography.h2>Origin Trackr</Typography.h2>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
    </div>
  );
}

export default App;
