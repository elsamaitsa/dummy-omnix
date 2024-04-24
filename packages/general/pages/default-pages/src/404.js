import React from "react";

// helpers
import Components from "./components/helper";

export default function PageNotFound(props) {
  React.useEffect(() => {
    // default pages if tenant code already in storage
    if (
      localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==") &&
      window.location.pathname === "/"
    ) {
      props.singleSpa.navigateToUrl("/login");
    } else if (!localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==")) {
      props.singleSpa.navigateToUrl("/login");
    }
  }, []);

  return (
    <Components.Mui.Box paddingY={5}>
      <center>
        <img
          src={`${window.ASSET_URL}/images/undraw-page-not-found-su7k-1.png`}
          alt="page not found"
          width="80%"
        />
      </center>
      <Components.Mui.Typography
        variant="body2"
        align="center"
        color="#91989C"
        sx={{ mb: 2 }}
      >
        Opss! We can't seem to find the page you are looking for. <br /> Please
        check the URL and try again{" "}
      </Components.Mui.Typography>
      <center>
        <Components.Mui.Button
          variant="contained"
          color="primary"
          onClick={() => window.location.replace("/login")}
        >
          Back to Dashboard
        </Components.Mui.Button>
      </center>
    </Components.Mui.Box>
  );
}
