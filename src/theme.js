import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

/* Shamelessly stolen from the code given in
https://github.com/mui-org/material-ui/tree/master/examples/nextjs
 */
export const lightTheme = createMuiTheme();

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});
