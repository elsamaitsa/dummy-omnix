import React from "react";

// helpers
import Components from "./components/helper";
import theme from "./components/theme";

export default function Root(props) {
  const axios = window.axios.default;
  const [alertType, setAlertType] = React.useState(props.alertType);
  React.useEffect(() => {
    setTimeout(() => {
      props.setAlert(false);
      props.setAlertType(false);
    }, 3000);

    axios.interceptors.response.use(
      (response) => {
        // if (response?.data?.message) {
        //props.setAlertType("success");
        //props.setAlert("Success"); //response?.data?.message
        // }
        return response;
      },
      (error) => {
        if (error) {
          if (error.response.status >= 500) {
            setAlertType("error");
          }

          if (error.response.status < 500) {
            setAlertType("warning");
          }
        }
        return Promise.reject(error);
      }
    );
  });

  React.useEffect(() => {
    setAlertType(props.alertType);
  }, [props.alertType]);
  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={true}
        autoHideDuration={6000}
        onClose={() => {
          props.setAlert(false);
          props.setAlertType(false);
        }}
      >
        <Components.Mui.Alert
          severity={alertType}
          sx={{ width: "400px" }}
          onClose={() => {
            props.setAlert(false);
            props.setAlertType(false);
          }}
        >
          {props.alert}
        </Components.Mui.Alert>
      </Components.Mui.Snackbar>
    </Components.Mui.ThemeProvider>
  );
}
