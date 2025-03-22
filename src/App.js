import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';

function App() {
  return (
    <div className="App">
      <AppBar>
        <AppBarSection>
          <h1>Origin Finder</h1>
        </AppBarSection>
        <AppBarSpacer />
      </AppBar>
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
