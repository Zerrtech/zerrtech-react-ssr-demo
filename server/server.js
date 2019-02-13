import express from "express";
import path from "path";
import fs from "fs";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Routes from "../src/Routes";
const app = express();

app.use("/static", express.static(path.resolve("./build/static")));

const distPath = path.resolve("./build");
const indexPath = `${distPath}/index.html`;

app.get("*", (req, res) => {
  const context = {};

  const ssr = (
    <StaticRouter context={context} location={req.url}>
      <Routes />
    </StaticRouter>
  );
  const dom = renderToString(ssr);

  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Index file not found!");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlTemplate(data, dom));
  });
});

app.listen(5000);

function htmlTemplate(data, dom) {
  return data.replace('<div id="root"></div>', `<div id="root">${dom}</div>`);
}
