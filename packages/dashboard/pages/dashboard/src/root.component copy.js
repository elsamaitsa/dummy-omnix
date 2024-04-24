import React from "react";
import Parcel from "single-spa-react/parcel";
// helpers
import Components from "./components/helper";
import theme from "./components/theme";

function Dashboard(props) {
  const [type, setType] = React.useState(1);
  const [startDate, setStartDate] = React.useState(
    window
      .moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISOString()
  );
  const [endDate, setEndDate] = React.useState(new Date().toISOString());

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
          if (props.isAuthenticated()?.user.is_service) {
            setType(1);
            loadData(1);
          } else if (props.isAuthenticated()?.user.is_sales) {
            setType(2);
            loadData(2);
          } else {
            setType(3);
            loadData(3);
          }

          if (props.getStorage("fWBOsAkEDa4euU3r1qHWfQ==", true)) {
            window.location.href = "/aux";
          } else {
            const storage = props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true);
            const filterAccess = storage.filter(
              (v) => v.path?.indexOf("/dashboard-agent") > -1
            );
            if (filterAccess.length === 0) {
              window.location.href = `/404`;
            }
          }
        }
      }
    }
    props.getChannelList();
  }, []);

  // React.useEffect(() => {
  //   loadData();
  // }, [type]);

  const loadData = (typeTab = type) => {
    if (typeTab === 1) {
      props.getPerfomance({ startDate, endDate });
      props.getIntervalChannel({
        startDate,
        endDate,
        channel: props.intervalChannel.channel,
      });
      props.getSummaryChannel({ startDate, endDate });
      props.getStatusTicket({ startDate, endDate });
    } else if (typeTab === 2) {
      props.getSummaryStatusCall({ startDate, endDate });
      props.getSummaryReason({ startDate, endDate });
      props.getSummarySubReason({ startDate, endDate });
      props.getStatusCall({ startDate, endDate });
      props.getStatusCallCampaign({ startDate, endDate })
    } else {
      props.getMarketerSummaryChannel({ startDate, endDate });
    }
  };

  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Box display="flex" bgcolor="#f1f2f4">
        <Components.Mui.CssBaseline />
        <Components.Mui.Box width="4.5vw" height="100vh">
          <Parcel
            config={() => System.import("@onx/sidebar")}
            wrapWith="div"
            isAuthenticated={props.isAuthenticated}
            getStorage={props.getStorage}
            setStorage={props.setStorage}
          />
        </Components.Mui.Box>
        <Components.Mui.Box
          width="95.5vw"
          height="100vh"
          padding="20px"
          sx={{ overflowY: "auto" }}
        >
          <Components.Mui.Grid
            container
            spacing={type !== 2 ? 3 : 2}
            alignItems="flex-end"
          >
            {/* HEADER DASBOARD  */}
            <Components.Mui.Grid item lg={12}>
              <Components.Mui.Grid
                container
                alignContent="center"
                justifyContent="space-between"
              >
                <Components.Mui.Grid item>
                  <Components.Mui.Typography
                    variant="h5"
                    sx={{
                      color: "#000000",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Dashboard
                  </Components.Mui.Typography>
                  <Components.Mui.Typography
                    variant="body2"
                    sx={{ color: "#91989C", fontSize: "14px" }}
                  >
                    Hi, {props.isAuthenticated()?.user?.name}! Here your
                    summary.
                  </Components.Mui.Typography>
                </Components.Mui.Grid>
                <Components.Mui.Grid item>
                  <Components.Mui.Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Components.Mui.FormControl
                      sx={{ width: 150, bgcolor: "#fff" }}
                      size="small"
                    >
                      <Components.Mui.InputLabel id="type-select">
                        Variant
                      </Components.Mui.InputLabel>
                      <Components.Mui.Select
                        labelId="type-select"
                        id="type-select"
                        label="Variant"
                        onChange={(e) => {
                          setType(e.target.value);
                          loadData(e.target.value);
                        }}
                        value={type}
                      >
                        {props.isAuthenticated()?.user?.is_service && (
                          <Components.Mui.MenuItem value={1}>
                            Service
                          </Components.Mui.MenuItem>
                        )}
                        {props.isAuthenticated()?.user?.is_sales && (
                          <Components.Mui.MenuItem value={2}>
                            Sales
                          </Components.Mui.MenuItem>
                        )}
                        {props.isAuthenticated()?.user?.is_marketer && (
                          <Components.Mui.MenuItem value={3}>
                            Marketer
                          </Components.Mui.MenuItem>
                        )}
                      </Components.Mui.Select>
                    </Components.Mui.FormControl>
                    <Components.Mui.TextField
                      type="datetime-local"
                      size="small"
                      sx={{ bgcolor: "#fff" }}
                      value={window
                        .moment(startDate)
                        .format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => {
                        e.preventDefault();
                        setStartDate(
                          window.moment(e.target.value).toISOString()
                        );
                      }}
                    />
                    <Components.Mui.TextField
                      type="datetime-local"
                      size="small"
                      sx={{ bgcolor: "#fff" }}
                      value={window.moment(endDate).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => {
                        e.preventDefault();
                        setEndDate(window.moment(e.target.value).toISOString());
                      }}
                    />
                    <Components.Mui.Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => loadData()}
                    >
                      Filter
                    </Components.Mui.Button>
                  </Components.Mui.Box>
                </Components.Mui.Grid>
              </Components.Mui.Grid>
            </Components.Mui.Grid>
            {/* END HEADER DASBOARD  */}
            {type === 1 && (
              <>
                <Components.Mui.Grid item lg={6} sm={12}>
                  <Parcel
                    config={() =>
                      System.import("@onx/dashboard-agent-perfomance")
                    }
                    wrapWith="div"
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
                <Components.Mui.Grid item lg={6} sm={12}>
                  <Components.Mui.Box>
                    <Parcel
                      config={() =>
                        System.import("@onx/dashboard-summary-channel")
                      }
                      wrapWith="div"
                      getStorage={props.getStorage}
                      setStorage={props.setStorage}
                    />
                  </Components.Mui.Box>
                </Components.Mui.Grid>
                <Components.Mui.Grid item lg={6} sm={12}>
                  <Parcel
                    config={() => System.import("@onx/dashboard-status-ticket")}
                    wrapWith="div"
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
                <Components.Mui.Grid item lg={6} sm={12}>
                  <Parcel
                    config={() =>
                      System.import("@onx/dashboard-interval-channel")
                    }
                    wrapWith="div"
                    onChangeChannel={(e) => {
                      props.getIntervalChannel({
                        startDate,
                        endDate,
                        channel: e,
                      });
                    }}
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
              </>
            )}
            {type === 2 && (
              <>
                <Components.Mui.Grid item lg={4} sm={12}>
                  <Parcel
                    config={() => System.import("@onx/dashboard-total-call")}
                    wrapWith="div"
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
                <Components.Mui.Grid item lg={8} sm={12}>
                  <Parcel
                    config={() => System.import("@onx/dashboard-summary-call")}
                    wrapWith="div"
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
                <Components.Mui.Grid item sm={12}>
                  <Parcel
                    config={() =>
                      System.import("@onx/dashboard-sales-campaign")
                    }
                    wrapWith="div"
                    getStorage={props.getStorage}
                    setStorage={props.setStorage}
                  />
                </Components.Mui.Grid>
              </>
            )}
            {type === 3 && (
              <Components.Mui.Box
                paddingY="3vh"
                // height="100vh"
                width="100%"
                bgcolor="#F4F5F7"
                padding={2}
              >
                <Parcel
                  config={() => System.import("@onx/admin-dashboard-marketers")}
                  wrapWith="div"
                  getStorage={props.getStorage}
                  setStorage={props.setStorage}
                />
              </Components.Mui.Box>
            )}
          </Components.Mui.Grid>
        </Components.Mui.Box>
      </Components.Mui.Box>
    </Components.Mui.ThemeProvider>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getChannelList: (data) =>
      dispatch({ type: "CHANNEL_LIST_GET", channel: data }),
    getPerfomance: (data) =>
      dispatch({ type: "GET_AGENT_PERFOMANCE", data: data }),
    getIntervalChannel: (data) =>
      dispatch({ type: "GET_INTERVAL_CHANNEL", data: data }),
    getSummaryChannel: (data) =>
      dispatch({ type: "GET_SUMMARY_CHANNEL", data: data }),
    getStatusTicket: (data) =>
      dispatch({ type: "GET_STATUS_TICKET", data: data }),
    getStatusCall: (data) => dispatch({ type: "GET_TOTAL_CALL", data: data }),
    getStatusCallCampaign: (data) => dispatch({ type: "GET_STATUS_CALL_CAMPAIGN", data: data }),
    getSummaryStatusCall: (data) =>
      dispatch({ type: "GET_SUMMARY_STATUS_CALL", data: data }),
    getSummaryReason: (data) =>
      dispatch({ type: "GET_SUMMARY_REASON", data: data }),
    getSummarySubReason: (data) =>
      dispatch({ type: "GET_SUMMARY_SUB_REASON", data: data }),
    getMarketerSummaryChannel: (data) =>
      dispatch({ type: "GET_MARKETER_SUMMARY_CHANNEL", data: data }),
  };
};

const mapStateToProps = (state) => {
  return { ...state };
};
export default Components.ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
