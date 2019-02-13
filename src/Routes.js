import React from "react";
import { Route, Switch } from "react-router-dom";
import HeroList from "./HeroList";
import HeroItem from "./HeroItem";

const Routes = () => (
  <div className="container-fluid">
    <Switch>
      <Route exact path="/" component={HeroList} />
      <Route exact path="/:id" component={HeroItem} />
    </Switch>
  </div>
);

export default Routes;
