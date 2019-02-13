import HeroList from "./HeroList";
import HeroItem from "./HeroItem";

export default [
  {
    exact: true,
    path: "/",
    component: HeroList
  },
  {
    exact: true,
    path: "/:id",
    component: HeroItem
  }
];
