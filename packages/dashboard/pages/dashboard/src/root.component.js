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
    // if (!props.isTenant()) {
    //   window.location.href = "/login";
    // } else {
    if (props.isAuthenticated()) {
      const storage = props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true);
      if (storage) {
        const parseMenu = storage;
        const menuSpecificLevel = parseMenu.filter(
          (val) =>
            val.application === null ||
            (val.application === "marketer" && props.isAuthenticated()?.user?.is_marketer) ||
            (val.application === "service" && props.isAuthenticated()?.user?.is_service) ||
            (val.application === "sales" && props.isAuthenticated()?.user?.is_sales)
        );

        if (menuSpecificLevel.length > 0) {
          window.location.href = `${menuSpecificLevel[0]?.path}`;
        } else {
          window.location.href = `/dashboard-agent`;
        }
      } else {
        if (props.isAuthenticated()?.user?.is_2fa) {
          setOpen2fa(true);
        }
      }
    }
    // }
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
      dashboard
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
