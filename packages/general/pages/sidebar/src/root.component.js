import React from "react";
import Parcel from "single-spa-react/parcel";
// helpers
import Components from "./components/helper";
// icons
import Key from "@mui/icons-material/FollowTheSigns";
import LockRounded from "@mui/icons-material/Lock";
import Logout from "@mui/icons-material/NoMeetingRoom";
import Warning from "@mui/icons-material/Warning";
import theme from "./components/theme";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardTwoTone from "@mui/icons-material/ArrowForward";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import SecurityIcon from "@mui/icons-material/Security";
import ImageIcon from "@mui/icons-material/Image";
import HelpIcon from "@mui/icons-material/Help";
import CloudIcon from "@mui/icons-material/CloudQueue";
// import helper from "./components/helper";
// import NewRelic from "new-relic-agent-react";

const axios = window.axios.default;

let secondary = [
  {
    name: "Notifications",
    path: "#notification",
    link_icon: `${window.ASSET_URL}/images/notification.svg`,
  },
  {
    name: "Setting",
    path: "#account",
    link_icon: `${window.ASSET_URL}/images/setting.svg`,
  },
];

export { secondary };

const closedMixin = (v) => ({
  transition: v.transitions.create("width", {
    easing: v.transitions.easing.sharp,
    duration: v.transitions.duration.leavingScreen,
  }),
  borderRight: "none",
  overflowX: "hidden",
  width: "65px",
  backgroundColor: v.palette.primary.dark,
  [v.breakpoints.up("sm")]: {
    width: "65px",
  },
});

const DrawerHeader = Components.Mui.styled("div")((v) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: v.theme.spacing(0, 1),
  backgroundColor: v.theme.palette.primary.light,
  borderRight: "none !important",
  // necessary for content to be below app bar
  ...v.theme.mixins.toolbar,
}));

const Drawer = Components.Mui.styled(Components.Mui.Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})((v) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRight: "none",
  ...(!v.open && {
    ...closedMixin(v.theme),
    "& .MuiDrawer-paper": closedMixin(v.theme),
  }),
}));

function root(props) {
  const navigate = (path) => {
    if (path === "/interaction") {
      window.location.replace(path);
    } else {
      window.singleSpaNavigate(path);
    }
  };
  const [menu, setMenu] = React.useState([]);
  const [current, setCurrent] = React.useState(window.location.pathname);
  const [anchorElProfile, setAnchorElProfile] = React.useState(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const [anchorElIpscae, setAnchorElIpscape] = React.useState(null);
  const [openModalAccount, setOpenModalAccount] = React.useState(false);
  const [openModalAuks, setOpenModalAuks] = React.useState(false);
  const [openModalNotif, setOpenModalNotif] = React.useState(false);
  const [detailNotif, setDetailNotif] = React.useState(false);
  const [openModalResetPassword, setOpenModalResetPassword] =
    React.useState(false);
  const [openModalExpired, setOpenModalExpired] = React.useState(false);
  const [openModalLogout, setOpenModalLogout] = React.useState(false);
  const [openForceLogout, setForceLogout] = React.useState(false);
  const [lightBox, setLightBox] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openModal2fa, setOpenModal2fa] = React.useState(false);
  const [qr2fa, setQr2fa] = React.useState(false);
  const [token2fa, setToken2fa] = React.useState(false);
  const [hidePopup, setHidePopup] = React.useState(false);
  const [hidePopupVideoCall, setHidePopupVideoCall] = React.useState(false);
  const [notification, setNotification] = React.useState([]);
  const openNotification = Boolean(anchorElNotification);
  const openProfile = Boolean(anchorElProfile);
  const [disabledButton, setDisabledButton] = React.useState(true);
  const [showIframe, setShowIframe] = React.useState(false);

  const dateStart = window.moment(
    props.isAuthenticated()?.dateExpired,
    "YYYY-MM-DD"
  );
  const dateEnd = window.moment(new Date(), "YYYY-MM-DD");
  const iframeRef = React.useRef(null);
  React.useEffect(() => {
    if (props.getStorage("e2g7ooGzLTllsrEjL2aAyQ==", false) === "ipscape") {
      secondary = [
        {
          name: "Notifications",
          path: "#notification",
          link_icon: `${window.ASSET_URL}/images/notification.svg`,
        },
        {
          name: "IPScape",
          path: "#ipscape",
          link_icon: "",
        },
        {
          name: "Setting",
          path: "#account",
          link_icon: `${window.ASSET_URL}/images/setting.svg`,
        },
      ];
    }
    window.ipscape?.integrate.onReady((response) => {
      setDisabledButton(false);
      window.ipscape.integrate.getAgentState((response) => {
        const rs = JSON.parse(response);
        if (rs.result === "Connection") {
          setShowIframe(true);
        } else {
          setShowIframe(false);
        }
      });
    });
    axios.interceptors.response.use(
      (response) => {
        // if (response?.data?.message) {
        //props.setAlertType("success");
        //props.setAlert("Success"); //response?.data?.message
        // }
        return response;
      },
      (error) => {
        if (error) {
          props.setAlertType("error");
          if (error?.response?.data?.message === "#pickup") {
            props.setAlertType("error");
            props.setAlert("This ticket has been handled by other user");
            props.getTicketStatus();
            props.setTicketForm(null);
            props.setTicketDetail(null);
            props.setTicketHistory([]);
            props.setTicketJourney([]);
            props.getTicketList({ status_id: 0, page: 1 });
          } else {
            if (error.response.status === 500) {
              props.setAlert("Internal server error..");
            } else if (error.response.status === 501) {
              props.setAlert("Not implemented..");
            } else if (error.response.status === 502) {
              props.setAlert("Bad gateway..");
            } else if (error.response.status === 503) {
              props.setAlert("Service unavailable..");
            } else if (error.response.status === 504) {
              props.setAlert("Gateway timeout..");
            } else if (error.response.status === 505) {
              props.setAlert("HTTP version not supported");
            } else if (error.response.status === 506) {
              props.setAlert("Variant also negotiates..");
            } else if (error.response.status === 507) {
              props.setAlert("Insufficient Storage..");
            } else if (error.response.status === 508) {
              props.setAlert("Loop Detected..");
            } else if (error.response.status === 510) {
              props.setAlert("Not Extended..");
            } else if (error.response.status === 511) {
              props.setAlert("Network Authentication Required");
            } else {
              if (
                error.response.status === 422 &&
                error.response.data.message ===
                  "Customer Consent NOK dan perlu Renewal Contract"
              ) {
                props.setAlertType("warning");
                props.setAlert(
                  error.response
                    ? `${
                        error.response.data.message ||
                        "Something wrong with our server, please try again later.."
                      }`
                    : "Something wrong with our server, please try again later.."
                );
              } else if (
                error.response.status === 422 &&
                error.response.data.message ===
                  "Customer Consent Inprogress – Check Menu New Paperless myCX"
              ) {
                props.setAlertType("warning");
                props.setAlert(
                  error.response
                    ? `${
                        error.response.data.message ||
                        "Something wrong with our server, please try again later.."
                      }`
                    : "Something wrong with our server, please try again later.."
                );
              } else if (
                error.response.status >= 400 &&
                error.response.status <= 499
              ) {
                props.setAlertType("warning");
                props.setAlert(
                  error.response
                    ? `${
                        error.response.data.message ||
                        "Something wrong with our server, please try again later.."
                      }`
                    : "Something wrong with our server, please try again later.."
                );
              } else {
                props.setAlertType("error");
                props.setAlert(
                  error.response
                    ? `${
                        error.response.data.message ||
                        "Something wrong with our server, please try again later.."
                      }`
                    : "Something wrong with our server, please try again later.."
                );
              }
            }
          }
          if (error.response.status === 401) {
            setForceLogout(true);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  React.useEffect(() => {
    if (
      props.channel === 1 &&
      window.location.href.indexOf("/interaction") > -1
    ) {
      setHidePopup(true);
    } else {
      setHidePopup(false);
    }
  }, [props.channel]);

  React.useEffect(() => {
    if (localStorage.getItem("t18CBZ2a2oiFK9WwUCYsuw==")) {
      const storage = props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true);
      setMenu(storage);
    }

    document.title = `${props.getStorage(
      "BIjwj21nplRT/Cy0YpmhyA==",
      false
    )} | Omnix`;

    if (
      dateStart.startOf("day").diff(dateEnd.startOf("day"), "days") > 0 &&
      dateStart.startOf("day").diff(dateEnd.startOf("day"), "days") <= 7 &&
      !localStorage.getItem("remind_later")
    ) {
      setOpenModalExpired(true);
    }
    axios
      .get("/news?sortBy=id&sortType=DESC&limit=10&page=1&term=%20")
      .then((res) => setNotification(res?.data ?? []));
  }, []);

  React.useEffect(() => {
    if (openModal2fa) {
      axios.get(`/auth/generateQR`, { responseType: "blob" }).then((res) => {
        if (res) {
          var reader = new window.FileReader();
          reader.readAsDataURL(res.data);
          reader.onload = function () {
            var imageDataUrl = reader.result;
            setQr2fa(imageDataUrl);
          };
        }
      });
    }
  }, [openModal2fa]);

  const downloadURI = (uri, name) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement("a");
      tag.href = imageUrl;
      tag.download = name;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  };
  let tenantSetting = props.getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);

  return (
    <Components.Mui.ThemeProvider theme={theme}>
      {/* <NewRelic
        licenseKey="ca2a453aa97d365c39e60519605432fa535eNRAL"
        applicationID="503291787"
      /> */}

      {props.isMobile ? (
        <>
          <Components.Mui.IconButton onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </Components.Mui.IconButton>
          <Components.Mui.SwipeableDrawer
            anchor={"left"}
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
          >
            <Components.Mui.Box sx={{ width: "250px" }} role="presentation">
              <Components.Mui.Box
                padding="10px"
                display="flex"
                alignItems="center"
              >
                <Components.Mui.Box
                  sx={{ background: (v) => v.palette.primary.light }}
                >
                  <img
                    src={`${window.ASSET_URL}${
                      tenantSetting ? tenantSetting.custom_path : ""
                    }/images/omnix-icon-white.png`}
                    alt="service"
                    height="45px"
                  />
                </Components.Mui.Box>
                <Components.Mui.Box display="flex" flexDirection="column">
                  <Components.Mui.Typography
                    sx={{
                      fontSize: "12px",
                      marginLeft: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    OmniX
                  </Components.Mui.Typography>
                  <Components.Mui.Typography
                    sx={{
                      fontSize: "10px",
                      marginLeft: "10px",
                      color: "#9e9e9e",
                    }}
                  >
                    Version {window.VERSION}
                  </Components.Mui.Typography>
                </Components.Mui.Box>
              </Components.Mui.Box>
              <Components.Mui.Divider />
              <Components.Mui.List>
                {menu?.length > 0
                  ? menu?.slice(0, 1)?.map((text, index) => (
                      <React.Fragment key={index}>
                        <Components.Mui.ListItem
                          button
                          onClick={() => {
                            setCurrent(text.path);
                            navigate(text.path);
                          }}
                        >
                          <Components.Mui.ListItemIcon>
                            <img
                              src={text.link_icon}
                              style={{
                                objectFit: "contain",
                                width: val.menu === "Interaction" ? 20 : 25,
                              }}
                            />
                          </Components.Mui.ListItemIcon>
                          <Components.Mui.ListItemText
                            primary={
                              <Components.Mui.Typography
                                sx={{
                                  fontSize: "12px",
                                }}
                              >
                                {text.menu}
                              </Components.Mui.Typography>
                            }
                          />
                        </Components.Mui.ListItem>
                        <Components.Mui.Divider />
                      </React.Fragment>
                    ))
                  : null}
                {secondary.map((text, index) => (
                  <React.Fragment key={index}>
                    <Components.Mui.ListItem
                      button
                      onClick={(e) => {
                        if (text.path === "#notification") {
                          setAnchorElNotification(e.currentTarget);
                        } else if (text.path === "#account") {
                          setOpenModalAccount(true);
                        }
                      }}
                    >
                      <Components.Mui.ListItemIcon>
                        {text.name === "IPScape" ? (
                          <CloudIcon />
                        ) : (
                          <img
                            src={text.link_icon}
                            style={{ objectFit: "contain", width: 25 }}
                          />
                        )}
                      </Components.Mui.ListItemIcon>
                      <Components.Mui.ListItemText
                        primary={
                          <Components.Mui.Box sx={{ display: "flex" }}>
                            <Components.Mui.Typography
                              sx={{ fontSize: "12px" }}
                            >
                              {text.name}
                            </Components.Mui.Typography>
                            {text.name === "Notifications" ? (
                              <Components.Mui.Box
                                sx={{
                                  background: "red",
                                  padding: "0 5px 0 5px",
                                  fontSize: "9px",
                                  color: "#fff",
                                  borderRadius: "100%",
                                  marginLeft: "auto",
                                  minWidth: "10px",
                                  minHeight: "10px",
                                  textAlign: "center",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {notification?.totalItems ?? 0}
                              </Components.Mui.Box>
                            ) : null}
                          </Components.Mui.Box>
                        }
                      />
                    </Components.Mui.ListItem>
                    <Components.Mui.Divider />
                  </React.Fragment>
                ))}
              </Components.Mui.List>
            </Components.Mui.Box>
          </Components.Mui.SwipeableDrawer>
        </>
      ) : (
        <>
          <Components.Mui.CssBaseline />
          <Drawer variant="permanent">
            <DrawerHeader>
              <Components.Mui.IconButton>
                <img
                  src={`${window.ASSET_URL}${
                    tenantSetting ? tenantSetting.custom_path : ""
                  }/images/omnix-icon-white.png`}
                  alt="service"
                  height="45px"
                />
              </Components.Mui.IconButton>
            </DrawerHeader>
            <Components.Mui.List>
              {menu?.map((val, index) => (
                <Components.Mui.Tooltip title={val.name} arrow>
                  <Components.Mui.ListItem
                    button
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      paddingBottom: 0.7,
                    }}
                    key={index}
                    onClick={() => {
                      setCurrent(val.path);
                      navigate(val.path);
                    }}
                  >
                    <Components.Mui.ListItemIcon
                      sx={{
                        minWidth: "15px",
                        padding: 1,
                        borderRadius: 1.5,
                        bgcolor: (v) =>
                          current === val.path
                            ? v.palette.primary.light
                            : "transparent",
                        color: (v) =>
                          current === val.path
                            ? v.palette.primary.contrastText
                            : "#998CE7",
                        "& svg": {
                          fontSize: "22px",
                        },
                      }}
                    >
                      <img
                        src={val.link_icon}
                        style={{
                          objectFit: "contain",
                          width: val.menu === "Interaction" ? 20 : 25,
                        }}
                      />
                    </Components.Mui.ListItemIcon>
                  </Components.Mui.ListItem>
                </Components.Mui.Tooltip>
              ))}
            </Components.Mui.List>

            <Components.Mui.List sx={{ marginTop: "auto" }}>
              {localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==") ===
                "onx_bkpm" && (
                <Components.Mui.ListItem
                  button
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    paddingBottom: 0.7,
                  }}
                  onClick={(e) => {
                    // setOpenFaq(true);
                    window.open("http://10.194.179.100/diana/login", true);
                  }}
                >
                  <Components.Mui.ListItemIcon
                    sx={{
                      minWidth: "15px",
                      padding: 1,
                      borderRadius: 1.5,
                      bgcolor: "transparent",
                      color: "998CE7",
                      "& svg": {
                        fontSize: "22px",
                      },
                    }}
                  >
                    <Components.Mui.Tooltip
                      title="FAQ"
                      placement="right-start"
                      arrow
                    >
                      <HelpIcon htmlColor="#fff" />
                    </Components.Mui.Tooltip>
                  </Components.Mui.ListItemIcon>
                </Components.Mui.ListItem>
              )}

              {secondary.map((val, index) => (
                <Components.Mui.ListItem
                  button
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    paddingBottom: 0.7,
                  }}
                  key={index}
                  onClick={(e) => {
                    if (val.path === "#notification") {
                      setAnchorElNotification(e.currentTarget);
                    } else if (val.path === "#account") {
                      setAnchorElProfile(e.currentTarget);
                    } else if (val.path === "#ipscape") {
                      setAnchorElIpscape(e.currentTarget);
                    }
                  }}
                >
                  <Components.Mui.ListItemIcon
                    sx={{
                      minWidth: "15px",
                      padding: 1,
                      borderRadius: 1.5,
                      bgcolor: (v) =>
                        current === val.path
                          ? v.palette.primary.light
                          : "transparent",
                      color: (v) =>
                        current === val.path
                          ? v.palette.primary.contrastText
                          : "#998CE7",
                      "& svg": {
                        fontSize: "22px",
                      },
                    }}
                  >
                    {val.name === "Notifications" ? (
                      <Components.Mui.Tooltip title={val.name} arrow>
                        <Components.Mui.Badge
                          badgeContent={notification?.totalItems ?? 0}
                          max={99}
                          color="error"
                        >
                          <img
                            src={val.link_icon}
                            style={{ objectFit: "contain", width: 25 }}
                          />
                        </Components.Mui.Badge>
                      </Components.Mui.Tooltip>
                    ) : val.name === "Setting" ? (
                      <Components.Mui.Avatar
                        sx={{
                          background: window.BASE_THEME.palette.primary.main,
                          width: 37,
                          height: 37,
                        }}
                      >
                        {props.isAuthenticated()?.user.name?.charAt(0)}
                      </Components.Mui.Avatar>
                    ) : (
                      <Components.Mui.Tooltip title={val.name} arrow>
                        {val.name === "IPScape" ? (
                          <CloudIcon style={{ color: "#fff" }} />
                        ) : (
                          <img
                            src={val.link_icon}
                            style={{ objectFit: "contain", width: 25 }}
                          />
                        )}
                      </Components.Mui.Tooltip>
                    )}
                  </Components.Mui.ListItemIcon>
                </Components.Mui.ListItem>
              ))}
            </Components.Mui.List>
          </Drawer>
          <Components.Mui.Box
            sx={{
              height: "100vh",
              py: "2vh",
              px: "1vw",
              width: "100vw",
              overflow: "hidden",
              bgcolor: "#F4F5F7",
            }}
          >
            <Components.Mui.Box>{props.children}</Components.Mui.Box>
          </Components.Mui.Box>
        </>
      )}
      {/* Avatar Menu */}
      <Components.Mui.Menu
        anchorEl={anchorElProfile}
        open={openProfile}
        onClose={() => setAnchorElProfile(null)}
        //onClose={() => setAnchorElProfile(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            ml: 7,
            minWidth: "200px",
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            borderRadius: 5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Components.Mui.Box
          display="flex"
          alignItems="center"
          padding="10px 10px 10px 10px"
          sx={{
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            background: `linear-gradient(180deg, ${window.BASE_THEME.palette.primary.dark} 0%, ${window.BASE_THEME.palette.primary.main} 100%)`,
          }}
        >
          <Components.Mui.Avatar
            sx={{ background: window.BASE_THEME.palette.primary.main }}
          >
            {props.isAuthenticated()?.user.name?.charAt(0)}
          </Components.Mui.Avatar>
          <Components.Mui.Box
            display="flex"
            flexDirection={"column"}
            marginLeft="10px"
          >
            <Components.Mui.Typography
              sx={{ fontSize: "15px", fontWeight: "bold", color: "#fff" }}
            >
              {props.isAuthenticated()?.user.name}
            </Components.Mui.Typography>
            <Components.Mui.Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer" }}
            >
              <Components.Mui.Typography
                sx={{ fontSize: "12px", color: "#fff" }}
                onClick={() => setOpenModalAccount(true)}
              >
                See my profile
              </Components.Mui.Typography>
              <ArrowForwardTwoTone sx={{ fontSize: "12px" }} htmlColor="#fff" />
            </Components.Mui.Box>
          </Components.Mui.Box>
        </Components.Mui.Box>
        <Components.Mui.Box padding="10px 0 10px 0">
          <Components.Mui.MenuItem onClick={() => setOpenModalAuks(true)}>
            <Components.Mui.ListItemIcon>
              <Key fontSize="small" />
            </Components.Mui.ListItemIcon>
            Aux
          </Components.Mui.MenuItem>
          <Components.Mui.MenuItem
            onClick={() => setOpenModalResetPassword(true)}
          >
            <Components.Mui.ListItemIcon>
              <LockRounded fontSize="small" />
            </Components.Mui.ListItemIcon>
            Change Password
          </Components.Mui.MenuItem>
          {!props.isAuthenticated()?.user?.is_2fa ? (
            <Components.Mui.MenuItem onClick={() => setOpenModal2fa(true)}>
              <Components.Mui.ListItemIcon>
                <SecurityIcon fontSize="small" />
              </Components.Mui.ListItemIcon>
              Activate 2FA
            </Components.Mui.MenuItem>
          ) : // <Components.Mui.MenuItem onClick={() => console.log(true)}>
          //   <Components.Mui.ListItemIcon>
          //     <SecurityIcon fontSize="small" />
          //   </Components.Mui.ListItemIcon>
          //   Deactivate 2FA
          // </Components.Mui.MenuItem>
          null}

          <Components.Mui.MenuItem onClick={() => setOpenModalLogout(true)}>
            <Components.Mui.ListItemIcon>
              <Logout fontSize="small" />
            </Components.Mui.ListItemIcon>
            Logout
          </Components.Mui.MenuItem>
        </Components.Mui.Box>
      </Components.Mui.Menu>

      {/* Notification Menu */}
      <Components.Mui.Menu
        anchorEl={anchorElNotification}
        open={openNotification}
        onClose={() => setAnchorElNotification(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            ml: 7,
            minWidth: "200px",
            mt: "-10vh",
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            borderRadius: 5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {/* <Components.Mui.Tabs
          value={tabNotification}
          onChange={handleNotifTab}
          sx={{
            "& .Mui-selected": {
              color: "#403292 !important",
            },
            "& .MuiButtonBase-root": {
              fontSize: "14px",
              textTransform: "capitalize",
              color: "#91989C",
            },
          }}
          centered
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: "#403292" } }}
        >
          <Components.Mui.Tab label={"Notification"} {...a11yProps(0)} />
        </Components.Mui.Tabs> */}

        {/* <TabPanel value={tabNotification} index={0}> */}
        {/* <Components.Mui.Box
          bgcolor="#F8F7FA"
          paddingX={1.5}
          paddingY={0.5}
          border="1px solid #E1E3E5"
        >
          <Components.Mui.Typography variant="body2">
            Today
          </Components.Mui.Typography>
        </Components.Mui.Box> */}

        <Components.Mui.List
          sx={{
            width: "100%",
            maxWidth: 300,
            minWidth: 300,
            bgcolor: "background.paper",
            maxHeight: 300,
            overflowY: "auto",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          {notification?.data?.length > 0 ? (
            notification?.data?.map((val, key) => (
              <React.Fragment key={key}>
                <Components.Mui.ListItem
                  button
                  alignItems="flex-start"
                  onClick={() => {
                    setOpenModalNotif(true);
                    setDetailNotif(val);
                  }}
                >
                  <Components.Mui.ListItemText
                    secondary={
                      <React.Fragment>
                        <Components.Mui.Grid
                          container
                          spacing={1}
                          alignItems="flex-end"
                        >
                          <Components.Mui.Grid item sm={10}>
                            <Components.Mui.Typography
                              variant="body2"
                              sx={{
                                color: "#2D2D2D",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {val?.name}
                            </Components.Mui.Typography>
                            <Components.Mui.Typography
                              variant="body2"
                              color="#2D2D2D"
                              fontSize={"12px"}
                            >
                              {val.message
                                ? val.message
                                    ?.toString()
                                    .split("\n")
                                    .map((msg, key) => (
                                      <span key={key.toString()}>
                                        {msg}
                                        <br />
                                      </span>
                                    ))
                                : ""}
                            </Components.Mui.Typography>
                          </Components.Mui.Grid>
                          <Components.Mui.Grid item sm={2}>
                            <Components.Mui.Box
                              display="flex"
                              justifyContent="flex-end"
                            >
                              <Components.Mui.Typography
                                component="small"
                                color="#91989C"
                                variant="body2"
                              >
                                {val?.date}
                              </Components.Mui.Typography>
                            </Components.Mui.Box>
                          </Components.Mui.Grid>
                        </Components.Mui.Grid>
                      </React.Fragment>
                    }
                  />
                </Components.Mui.ListItem>
                <Components.Mui.Divider />
              </React.Fragment>
            ))
          ) : (
            <Components.Mui.Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
                padding: "30px",
              }}
            >
              <img
                src={`${window.ASSET_URL}${
                  tenantSetting ? tenantSetting.custom_path : ""
                }/images/interaction.png`}
                alt="Empty"
                width={70}
              />
              <Components.Mui.Typography
                sx={{ marginTop: "10px" }}
                component="span"
                variant="body2"
              >
                No data notification...
              </Components.Mui.Typography>
              {/* <Components.Mui.Button
              onClick={() => handlePickup()}
              disabled={props.loading}
            >
              {props.loading ? "Please wait..." : "Pickup"}
            </Components.Mui.Button> */}
            </Components.Mui.Box>
          )}
        </Components.Mui.List>
        {/* </TabPanel> */}

        {/* <TabPanel value={tabNotification} index={1}>
          <Components.Mui.Box paddingX={1}>Not Found...</Components.Mui.Box>
        </TabPanel> */}
      </Components.Mui.Menu>

      {/* Ipscape Menu */}
      <Components.Mui.Menu
        anchorEl={anchorElIpscae}
        open={Boolean(anchorElIpscae)}
        onClose={() => setAnchorElIpscape(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            ml: 7,
            minWidth: "200px",
            minHeight: "200px",
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            borderRadius: 5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <iframe
          ref={iframeRef}
          id="iframe-ipscape"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          src={window.IPSCAPE_AUTH_URL}
          width="330"
          height="500"
          style={{ display: showIframe ? "block" : "none" }}
        ></iframe>

        {!showIframe ? (
          <div
            style={{
              width: "100%",
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Components.Mui.Button
              variant="contained"
              disabled={disabledButton}
              onClick={() => {
                setDisabledButton(true);
                window.ipscape.integrate.login(
                  { user: "agent.demo1", pass: "1Nfomedi@2023" },
                  function (response) {
                    setDisabledButton(false);
                    const rs = JSON.parse(response);
                    if (rs.result) {
                      setShowIframe(true);
                      if (window.ipscape && window.ipscape.integrate) {
                        window.ipscape.integrate.onReady(function () {
                          window.ipscape.integrate.subscribe(
                            ["system"],
                            function (response) {
                              const rs = JSON.parse(response);
                              if (rs.result) {
                                console.log("EVT", rs.result);
                              } else {
                                console.error("ERR", rs.error);
                              }
                            }
                          );
                        });
                      }
                    } else {
                      setShowIframe(false);
                    }
                  }
                );
              }}
            >
              Login Ipscape
            </Components.Mui.Button>
          </div>
        ) : null}
      </Components.Mui.Menu>
      {/* Expired */}
      <Components.Mui.Dialog open={openModalExpired}>
        <Components.Mui.DialogContent sx={{ padding: 0 }}>
          <Components.Mui.Box padding="20px" sx={{ minWidth: "20vw" }}>
            <Warning
              sx={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                margin: "auto",
                fontSize: "90px",
                color: window.BASE_THEME.palette.primary.dark,
                marginBottom: "10px",
              }}
            />
            <Components.Mui.Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ marginBottom: "10px" }}
            >
              Your password will be expired in{" "}
              {dateStart.startOf("day").diff(dateEnd.startOf("day"), "days")}{" "}
              days, please update your password immediately!
            </Components.Mui.Typography>
            <Components.Mui.Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              mt={1.5}
            >
              <Components.Mui.Button
                variant="contained"
                color="primary"
                sx={{ minWidth: "70px !important" }}
                onClick={() => setOpenModalResetPassword(true)}
              >
                Update now
              </Components.Mui.Button>
              <Components.Mui.Button
                variant="contained"
                color="error"
                sx={{ minWidth: "70px !important" }}
                onClick={() => {
                  localStorage.setItem("remind_later", true);
                  setOpenModalExpired(false);
                }}
              >
                Ignore
              </Components.Mui.Button>
            </Components.Mui.Box>
          </Components.Mui.Box>
        </Components.Mui.DialogContent>
      </Components.Mui.Dialog>
      {/* Notif detail*/}
      {openModalNotif ? (
        <Components.Mui.Dialog
          open={openModalNotif}
          onClose={() => {
            setDetailNotif(false);
            setOpenModalNotif(false);
          }}
          sx={{
            "& .MuiPaper-root": {
              overflowY: "unset",
              maxWidth: "unset",
            },
          }}
        >
          <Components.Mui.Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="1px solid #C6CACC"
            paddingX={2}
            paddingY={1}
          >
            <Components.Mui.Typography variant="h5">
              Detail Notification
            </Components.Mui.Typography>
            <Components.Mui.IconButton
              size="small"
              onClick={() => {
                setDetailNotif(false);
                setOpenModalNotif(false);
              }}
            >
              <CloseRoundedIcon size="small" />
            </Components.Mui.IconButton>
          </Components.Mui.Box>

          <Components.Mui.DialogContent
            sx={{ padding: "20px", minWidth: "30vw" }}
          >
            <Components.Mui.Typography
              variant="body2"
              color="#2D2D2D"
              fontSize={"14px"}
              fontWeight="bold"
            >
              {detailNotif?.name}
            </Components.Mui.Typography>
            <Components.Mui.Typography
              variant="body2"
              color="#2D2D2D"
              fontSize={"12px"}
              marginTop="10px"
              marginBottom="10px"
            >
              {detailNotif.message
                ? detailNotif.message
                    ?.toString()
                    .split("\n")
                    .map((msg, key) => (
                      <span key={key.toString()}>
                        {msg}
                        <br />
                      </span>
                    ))
                : ""}
            </Components.Mui.Typography>
            <Components.Mui.Divider />
            {detailNotif?.files
              ? JSON.parse(detailNotif?.files).map((res, fileIdx) => (
                  <Components.Mui.Card
                    sx={{ width: "70%", my: 1 }}
                    key={fileIdx}
                  >
                    <Components.Mui.CardActionArea
                      sx={{ padding: 1, paddingX: 2 }}
                      onClick={() => {
                        res.mimeType.split("/")[0] === "image"
                          ? setLightBox({ data: detailNotif, media: res })
                          : downloadURI(res?.url, res?.fileName);
                      }}
                    >
                      <Components.Mui.Grid
                        container
                        alignItems="center"
                        spacing={1}
                      >
                        <Components.Mui.Grid item sm={1}>
                          {/* content icon */}
                          {res.mimeType.split("/")[0] === "image" ? (
                            <ImageIcon htmlColor="#91989C" />
                          ) : (
                            <FilePresentRoundedIcon htmlColor="#91989C" />
                          )}
                        </Components.Mui.Grid>
                        <Components.Mui.Grid item sm={10}>
                          <Components.Mui.Typography noWrap>
                            &nbsp;{res?.fileName ?? "No name"}
                          </Components.Mui.Typography>
                        </Components.Mui.Grid>
                        <Components.Mui.Grid item sm={1}>
                          <FileDownloadOutlinedIcon htmlColor="#91989C" />
                        </Components.Mui.Grid>
                      </Components.Mui.Grid>
                    </Components.Mui.CardActionArea>
                  </Components.Mui.Card>
                ))
              : null}
          </Components.Mui.DialogContent>
        </Components.Mui.Dialog>
      ) : null}

      {lightBox ? (
        <Components.Mui.Dialog
          open={true}
          sx={{
            "& .MuiPaper-root": {
              overflowY: "unset",
              maxWidth: "unset",
            },
          }}
        >
          <Components.Mui.Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="1px solid #C6CACC"
            paddingX={2}
            paddingY={1}
          >
            <Components.Mui.Typography variant="h5">
              Detail Picture
            </Components.Mui.Typography>
            <Components.Mui.IconButton
              size="small"
              onClick={() => setLightBox(false)}
            >
              <CloseRoundedIcon size="small" />
            </Components.Mui.IconButton>
          </Components.Mui.Box>
          <Components.Mui.DialogContent sx={{ padding: "10px" }}>
            <img
              src={lightBox.media ? lightBox.media.url : ""}
              alt="Lightbox"
              style={{ width: "100vh" }}
              onError={(e) => {
                const axios = window.axios.default;
                axios
                  .put(`/service/email/generateNewUrl`, {
                    interaction_id: lightBox.data.id,
                    interaction_type: "now",
                    token: lightBox.media.token,
                  })
                  .then((res) => {
                    if (res) {
                      if (e && e.currentTarget) {
                        e.currentTarget.onerror = null;
                      }
                      e.target.src = res.data?.data?.url;
                    }
                  });
              }}
            />
          </Components.Mui.DialogContent>
        </Components.Mui.Dialog>
      ) : null}
      {/* Aaux */}
      <Components.Mui.Dialog
        open={openModalAuks}
        onClose={() => setOpenModalAuks(false)}
      >
        <Components.Mui.DialogContent sx={{ padding: 0 }}>
          <Components.Mui.Box padding="20px" sx={{ minWidth: "20vw" }}>
            <Components.Mui.Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ marginBottom: "10px" }}
            >
              Are you sure want to Aux?
            </Components.Mui.Typography>
            <Parcel
              config={() => System.import("@onx/auks-form")}
              wrapWith="div"
              {...props}
              handleClose={() => setOpenModalAuks(false)}
            />
          </Components.Mui.Box>
        </Components.Mui.DialogContent>
      </Components.Mui.Dialog>
      {/* Profile */}
      <Components.Mui.Dialog
        open={openModalAccount}
        onClose={() => setOpenModalAccount(false)}
      >
        <Components.Mui.DialogContent sx={{ padding: 0 }}>
          <Components.Mui.Box
            sx={{
              minWidth: "30vw",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Components.Mui.Box
              sx={{
                background: `linear-gradient(180deg, ${window.BASE_THEME.palette.primary.dark} 0%, ${window.BASE_THEME.palette.primary.main} 100%)`,
              }}
              display={"flex"}
              alignItems={"center"}
              padding="10px 20px 10px 20px"
            >
              <Components.Mui.Avatar
                sx={{ background: window.BASE_THEME.palette.primary.main }}
              >
                {props.isAuthenticated()?.user.name?.charAt(0)}
              </Components.Mui.Avatar>
              <Components.Mui.Box
                display="flex"
                flexDirection="column"
                alignItems={"start"}
                marginLeft={"10px"}
              >
                <Components.Mui.Typography
                  sx={{ fontSize: "15px", color: "#fff", fontWeight: "bold" }}
                >
                  {props.isAuthenticated()?.user.name}
                </Components.Mui.Typography>
                <Components.Mui.Typography
                  sx={{ fontSize: "12px", color: "#fff" }}
                >
                  {props.isAuthenticated()?.user.level}
                </Components.Mui.Typography>
              </Components.Mui.Box>
            </Components.Mui.Box>
            <Components.Mui.Box padding="20px">
              <Parcel
                config={() => System.import("@onx/update-profile")}
                wrapWith="div"
                {...props}
                handleClose={() => setOpenModalAccount(false)}
              />
            </Components.Mui.Box>
            <Components.Mui.Divider />
            <Components.Mui.Box padding="20px">
              <Components.Mui.Typography
                sx={{
                  fontSize: "12px",
                  color: "#294354",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                Password will expired on{" "}
                {window
                  .moment(props.isAuthenticated()?.dateExpired)
                  .format("DD MMM YYYY")}
              </Components.Mui.Typography>
            </Components.Mui.Box>
          </Components.Mui.Box>
        </Components.Mui.DialogContent>
      </Components.Mui.Dialog>
      {/* Reset Password */}

      <Components.Mui.Dialog
        open={
          dateStart.startOf("day").diff(dateEnd.startOf("day"), "days") <= 0
        }
        disableEscapeKeyDown={true}
        maxWidth="xl"
      >
        <Parcel
          config={() => System.import("@onx/change-password-expired")}
          wrapWith="div"
          {...props}
        />
      </Components.Mui.Dialog>
      <Components.Mui.Dialog
        open={openModalResetPassword}
        disableEscapeKeyDown={true}
        maxWidth="xl"
      >
        <Parcel
          config={() => System.import("@onx/change-password-expired")}
          wrapWith="div"
          isReset={true}
          handleClose={() => setOpenModalResetPassword(false)}
          {...props}
        />
      </Components.Mui.Dialog>

      <Components.Mui.Dialog
        open={openModalLogout}
        onClose={() => setOpenModalLogout(false)}
      >
        <Parcel
          config={() => System.import("@onx/logout")}
          wrapWith="div"
          setOpenModalLogout={(e) => setOpenModalLogout(false)}
          {...props}
        />
      </Components.Mui.Dialog>

      <Components.Mui.Dialog
        open={openModal2fa}
        onClose={() => setOpenModal2fa(false)}
      >
        <div style={{ padding: 20 }}>
          <img
            src={qr2fa}
            alt="QR"
            style={{ margin: "auto", display: "block" }}
          />
          <div
            style={{
              fontSize: 12,
              marginBottom: 10,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Please scan QR with Google Authenticator and fill the token below
          </div>
          <Components.Mui.TextField
            placeholder="Token google authenticator"
            sx={{ bgcolor: "#fff", marginBottom: "10px" }}
            onChange={(e) => setToken2fa(e.target.value)}
            fullWidth
          />
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
              onClick={() => setOpenModal2fa(false)}
            >
              Cancel
            </Components.Mui.Button>
            <Components.Mui.Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "70px !important" }}
              onClick={() => {
                axios
                  .post("/auth/turn-on-2fa", {
                    token: token2fa,
                  })
                  .then((res) => {
                    if (res) {
                      let storage = props.getStorage(
                        "h/zkD4TZprsOwTyHV2rxgg==",
                        true
                      );
                      storage.user.is_2fa = true;
                      props.setStorage(
                        "h/zkD4TZprsOwTyHV2rxgg==",
                        storage,
                        true
                      );
                      window.location.reload(true);
                    }
                  });
              }}
            >
              Submit
            </Components.Mui.Button>
          </Components.Mui.Box>
        </div>
      </Components.Mui.Dialog>

      <Components.Mui.Dialog
        open={openForceLogout}
        onClose={() => {
          axios
            .post("/auth/logout", {
              userid: props.isAuthenticated()?.user?.id,
            })
            .then((res) => {
              if (res) {
                setForceLogout(false);
                localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
                localStorage.removeItem("KPwpN5Bjh4Y2N2L1CC4sRQ==");
                localStorage.removeItem("t18CBZ2a2oiFK9WwUCYsuw==");
                localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyQ==");
                localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyR==");
                localStorage.removeItem("fWBOsAkEDa4euU3r1qHWfQ==");
                localStorage.removeItem("face-recognition");
                localStorage.removeItem("bucket-type");
                localStorage.removeItem("video-platform");
                localStorage.removeItem("pabx_ami_url");
                // window.location.reload(true);
                //if (!localStorage.getItem("session")) {
                window.location.href = "/login";
                //}
              }
            });
        }}
      >
        <Components.Mui.Box
          sx={{ width: "25vw" || 300, padding: "30px 10px 30px 10px" }}
        >
          <Logout
            sx={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              margin: "auto",
              fontSize: "90px",
              color: window.BASE_THEME.palette.primary.dark,
              marginBottom: "10px",
            }}
          />

          <Components.Mui.Typography variant="h5" align="center" gutterBottom>
            Your session is expired, please relogin..
          </Components.Mui.Typography>

          <Components.Mui.Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1.5}
          >
            <Components.Mui.Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "70px !important" }}
              onClick={() => {
                axios
                  .post("/auth/logout", {
                    userid: props.isAuthenticated()?.user?.id,
                  })
                  .then((res) => {
                    if (res) {
                      localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
                      localStorage.removeItem("KPwpN5Bjh4Y2N2L1CC4sRQ==");
                      localStorage.removeItem("t18CBZ2a2oiFK9WwUCYsuw==");
                      localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyQ==");
                      localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyR==");
                      localStorage.removeItem("fWBOsAkEDa4euU3r1qHWfQ==");
                      // window.location.reload(true);
                      //if (!localStorage.getItem("session")) {
                      window.location.href = "/login";
                      //}
                    }
                  });
              }}
            >
              Relogin
            </Components.Mui.Button>
          </Components.Mui.Box>
        </Components.Mui.Box>
      </Components.Mui.Dialog>
      {props.alert ? (
        <Parcel
          config={() => System.import("@onx/base-alert")}
          wrapWith="div"
          {...props}
        />
      ) : null}
      {props.statusCall === "RINGING" && !hidePopup ? (
        <Components.Mui.Box
          sx={{
            background: "#1E1745",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            minWidth: "200px",
          }}
        >
          <Components.Mui.Avatar sx={{ background: "transparent" }}>
            <img
              src={`${window.ASSET_URL}${
                tenantSetting ? tenantSetting.custom_path : ""
              }/images/${
                props.statusCall === "RINGING" ? "calling" : "call"
              }.svg`}
              alt="calling"
              style={{ width: 20 }}
            />
          </Components.Mui.Avatar>
          <Components.Mui.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <Components.Mui.Typography sx={{ fontSize: "12px", color: "#fff" }}>
              {props.call.length > 0 ? props.call[3] : "Unknow number"}
            </Components.Mui.Typography>
            <Components.Mui.Typography sx={{ fontSize: "10px", color: "#fff" }}>
              Incoming Call...
            </Components.Mui.Typography>
            <Components.Mui.Button
              sx={{
                backgroundColor: "green",
                color: "#fff",
                textTransform: "none",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "green",
                },
                marginTop: "10px",
              }}
              variant="contained"
              size="small"
              onClick={async () => {
                await setHidePopup(true);
                await props.setStorage(
                  "KPwpN5Bjh4Y2N2L1CC4sRQ==",
                  "voice",
                  false
                );
                await props.setChannel(1);
                await props.setLoading({
                  list_customer: false,
                  list_journey: false,
                  list_journey_ticket: false,
                  log_interaction_body: false,
                  list_log_journey: false,
                  list_log_interaction: false,
                  list_log_detail_ticket: false,
                  list_log_ticket: false,
                  interaction_body: true,
                  submit_case: false,
                  history_interaction: false,
                  list_history_rtc: false,
                  list_group: false,
                  list_user: false,
                  list_case: false,
                  footer_case: false,
                  list_task: true,
                });
                await props.getTask({
                  channel_id: 1,
                  type: "assigned",
                  page: 1,
                  nextPage: 0,
                  sort_type: "DESC",
                });

                if (props.interactionCurrent["voice"]) {
                  await props.setLoading({
                    list_customer: false,
                    list_journey: false,
                    list_journey_ticket: false,
                    log_interaction_body: false,
                    list_log_journey: false,
                    list_log_interaction: false,
                    list_log_detail_ticket: false,
                    list_log_ticket: false,
                    interaction_body: true,
                    submit_case: false,
                    history_interaction: false,
                    list_history_rtc: false,
                    list_group: false,
                    list_user: false,
                    list_case: false,
                    footer_case: false,
                    list_task: false,
                  });
                  await props.getInteraction({
                    code: "voice",
                    session_id: props.interactionCurrent["voice"]?.session_id,
                    type: props.interactionCurrent["voice"]?.date_end
                      ? "history"
                      : "now",
                    cust_id: props.interactionCurrent["voice"]?.cust_id,
                    page: 1,
                    state: props,
                    item: props.interactionCurrent["voice"],
                  });
                }
                window.singleSpaNavigate("/interaction");
              }}
            >
              Open Interaction
            </Components.Mui.Button>
          </Components.Mui.Box>
        </Components.Mui.Box>
      ) : null}

      {props.statusVideoCall === "RINGING" ? (
        <Components.Mui.Box
          sx={{
            background: "#1E1745",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            minWidth: "200px",
          }}
        >
          <Components.Mui.Avatar sx={{ background: "transparent" }}>
            <img
              src={`${window.ASSET_URL}${
                tenantSetting ? tenantSetting.custom_path : ""
              }/images/${
                props.statusVideoCall === "RINGING" ? "calling" : "call"
              }.svg`}
              alt="calling"
              style={{ width: 20 }}
            />
          </Components.Mui.Avatar>
          <Components.Mui.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <Components.Mui.Typography sx={{ fontSize: "12px", color: "#fff" }}>
              {props.videoCall?.from_name}
            </Components.Mui.Typography>
            <Components.Mui.Typography sx={{ fontSize: "10px", color: "#fff" }}>
              Incoming Video Call...
            </Components.Mui.Typography>
            <Components.Mui.Button
              sx={{
                backgroundColor: "green",
                color: "#fff",
                textTransform: "none",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "green",
                },
                marginTop: "10px",
              }}
              variant="contained"
              size="small"
              onClick={async () => {
                // axios
                //   .post(`/service/videocall/incoming`, {
                //     name: props.videoCall?.customer?.name,
                //     email: props.videoCall?.customer.email,
                //     phone: props.videoCall?.customer.phone,
                //     message: props.videoCall?.last_message,
                //     room: props.videoCall?.conv_id,
                //     token: props.videoCall?.token,
                //     date_incoming: props.videoCall?.created_at,
                //     additional_info: props.videoCall?.customer,
                //   })
                //   .then(async (res) => {
                //     if (res) {
                //       await props.setOpenIncomingVideoCall(false);
                //       await props.setStatusVideoCall(false);
                //       const dirtyCurrent = props.interactionCurrent;
                //       dirtyCurrent.videocall = res.data;
                //       await props.setInteractionCurrent(dirtyCurrent);
                //       await setHidePopupVideoCall(true);
                //       await props.setStorage(
                //         "KPwpN5Bjh4Y2N2L1CC4sRQ==",
                //         "videocall",
                //         false
                //       );
                //       await props.setChannel(9);
                //       await props.setLoading({
                //         list_customer: false,
                //         list_journey: false,
                //         list_journey_ticket: false,
                //         log_interaction_body: false,
                //         list_log_journey: false,
                //         list_log_interaction: false,
                //         list_log_detail_ticket: false,
                //         list_log_ticket: false,
                //         interaction_body: true,
                //         submit_case: false,
                //         history_interaction: false,
                //         list_history_rtc: false,
                //         list_group: false,
                //         list_user: false,
                //         list_case: false,
                //         footer_case: false,
                //         list_task: true,
                //       });
                //       await props.getTask({
                //         channel_id: 9,
                //         type: "assigned",
                //         page: 1,
                //         nextPage: 0,
                //       });

                //       if (props.interactionCurrent["videocall"]) {
                //         await props.setLoading({
                //           list_customer: false,
                //           list_journey: false,
                //           list_journey_ticket: false,
                //           log_interaction_body: false,
                //           list_log_journey: false,
                //           list_log_interaction: false,
                //           list_log_detail_ticket: false,
                //           list_log_ticket: false,
                //           interaction_body: true,
                //           submit_case: false,
                //           history_interaction: false,
                //           list_history_rtc: false,
                //           list_group: false,
                //           list_user: false,
                //           list_case: false,
                //           footer_case: false,
                //           list_task: false,
                //         });
                //         await props.getInteraction({
                //           code: "videocall",
                //           session_id:
                //             props.interactionCurrent["videocall"]?.session_id,
                //           type: props.interactionCurrent["videocall"]?.date_end
                //             ? "history"
                //             : "now",
                //           cust_id:
                //             props.interactionCurrent["videocall"]?.cust_id,
                //           page: 1,
                //           state: props,
                //           item: props.interactionCurrent["videocall"],
                //         });
                //       }
                //       window.singleSpaNavigate("/interaction");
                //       //navigate("/interaction");
                //     }
                //   });
                await props.setOpenIncomingVideoCall(false);
                await props.setStatusVideoCall(false);
                // const dirtyCurrent = props.interactionCurrent;
                // dirtyCurrent.videocall = props.videoCall;
                // await props.setInteractionCurrent(dirtyCurrent);
                await setHidePopupVideoCall(true);
                await props.setStorage(
                  "KPwpN5Bjh4Y2N2L1CC4sRQ==",
                  "videocall",
                  false
                );
                await props.setChannel(9);
                await props.setLoading({
                  list_customer: false,
                  list_journey: false,
                  list_journey_ticket: false,
                  log_interaction_body: false,
                  list_log_journey: false,
                  list_log_interaction: false,
                  list_log_detail_ticket: false,
                  list_log_ticket: false,
                  interaction_body: true,
                  submit_case: false,
                  history_interaction: false,
                  list_history_rtc: false,
                  list_group: false,
                  list_user: false,
                  list_case: false,
                  footer_case: false,
                  list_task: true,
                });
                await props.getTask({
                  channel_id: 9,
                  type: "unassigned",
                  page: 1,
                  nextPage: 0,
                  sort_type: "DESC",
                });

                // if (props.interactionCurrent["videocall"]) {
                //   await props.setLoading({
                //     list_customer: false,
                //     list_journey: false,
                //     list_journey_ticket: false,
                //     log_interaction_body: false,
                //     list_log_journey: false,
                //     list_log_interaction: false,
                //     list_log_detail_ticket: false,
                //     list_log_ticket: false,
                //     interaction_body: true,
                //     submit_case: false,
                //     history_interaction: false,
                //     list_history_rtc: false,
                //     list_group: false,
                //     list_user: false,
                //     list_case: false,
                //     footer_case: false,
                //     list_task: false,
                //   });
                //   await props.getInteraction({
                //     code: "videocall",
                //     session_id:
                //       props.interactionCurrent["videocall"]?.session_id,
                //     type: props.interactionCurrent["videocall"]?.date_end
                //       ? "history"
                //       : "now",
                //     cust_id: props.interactionCurrent["videocall"]?.cust_id,
                //     page: 1,
                //     state: props,
                //     item: props.interactionCurrent["videocall"],
                //   });
                // }
                window.singleSpaNavigate("/interaction");
                //navigate("/interaction");
              }}
            >
              Answer
            </Components.Mui.Button>
          </Components.Mui.Box>
        </Components.Mui.Box>
      ) : null}

      {props.statusMeta === "RINGING" ? (
        <Components.Mui.Box
          sx={{
            background: "#1E1745",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            minWidth: "200px",
          }}
        >
          <Components.Mui.Avatar sx={{ background: "transparent" }}>
            <img
              src={`${window.ASSET_URL}${
                tenantSetting ? tenantSetting.custom_path : ""
              }/images/${
                props.statusVideoCall === "RINGING" ? "calling" : "call"
              }.svg`}
              alt="calling"
              style={{ width: 20 }}
            />
          </Components.Mui.Avatar>
          <Components.Mui.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <Components.Mui.Typography sx={{ fontSize: "12px", color: "#fff" }}>
              {props.videoCall?.body?.name}
            </Components.Mui.Typography>
            <Components.Mui.Typography sx={{ fontSize: "10px", color: "#fff" }}>
              Incoming meta...
            </Components.Mui.Typography>
            <Components.Mui.Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "#fff",
                textTransform: "none",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "green",
                },
                marginTop: "10px",
              }}
              size="small"
              onClick={async () => {
                await props.setStatusMeta(true);
                await props.setStorage(
                  "KPwpN5Bjh4Y2N2L1CC4sRQ==",
                  "meta",
                  false
                );
                await props.setChannel(19);
                await props.setLoading({
                  list_customer: false,
                  list_journey: false,
                  list_journey_ticket: false,
                  log_interaction_body: false,
                  list_log_journey: false,
                  list_log_interaction: false,
                  list_log_detail_ticket: false,
                  list_log_ticket: false,
                  interaction_body: true,
                  submit_case: false,
                  history_interaction: false,
                  list_history_rtc: false,
                  list_group: false,
                  list_user: false,
                  list_case: false,
                  footer_case: false,
                  list_task: true,
                });
                await props.getTask({
                  channel_id: 19,
                  type: "assigned",
                  page: 1,
                  nextPage: 0,
                  sort_type: "DESC",
                });

                if (props.interactionCurrent["meta"]) {
                  await props.setLoading({
                    list_customer: false,
                    list_journey: false,
                    list_journey_ticket: false,
                    log_interaction_body: false,
                    list_log_journey: false,
                    list_log_interaction: false,
                    list_log_detail_ticket: false,
                    list_log_ticket: false,
                    interaction_body: true,
                    submit_case: false,
                    history_interaction: false,
                    list_history_rtc: false,
                    list_group: false,
                    list_user: false,
                    list_case: false,
                    footer_case: false,
                    list_task: false,
                  });
                  await props.getInteraction({
                    code: "meta",
                    session_id: props.interactionCurrent["meta"]?.session_id,
                    type: props.interactionCurrent["meta"]?.date_end
                      ? "history"
                      : "now",
                    cust_id: props.interactionCurrent["meta"]?.cust_id,
                    page: 1,
                    state: props,
                    item: props.interactionCurrent["meta"],
                  });
                }
                // navigate("/interaction");
              }}
            >
              Answer
            </Components.Mui.Button>
          </Components.Mui.Box>
        </Components.Mui.Box>
      ) : null}
      {menu.filter((v) => window.location.pathname.indexOf(v.path) > -1)
        .length > 0 ? (
        <Components.Mui.Box
          sx={{
            position: "fixed",
            bottom: "0",
            right: "7%",
            background: window.BASE_THEME.palette.primary.dark,
            fontSize: "12px",
            padding: "5px",
            color: "#fff",
            fontWeight: "bold",
            zIndex: 999,
          }}
        >
          {props.getStorage("BIjwj21nplRT/Cy0YpmhyA==", false)}:{" "}
          {
            menu.filter((v) => window.location.pathname.indexOf(v.path) > -1)[0]
              ?.application
          }
        </Components.Mui.Box>
      ) : null}
    </Components.Mui.ThemeProvider>
  );
}
const mapDispatchToProps = (dispatch) => ({
  setAlert: (data) => dispatch({ type: "ALERT_SET", alert: data }),
  setInteractionCurrent: (data) =>
    dispatch({ type: "INTERACTION_CURRENT_SET", current: data }),
  setAlertType: (data) => dispatch({ type: "ALERT_TYPE_SET", alert: data }),
  getInteraction: (data) =>
    dispatch({ type: "INTERACTION_GET", interaction: data }),
  setCollapseChannel: (data) =>
    dispatch({ type: "COLLAPSE_CHANNEL_SET", collapse: data }),
  setChannel: (data) => dispatch({ type: "CHANNEL_SET", channel: data }),
  setLoading: (data) => dispatch({ type: "LOADING_SET", loading: data }),
  getTask: (data) => dispatch({ type: "TASK_GET", task: data }),
  setOpenIncomingVideoCall: (data) =>
    dispatch({ type: "OPEN_INCOMING_VIDEO_CALL_SET", data: data }),
  setStatusVideoCall: (data) =>
    dispatch({ type: "STATUS_VIDEO_CALL_SET", data: data }),
  setStatusMeta: (data) => dispatch({ type: "STATUS_META_SET", data: data }),
  setTicketForm: (detail) =>
    dispatch({ type: "TICKET_FORM_SET", data: detail }),
  setTicketDetail: (detail) =>
    dispatch({ type: "TICKET_DETAIL_SET", data: detail }),
  setTicketJourney: (detail) =>
    dispatch({ type: "TICKET_JOURNEY_SET", data: detail }),
  setTicketHistory: (detail) =>
    dispatch({ type: "TICKET_HISTORY_SET", data: detail }),
  setTicketAdditionalForm: (detail) =>
    dispatch({ type: "TICKET_FORM_ADDITIONAL_SET", data: detail }),
  setTicketTab: (props) => dispatch({ type: "TICKET_TAB_SET", data: props }),
  getTicketStatus: () => dispatch({ type: "TICKET_STATUS_GET" }),
  getTicketList: (props) => dispatch({ type: "TICKET_LIST_GET", data: props }),
});
const mapStateToProps = (state) => {
  return { ...state };
};
export default Components.ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(root);
