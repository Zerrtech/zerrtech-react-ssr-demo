import express from "express";
import path from "path";
import fs from "fs";
import React from "react";
import Helmet from "react-helmet";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import Routes from "../src/Routes";
import routeList from "../src/RouteList";
const app = express();

app.use("/static", express.static(path.resolve("./build/static")));

const distPath = path.resolve("./build");
const indexPath = `${distPath}/index.html`;

app.get("*", (req, res) => {
  // handle favicon.ico, it matches my weak route /:id
  if (req.url === "/favicon.ico") {
    return res.status(404).send("Favicon not found!");
  }

  // set up our initial context passed through the router
  const context = { initialState: {} };

  // find the route that matches
  // then fire off any getInitialState function if it exists
  const dataPromises = routeList
    .map(route => {
      const match = matchPath(req.url, route);
      if (match && route.component.getInitialState) {
        return route.component.getInitialState(match.params);
      } else {
        return null;
      }
    })
    .filter(p => p !== null);

  // wait for all data to be fetched before we do ssr
  Promise.all(dataPromises).then(initialStateList => {
    context.initialState = initialStateList[0];
    // we pass the data result into SSR on the StaticRouter context
    const ssr = (
      <StaticRouter context={context} location={req.url}>
        <Routes />
      </StaticRouter>
    );
    const dom = renderToString(ssr);
    // site title
    const helmet = Helmet.renderStatic();

    fs.readFile(indexPath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Index file not found!");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlTemplate(data, dom, helmet));
    });
  });
});

app.listen(5000);

function htmlTemplate(data, dom, helmet) {
  return data
    .replace('<div id="root"></div>', `<div id="root">${dom}</div>`)
    .replace(/<title>.*?<\/title>/g, helmet.title.toString());
}
