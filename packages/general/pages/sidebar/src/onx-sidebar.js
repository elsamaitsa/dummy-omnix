import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import Components from "./components/helper";

function App(props) {
  return (
    <Components.ReactRedux.Provider store={window.store}>
      <Root {...props} />
    </Components.ReactRedux.Provider>
  );
}
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
