import React from "react";
// helpers
import Components from "./components/helper";
//import ReCAPTCHA from "react-google-recaptcha";
import theme from "./components/theme";
const AuksFormSchema = Components.Yup.object().shape({
  reason: Components.Yup.string().required("Reason is required"),
});

function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [type, setType] = React.useState("error");
  const [auks, setAuks] = React.useState([]);
  const axios = window.axios.default;
  React.useEffect(() => {
    axios.get("/aux/list").then((res) => setAuks(res?.data ?? []));
  }, []);
  const handleUpdate = (params) => {
    setLoading(true);
    axios
      .post(`/auth/auxLogin`, params)
      .then((res) => {
        if (res) {
          setType("success");
          props.setStorage(
            "fWBOsAkEDa4euU3r1qHWfQ==",
            {
              reason: params.reason,
              lup: new Date(),
            },
            true
          );
          window.location.reload(true);
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
        initialValues={{ reason: "" }}
        validationSchema={AuksFormSchema}
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
          isSubmitting,
          setFieldValue,
          handleSubmit,
        }) => (
          <Components.Formik.Form onSubmit={handleSubmit}>
            <Components.Mui.FormControl
              size="small"
              sx={{ width: "100%", marginBottom: "10px" }}
              error={errors.reason}
            >
              <Components.Mui.InputLabel id="reason">
                Reason
              </Components.Mui.InputLabel>
              <Components.Mui.Select
                labelId="reason"
                id="reason"
                label="Reason"
                onChange={(e) => setFieldValue("reason", e.target.value)}
                onBlur={handleBlur}
                value={values.reason}
              >
                {auks.length > 0
                  ? auks.map((a, b) => (
                      <Components.Mui.MenuItem value={a.name} key={b}>
                        {a.name}
                      </Components.Mui.MenuItem>
                    ))
                  : null}
              </Components.Mui.Select>
              {errors.reason && (
                <Components.Mui.FormHelperText
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  {errors.reason}
                </Components.Mui.FormHelperText>
              )}
            </Components.Mui.FormControl>
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
                {loading ? "Please wait..." : "Submit"}
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
