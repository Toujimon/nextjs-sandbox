import { styled } from "@material-ui/core";

export const ContentBox = styled("div")(({ theme }) => ({
  marginTop: "8px",
  padding: "8px",
  border: "1px solid rgba(0,0,0,0.5)",
  borderRadius: "4px",
  boxShadow: `2px 2px 4px ${theme.palette.primary.main}`,
}));
