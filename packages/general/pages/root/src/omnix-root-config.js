import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
// import microfrontendLayout from "./microfrontend-layout.html";
// import routeJSON from "./routes";
import "./store";
import { getStorage, setStorage } from "./helper";
import Emitter from "./emitter";
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Jakarta");

window.moment = moment;

let voiceSetting = getStorage("e2g7ooGzLTllsrEjL2aAyQ==", false);
let colorSetting = getStorage("BIjwj21nplRT/Cy0YpmhyB==", true);
let tokenVoice = getStorage("token-voice", false);

window.BASE_THEME.palette = colorSetting
  ? colorSetting.color
  : window.BASE_THEME.palette;
const loadAvayaV3 = (callback) => {
  const existingScript = document.getElementById("avaya");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `${process.env.HOST_AVAYA_V3
      }/Viera.AvayaCTI/Plugin/index?key=${tokenVoice ? tokenVoice : process.env.TOKEN_AVAYA_V3
      }&callback=myJavascriptCall`;
    script.id = "avaya";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const loadAvayaV2 = (callback) => {
  const existingScript = document.getElementById("avayaV2");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `${process.env.HOST_AVAYA_V2
      }/Viera.AvayaCTI/Plugin/index?key=${tokenVoice ? tokenVoice : process.env.TOKEN_AVAYA_V2
      }&callback=myJavascriptCall`;
    script.id = "avayaV2";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const loadIpScape = (callback) => {
  const existingScript = document.getElementById("ipscape-source");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://ctiadaptor.ipscape.com.au/lib/api/0.9/ipscape.integrate.min.js`;
    script.id = "ipscape-source";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const loadMizzu = (callback) => {
  const existingScript = document.getElementById("mizzu");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `${process.env.HOST_MIZZU}`;
    script.id = "mizzu";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

if (voiceSetting === "mizzu") {
  loadMizzu(() => {
    console.log("MIZZU LOAD");
  });
}

if (voiceSetting === "avaya") {
  loadAvayaV3(() => {
    console.log("AVAYA V3");
  });
  loadAvayaV2(() => {
    console.log("AVAYA V2");
  });
}

if (voiceSetting === "ipscape") {
  // loadIpScape(() => {
  //   console.log("IPSCAPE LOADED");
  // });
}

const isAuthenticated = () => {
  if (localStorage.getItem("h/zkD4TZprsOwTyHV2rxgg==")) {
    const storage = getStorage("h/zkD4TZprsOwTyHV2rxgg==", true);
    if (storage.access_token) {
      return storage;
    }
  }
  return false;
};

const isTenant = () => {
  return localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==");
};
const routes = constructRoutes({
  routes: routeJSON(isAuthenticated, isTenant, getStorage, setStorage, Emitter),
});
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });
applications.forEach(registerApplication);
layoutEngine.activate();
start({ urlRerouteOnly: true });
