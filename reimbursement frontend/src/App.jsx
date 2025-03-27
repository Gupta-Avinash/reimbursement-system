import { AuthProvider } from "./context/LoginContext";
import { Routers } from "./Routers";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <AuthProvider>
        <Routers></Routers>
      </AuthProvider>
    </>
  );
}

export default App;
