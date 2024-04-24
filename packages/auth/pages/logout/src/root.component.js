import React from "react";
import Logout from "@mui/icons-material/NoMeetingRoom";
// helpers
import Components from "./components/helper";
// icons
import theme from "./components/theme";

function Root(props) {
  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Box
        sx={{ width: "25vw" || 300, padding: "30px 10px 30px 10px" }}
      >
        <Logout
          sx={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            margin: "auto",
            fontSize: "90px",
            color: window.BASE_THEME.palette.primary.dark,
            marginBottom: "10px",
          }}
        />

        <Components.Mui.Typography variant="h5" align="center" gutterBottom>
          Are you sure want logout?
        </Components.Mui.Typography>

        <Components.Mui.Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mt={1.5}
        >
          <Components.Mui.Button
            variant="contained"
            color="error"
            sx={{ minWidth: "70px !important" }}
            onClick={() => props.setOpenModalLogout(false)}
          >
            No
          </Components.Mui.Button>
          <Components.Mui.Button
            variant="contained"
            color="primary"
            sx={{ minWidth: "70px !important" }}
            onClick={() => {
              axios
                .post("/auth/logout", {
                  userid: props.isAuthenticated()?.user?.id,
                })
                .then((res) => {
                  if (res) {
                    localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
                    localStorage.removeItem("KPwpN5Bjh4Y2N2L1CC4sRQ==");
                    localStorage.removeItem("t18CBZ2a2oiFK9WwUCYsuw==");
                    localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyQ==");
                    localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyR==");
                    localStorage.removeItem("fWBOsAkEDa4euU3r1qHWfQ==");
                    localStorage.removeItem("face-recognition");
                    localStorage.removeItem("bucket-type");
                    localStorage.removeItem("video-platform");
                    localStorage.removeItem("pabx_ami_url");
                    // window.location.reload(true);
                    //if (!localStorage.getItem("session")) {
                    window.location.href = "/login";
                    //}
                  }
                });
            }}
          >
            Yes
          </Components.Mui.Button>
        </Components.Mui.Box>
      </Components.Mui.Box>
    </Components.Mui.ThemeProvider>
  );
}
export default Root;
