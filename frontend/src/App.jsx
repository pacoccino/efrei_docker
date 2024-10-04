import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { getAPI } from "./lib/api";

function App() {
  const [logs, setLogs] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    getAPI("ids").then((d) => setIds(d));
    getAPI("logs").then((d) => setLogs(d));
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Full-stack app</h1>
      <div className="split">
        <div className="col">
          <h2>Containers Id</h2>
          <ul>
            {ids.map((id) => (
              <li>
                {id.hostname}: {id.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="col">
          <h2>Logs</h2>
          <ul>
            {logs.map((id) => (
              <li>
                <p>{id.hostname}</p>
                <p>
                  <i>{new Date(id.date).toLocaleString()}</i>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
