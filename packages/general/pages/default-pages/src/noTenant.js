import React from "react";
import Parcel from "single-spa-react/parcel";
// helpers
import Components from "./components/helper";
const axios = window.axios.default;
export default function NoTenant(props) {
  const [tenant, setTenant] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertType, setAlertType] = React.useState("");
  const handleSubmit = () => {
    if (tenant) {
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers["x-encrypt"];
      delete axios.defaults.headers["x-time"];
      delete axios.defaults.headers["x-tenant"];
      setLoading(true);
      axios
        .get(`${window.TENANT_API}/api/tenant/${tenant}`)
        .then((res) => {
          setLoading(false);
          if (res.data) {
            if (res.data.is_custom === "1") {
              localStorage.setItem("vbHWO+rgpyh0", 1);
            }

            localStorage.setItem(
              "UBrwj66nplRT/Cy0YpmhyA==",
              res.data?.tenant_id
            );

            const dirtyStorage = res.data;
            if (res.data.color_setting) {
              dirtyStorage.color = JSON.parse(res.data.color_setting);
              props.setStorage("BIjwj21nplRT/Cy0YpmhyB==", dirtyStorage, true);
            }

            props.setStorage("BIjwj21nplRT/Cy0YpmhyC==", dirtyStorage, true);

            props.setStorage("BIjwj21nplRT/Cy0YpmhyA==", res.data.name, false);
            window.location.reload(true);
          } else {
            setAlert("Tenant not valid");
            setAlertType("error");
          }
        })
        .catch((err) => {
          console.log("ERR", err);
          setAlert("Tenant not valid");
          setAlertType("error");
        });
    }
  };

  React.useEffect(() => {
    if (props.isTenant()) {
      if (!props.isAuthenticated()) {
        window.location.href = "/login";
      } else {
        if (localStorage.getItem("fWBOsAkEDa4euU3r1qHWfQ==")) {
          window.location.href = "/aux";
        } else {
          window.location.href = `/dashboard-${props.isAuthenticated()?.user?.level
            }`;
        }
      }
    }
  });
  return (
    <Components.Mui.Box padding={5}>
      <center>
        <img
          src={`${window.ASSET_URL}/images/undraw-access-denied-re-awnf-1.png`}
          alt="No Tenant"
          width="80%"
        />
      </center>
      <Components.Mui.Typography
        variant="body2"
        align="center"
        color="#91989C"
        gutterBottom
        marginBottom="10px"
      >
        The tenant you are looking for is empty. <br /> Please input the tenant
        code
      </Components.Mui.Typography>
      <Components.Mui.OutlinedInput
        id="tenant-input"
        type="text"
        name="tenant"
        placeholder="Enter Tenant Code"
        size="small"
        value={tenant}
        onChange={(e) => setTenant(e.target.value)}
        fullWidth
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.keyCode === 13 || e.charCode === 13) {
            handleSubmit();
          }
        }}
      />
      <Components.Mui.Button
        variant="contained"
        fullWidth
        style={{ marginTop: 10 }}
        disabled={loading}
        onClick={() => handleSubmit()}
      >
        {loading ? "Please wait..." : "Submit"}
      </Components.Mui.Button>
      {alert ? (
        <Parcel
          config={() => System.import("@onx/base-alert")}
          wrapWith="div"
          setAlert={(e) => setAlert(e)}
          setAlertType={(e) => setAlertType(e)}
          alert={alert}
          alertType={alertType}
        />
      ) : null}
    </Components.Mui.Box>
  );
}
