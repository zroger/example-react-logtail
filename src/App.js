import React from "react";
import "./App.css";
import LogService from "./LogService.js";

class App extends React.Component {
  state = {
    logs: []
  };

  /**
   * When the component mounts, start polling for logs.
   * The callback appends the new log message to the `logs` array in the state.
   */
  componentDidMount() {
    LogService.poll(log => {
      this.setState(state => ({
        logs: state.logs.concat([log])
      }));
    });
  }

  /**
   * Nothing fancy here. Render logs from the state object.
   */
  render() {
    const { logs } = this.state;
    return (
      <div className="App">
        <div className="logs">
          {logs.map((log, index) => (
            <pre key={index}>
              <code>{log}</code>
            </pre>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
