import React, { useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Typography } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import { BarcodeScanner, useTorch } from 'react-barcode-scanner'
import getCountryFromUPC from './countries';
import "react-barcode-scanner/polyfill"
import './index.scss';
import './App.css'

function App() {

  const [data, setData] = useState('Not Found');
  const [scanning, setScanning] = useState(false);
  const [isSupportTorch, isOpen, setOpen] = useTorch()

  const toggleScanning = () => {
    if (!scanning) {
      setScanning(true);
      return;
    } else {
      setScanning(false);
      setData('Not Found');
    }
  };

  const onTorchSwitch = () => {
    setOpen(!isOpen)
  }

  return (
    <div className="App">
      <AppBar>
        <AppBarSection>
          <Typography.h1>Origin Trackr</Typography.h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
      <Typography.h3>Find the country of origin of a product from its UPC code.</Typography.h3>
      <div className="content" style={{ width: '80%', margin: '0 auto' }}>
        <Card style={{ backgroundSize: 'cover', color: 'white' }}>
          <CardHeader>
          <Typography.h2>Welcome to Origin Trackr</Typography.h2>
          </CardHeader>
          <CardBody>
            {scanning && (
              <BarcodeScanner 
                options={{ formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8'] }}
                onCapture={(e) => setData(e[0]?.rawValue)}
                {...isSupportTorch ? <Button onClick={onTorchSwitch}>Turn on Flashlight</Button>: null}
              />
            )}
            {!scanning && (
              <Button themeColor="success" id="scanbutton" onClick={toggleScanning} style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Start Scanning</Button>
            )}
          </CardBody>
        </Card>
        <br></br>
      </div>
      <Typography.p>Scanned Code: {data}</Typography.p>
      <Typography.p>Country of Origin: {getCountryFromUPC(data)}</Typography.p>

      <AppBar position="bottom">
        <AppBarSection>
          <Typography.p>Origin Trackr</Typography.p>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
    </div>
  );
}

export default App;
