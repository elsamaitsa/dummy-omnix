import React from "react";

import Components from "./helper";
import theme from "./theme";
// icons
import PersonIcon from "@mui/icons-material/Person";
import SyncIcon from "@mui/icons-material/Sync";
// import ReCAPTCHA from "react-google-recaptcha";
const axios = window.axios.default;

// const captcha = new Array();

const ForgotPasswordSchema = Components.Yup.object().shape({
  username: Components.Yup.string().email("Invalid email address format").required("Email is required"),
});

const FormSecurity = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  // const [token, setToken] = React.useState(false);
  const [isResend, setIsResend] = React.useState(false);
  const [type, setType] = React.useState("error");
  const [otpNumber, setOtpNumber] = React.useState(["", "", "", "", ""]);

  // let re_captcha = React.useRef();

  const handleOtpChange = (index, value) => {
    // Validate input (only allow numeric digits)
    if (value.length <= 1) {
      const newOtp = [...otpNumber];
      newOtp[index] = value;
      setOtpNumber(newOtp);

      // Move to the next input field if a digit is entered
      if (value !== "" && index < 4) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOTP = (params) => {
    setLoading(true);
    axios
      .post(`/user/otpSubmit`, params)
      .then((res) => {
        if (res) {
          setType("success");
          setOpenSnack(true);
          props.handleNext();
          setLoading(false);
          props.setKeyOTP(res.data);
          setMessage("OTP true");
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

  const resendOTP = (params) => {
    const payload = {
      email: props.email,
      tokenCaptcha: params.token,
    };
    setLoading(true);
    const axios = window.axios.default;
    axios
      .post(`/user/forgotPassword`, payload)
      .then((res) => {
        if (res) {
          setType("success");
          setOpenSnack(true);
          setMessage("Forgot password link was sent to your email.");
          setIsResend(false);
          setToken(false);
          setLoading(false);
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
  //   if (token && token?.length >= 4) {
  //     resendOTP();
  //   }
  // }, [token]);
  React.useEffect(() => {
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute("6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P", {
          action: "resend",
        })
        .then(function (token) {
          resendOTP(token);
        });
    });
  }, [isResend]);

  // React.useEffect(() => {
  //   console.log(props?.isCaptcha);
  //   var canvas = document.getElementById("captcha");
  //   if (props?.isCaptcha != null) {
  //     if (canvas && !props?.isCaptcha) {
  //       createCaptcha();
  //     }
  //   }
  // }, [props?.isCaptcha, isResend]);

  const handleSubmitOTP = (e) => {
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute("6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P", {
          action: "submit",
        })
        .then(function (token) {
          handleOTP({
            email: props.email,
            otp: otpNumber.join(""),
          });
        });
    });
  };
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
        We have sent an email with 5 digit code OTP to {props.email}. Please enter that code OTP
      </Components.Mui.Typography>
      <Components.Mui.Box marginBottom="15px" />
      {/* form */}
      <Components.Formik.Formik
        initialValues={{
          username: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => {
          handleSubmitOTP(values);
        }}
      >
        {({ errors, touched, values, handleChange, handleBlur, isValid, isSubmitting, handleSubmit }) => (
          <Components.Formik.Form onSubmit={handleSubmit}>
            {otpNumber.map((digit, index) => (
              <Components.Mui.OutlinedInput
                key={index}
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                maxLength="1"
                style={{ width: 50, margin: 5 }}
              />
            ))}
            <Components.Mui.Typography
              variant="h5"
              sx={{
                color: "#294354",
                fontSize: "12px",
                fontWeight: "normal",
                marginTop: "10px",
              }}
            >
              Didn’t receive code OTP?{" "}
              <span
                style={{
                  color: window.BASE_THEME.palette.primary.dark,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsResend(true);
                }}
                sx={{ mr: 1 }}
              >
                resend
              </span>{" "}
              or{" "}
              <span
                style={{
                  color: window.BASE_THEME.palette.primary.dark,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={props.handleBack}
              >
                change email
              </span>
            </Components.Mui.Typography>
            <Components.Mui.Box marginBottom="15px" />
            {/* {isResend ? (
              props?.isCaptcha != null ? (
                props?.isCaptcha ? (
                  <Components.Mui.Box cs={{ maxWidth: "100%" }}>
                    <Components.Mui.Typography
                      variant="h5"
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        fontWeight: "normal",
                        marginBottom: "10px",
                      }}
                    >
                      Please, check captcha in the below to resend email.
                    </Components.Mui.Typography>
                    <ReCAPTCHA
                      ref={re_captcha}
                      sitekey="6LcDtGgeAAAAAM3fXyblIX3Mtooi8Ex1a-yJsJMV"
                      onChange={(e) => setToken(e)}
                    />
                  </Components.Mui.Box>
                ) : (
                  <Components.Mui.Grid
                    container
                    sx={{ maxWidth: "50%", maxHeight: "80px" }}
                  >
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
                        <Components.Mui.Typography sx={{ fontSize: "14px" }}>
                          Captcha
                        </Components.Mui.Typography>
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

                        <span
                          id="errCaptcha"
                          style={{ color: "red", fontSize: "13px" }}
                        ></span>
                      </Components.Mui.Box>
                    </Components.Mui.Grid>
                  </Components.Mui.Grid>
                )
              ) : null
            ) : null} */}
            <Components.Mui.Box marginBottom="15px" />
            <Components.Mui.Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Components.Mui.Button
                color="inherit"
                disabled={props.activeStep === 0}
                onClick={props.handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Components.Mui.Button>
              <Components.Mui.Box sx={{ flex: "1 1 auto" }} />

              <Components.Mui.Button onClick={handleSubmitOTP} disabled={!isValid || loading} variant="contained">
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

export default FormSecurity;
