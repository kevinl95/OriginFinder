import React, { useState, useEffect } from 'react';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Card, CardHeader, CardBody, ExpansionPanel, ExpansionPanelContent } from '@progress/kendo-react-layout';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Typography } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import { Reveal } from '@progress/kendo-react-animation';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { BarcodeScanner, useTorch } from 'react-barcode-scanner';
import getCountryFromUPC from './countries';
import { openDB } from 'idb';
import "react-barcode-scanner/polyfill";
import './index.scss';
import './App.css';

function App() {
  const [data, setData] = useState('Not Found');
  const [scanning, setScanning] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isSupportTorch, isOpen, setOpen] = useTorch();
  const [expanded, setExpanded] = React.useState('historyTable');
  const [historyData, setHistoryData] = useState([]);
  const [notification, setNotification] = useState(null);

  const toggleScanning = () => {
    setDialogVisible(false);
    if (!scanning) {
      setScanning(true);
      return;
    } else {
      setScanning(false);
      setData('Not Found');
    }
  };

  const onTorchSwitch = () => {
    setOpen(!isOpen);
  };

  const saveToHistory = async () => {
    const db = await openDB('originTrackrDB', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    const date = new Date();
    const dateString = `${date.toLocaleDateString()}`;
    await store.add({ upc: data, country: getCountryFromUPC(data), dateString });
    await tx.done;
    setDialogVisible(false);
    fetchHistoryData(); // Fetch updated history data
  };

  const fetchHistoryData = async () => {
    const db = await openDB('originTrackrDB', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
    const tx = db.transaction('history', 'readonly');
    const store = tx.objectStore('history');
    const allRecords = await store.getAll();
    setHistoryData(allRecords.map(record => ({
      upc: record.upc,
      country: record.country,
      dayYear: record.dayYear
    })));
  };

  // Fetch history data on component mount
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Let user know if they can use the app offline
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        setNotification({ type: 'success', message: 'OriginTrackr loaded successfully. You can use this app offline!' });
      } else {
        setNotification({ type: 'warning', message: 'Service worker not found. Offline functionality may not be available.' });
      }
    } else {
      setNotification({ type: 'warning', message: 'Your browser does not support service workers. Offline functionality is not available.' });
    }
  }, []);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar>
        <AppBarSection>
          <Typography.h1>Origin Trackr</Typography.h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
      <Typography.h3>Find the country of origin of a product from its barcode!</Typography.h3>
      {notification && (
        <NotificationGroup style={{ right: 0, bottom: 0 }}>
          <Notification type={{ style: notification.type, icon: true }} closable={true} onClose={() => setNotification(null)}>
            <span>{notification.message}</span>
          </Notification>
        </NotificationGroup>
      )}
      <div className="content" style={{ width: '80%', margin: '0 auto', flex: '1' }}>
        <Card style={{ backgroundSize: 'cover', color: 'white' }}>
          <CardHeader>
            <Typography.h2>Barcode Scanner</Typography.h2>
          </CardHeader>
          <CardBody>
            {scanning && (
              <BarcodeScanner 
                options={{ formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8'] }}
                onCapture={(e) => {
                  const value = e[0]?.rawValue;
                  setData(value);
                  if (value && value !== 'Not Found') {
                    setDialogVisible(true);
                    setScanning(false);
                  }
                }}
                {...isSupportTorch ? <Button onClick={onTorchSwitch}>Turn on Flashlight</Button>: null}
              />
            )}
            {!scanning && (
              <Button themeColor="success" id="scanbutton" onClick={toggleScanning} style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Start Scanning</Button>
            )}
          </CardBody>
        </Card>
        <br></br>

        {dialogVisible && (
          <Dialog title="Scan Result" onClose={() => setDialogVisible(false)}>
            <DialogActionsBar>
              <Button onClick={() => setDialogVisible(false)}>Close</Button>
              <Button themeColor="primary" onClick={saveToHistory}>Save to History</Button>
            </DialogActionsBar>
            <div style={{ padding: '20px' }}>
              <Typography.h4>Scanned Code: {data}</Typography.h4>
              <Typography.h4>Country of Origin: {getCountryFromUPC(data)}</Typography.h4>
            </div>
          </Dialog>
        )}
      </div>
      <ExpansionPanel 
        title="Scan History"
        subtitle="Show scanned items and dates"
        expanded={expanded === 'historyTable'}
        onAction={(e) => setExpanded(e.expanded ? '' : 'historyTable')}
      >
        <Reveal>
          {expanded === 'historyTable' && (
            <ExpansionPanelContent>
              <table className="k-grid k-widget" style={{ width: '100%' }}>
                <thead className="k-grid-header">
                  <tr>
                    <th className="k-header" style={{ width: '33%', textAlign: 'left' }}>UPC</th>
                    <th className="k-header" style={{ width: '33%', textAlign: 'left' }}>Country of Origin</th>
                    <th className="k-header" style={{ width: '33%', textAlign: 'left' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((record, index) => (
                    <tr key={index}>
                      <td className="k-cell" style={{ width: '33%', padding: '10px' }}>{record.upc}</td>
                      <td className="k-cell" style={{ width: '33%', padding: '20px' }}>{record.country}</td>
                      <td className="k-cell" style={{ width: '33%', padding: '10px' }}>{record.dayYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ExpansionPanelContent>
          )}
        </Reveal>
      </ExpansionPanel>
      <br></br>
      <AppBar position="bottom">
        <AppBarSection>
          <Typography.p>Origin Trackr - an open source project by Kevin Loeffler </Typography.p>
        </AppBarSection>
        <AppBarSection>
          <Typography.p>
            <a href="https://github.com/kevinl95/OriginTrackr" target="_blank" rel="noopener noreferrer">
              Check out the code on GitHub
            </a>
          </Typography.p>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
    </div>
  );
}

export default App;