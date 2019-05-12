import React from "react";
import "./App.css";
import LogService from "./LogService.js";

/**
 * Wrapper componenet for the IntersectionObserver API.
 */
class IntersectionTarget extends React.Component {

  /**
   * Event handler for the IntersectionObserver.
   * Filters entries to ensure events are for this component's target,
   * then invokes the `onChange` prop with a single IntersectionObserverEntry.
   * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
   */
  handleIntersection = (entries) => {
    const entry = entries.find(entry => entry.target === this.element)
    if (entry) {
      this.props.onChange(entry);
    }
  };

  /**
   * Ref callback.
   * On render, when React invokes this function with the actual DOM element
   * that is created. This element is used as the target for the observer.
   */
  handleRef = (element) => {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        this.handleIntersection,
        this.props.options,
      );
    }
    if (element !== this.element) {
      this.observer.disconnect();
    }
    if (element) {
      this.observer.observe(element);
    }
    this.element = element;
  };

  render() {
    const {children, Component='div'} = this.props;
    return <Component ref={this.handleRef}>{children}</Component>;
  }
}

class App extends React.Component {
  state = {
    logs: [],
    target: null,
  };

  /**
   * When the component mounts, start polling for logs.
   */
  componentDidMount() {
    LogService.poll(this.handleNewLog);
  }

  /**
   * The callback appends the new log message to the `logs` array in the state.
   */
  handleNewLog = (log) => {
    this.setState(state => ({
      logs: state.logs.concat([log])
    }));
    const target = this.state.target;
    if (target) {
      target.scrollIntoView();
    }
  };

  /**
   * Handle intersection events.
   * Store the event target in `state.target` if it is intersecting,
   * i.e. it is visible in the viewport.
   */
  handleIntersection = (entry) => {
    this.setState({
      target: entry.isIntersecting ? entry.target : null,
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
        <IntersectionTarget onChange={this.handleIntersection}>
          <div className="intersection-target">
            <code>IntersectionTarget</code>
          </div>
        </IntersectionTarget>
      </div>
    );
  }
}

export default App;
