import React from "react";

// helpers
import Components from "./components/helper";

export default function Maintenance() {
  return (
    <Components.Mui.Box paddingY={5}>
      <center>
        <img
          src={`${window.ASSET_URL}/images/undraw-Maintenance-re-59vn-1.png`}
          alt="Maintenance"
          width="80%"
        />
      </center>
      <Components.Mui.Typography
        variant="body2"
        align="center"
        color="#91989C"
        gutterBottom
      >
        The page you are looking for is currently under <br /> maintenance and
        we will back soon.
      </Components.Mui.Typography>
      <Components.Mui.Typography
        variant="h4"
        align="center"
        color="primary"
        sx={{ mb: 2 }}
      ></Components.Mui.Typography>
    </Components.Mui.Box>
  );
}
