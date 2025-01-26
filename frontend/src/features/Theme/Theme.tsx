import { createTheme } from "@mui/material";
import '@fontsource/montserrat';


const theme = createTheme({
    palette: {
      primary: {
        main: "#49b2cf", 
        contrastText: "#FFFFFF", 
      },
      secondary: {
        main: "#00B0FF", 
        contrastText: "#0D47A1", 
      },
      background: {
        default: "white", 
        paper: "white", 
      },
      text: {
        primary: "#FFFFFF", 
        secondary: "#B0B0B0", 
      },
      error: {
        main: "#D32F2F", 
      },
      warning: {
        main: "#FF9800", 
      },
      info: {
        main: "#0288D1", 
      },
      success: {
        main: "#388E3C", 
      },
    },
    typography: {
      fontFamily: "Montserrat, Arial, sans-serif", 
      h1: {
        fontSize: "3.5rem",
        fontWeight: 700,
        color: "#0D47A1",
      },
      h2: {
        fontSize: "2.75rem",
        fontWeight: 600,
        color: "black",
      },
      h3: {
        fontSize: "2.25rem",
        fontWeight: 600,
        color: "black",
      },
      h4: {
        fontSize: "1.7rem",
        fontWeight: 600,
        color: "black",
      },
      h5: {
        fontSize: "1rem",
        fontWeight: 600,
        color: "white",
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
        color: "black",
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        color: "#212121",
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        color: "#424242",
      },

      button: {
        fontWeight: 600,
        textTransform: "capitalize",
      },
      
         
    
    },
    components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiInputBase-input": {
                color: "black", 
              },
              "& .MuiInputLabel-root": {
                color: "black", 
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", 
              },
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            root: {
              "& .MuiInputBase-input": {
                color: "black", 
              },
              "& .MuiAutocomplete-tag": {
                backgroundColor: "#e0e0e0", 
                color: "#424242", 
              },
              "& .MuiChip-deleteIcon": {
                color: "#787c7e", 
                "&:hover": {
                color: "white", 
                },
                },
                },
            },
        
        },
        
}

    
  });

export default theme;