import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

class HeroList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroes: [],
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
    const heroes = await HeroList.getHeroes();
    return {
      heroes,
      loading: false
    };
  }

  static async getHeroes() {
    const heroesResponse = await fetch(
      "https://angular-1-training-class-api.herokuapp.com/heroes"
    );
    return heroesResponse.json();
  }

  async componentDidMount() {
    const { match } = this.props;
    this.setState({ loading: true });
    const initialState = await HeroList.getInitialState(match.params);
    this.setState(initialState);
  }

  render() {
    const { heroes, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
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
