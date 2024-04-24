import React from "react";
import Parcel from "single-spa-react/parcel";
// helpers
import Components from "./components/helper";
//import ReCAPTCHA from "react-google-recaptcha";
import theme from "./components/theme";
const UpdateProfileSchema = Components.Yup.object().shape({
  email: Components.Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  fullname: Components.Yup.string().required("Name is required"),
  nickname: Components.Yup.string().required("Nickname is required"),
  phone: Components.Yup.string().required("Phone is required"),
});

function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [type, setType] = React.useState("error");
  const [initialValues, setInitialValues] = React.useState({
    email: props.isAuthenticated()?.user.email,
    fullname: props.isAuthenticated()?.user.name,
    nickname: props.isAuthenticated()?.user.nickname,
    phone: props.isAuthenticated()?.user.phone,
  });
  const axios = window.axios.default;
  React.useEffect(() => {
    axios
      .get(`/user/detail/${props.isAuthenticated()?.user.id}`)
      .then((res) => {
        if (res) {
          setInitialValues({
            email: res.data.email,
            fullname: res.data.fullname,
            nickname: res.data.nickname,
            phone: res.data.phone,
          });
        }
      });
  }, []);
  const handleUpdate = (params) => {
    setLoading(true);
    axios
      .put(`/user/${props.isAuthenticated()?.user.id}`, params)
      .then((res) => {
        if (res) {
          setType("success");
          const storage = props.getStorage("h/zkD4TZprsOwTyHV2rxgg==", true);
          storage.user.email = params.email;
          storage.user.nickname = params.nickname;
          storage.user.name = params.fullname;
          storage.user.phone = params.phone;
          props.setStorage("h/zkD4TZprsOwTyHV2rxgg==", storage, true);
          setLoading(false);
          setOpenSnack(true);
          setMessage("Success update profile.");
          props.handleClose();
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
      <Components.Formik.Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={UpdateProfileSchema}
        onSubmit={(values) => {
          handleUpdate(values);
        }}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          setFieldValue,
        }) => (
          <Components.Formik.Form onSubmit={handleSubmit}>
            <Components.Mui.Grid container spacing={1}>
              <Components.Mui.Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Components.Mui.Typography variant="body2" marginBottom={"5px"}>
                  Name
                </Components.Mui.Typography>
                <Components.Mui.OutlinedInput
                  id="fullname-input"
                  type="text"
                  name="fullname"
                  placeholder="Enter your name"
                  size="small"
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fullname}
                  fullWidth
                />
                {touched.fullname && errors.fullname && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.fullname}
                  </Components.Mui.Typography>
                )}
                <Components.Mui.Box marginBottom="15px" />
              </Components.Mui.Grid>
              <Components.Mui.Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Components.Mui.Typography variant="body2" marginBottom={"5px"}>
                  Nick Name
                </Components.Mui.Typography>
                <Components.Mui.OutlinedInput
                  id="nickname-input"
                  type="text"
                  name="nickname"
                  placeholder="Enter Your Nickname"
                  size="small"
                  value={values.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.nickname}
                  fullWidth
                />
                {touched.nickname && errors.nickname && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.nickname}
                  </Components.Mui.Typography>
                )}
                <Components.Mui.Box marginBottom="15px" />
              </Components.Mui.Grid>
            </Components.Mui.Grid>
            <Components.Mui.Grid container spacing={1}>
              <Components.Mui.Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Components.Mui.Typography variant="body2" marginBottom={"5px"}>
                  Phone
                </Components.Mui.Typography>

                <Components.Mui.OutlinedInput
                  id="phone-input"
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  size="small"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  fullWidth
                />
                {touched.phone && errors.phone && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.phone}
                  </Components.Mui.Typography>
                )}
                <Components.Mui.Box marginBottom="15px" />
              </Components.Mui.Grid>
              <Components.Mui.Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Components.Mui.Typography variant="body2" marginBottom={"5px"}>
                  Email
                </Components.Mui.Typography>
                <Components.Mui.OutlinedInput
                  id="email-input"
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  size="small"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  fullWidth
                />
                {touched.email && errors.email && (
                  <Components.Mui.Typography
                    sx={{
                      margin: "5px 0 0 10px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors.email}
                  </Components.Mui.Typography>
                )}
                <Components.Mui.Box marginBottom="15px" />
              </Components.Mui.Grid>
            </Components.Mui.Grid>
            <Components.Mui.Box
              display="flex"
              alignItems="center"
              justifyContent={"center"}
            >
              <Components.Mui.Button
                size="small"
                variant="contained"
                type="submit"
                disabled={!isValid || loading}
                sx={{ marginRight: "10px" }}
              >
                {loading ? "Please wait..." : "Update"}
              </Components.Mui.Button>
              <Components.Mui.Button
                variant="outlined"
                onClick={() => props.handleClose()}
              >
                Cancel
              </Components.Mui.Button>
            </Components.Mui.Box>
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
    </Components.Mui.ThemeProvider>
  );
}
export default Root;
