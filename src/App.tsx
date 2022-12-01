import "./App.scss";
import Header from "./components/layout/Header";
import Main from "./components/layout/Main";
import Sidebar from "./components/layout/Sidebar";
import TargetSelector from "./components/layout/TargetSelector";

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />
      <TargetSelector />
      <Main />
    </div>
  );
}

export default App;
