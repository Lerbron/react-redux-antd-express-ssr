import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";
// 服务端渲染依赖
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router";
import { Provider } from "react-redux";
import MetaTagsServer from "react-meta-tags/server";
import { MetaTagsContext } from "react-meta-tags";

// import Loadable from 'react-loadable'

// 路由配置
import configureStore from "@/store";
// 路由组件
import AppRouter, { routes } from "@/router";
// 路由初始化的redux内容
import { initialStateJSON } from "@/store/reducers";

// 配置
import { port } from "Config";

const app = express();

// ***** 注意 *****
// 不要改变如下代码执行位置，否则热更新会失效
// 开发环境开启修改代码后热更新

// app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(express.static("./dist/client"));

app.use(function (req, res, next) {
  // 计算页面加载完成花费的时间
  var exec_start_at = Date.now();
  var _send = res.send;
  res.send = function () {
    // 发送Header
    res.set("X-Execution-Time", String(Date.now() - exec_start_at) + " ms");
    // 调用原始处理函数
    return _send.apply(res, arguments);
  };
  next();
});
const devMode = process.env.NODE_ENV === "development";
const devProxy = {
  "/api": {
    target: "https://cnodejs.org",
    changeOrigin: true,
  },
};

if (devMode) {
  Object.keys(devProxy).forEach(function (context) {
    app.use(createProxyMiddleware(context, devProxy[context]));
  });
}

app.get("*", async (req, res) => {
  let store = configureStore(JSON.parse(initialStateJSON));
  let _route = null,
    _match = null;

  routes.some((route) => {
    let match = matchPath(req.url.split("?")[0], route);
    if (match && match.path) {
      _route = route;
      _match = match;
      return true;
    }
  });

  let context = {
    code: 200,
  };

  if (_route.component && _route.component.preFetch) {
    context = await _route.component.preFetch({
      store,
      match: _match,
      query: req.query,
    });
  }

  _route &&
    _route.component &&
    _route.component.preload &&
    (await _route.component.preload());

  const metaTagsInstance = MetaTagsServer();

  let _mainContent = (
    <Provider store={store}>
      <MetaTagsContext extract={metaTagsInstance.extract}>
        <StaticRouter location={req.url} context={context}>
          <AppRouter />
        </StaticRouter>
      </MetaTagsContext>
    </Provider>
  );

  // html
  let html = ReactDOMServer.renderToString(_mainContent);

  // 获取页面的meta，嵌套到模版中
  let meta = metaTagsInstance.renderToString();

  let reduxState = JSON.stringify(store.getState()).replace(/</g, "\\x3c");

  if (context.code == 302) {
    res.writeHead(302, {
      Location: context.url,
    });
  } else {
    res.status(context.code);
    res.render("../dist/server/index.ejs", { html, reduxState, meta });
  }

  res.end();

  // 释放store内存
  store = null;
});

app.listen(port);
console.log("server started on port " + port);
