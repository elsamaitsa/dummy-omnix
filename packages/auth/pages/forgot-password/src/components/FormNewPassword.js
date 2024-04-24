import React from 'react'
import Components from "./helper";
import theme from "./theme";
// icons
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const axios = window.axios.default;
  
  const SignInSchemaPassword = Components.Yup.object().shape({
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

const FormNewPassword = (props) => {
    const [loading, setLoading] = React.useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [message, setMessage] = React.useState(false);
    const [type, setType] = React.useState("error");
    const [showPass2, setShowPass2] = React.useState(false);
    const [showPass3, setShowPass3] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState(false);
  
    const handleChgPassword = (params) => {
      setLoading(true);
      axios
      .post(`/user/changePasswordSubmit`, params)
      .then((res) => {
        if (res) {
            setType("success");
            setOpenSnack(true);
            setMessage("Change password was successful.");
            setTimeout(() => {
              window.location.replace("/login")
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
                ? `${
                    error.response.data.message ||
                    "Something wrong with our server, please try again later.."
                  }`
                : "Something wrong with our server, please try again later.."
            );
          }
        });
    };
  
    const handleSubmitForgot = (e, i) => {
      handleChgPassword({
        newPassword: e.newPassword,
        key: props.keyOTP,
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
        marginTop: 3
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
      Please enter new password
    </Components.Mui.Typography>
    <Components.Mui.Box marginBottom="15px" />
    {/* form */}
    <Components.Formik.Formik
      initialValues={{
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={SignInSchemaPassword}
      onSubmit={(values) => {
        handleSubmitForgot(values);
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

          <Components.Mui.Box
            sx={{ display: "flex", flexDirection: "row", pt: 2 }}
          >
            <Components.Mui.Button
              color="inherit"
              disabled={props.activeStep === 0}
              onClick={props.handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Components.Mui.Button>
            <Components.Mui.Box sx={{ flex: "1 1 auto" }} />

            <Components.Mui.Button
                // onClick={handleSubmitForgot}
                type='submit'
              disabled={!isValid || loading}
              variant="contained"
            >
              {props.activeStep === props.steps.length - 1
                ? "Submit"
                : "Next"}
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
  )
}

export default FormNewPassword