import React from "react";

// helpers
import Components from "./components/helper";

export default function NoTenant() {
  return (
    <Components.Mui.Box paddingY={3}>
      <center>
        <img
          src={`${window.ASSET_URL}/images/undraw-online-connection-6778-1.png`}
          alt="Connection Lost"
          width="80%"
        />
      </center>
      <Components.Mui.Typography
        variant="body2"
        align="center"
        color="#91989C"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Your connection was lost or very slowly. <br /> Please check your
        internet connection.
      </Components.Mui.Typography>
      <center>
        <Components.Mui.Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Components.Mui.Button>
      </center>
    </Components.Mui.Box>
  );
}
