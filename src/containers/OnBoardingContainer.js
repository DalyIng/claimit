import React, { Component } from "react";
import { connect } from "react-redux";

class onBoardingContainer extends Component {
  componentDidMount() {}

  render = () => {
    const { Layout } = this.props;

    return <Layout />;
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onBoardingContainer);
