import Body from "./Common/Body";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import routingConfig from "./Common/routingConfig.json";
import { useLocation } from "react-router-dom";
import { AxiosMemory } from "./Common/InterCeptors";
import { useState } from "react";

function App() {
  const [nxt, setNxt] = useState("");
  const location = useLocation();

  const hideHead =
    location.pathname === "/" ||
    location.pathname === "/signUp";

  return (
    <div className="app-shell">
      <AxiosMemory />
      {!hideHead && nxt && <Header />}
      <main className="app-main">
        <Body
          routers={routingConfig}
          setNxt={setNxt}
        />
      </main>
      {!hideHead && nxt && <Footer />}
    </div>
  );
}

export default App;
