import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

class HeroItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hero: null,
      loading: true
    };
    if (this.props.staticContext && this.props.staticContext.initialState) {
      this.state = Object.assign(
        this.state,
        this.props.staticContext.initialState
      );
    }
  }

  static async getInitialState(matchParams) {
    const hero = await HeroItem.getHero(matchParams.id);
    return {
      hero,
      loading: false
    };
  }

  static async getHero(id) {
    const heroResponse = await fetch(
      `https://angular-1-training-class-api.herokuapp.com/heroes/${id}`
    );
    return heroResponse.json();
  }

  async componentDidMount() {
    const { match } = this.props;
    this.setState({ loading: true });
    const initialState = await HeroItem.getInitialState(match.params);
    this.setState(initialState);
  }

  render() {
    const { hero, loading } = this.state;

    if (loading || !hero) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <h1>You are my hero!</h1>
        <Helmet title={`Star Wars Heroes - ${hero.name}`} />
        <div className="card bg-dark text-white">
          <img src={hero.imageUrl} className="card-img" alt={hero.name} />
          <div className="card-img-overlay">
            <h5 className="card-title">{hero.name}</h5>
            <p className="card-text">
              Power: {hero.power} Affiliation: {hero.affiliations.join(" ")}
            </p>
            <p className="card-text">
              I am strong with the {hero.light ? "light" : "dark"} side
            </p>
            <Link to="/" className="btn btn-primary">
              Back
            </Link>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(HeroItem);
