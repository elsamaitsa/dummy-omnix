import React from "react";
import Components from "./helper";
import theme from "./theme";
// icons
import PersonIcon from "@mui/icons-material/Person";
import SyncIcon from "@mui/icons-material/Sync";
// import ReCAPTCHA from "react-google-recaptcha";

// const captcha = new Array();

const ForgotPasswordSchema = Components.Yup.object().shape({
  username: Components.Yup.string().email("Invalid email address format").required("Email is required"),
});
const FormAccountInfo = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  // const [token, setToken] = React.useState(false);
  const [type, setType] = React.useState("error");

  // let re_captcha = React.useRef();

  const handleLogin = (params) => {
    setLoading(true);
    const axios = window.axios.default;
    // params.tokenCaptcha = token;
    props.setEmail(params.email);
    axios
      .post(`/user/forgotPassword`, params)
      .then((res) => {
        if (res) {
          setType("success");
          setOpenSnack(true);
          setMessage("Forgot password link was sent to your email.");
          setTimeout(() => {
            props.handleNext();
          }, 2000);
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
              ? `${error.response.data.message || "Something wrong with our server, please try again later.."}`
              : "Something wrong with our server, please try again later.."
          );
        }
      });
  };

  const handleSubmitForgot = (e) => {
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute("6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P", {
          action: "submit",
        })
        .then(function (token) {
          handleLogin({
            email: e.username,
            tokenCaptcha: token,
          });
        });
    });
  };

  // captcha
  // function createCaptcha() {
  //   document.getElementById("recaptcha").value = "";
  //   document.getElementById("errCaptcha").innerHTML = "";
  //   for (var i = 0; i < 4; i++) {
  //     captcha[i] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  //     /*
  //     if (i % 2 == 0) {
  //       captcha[i] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  //     } else {
  //       captcha[i] = Math.floor(Math.random() * 10 + 0);
  //     }*/
  //   }

  //   var thecaptcha = captcha.join("");
  //   var canvas = document.getElementById("captcha");

  //   var ctx = canvas.getContext("2d");
  //   //ctx.fillStyle = "blue";
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.font = "18px Arial";

  //   //ctx.fillText(thecaptcha, 10, 70);
  //   ctx.fillText(thecaptcha, 130, 82);
  // }

  // React.useEffect(() => {
  //   var canvas = document.getElementById("captcha");
  //   if (props?.isCaptcha != null) {
  //     if (canvas && !props?.isCaptcha) {
  //       createCaptcha();
  //     }
  //   }
  // }, [props?.isCaptcha]);

  return (
    <div>
      <Components.Mui.Typography
        variant="h5"
        sx={{
          color: window.BASE_THEME.palette.primary.dark,
          fontSize: "20px",
          fontWeight: "bold",
          marginTop: 3,
        }}
      >
        Forgot Password
      </Components.Mui.Typography>
      <Components.Mui.Typography
        variant="h5"
        sx={{
          color: "#294354",
          fontSize: "12px",
          fontWeight: "normal",
          marginTop: "10px",
        }}
      >
        Enter your registered email below for sent code OTP to your email
      </Components.Mui.Typography>
      <Components.Mui.Box marginBottom="15px" />
      {/* form */}
      <Components.Formik.Formik
        initialValues={{
          username: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => {
          handleSubmitForgot(values);
        }}
      >
        {({ errors, touched, values, handleChange, handleBlur, isValid, isSubmitting, handleSubmit }) => (
          <Components.Formik.Form onSubmit={handleSubmit}>
            <Components.Mui.OutlinedInput
              id="username-input"
              type="text"
              name="username"
              placeholder="Enter Email"
              startAdornment={
                <Components.Mui.InputAdornment position="start">
                  <PersonIcon position="start" fontSize="small" />
                </Components.Mui.InputAdornment>
              }
              size="small"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              fullWidth
            />
            {touched.username && errors.username && (
              <Components.Mui.Typography
                sx={{
                  margin: "5px 0 0 10px",
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {errors.username}
              </Components.Mui.Typography>
            )}
            <Components.Mui.Box marginBottom="15px" />
            {/*{props?.isCaptcha != null ? (
              props?.isCaptcha ? (
                <Components.Mui.Box cs={{ maxWidth: "100%" }}>
                  <ReCAPTCHA
                    ref={re_captcha}
                    sitekey="6LcDtGgeAAAAAM3fXyblIX3Mtooi8Ex1a-yJsJMV"
                    onChange={(e) => setToken(e)}
                  />
                </Components.Mui.Box>
              ) : (
                <Components.Mui.Grid container sx={{ maxWidth: "50%", maxHeight: "80px" }}>
                  <Components.Mui.Grid
                    item
                    xs={5}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#cdd4e0",
                      justifyContent: "center",
                      height: "80px",
                    }}
                  >
                    <canvas id="captcha"></canvas>
                  </Components.Mui.Grid>
                  <Components.Mui.Grid
                    item
                    xs={7}
                    sx={{
                      pl: 1,
                    }}
                  >
                    <Components.Mui.Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Components.Mui.Typography sx={{ fontSize: "14px" }}>Captcha</Components.Mui.Typography>
                      <Components.Mui.IconButton onClick={createCaptcha}>
                        <SyncIcon color="primary" />
                      </Components.Mui.IconButton>
                    </Components.Mui.Box>

                    <Components.Mui.Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Components.Mui.TextField
                        id="recaptcha"
                        type="text"
                        placeholder="Enter your captcha"
                        size="small"
                        variant="standard"
                        onChange={(e) => setToken(e.target.value)}
                      />

                      <span id="errCaptcha" style={{ color: "red", fontSize: "13px" }}></span>
                    </Components.Mui.Box>
                  </Components.Mui.Grid>
                </Components.Mui.Grid>
              )
            ) : null} */}

            <Components.Mui.Box marginBottom="15px" />

            <Components.Mui.Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Components.Mui.Box sx={{ flex: "1 1 auto" }} />

              <Components.Mui.Button type="submit" disabled={!isValid || loading} variant="contained">
                {props.activeStep === props.steps.length - 1 ? "Submit" : "Next"}
              </Components.Mui.Button>
            </Components.Mui.Box>

            {/* <Components.Mui.Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Components.Mui.Link
                      href="#"
                      style={{ fontSize: 12 }}
                      onClick={() => window.location.replace("/login")}
                    >
                      Already have an account
                    </Components.Mui.Link>
                    <Components.Mui.Button
                      variant="contained"
                      type="submit"
                      disabled={!isValid || loading}
                    >
                      {loading ? "Please wait..." : "Send Link Reset"}
                    </Components.Mui.Button>
                  </Components.Mui.Box> */}
          </Components.Formik.Form>
        )}
      </Components.Formik.Formik>
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
    </div>
  );
};

export default FormAccountInfo;
