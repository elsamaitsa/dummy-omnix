import React from "react";
// helpers
import Components from "./components/helper";
import theme from "./components/theme";
import FormAccountInfo from "./components/FormAccountInfo";
import FormSecurity from "./components/FormSecurity";
import FormNewPassword from "./components/FormNewPassword";
import WestIcon from "@mui/icons-material/West";

const steps = ["Account Info", "Security", "New Password"];

function Root(props) {
  //step
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [email, setEmail] = React.useState(null);
  const [keyOTP, setKeyOTP] = React.useState(null);
  const [isCaptcha, setIsCaptcha] = React.useState(null);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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

    // CAPTCHA V3
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

  React.useEffect(() => {
    if (!props.isTenant()) {
      window.location.href = "/tenant";
    } else {
      if (props.isAuthenticated()) {
        const storage = props.getStorage("t18CBZ2a2oiFK9WwUCYsuw==", true);
        if (storage) {
          const parseMenu = storage;
          const menuSpecificLevel = parseMenu?.filter(
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
        }
      } else {
        handleGetCaptchaSetting();
      }
    }
  }, []);

  let tenantSetting = props.getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);
  return (
    <Components.Mui.ThemeProvider theme={theme}>
      <Components.Mui.Box
        sx={{
          height: "100vh",
          width: "100vw",
          background: `linear-gradient(180deg, ${window.BASE_THEME.palette.primary.dark} 0%, ${window.BASE_THEME.palette.primary.main} 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Components.Mui.CssBaseline />
        <Components.Mui.Box display="flex" flexDirection="column" alignItems="center">
          <img
            src={`${window.ASSET_URL}${tenantSetting ? tenantSetting.custom_path : ""}/images/omnix.png`}
            alt="omnix-logo"
            width="150"
            height="70"
          />

          <Components.Mui.Box
            sx={{
              marginTop: "20px",
              width: "800px",
              minWidth: "25vw",
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: "max-content",
                cursor: "pointer",
                color: window.BASE_THEME.palette.primary.main,
                fontSize: 12,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
              onClick={() => window.location.replace("/login")}
            >
              <WestIcon />
              Back to login
            </div>
            <Components.Mui.Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Components.Mui.Step key={label} {...stepProps}>
                    <Components.Mui.StepLabel {...labelProps}>{label}</Components.Mui.StepLabel>
                  </Components.Mui.Step>
                );
              })}
            </Components.Mui.Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Components.Mui.Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Components.Mui.Typography>
                <Components.Mui.Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Components.Mui.Box sx={{ flex: "1 1 auto" }} />
                  <Components.Mui.Button onClick={handleReset}>Reset</Components.Mui.Button>
                </Components.Mui.Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep === 0 ? (
                  <FormAccountInfo
                    email={email}
                    setEmail={setEmail}
                    keyOTP={keyOTP}
                    setKeyOTP={setKeyOTP}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    activeStep={activeStep}
                    steps={steps}
                    isCaptcha={isCaptcha}
                    {...props}
                  />
                ) : activeStep === 1 ? (
                  <FormSecurity
                    email={email}
                    setEmail={setEmail}
                    keyOTP={keyOTP}
                    setKeyOTP={setKeyOTP}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    activeStep={activeStep}
                    steps={steps}
                    isCaptcha={isCaptcha}
                    {...props}
                  />
                ) : (
                  <FormNewPassword
                    email={email}
                    setEmail={setEmail}
                    keyOTP={keyOTP}
                    setKeyOTP={setKeyOTP}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    activeStep={activeStep}
                    steps={steps}
                    {...props}
                  />
                )}
              </React.Fragment>
            )}
          </Components.Mui.Box>
        </Components.Mui.Box>

        {/* <Components.Mui.Box
          sx={{
            zIndex: 0,
            minHeight: "100vh",
            minWidth: "100%",
            position: "absolute",
            bottom: "0",
            backgroundPosition: "center",
            backgroundRaepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${window.ASSET_URL}${tenantSetting?tenantSetting.custom_path : "/"}/images/bg-fullwidth.svg)`,
          }}
        />
        <Components.Mui.Box
          sx={{
            zIndex: 0,
            minHeight: "100vh",
            minWidth: "100%",
            position: "absolute",
            bottom: "0",
            backgroundPosition: "center",
            backgroundRaepeat: "no-repeat",
            backgroundSize: "cover",
            transform: "scaleX(-1)",
            backgroundImage: `url(${window.ASSET_URL}${tenantSetting?tenantSetting.custom_path : "/"}/images/bg-fullwidth.svg)`,
          }}
        /> */}
      </Components.Mui.Box>
    </Components.Mui.ThemeProvider>
  );
}
export default Root;
