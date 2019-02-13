import React from "react";
import Spinner from "react-spinkit";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

class HeroList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
      loading: true
    };
  }

  async getHeroes() {
    this.setState({ loading: true });
    const heroesResponse = await fetch(
      "https://angular-1-training-class-api.herokuapp.com/heroes"
    );
    this.setState({ loading: false });
    return heroesResponse.json();
  }

  async componentDidMount() {
    const heroes = await this.getHeroes();
    this.setState({ heroes });
  }

  render() {
    const { heroes, loading } = this.state;

    if (loading) {
      return <Spinner name="circle" />;
    }

    return (
      <>
        <Helmet title="Star Wars Heroes - List" />
        <h1>These are all my Star Wars heroes!</h1>
        {heroes.map(hero => (
          <div key={hero.id} className="card card-hero">
            <img src={hero.imageUrl} className="card-img-top" alt={hero.name} />
            <div className="card-body">
              <h5 className="card-title">{hero.name}</h5>
              <p className="card-text">
                Power: {hero.power} Affiliation: {hero.affiliations.join(" ")}
              </p>
              <Link to={`/${hero.id}`} className="btn btn-primary">
                Select
              </Link>
            </div>
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(HeroList);
