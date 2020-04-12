import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { matchPath } from "react-router";
import parseUrl from "@/utils/parseUrl";

import configureStore from "@/store";
import AppRouter, { routes } from "@/router";

// 引入全局样式
import "../pages/global.scss";

class AppRoute extends React.Component {
  state = {
    path: this.props.initPath
  };

  static getDerivedStateFromProps(props, state) {
    let _route = null,
      _match = null;
    routes.some(route => {
      let match = matchPath(window.location.pathname, route);
      if (match && match.path) {
        _route = route;
        _match = match;
        return true;
      }
    });

    if (_route.path != state.path) {
      let { appStore } = props;
      let { search } = location;
      const query = search ? parseUrl(search) : null;
      if (_route && _route.component && _route.component.preFetch) {
        _route.component.preFetch({ store: appStore, _match, query });
      }
      return {
        path: _route.path
      };
    }

    return {};
  }

  render() {
    return <AppRouter />;
  }
}

// 从页面中获取服务端生产redux数据，作为客户端redux初始值
const store = configureStore(window.__initState__);

const run = async () => {
  let _route = null;

  routes.some(route => {
    let match = matchPath(window.location.pathname, route);
    if (match && match.path) {
      _route = route;
      return true;
    }
  });

  _route.component.preload && (await _route.component.preload());

  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <AppRoute
          pathname={location.pathname}
          appStore={store}
          initPath={_route.path}
        />
      </BrowserRouter>
    </Provider>,
    document.getElementById("app")
  );

  if (process.env.NODE_ENV === "development") {
    if (module.hot) {
      module.hot.accept();
    }
  }
};

run();
