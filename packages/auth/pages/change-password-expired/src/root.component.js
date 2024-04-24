import React from "react";
// helpers
import Components from "./components/helper";
// icons
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//import ReCAPTCHA from "react-google-recaptcha";
import theme from "./components/theme";
const SignInSchemaPasswordExpired = Components.Yup.object().shape({
  newPassword: Components.Yup.string()
    .required("New password is a required field")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Components.Yup.string()
    .oneOf([Components.Yup.ref("newPassword"), null], "Password doesn't match")
    .required("Password confirmation is a required field"),
});

const SignInSchemaPassword = Components.Yup.object().shape({
  oldPassword: Components.Yup.string().required(
    "Old password is a required field"
  ),
  newPassword: Components.Yup.string()
    .required("New password is a required field")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Components.Yup.string()
    .oneOf([Components.Yup.ref("newPassword"), null], "Password doesn't match")
    .required("Password confirmation is a required field"),
});

function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);
  const [showPass2, setShowPass2] = React.useState(false);
  const [showPass3, setShowPass3] = React.useState(false);
  const [type, setType] = React.useState("error");
  const [openModalSuccess, setOpenModalSuccess] = React.useState(false);

  const handleChangePassword = (e) => {
    setLoading(true);
    const axios = window.axios.default;
    const postData = { newPassword: e.newPassword };

    if (props.isReset) {
      postData.oldPassword = e.oldPassword;
    }
    axios
      .put(
        `/user/${props.isReset ? "changePassword" : "changePasswordExpired"}`,
        postData
      )
      .then((res) => {
        if (res) {
          setLoading(false);
          let storage = props.getStorage("h/zkD4TZprsOwTyHV2rxgg==", true);
          storage.dateExpired = window
            .moment(new Date(res?.data?.expired_password_at))
            .format("YYYY-MM-DD");
          props.setStorage("h/zkD4TZprsOwTyHV2rxgg==", storage, true);
          localStorage.setItem("remind_later", false);

          if (window.confirm("Update password success")) {
            window.location.reload();
          } else {
            window.location.reload();
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
              ? `${
                  error.response.data.message ||
                  "Something wrong with our server, please try again later.."
                }`
              : "Something wrong with our server, please try again later.."
          );
        }
      });
  };

  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Components.Mui.Box
          sx={{
            marginTop: "0px",
            width: "25vw",
            padding: "25px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            zIndex: 5,
          }}
        >
          <Components.Mui.Typography
            variant="h5"
            sx={{
              color: window.BASE_THEME.palette.primary.dark,
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {props.isReset ? "Change Password" : "Password Expired"}
          </Components.Mui.Typography>
          <Components.Mui.Typography variant="body2" sx={{ fontSize: "12px" }}>
            {props.isReset
              ? "Please create strong password."
              : "Your password expired, please change password before continue."}
          </Components.Mui.Typography>
          <Components.Mui.Box marginBottom="15px" />
          {/* form */}
          <Components.Formik.Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={
              props.isReset ? SignInSchemaPassword : SignInSchemaPasswordExpired
            }
            onSubmit={(values) => {
              handleChangePassword(values);
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
                {props.isReset ? (
                  <>
                    <Components.Mui.OutlinedInput
                      id="outlined-adornment-password"
                      name="oldPassword"
                      type={showPass ? "text" : "password"}
                      placeholder="Enter Old Password"
                      startAdornment={
                        <Components.Mui.InputAdornment position="start">
                          <LockIcon position="start" fontSize="small" />
                        </Components.Mui.InputAdornment>
                      }
                      endAdornment={
                        <Components.Mui.InputAdornment
                          position="end"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </Components.Mui.InputAdornment>
                      }
                      size="small"
                      value={values.oldPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.oldPassword}
                      fullWidth
                    />
                    {touched.oldPassword && errors.oldPassword && (
                      <Components.Mui.Typography
                        sx={{
                          margin: "5px 0 0 10px",
                          fontSize: "12px",
                          color: "red",
                        }}
                      >
                        {errors.oldPassword}
                      </Components.Mui.Typography>
                    )}
                    <Components.Mui.Box marginBottom="15px" />
                  </>
                ) : null}
                <Components.Mui.OutlinedInput
                  id="outlined-adornment-password"
                  name="newPassword"
                  type={showPass2 ? "text" : "password"}
                  placeholder="Enter New Password"
                  startAdornment={
                    <Components.Mui.InputAdornment position="start">
                      <LockIcon position="start" fontSize="small" />
                    </Components.Mui.InputAdornment>
                  }
                  endAdornment={
                    <Components.Mui.InputAdornment
                      position="end"
                      onClick={() => setShowPass2(!showPass2)}
                    >
                      {showPass2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </Components.Mui.InputAdornment>
                  }
                  size="small"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  fullWidth
                />
                {touched.newPassword && errors.newPassword && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.newPassword}
                  </Components.Mui.Typography>
                )}
                <Components.Mui.Box marginBottom="15px" />
                <Components.Mui.OutlinedInput
                  id="outlined-adornment-password"
                  name="confirmPassword"
                  type={showPass3 ? "text" : "password"}
                  placeholder="Enter Confirmation Password"
                  startAdornment={
                    <Components.Mui.InputAdornment position="start">
                      <LockIcon position="start" fontSize="small" />
                    </Components.Mui.InputAdornment>
                  }
                  endAdornment={
                    <Components.Mui.InputAdornment
                      position="end"
                      onClick={() => setShowPass3(!showPass3)}
                    >
                      {showPass3 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </Components.Mui.InputAdornment>
                  }
                  size="small"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  fullWidth
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.confirmPassword}
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
                <Components.Mui.Box
                  display="flex"
                  alignItems="center"
                  justifyContent={"center"}
                >
                  <Components.Mui.Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || loading}
                    sx={{
                      marginRight: props.isReset ? "10px" : "unset",
                      width: props.isReset ? "auto" : "100%",
                    }}
                  >
                    {loading ? "Please wait..." : "Submit"}
                  </Components.Mui.Button>
                  {props.isReset ? (
                    <Components.Mui.Button
                      variant="outlined"
                      onClick={() => props.handleClose()}
                    >
                      Cancel
                    </Components.Mui.Button>
                  ) : null}
                </Components.Mui.Box>
              </Components.Formik.Form>
            )}
          </Components.Formik.Formik>
        </Components.Mui.Box>
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
