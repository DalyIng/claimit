import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Error() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">This is an error alert — check it out!
      <Link to="/">
            <Button variant="contained" color="primary">
              Go home!
            </Button>
          </Link>
      </Alert>
    </div>
  );
}

Error.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

Error.defaultProps = {
  title: "Uh oh",
  content: "An unexpected error came up",
};

// export default Error;
