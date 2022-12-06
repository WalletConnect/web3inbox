import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./components/layout/Header";
import Main from "./components/layout/Main";
import Sidebar from "./components/layout/Sidebar";
import TargetSelector from "./components/layout/TargetSelector";
import AuthProtectedPage from "./components/utils/AuthProtectedPage";

function App() {
  return (
    <AuthProtectedPage>
      <div className="App">
        <Header />
        <Sidebar />
        <Outlet />
      </div>
    </AuthProtectedPage>
  );
}

export default App;
