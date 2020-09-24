import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getLatestBlocksInfos } from "../actions/latestBlocksInfos";

class ClaimITContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    latestBlocksInfos: PropTypes.array.isRequired,
    _getLatestBlocksInfos: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    errorMessage: null,
  };

  componentDidMount() {
    this._getLatestBlocksInfos();
  }

  _getLatestBlocksInfos = () => {
    const { _getLatestBlocksInfos } = this.props;
    return _getLatestBlocksInfos().catch((err) => {
      this.setState({ errorMessage: err });
      throw err;
    });
  };

  render = () => {
    const { Layout, isLoading, latestBlocksInfos } = this.props;

    const { errorMessage } = this.state;

    return (
      <Layout
        loading={isLoading}
        error={errorMessage}
        latestBlocksInfos={latestBlocksInfos}
      />
    );
  };
}

const mapStateToProps = (state) => ({
  isLoading: state.status.loading || false,
  latestBlocksInfos: state.latestBlocksInfos.latestBlocksInfos,
});

const mapDispatchToProps = {
  _getLatestBlocksInfos: getLatestBlocksInfos,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimITContainer);
