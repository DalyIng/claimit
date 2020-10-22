import React, { Component } from "react";
import { connect } from "react-redux";

class onBoardingContainer extends Component {
  state = {
    errorMessage: null,
    address: null,
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    const address = query.get("address");

    if (address) {
      this.setState({ address });
    }
  }

  render = () => {
    const { Layout } = this.props;
    const { address } = this.state;

    return <Layout address={address} />;
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onBoardingContainer);
