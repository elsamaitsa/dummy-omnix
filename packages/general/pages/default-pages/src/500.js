import React from "react";

// helpers
import Components from "./components/helper";

export default function ServerError() {
  return (
    <Components.Mui.Box paddingY={5}>
      <center>
        <img
          src={`${window.ASSET_URL}/images/undraw-server-down-s4lk-1.png`}
          alt="Server Error"
          width="80%"
        />
      </center>
      <Components.Mui.Typography
        variant="body2"
        align="center"
        color="#91989C"
        sx={{ mb: 2 }}
      >
        Our server is feeling a little down. <br /> Please try again in a few
        moments
      </Components.Mui.Typography>
    </Components.Mui.Box>
  );
}
