import React from "react";

// helpers
import Components from "./components/helper";
import theme from "./components/theme";

export default function Root(props) {
  const {
    open,
    width,
    title,
    body,
    variant,
    handleOk,
    handleCancel,
    bodyProps,
    loading,
    labelYes,
  } = props;

  let tenantSetting = props.getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);
  const variantImg = (variantParam) => {
    switch (variantParam) {
      case "transfer":
        return `${window.ASSET_URL}${
          tenantSetting ? tenantSetting.custom_path : ""
        }/images/transfer.svg`;
      case "merge":
        return `${window.ASSET_URL}${
          tenantSetting ? tenantSetting.custom_path : ""
        }/images/transfer.svg`;
      case "end":
        return `${window.ASSET_URL}${
          tenantSetting ? tenantSetting.custom_path : ""
        }/images/end_session.svg`;
      case "csat":
        return `${window.ASSET_URL}${
          tenantSetting ? tenantSetting.custom_path : ""
        }/images/end_session.svg`;
    }
  };

  const [isSendCsat, setIsSendCsat] = React.useState(false);
  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Dialog open={open} onClose={handleCancel}>
        <Components.Mui.Box sx={{ width: width || 300, padding: 2 }}>
          <center>
            <img src={variantImg(variant)} alt="icon" width="150px" />
          </center>

          {title && (
            <Components.Mui.Typography variant="h4" align="center" gutterBottom>
              {title}
            </Components.Mui.Typography>
          )}

          {variant === "csat" ? (
            <Components.Mui.Typography
              align="center"
              variant="body2"
              {...bodyProps}
              gutterBottom
            >
              <Components.Mui.FormControlLabel
                control={
                  <Components.Mui.Checkbox
                    checked={isSendCsat}
                    onChange={(e) => {
                      setIsSendCsat(e.target.checked);
                    }}
                  />
                }
                label={
                  <Components.Mui.Typography sx={{ fontSize: "14px" }}>
                    Send CSAT/SURVEY
                  </Components.Mui.Typography>
                }
              />
            </Components.Mui.Typography>
          ) : body ? (
            <Components.Mui.Typography
              align="center"
              variant="body2"
              {...bodyProps}
              gutterBottom
            >
              {body}
            </Components.Mui.Typography>
          ) : null}

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
              onClick={handleCancel}
            >
              No
            </Components.Mui.Button>
            <Components.Mui.Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "70px !important" }}
              onClick={async () => {
                await handleOk(isSendCsat, variant);
                handleCancel();
              }}
              disabled={loading}
            >
              {labelYes || "Yes"}
            </Components.Mui.Button>
          </Components.Mui.Box>
        </Components.Mui.Box>
      </Components.Mui.Dialog>
    </Components.Mui.ThemeProvider>
  );
}
