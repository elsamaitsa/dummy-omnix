import React from "react";
// helpers
import Components from "./components/helper";
// icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
//import ReCAPTCHA from "react-google-recaptcha";
import theme from "./components/theme";
const SignInSchema = Components.Yup.object().shape({
  password: Components.Yup.string().required("Password required"),
});

function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [type, setType] = React.useState("error");
  const [showPassword, setShowPassword] = React.useState(false);
  const [duration, setDuration] = React.useState();
  const storage = props.getStorage("fWBOsAkEDa4euU3r1qHWfQ==", true);
  React.useEffect(() => {
    if (!props.isTenant()) {
      window.location.href = "/tenant";
    } else {
      if (!props.isAuthenticated()) {
        window.location.href = "/login";
      } else {
        if (!props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true)) {
          localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
          window.location.href = "/login";
        } else {
          if (!props.getStorage("fWBOsAkEDa4euU3r1qHWfQ==", true)) {
            window.location.href = `/dashboard-agent`;
          }
        }
      }
    }
  }, []);

  React.useEffect(() => {
    setInterval(() => {
      setDuration(
        window.moment
          .utc(moment(new Date()).diff(moment(new Date(storage?.lup))))
          .format("HH:mm:ss")
      );
    }, 1000);
  });

  const handleLogin = (params) => {
    setLoading(true);
    const axios = window.axios.default;
    params.reason = storage?.reason;
    axios
      .post(`/auth/auxLogout`, params)
      .then(() => {
        setLoading(false);
        setType("success");
        localStorage.removeItem("fWBOsAkEDa4euU3r1qHWfQ==");
        if (props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true)) {
          if (props.getStorage("t18CBZ2a2oiFK9WwUCYsuw", true)?.length > 0) {
            window.location.href = `${props.getStorage("t18CBZ2a2oiFK9WwUCYsuw", true)[0]?.path
              }`;
          } else {
            window.location.href = `/login`;
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 500) {
          setOpenSnack(true);
          setMessage("Internal server error..");
          setType("error");
        } else if (error.response.status === 501) {
          setOpenSnack(true);
          setMessage("Not implemented..");
          setType("error");
        } else if (error.response.status === 502) {
          setOpenSnack(true);
          setMessage("Bad gateway..");
          setType("error");
        } else if (error.response.status === 503) {
          setOpenSnack(true);
          setMessage("Service unavailable..");
          setType("error");
        } else if (error.response.status === 504) {
          setOpenSnack(true);
          setMessage("Gateway timeout..");
          setType("error");
        } else if (error.response.status === 505) {
          setOpenSnack(true);
          setMessage("HTTP version not supported");
          setType("error");
        } else if (error.response.status === 506) {
          setOpenSnack(true);
          setMessage("Variant also negotiates..");
          setType("error");
        } else if (error.response.status === 507) {
          setOpenSnack(true);
          setMessage("Insufficient Storage..");
          setType("error");
        } else if (error.response.status === 508) {
          setOpenSnack(true);
          setMessage("Loop Detected..");
          setType("error");
        } else if (error.response.status === 510) {
          setOpenSnack(true);
          setMessage("Not Extended..");
          setType("error");
        } else if (error.response.status === 511) {
          setOpenSnack(true);
          setMessage("Network Authentication Required");
          setType("error");
        } else {
          setType("warning");
          setOpenSnack(true);
          setMessage(
            error.response
              ? `${error.response.data.message ||
              "Something wrong with our server, please try again later.."
              }`
              : "Something wrong with our server, please try again later.."
          );

          if (error.response.status === 401) {
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
          }
        }
      });
  };

  let tenantSetting = props.getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);
  return (
    <Components.Mui.ThemeProvider theme={theme}>
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
          <img
            src={`${window.ASSET_URL}${tenantSetting ? tenantSetting.custom_path : ""
              }/images/omnix.png`}
            alt="omnix-logo"
            width="150"
            height="70"
          />
          <Components.Mui.Box
            sx={{
              marginTop: "20px",
              width: "300px",
              minWidth: "25vw",
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              zIndex: 5,
            }}
          >
            <Components.Mui.Typography
              variant="h5"
              sx={{
                color: "#2D2D2D",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Welcome Back,
            </Components.Mui.Typography>
            <Components.Mui.Typography
              variant="h5"
              sx={{
                color: window.BASE_THEME.palette.primary.dark,
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {props.isAuthenticated()?.user.name}
            </Components.Mui.Typography>
            <Components.Mui.Box marginBottom="30px" />
            <Components.Mui.Box display="flex" alignItems="center">
              <Components.Mui.Typography
                variant="h5"
                sx={{
                  color: "#2D2D2D",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                Your Aux Time is
              </Components.Mui.Typography>
              <Components.Mui.Typography
                variant="h5"
                sx={{
                  color: window.BASE_THEME.palette.primary.dark,
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}
              >
                {duration}
              </Components.Mui.Typography>
            </Components.Mui.Box>
            <Components.Mui.Box
              display="flex"
              alignItems="center"
              marginTop={"15px"}
            >
              <Components.Mui.Typography
                variant="h5"
                sx={{
                  color: "#2D2D2D",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                Reason For Aux is
              </Components.Mui.Typography>
              <Components.Mui.Typography
                variant="h5"
                sx={{
                  color: window.BASE_THEME.palette.primary.dark,
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}
              >
                {storage?.reason ?? "-"}
              </Components.Mui.Typography>
            </Components.Mui.Box>
            <Components.Mui.Box marginBottom="30px" />
            {/* form */}
            <Components.Formik.Formik
              initialValues={{
                password: "",
              }}
              validationSchema={SignInSchema}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              {({
                errors,
                touched,
                values,
                handleChange,
                handleBlur,
                isValid,
                isSubmitting,
                handleSubmit,
              }) => (
                <Components.Formik.Form onSubmit={handleSubmit}>
                  <Components.Mui.OutlinedInput
                    id="outlined-adornment-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    startAdornment={
                      <Components.Mui.InputAdornment position="start">
                        <LockIcon position="start" fontSize="small" />
                      </Components.Mui.InputAdornment>
                    }
                    endAdornment={
                      <Components.Mui.InputAdornment position="end">
                        <Components.Mui.IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Components.Mui.IconButton>
                      </Components.Mui.InputAdornment>
                    }
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    fullWidth
                  />
                  {errors.password && (
                    <Components.Mui.Typography
                      sx={{
                        margin: "5px 0 0 10px",
                        fontSize: "12px",
                        color: "red",
                      }}
                    >
                      {errors.password}
                    </Components.Mui.Typography>
                  )}
                  <Components.Mui.Box marginBottom="15px" />
                  <Components.Mui.Box cs={{ maxWidth: "100%" }}>
                    {/* <ReCAPTCHA
                      sitekey="6Lf2jyYdAAAAANG2d6D9A7ALEbfbfbA5BHQdMZ-n"
                      onChange={(test) => console.log(test)}
                    /> */}
                  </Components.Mui.Box>
                  <Components.Mui.Box marginBottom="15px" />
                  <Components.Mui.Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || loading}
                  >
                    {loading ? "Please wait..." : "Sign In"}
                  </Components.Mui.Button>
                </Components.Formik.Form>
              )}
            </Components.Formik.Formik>
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
      <Components.Mui.Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnack}
        onClose={() => {
          setMessage(false);
          setOpenSnack(false);
        }}
        autoHideDuration={6000}
      >
        <Components.Mui.Alert
          onClose={() => {
            setMessage(false);
            setOpenSnack(false);
          }}
          severity={type}
          sx={{ width: "100%" }}
        >
          {message}
        </Components.Mui.Alert>
      </Components.Mui.Snackbar>
    </Components.Mui.ThemeProvider>
  );
}
export default Root;
