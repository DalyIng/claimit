import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import { getLatestBlocksInfos } from "../actions/latestBlocksInfos";

class ClaimITContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    latestBlocksInfos: PropTypes.array.isRequired,
    // _getLatestBlocksInfos: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    errorMessage: null,
    address: null,
  };

  componentDidMount() {
    // this._getLatestBlocksInfos();

    const query = new URLSearchParams(this.props.location.search);

    const address = query.get("address");

    if (address) {
      this.setState({ address });
    }
  }

  // _getLatestBlocksInfos = () => {
  //   const { _getLatestBlocksInfos } = this.props;
  //   return _getLatestBlocksInfos().catch((err) => {
  //     this.setState({ errorMessage: err });
  //     throw err;
  //   });
  // };

  render = () => {
    const { Layout, isLoading, latestBlocksInfos } = this.props;

    const { errorMessage, address } = this.state;

    console.log("address: ", address);

    return (
      <Layout
        loading={isLoading}
        error={errorMessage}
        latestBlocksInfos={latestBlocksInfos}
        address={address}
      />
    );
  };
}

const mapStateToProps = (state) => ({
  isLoading: state.status.loading || false,
  latestBlocksInfos: state.latestBlocksInfos.latestBlocksInfos,
});

const mapDispatchToProps = {
  // _getLatestBlocksInfos: getLatestBlocksInfos,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimITContainer);
