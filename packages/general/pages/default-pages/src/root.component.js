import React from "react";

// helpers
import Components from "./components/helper";
import mainTheme from "./components/theme";

// local components
import PageNotFound from "./404";
import ServerError from "./500";
import ConnectionLost from "./connectionLost";
import NoTenant from "./noTenant";
import Maintenance from "./maintenance";

const RenderComponents = ({
  variant,
  isAuthenticated,
  isTenant,
  getStorage,
  setStorage,
  singleSpa,
}) => {
  switch (variant) {
    case "404":
      return (
        <PageNotFound
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
          singleSpa={singleSpa}
        />
      );
    case "500":
      return (
        <ServerError
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
        />
      );
    case "tenant":
      return (
        <NoTenant
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
        />
      );
    case "maintenance":
      return (
        <Maintenance
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
        />
      );
    case "offline":
      return (
        <ConnectionLost
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
        />
      );
    default:
      return (
        <PageNotFound
          isAuthenticated={isAuthenticated}
          isTenant={isTenant}
          getStorage={getStorage}
          setStorage={setStorage}
        />
      );
  }
};

export default function Root(props) {
  return (
    <Components.Mui.ThemeProvider theme={mainTheme}>
      <Components.Mui.Box
        sx={{
          height: "100vh",
          width: "100vw",
          background: `linear-gradient(180deg, ${window.BASE_THEME.palette.primary.dark} 0%, ${window.BASE_THEME.palette.primary.main} 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Components.Mui.CssBaseline />
        <Components.Mui.Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Components.Mui.Box
            sx={{
              marginTop: "20px",
              width: "100%",
              minWidth: "300px",
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              zIndex: 5,
            }}
          >
            <RenderComponents
              variant={props?.variant}
              isAuthenticated={props.isAuthenticated}
              isTenant={props.isTenant}
              singleSpa={props.singleSpa}
              getStorage={props.getStorage}
              setStorage={props.setStorage}
            />
          </Components.Mui.Box>
        </Components.Mui.Box>
        {/* <Components.Mui.Box
          sx={{
            zIndex: 0,
            minHeight: "100vh",
            minWidth: "100%",
            position: "absolute",
            bottom: "0",
            backgroundPosition: "center",
            backgroundRaepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${window.ASSET_URL}${tenantSetting?tenantSetting.custom_path : "/"}/images/bg-fullwidth.svg)`,
          }}
        />
        <Components.Mui.Box
          sx={{
            zIndex: 0,
            minHeight: "100vh",
            minWidth: "100%",
            position: "absolute",
            bottom: "0",
            backgroundPosition: "center",
            backgroundRaepeat: "no-repeat",
            backgroundSize: "cover",
            transform: "scaleX(-1)",
            backgroundImage: `url(${window.ASSET_URL}${tenantSetting?tenantSetting.custom_path : "/"}/images/bg-fullwidth.svg)`,
          }}
        /> */}
      </Components.Mui.Box>
    </Components.Mui.ThemeProvider>
  );
}
