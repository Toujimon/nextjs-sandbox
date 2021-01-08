import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

/* Shamelessly stolen from the code given in
https://github.com/mui-org/material-ui/tree/master/examples/nextjs
 */
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fff"
    }
  }
});

export default theme;
