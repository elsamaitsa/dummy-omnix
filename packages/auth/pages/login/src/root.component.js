import React from "react";
// helpers
import Components from "./components/helper";
// icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import DialpadIcon from "@mui/icons-material/Dialpad";
import SyncIcon from "@mui/icons-material/Sync";
import ReCAPTCHA from "react-google-recaptcha";
import theme from "./components/theme";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
const axios = window.axios.default;
const SignInSchema = Components.Yup.object().shape({
  username: Components.Yup.string().required("User Id required"),
  password: Components.Yup.string().required("Password required"),
  // .matches(
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // ),
});
// const captcha = new Array();

function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  // const [token, setToken] = React.useState("");
  const [type, setType] = React.useState("error");
  const [open2fa, setOpen2fa] = React.useState(false);
  const [token2fa, setToken2fa] = React.useState("");
  const [settings, setSettings] = React.useState({});
  // const [isCaptcha, setIsCaptcha] = React.useState(null);

  // let re_captcha = React.useRef();

  const handleLogin = (params) => {
    setLoading(true);
    axios
      .post(`/auth/login`, params)
      .then(async (res) => {
        if (res) {
          setLoading(false);
          setType("success");
          const storage = {
            access_token: res?.data?.token,
            user: res?.data?.user,
            //expired: res?.data?.expired_password_at,
            dateExpired: window.moment(new Date(res?.data?.expired_password_at)).format("YYYY-MM-DD"),
          };
          await localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
          props.setStorage("h/zkD4TZprsOwTyHV2rxgg==", storage, true);
          axios.defaults.headers.common["Authorization"] = `Bearer ${storage.access_token}`;

          axios
            .get(`/setting?timestamp=${new Date().getMilliseconds()}`)
            .then((_res) => {
              if (_res) {
                if (_res.data.length > 0) {
                  const pabx = _res.data.filter((v) => v.key === "pabx");
                  if (pabx.length > 0) {
                    props.setStorage("e2g7ooGzLTllsrEjL2aAyQ==", pabx[0].value1, false);
                  }

                  if (pabx.length > 0) {
                    props.setStorage("token-voice", pabx[0].value2, false);
                  }

                  const notif = _res.data.filter((v) => v.key === "notification_sound");
                  if (notif.length > 0) {
                    props.setStorage("e2g7ooGzLTllsrEjL2aAyR==", notif[0], true);
                  }

                  const face = _res.data.filter((v) => v.key === "face_recognition");
                  if (face.length > 0) {
                    props.setStorage("face-recognition", face[0], true);
                  }

                  const bucket = _res.data.filter((v) => v.key === "bucket_type");
                  if (bucket.length > 0) {
                    props.setStorage("bucket-type", bucket[0], true);
                  }

                  const vcall = _res.data.filter((v) => v.key === "videocall_platform");
                  if (vcall.length > 0) {
                    props.setStorage("video-platform", vcall[0], true);
                  }

                  const vcallCode = _res.data.filter((v) => v.key === "videocall_code");
                  if (vcallCode.length > 0) {
                    props.setStorage("video-code", vcallCode[0], true);
                  }

                  const hideTransfer = _res.data.filter((v) => v.key === "hide_transfer");
                  if (hideTransfer.length > 0) {
                    props.setStorage("hide-transfer", hideTransfer[0], true);
                  }

                  const hideFeedback = _res.data.filter((v) => v.key === "feedback_ticket");
                  if (hideFeedback.length > 0) {
                    props.setStorage("feedback-ticket", hideFeedback[0], true);
                  }

                  const hideSortir = _res.data.filter((v) => v.key === "sortir_interaction");
                  if (hideSortir.length > 0) {
                    props.setStorage("sortir-interaction", hideSortir[0], true);
                  }

                  const pabxAmi = _res.data.filter((v) => v.key === "pabx_ami_url");
                  if (pabxAmi.length > 0) {
                    props.setStorage("pabx_ami_url", pabxAmi[0], true);
                  }

                  axios.get(`/menu?timestamp=${new Date().getMilliseconds()}`).then(async (__res) => {
                    if (__res && __res.data.length > 0) {
                      const menuSpecificLevel = await __res.data.filter(
                        (val) =>
                          val.application === null ||
                          val.application === "general" ||
                          (val.application === "marketer" && res?.data?.user?.is_marketer) ||
                          (val.application === "service" && res?.data?.user?.is_service) ||
                          (val.application === "sales" && res?.data?.user?.is_sales)
                      );

                      props.setStorage("t18CBZ2a2oiFK9WwUCYsuw==", menuSpecificLevel, true);

                      const dataCsat = await axios.get("/service/account/csatSetting/list");

                      props.setStorage("csat", dataCsat?.data, true);

                      if (props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true)) {
                        if (menuSpecificLevel.length > 0) {
                          const dashboard = menuSpecificLevel.filter((val) => val.name === "Dashboard");
                          if (dashboard.length > 0) {
                            window.location.href = `${dashboard[0]?.path}`;
                          } else {
                            window.location.href = `${menuSpecificLevel[0]?.path}`;
                          }
                        } else {
                          window.location.href = `${res?.data?.redirectUrl}`;
                        }
                      }
                    }
                  });
                }
              }
            })
            .catch((error) => {
              if (error.response.status === 403) {
                setOpen2fa(true);
              }
            });
        }
      })
      .catch((error) => {
        // re_captcha?.current?.reset();
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

  const handleSubmitLogin = (e) => {
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute("6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P", {
          action: "login",
        })
        .then(function (token) {
          handleLogin({
            email: e.username,
            password: e.password,
            tokenCaptcha: token,
            pbx: e.pbx,
          });
        });
    });

    // if (isCaptcha) {
    //   handleLogin({
    //     email: e.username,
    //     password: e.password,
    //     tokenCaptcha: token,
    //     pbx: e.pbx,
    //   });
    // } else {
    //   var recaptcha = document.getElementById("recaptcha").value;
    //   var validRecaptcha = 0;
    //   for (var j = 0; j < 4; j++) {
    //     if (recaptcha.charAt(j) != captcha[j]) {
    //       validRecaptcha++;
    //     }
    //   }
    //   if (validRecaptcha === 0 && recaptcha.length === 4) {
    //     handleLogin({
    //       email: e.username,
    //       password: e.password,
    //       tokenCaptcha: recaptcha,
    //       pbx: e.pbx,
    //     });
    //   } else {
    //     document.getElementById("errCaptcha").innerHTML = "Captcha is not valid";
    //   }
    // }
  };

  const handleGetSettings = () => {
    axios.get("/auth/checkPabx").then((res) => {
      if (res && res.data) {
        setSettings(res.data);
      }
    });
  };

  const handleGetCaptchaSetting = (callback) => {
    // axios.get("/setting/is_captcha").then((res) => {
    //   if (res && res.data) {
    //     setIsCaptcha(
    //       res.data?.captcha_status != null
    //         ? Number(res.data?.captcha_status) === 1
    //         : true
    //     );
    //   } else {
    //     setIsCaptcha(true);
    //   }
    // });

    //CAPTCHA V3
    const existingScript = document.getElementById("recaptcha");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P`;
      script.id = "recaptcha";
      script.async = true;
      script.defer = true;
      script.preload = true;
      document.head.appendChild(script);
      script.onload = () => {
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
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
          window.location.href = `/`;
        }
      } else {
        if (props.isAuthenticated()?.user?.is_2fa) {
          setOpen2fa(true);
        }
      }
    } else {
      handleGetSettings();
      // handleGetCaptchaSetting();
    }
    // }
  }, []);

  // React.useEffect(() => {
  //   var canvas = document.getElementById("captcha");
  //   if (isCaptcha !== null) {
  //     if (canvas && !isCaptcha) {
  //       createCaptcha();
  //     }
  //   }
  // }, [isCaptcha]);

  let tenantSetting = props.getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);

  return (
    <Components.Mui.ThemeProvider theme={theme}>
      Login
    </Components.Mui.ThemeProvider>
  );
}
export default Root;
