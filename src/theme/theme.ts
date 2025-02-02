import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "Plus Jakarta Sans, sans-serif",
        allVariants: {
            color: "#2d3648",
        },
        body1: {
            fontWeight: 500,
            fontSize:"18px",
        },
    },
});

export default theme;
