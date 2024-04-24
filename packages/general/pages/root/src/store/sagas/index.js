const _ = require("lodash");
const socket = require("../../socket");
const Emitter = require("../../emitter").default;
const store = require("..");
const axios = window.axios.default;
const CryptoJS = window.CryptoJS;
// import sagas
const ticketing = require("./ticketing");
const sales = require("./sales");
const dashboard = require("./dashboard");
const tabels = require("./tabels");
const { getStorage, setStorage, encrypt, decrypt } = require("../../helper");
let voiceSetting = getStorage("e2g7ooGzLTllsrEjL2aAyQ==", false);
let notifSetting = getStorage("e2g7ooGzLTllsrEjL2aAyR==", true);
let tenant = localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==");
let intervalAmi = null;
let intervalMizzu = null;
let intervalAvaya = null;
let interval = null;
axios.defaults.baseURL = process.env.API_URL + "/" + tenant;
axios.interceptors.request.use(
  (config) => {
    const date = new Date().getTime();
    const str = `xmen:${date}`;
    const signed = CryptoJS.HmacSHA256(str, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Hex);
    config.headers["x-encrypt"] = signed;
    config.headers["x-time"] = date;
    config.headers["x-tenant"] = tenant;

    const isMinio = config.url === "/storage/upload";
    const isPolri = config.url === "/integration/polri/faceRecognition";
    const isBodyValid = config.data;
    const noEncrypt = config.headers.noEncrypt;
    const isEncrypt =
      config.method !== "get" && process.env.IS_ENCRYPT && !isMinio && !isPolri && !noEncrypt && isBodyValid;

    if (isEncrypt) {
      const enc = encrypt(JSON.stringify(config.data));
      config.data = { data: enc };
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
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
      // if (error.response.status === 401) {
      //   axios
      //     .post("/auth/logout", {
      //       userid: isAuthenticated()?.user?.id,
      //     })
      //     .then((res) => {
      //       if (res) {
      //         localStorage.removeItem("h/zkD4TZprsOwTyHV2rxgg==");
      //         localStorage.removeItem("KPwpN5Bjh4Y2N2L1CC4sRQ==");
      //         localStorage.removeItem("t18CBZ2a2oiFK9WwUCYsuw==");
      //         localStorage.removeItem("e2g7ooGzLTllsrEjL2aAyQ==");
      //         localStorage.removeItem("fWBOsAkEDa4euU3r1qHWfQ==");
      //         window.location.href = "/login";
      //       }
      //     });
      // }
    }
    return Promise.reject(error);
  }
);

const isAuthenticated = () => {
  if (localStorage.getItem("h/zkD4TZprsOwTyHV2rxgg==")) {
    const storage = getStorage("h/zkD4TZprsOwTyHV2rxgg==", true);
    if (storage.access_token) {
      return storage;
    }
  }
  return false;
};

if (isAuthenticated()) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${isAuthenticated().access_token}`;
}
function* getChannel() {
  try {
    const data = yield window.ReduxSaga.effects.call(axios.get, "/service/channel");
    let result = _.orderBy(data?.data, ["code", "asc"]);
    yield window.ReduxSaga.effects.put({
      type: "CHANNEL_LIST_SET",
      channel: result,
    });
  } catch (err) {
    console.log(err);
  }
}

function* getInteraction(action) {
  try {
    let result = [];
    const state = store.default.getState();
    let resultInteractionCurrent = state.interactionCurrent;
    let endpoint = !action.interaction.log
      ? action.interaction.type === "history"
        ? `getInteractionByCust?cust_id=${action.interaction.cust_id}&limit=10&page=${action.interaction.page}`
        : `getInteractionBySession?session_id=${action.interaction.session_id}&interaction_type=${action.interaction.type}`
      : `getInteractionBySession?session_id=${action.interaction.session_id}&interaction_type=history`;

    if (action?.interaction?.item?.channel_id === 19) {
      endpoint = `getInteractionBySession?session_id=${action.interaction.session_id}&interaction_type=${action.interaction.type}`;
    }

    const { data } = yield window.ReduxSaga.effects.call(axios.get, `/service/${action.interaction.code}/${endpoint}`);
    setStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", action.interaction.code, false);
    result = data;
    if (action.interaction.code === "facebookComment") {
      if (action.interaction.type === "history") {
        if (!action.interaction.log) {
          result = data;
          if (action.interaction.item) {
            resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
          }
        } else {
          result = data;
          resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
        }
      } else {
        resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
        result = data;
      }
    } else {
      if (action.interaction.type === "history") {
        if (!action.interaction.log) {
          if (Array.isArray(data)) {
            if (data.length > 0) {
              result = state.interaction.concat(data.filter((v) => v !== null));
            } else {
              result = state.interaction;
            }
          }

          if (action.interaction.item) {
            resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
          }
        } else {
          result = state.interaction.concat(data.filter((v) => v !== null));
          resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
        }
      } else {
        resultInteractionCurrent[getStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", false)] = action.interaction.item;
        result = data.filter((v) => v !== null);
      }

      if (Array.isArray(data) && data.length === 0) {
        state.loadMore.history_interaction = false;
      } else {
        state.loadMore.history_interaction = true;
      }

      if (Array.isArray(result) && result.length > 0) {
        result = _.orderBy(result, ["id", "asc"]);
      }

      if (Array.isArray(result)) {
        result = _.uniqBy(result, "id");
      }
    }

    Emitter.emit("INTERACTION_SET", action.interaction.code === "facebookComment" ? [result] : result);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "INTERACTION_CURRENT_SET",
        current: resultInteractionCurrent,
      }),
      window.ReduxSaga.effects.put({
        type: "ASIDE_SET",
        aside: "profile",
      }),
      window.ReduxSaga.effects.put({
        type: "LOG_CURRENT_SET",
        data: resultInteractionCurrent,
      }),
      window.ReduxSaga.effects.put({
        type: "CUSTOMER_CASE_SET",
        customer: false,
      }),
      window.ReduxSaga.effects.put({
        type: "INTERACTION_SET",
        interaction: action.interaction.code === "facebookComment" ? [result] : result,
      }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "interaction_body",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getInteractionHistory(action) {
  try {
    let result = [];
    let channel = 0;
    const endpoint = `getInteractionBySession?session_id=${action.interaction.session_id}&interaction_type=history`;
    const { data } = yield window.ReduxSaga.effects.call(axios.get, `/service/${action.interaction.code}/${endpoint}`);
    result = data;

    if (Array.isArray(result) && result.length > 0) {
      result = _.orderBy(result, ["id", "asc"]);
      result = _.uniqBy(result, "id");
      channel = result[0].channel_id;
    }

    // Emitter.emit("INTERACTION_HISTORY_SET", result);
    // console.log("action", action);
    if (channel === 0) {
      yield window.ReduxSaga.effects.all([
        window.ReduxSaga.effects.put({
          type: "CHANNEL_SET",
          channel: channel,
        }),
        window.ReduxSaga.effects.put({
          type: "INTERACTION_HISTORY_SET",
          interaction: result,
        }),
        window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
        window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      ]);
    } else {
      yield window.ReduxSaga.effects.all([
        window.ReduxSaga.effects.put({
          type: "INTERACTION_HISTORY_SET",
          interaction: result,
        }),
        window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
        window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      ]);
    }
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_history_rtc",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getInteractionCase(action) {
  try {
    let result = [];
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticket/bySession/${action.interaction.session_id}`
    );

    if (data.length > 0) {
      result = _.orderBy(data, ["id", "asc"]);
    }

    result = _.uniqBy(result, "id");
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "INTERACTION_CASE_SET",
        interaction: result,
      }),
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_case",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getTask(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/interaction/listTask?channel_id=${action.task.channel_id}&sortType=${action.task?.sort_type}&taskType=${
        action.task.type
      }&limit=10&page=${action.task.page}&r=${Date.now()}&term=`
    );

    const dataFiltered =
      action.task.type === "unassigned" ? data?.data : _.orderBy(data?.data, ["date_start"], ["desc"]);
    // const dataFiltered = data?.data;
    if (action.task.nextPage > 0) {
      if (state.task[action.task.type].length > 0) {
        const dirtyTask = state.task;
        dirtyTask[action.task.type] = [...dirtyTask[action.task.type], ...dataFiltered];
        result = dirtyTask;
      } else {
        state.task[action.task.type] = dataFiltered;
        result = state.task;
      }
    } else {
      state.task[action.task.type] = dataFiltered;
      result = state.task;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_task = false;
    } else {
      state.loadMore.list_task = true;
    }

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({ type: "TASK_SET", task: result }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: "list_task" }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getTaskCount(action) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/interaction/countTask?channel_id=${action.task.channel_id}&r=${Date.now()}`
    );
    yield window.ReduxSaga.effects.put({
      type: "TASK_COUNT_SET",
      task: data?.data,
    });
  } catch (err) {
    console.log(err);
  }
}

function* getLogInteraction(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/interaction/log?${action.data.terms}page=${action.data.page}&sort=${action.data.sort}&limit=10`
    );

    const dataFiltered = _.orderBy(data?.data, ["date_start"], ["desc"]);
    if (action.data.nextPage > 0) {
      if (state.logInteraction.length > 0) {
        const concatData = state.logInteraction.concat(dataFiltered);
        result = concatData;
      } else {
        result = dataFiltered;
      }
    } else {
      state.logInteraction = dataFiltered;
      result = state.logInteraction;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_log_interaction = false;
    } else {
      state.loadMore.list_log_interaction = true;
    }

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "LOG_INTERACTION_SET",
        data: result,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_log_interaction",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getLogSession(action) {
  try {
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/Log/session?session_id=${action.data.session_id}`
    );

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOG_SESSION_SET",
        data: data,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_log_journey",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getProfile(action) {
  try {
    const { data } = yield window.ReduxSaga.effects.call(axios.get, `/customer/detail/${action.profile.id}`);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "PROFILE_SET", profile: data }),
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  } catch (err) {
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "aside_cust_profile",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getCustomer(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/customer?sortBy=name&sortType=ASC&limit=10&page=${action.customer.page}&${action.customer.searchValue}`
    );

    if (action.customer.nextPage > 0) {
      result = state.customer.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_customer = false;
    } else {
      state.loadMore.list_customer = true;
    }

    const dataFiltered = _.orderBy(result, ["name"], ["asc"]);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "CUSTOMER_SET",
        customer: dataFiltered,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_customer",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getGroup(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/group?sortBy=name&sortType=ASC&limit=10&page=${action.group.page}&term=${action.group.searchValue}`
    );

    if (action.group.nextPage > 0) {
      result = state.group.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_group = false;
    } else {
      state.loadMore.list_group = true;
    }

    const dataFiltered = _.orderBy(result, ["name"], ["asc"]);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "GROUP_SET",
        group: dataFiltered,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_group",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getUser(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/user/agentTransfer?sortBy=nickname&sortType=ASC&limit=10&page=${action.user.page}&term=${
        action.user.searchValue
      }&channel_id=${action.user.channel ? action.user.channel : state.channel}`
    );

    if (action.user.nextPage > 0) {
      result = state.user.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_user = false;
    } else {
      state.loadMore.list_user = true;
    }

    const dataFiltered = _.orderBy(result, ["name"], ["asc"]);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "USER_SET",
        user: dataFiltered,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_user",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getJourney(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const indHome = action.journey.indNum ? `&indihomeNumber=${action.journey.indNum}` : "";
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/journey?${
        action.journey?.getTicketBy === "ticket"
          ? `ticket_id=${action.journey.ticketId}`
          : `cust_id=${action.journey.cust_id}`
      }&limit=10&page=${action.journey.page}${indHome}`
    );

    if (action.journey.nextPage > 0) {
      result = state.journey.concat(data);
    } else {
      result = data;
    }

    if (data.length === 0) {
      state.loadMore.list_journey = false;
    } else {
      state.loadMore.list_journey = true;
    }

    const dataFiltered = _.orderBy(result, ["id"], ["desc"]);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "JOURNEY_SET",
        journey: dataFiltered,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_journey",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function interactionEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });
      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      let result = [];
      const state = store.default.getState();
      const dirtyDataInteraction = state.interaction;

      if (Array.isArray(state.channelList)) {
        const currentChannel = state.channelList?.filter((v) => parseInt(v.id) === parseInt(decryptData.channel_id));
        if (currentChannel?.length > 0) {
          const currentInteraction = state.interactionCurrent[currentChannel[0].code];

          // if (currentInteraction && currentInteraction?.session_id === decryptData.session_id) {
          if (parseInt(state.channel) === parseInt(decryptData.channel_id)) {
            if (decryptData.action_type === "IN") {
              const dirtyNotification = state.notification;
              dirtyNotification.push(decryptData);
              emit({
                type: "NOTIFICATION_SET",
                notification: dirtyNotification,
              });
              //helper.pushNotification(`${decryptData.message}`);
            }
            const dirtyDataTask = state.task;
            if (dirtyDataTask["assigned"].length > 0) {
              const validateTask = dirtyDataTask["assigned"].filter((v) => v.session_id === decryptData.session_id);
              if (validateTask.length > 0) {
                const findIndexTask = dirtyDataTask["assigned"].findIndex(
                  (v) => v.session_id === decryptData.session_id
                );
                if (findIndexTask > -1) {
                  dirtyDataTask["assigned"][findIndexTask].last_message =
                    parseInt(decryptData.channel_id) === 2 || parseInt(decryptData.channel_id) === 15
                      ? decryptData.subject
                      : decryptData.message;
                  const dataFiltered = _.orderBy(dirtyDataTask["assigned"], ["date_start"], ["desc"]);
                  emit({
                    type: "TASK_SET",
                    task: {
                      assigned: dataFiltered,
                      unassigned: state.task.unassigned,
                      resolved: state.task.resolved,
                    },
                  });
                }
              }
            }
            if (Array.isArray(state.interaction)) {
              if (parseInt(decryptData.channel_id) !== 6) {
                const validateInteraction = state.interaction.filter((v) => v.id === decryptData.id);
                if (validateInteraction.length > 0) {
                  const findIndexInteraction = state.interaction.findIndex((v) => v.id === decryptData.id);
                  if (findIndexInteraction > -1) {
                    dirtyDataInteraction[findIndexInteraction] = decryptData;
                    result = dirtyDataInteraction;
                  } else {
                    result = state.interaction;
                  }
                } else {
                  dirtyDataInteraction.push(decryptData);
                  result = dirtyDataInteraction;
                }
              } else {
                const validateInteraction = state.interaction[0]?.traffic?.child?.filter(
                  (v) => v.id === decryptData.id
                );
                if (validateInteraction.length > 0) {
                  const findIndexInteraction = state.interaction[0]?.traffic?.child?.findIndex(
                    (v) => v.id === decryptData.id
                  );
                  if (findIndexInteraction > -1) {
                    dirtyDataInteraction[0].traffic.child[findIndexInteraction] = decryptData;
                    result = dirtyDataInteraction;
                  } else {
                    result = state.interaction;
                  }
                } else {
                  dirtyDataInteraction[0]?.traffic?.child.push(decryptData);
                  result = dirtyDataInteraction;
                }
              }
            }

            if (Array.isArray(result)) {
              result = _.uniqBy(result, "id");
            }

            if (Array.isArray(result) && result.length > 0) {
              result = _.orderBy(result, ["id", "asc"]);
            }

            Emitter.emit("INTERACTION_SET", result);
            emit({ type: "INTERACTION_SET", interaction: result });
          } else {
            if (decryptData.action_type === "IN" || decryptData.action_type === "MEMO") {
              const dirtyNotification = state.notification;
              dirtyNotification.push(decryptData);
              emit({
                type: "NOTIFICATION_SET",
                notification: dirtyNotification,
              });
              //helper.pushNotification(`${decryptData.message}`);
            }
            const dirtyDataTask = state.task;
            if (dirtyDataTask["assigned"].length > 0) {
              const validateTask = dirtyDataTask["assigned"].filter((v) => v.session_id === decryptData.session_id);
              if (validateTask.length > 0) {
                const findIndexTask = dirtyDataTask["assigned"].findIndex(
                  (v) => v.session_id === decryptData.session_id
                );
                if (findIndexTask > -1) {
                  dirtyDataTask["assigned"][findIndexTask].last_message =
                    parseInt(decryptData.channel_id) === 2 || parseInt(decryptData.channel_id) === 15
                      ? decryptData.subject
                      : decryptData.message;
                  const dataFiltered = _.orderBy(dirtyDataTask["assigned"], ["date_start"], ["desc"]);
                  emit({
                    type: "TASK_SET",
                    task: {
                      assigned: dataFiltered,
                      unassigned: state.task.unassigned,
                      resolved: state.task.resolved,
                    },
                  });
                }
              }
            }
            if (Array.isArray(state.interaction) && Array.isArray(state.channelList)) {
              const isRtc = state.channelList.filter((v) => v.group === "RTC");
              if (isRtc.length > 0) {
                const validateInteraction = state.interaction.filter((v) => v.id === decryptData.id);
                if (validateInteraction.length > 0) {
                  const findIndexInteraction = state.interaction.findIndex((v) => v.id === decryptData.id);
                  if (findIndexInteraction > -1) {
                    dirtyDataInteraction[findIndexInteraction] = decryptData;
                    result = dirtyDataInteraction;
                  } else {
                    result = state.interaction;
                  }
                } else {
                  dirtyDataInteraction.push(decryptData);
                  result = dirtyDataInteraction;
                }

                if (Array.isArray(result)) {
                  result = _.uniqBy(result, "id");
                }

                if (Array.isArray(result) && result.length > 0) {
                  result = _.orderBy(result, ["id", "asc"]);
                }
                Emitter.emit("INTERACTION_SET", result);
                emit({ type: "INTERACTION_SET", interaction: result });
              }
            }
          }
          // }
        }
      }
    };
    socket.default.onMessage(socketEvent);
    return () => {};
  });
}

function newQueueEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (parseInt(notifSetting?.value1) === 1) {
        const audio = document.createElement("audio");
        audio.setAttribute("src", window.ASSET_URL + "/audio/notification.mp3");
        audio.setAttribute("controls", "controls");
        audio.setAttribute("autoPlay", "autoPlay");
        document.body.appendChild(audio);
      }
    };
    socket.default.onQueue(socketEvent);
    return () => {};
  });
}

function newHandledEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      const state = store.default.getState();
      let result = [];
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      if (decryptData?.date_pickup) {
        if (state.task.assigned.length > 0) {
          state.task.assigned.push(decryptData);
          const dataFiltered = _.orderBy(state.task.assigned, ["date_start"], ["desc"]);
          result = {
            assigned: dataFiltered,
            unassigned: state.task.unassigned,
            resolved: state.task.resolved,
          };
        } else {
          state.task.assigned = [decryptData];
          const dataFiltered = _.orderBy(state.task.assigned, ["date_start"], ["desc"]);
          result = {
            assigned: dataFiltered,
            unassigned: state.task.unassigned,
            resolved: state.task.resolved,
          };
        }

        if (decryptData.channel_id === 19) {
          emit({ type: "STATUS_META_SET", data: "RINGING" });
        }

        if (decryptData.channel_id === 9) {
          if (isAuthenticated() && isAuthenticated().user.level === "agent") {
            const validateChannel = isAuthenticated()?.user.skill.includes(9);
            if (validateChannel) {
              Notification.requestPermission();
              if (!Notification) {
                alert("Desktop notifications not available in your browser. Try Chromium.");
                return;
              }

              if (Notification.permission !== "granted") {
                Notification.requestPermission();
              } else {
                const notification = new Notification("Omnix Video Call", {
                  icon: `${window.ASSET_URL}/images/favicon.png`,
                  body: "New interaction video call from " + decryptData?.from_name,
                });
                notification.onclick = function () {
                  // history.push(`/${route}`);
                  notification.close();
                };
              }

              emit({ type: "OPEN_INCOMING_VIDEO_CALL_SET", data: true });
              emit({ type: "VIDEO_CALL_SET", data: decryptData });
              emit({ type: "STATUS_VIDEO_CALL_SET", data: "RINGING" });
            }
          }
        }
        emit({ type: "TASK_SET", task: result });
        // if (decryptData.channel_id === state.channel) {
        //   emit({
        //     type: "TASK_COUNT_SET",
        //     task: {
        //       unassigned: state.taskCount.unassigned,
        //       assigned: state.taskCount.assigned + 1,
        //       resolved: state.taskCount.resolved,
        //     },
        //   });
        // }
      } else {
        if (state.task.unassigned.length > 0) {
          state.task.unassigned.push(decryptData);
          const dataFiltered = _.orderBy(state.task.unassigned, ["date_start"], ["desc"]);
          result = {
            unassigned: dataFiltered,
            assigned: state.task.assigned,
            resolved: state.task.resolved,
          };
        } else {
          state.task.unassigned = [decryptData];
          const dataFiltered = _.orderBy(state.task.unassigned, ["date_start"], ["desc"]);
          result = {
            unassigned: dataFiltered,
            assigned: state.task.assigned,
            resolved: state.task.resolved,
          };
        }
        if (decryptData.channel_id === 9) {
          if (isAuthenticated() && isAuthenticated().user.level === "agent") {
            const validateChannel = isAuthenticated()?.user.skill.includes(9);
            if (validateChannel) {
              Notification.requestPermission();
              if (!Notification) {
                alert("Desktop notifications not available in your browser. Try Chromium.");
                return;
              }

              if (Notification.permission !== "granted") {
                Notification.requestPermission();
              } else {
                const notification = new Notification("Omnix Video Call", {
                  icon: `${window.ASSET_URL}/images/favicon.png`,
                  body: "New interaction video call from " + decryptData?.from_name,
                });
                notification.onclick = function () {
                  // history.push(`/${route}`);
                  notification.close();
                };
              }

              emit({ type: "OPEN_INCOMING_VIDEO_CALL_SET", data: true });
              emit({ type: "VIDEO_CALL_SET", data: decryptData });
              emit({ type: "STATUS_VIDEO_CALL_SET", data: "RINGING" });
            }
          }
        }
        emit({ type: "TASK_SET", task: result });
        // if (decryptData.channel_id === state.channel) {
        //   emit({
        //     type: "TASK_COUNT_SET",
        //     task: {
        //       unassigned: state.taskCount.unassigned + 1,
        //       assigned: state.taskCount.assigned,
        //       resolved: state.taskCount.resolved,
        //     },
        //   });
        // }
      }
    };
    socket.default.onHandled(socketEvent);
    return () => {};
  });
}

function pingEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      const state = store.default.getState();
      setTimeout(() => {
        emit({ type: "INTERACTION_SET", interaction: state.interaction });
      }, 3000);
    };
    socket.default.ping(socketEvent);
    return () => {};
  });
}
function* socketPing() {
  try {
    const ping = yield window.ReduxSaga.effects.call(pingEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(ping);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function videoCallChatEvent() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      Emitter.emit("VIDEOCALL_CHAT", JSON.parse(decrypt(data)));
    };
    socket.default.videoCallChat(socketEvent);
    return () => {};
  });
}
function* socketVideoChatEvent() {
  try {
    const ping = yield window.ReduxSaga.effects.call(videoCallChatEvent);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(ping);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* socketNewQueue() {
  try {
    const queue = yield window.ReduxSaga.effects.call(newQueueEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(queue);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* socketNewHandled() {
  try {
    const queue = yield window.ReduxSaga.effects.call(newHandledEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(queue);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* socketInteraction() {
  try {
    const message = yield window.ReduxSaga.effects.call(interactionEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(message);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function updateInteractionEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      setTimeout(() => {
        let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
          iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        });

        const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        let result = [];

        const state = store.default.getState();
        const dirtyDataInteraction = state.interaction;
        if (dirtyDataInteraction.length > 0) {
          const dataIndex = dirtyDataInteraction.findIndex((v) => v.id === decryptData.id);
          if (dataIndex > 0) {
            dirtyDataInteraction[dataIndex].date_received = decryptData.date_received;
            dirtyDataInteraction[dataIndex].send_detail = decryptData.send_detail;
            dirtyDataInteraction[dataIndex].send_status = decryptData.send_status;

            result = dirtyDataInteraction;
          } else {
            result = dirtyDataInteraction;
          }
        } else {
          result = dirtyDataInteraction;
        }
        emit({ type: "INTERACTION_SET", interaction: result });
        Emitter.emit("INTERACTION_SET", result);
      }, 3000);
    };
    socket.default.updateMessage(socketEvent);
    return () => {};
  });
}

function* socketUpdateInteraction() {
  try {
    const message = yield window.ReduxSaga.effects.call(updateInteractionEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(message);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function totalQueueEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      emit({ type: "TOTAL_QUEUE_SET", total: decryptData });
    };
    socket.default.totalQueue(socketEvent);
    return () => {};
  });
}

function totalHandledEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      emit({ type: "TOTAL_HANDLED_SET", total: decryptData });
    };
    socket.default.totalHandled(socketEvent);
    return () => {};
  });
}

function totalTicketEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      emit({ type: "TOTAL_TICKET_SET", total: decryptData });
    };
    socket.default.totalTicket(socketEvent);
    return () => {};
  });
}

function* socketTotalQueue() {
  try {
    const total = yield window.ReduxSaga.effects.call(totalQueueEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(total);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* socketTotalHandled() {
  try {
    const total = yield window.ReduxSaga.effects.call(totalHandledEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(total);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* socketTotalTicket() {
  try {
    const total = yield window.ReduxSaga.effects.call(totalTicketEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(total);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function callBackVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      // let decrypted = CryptoJS.AES.decrypt(
      //   data,
      //   CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY),
      //   {
      //     iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
      //     padding: CryptoJS.pad.Pkcs7,
      //     mode: CryptoJS.mode.CBC,
      //   }
      // );

      // const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      emit({ type: "SALES_CALL_STATUS_SET", data: null });
    };
    socket.default.callBackVoice(socketEvent);
    return () => {};
  });
}

function* socketCallBackVoice() {
  try {
    const callback = yield window.ReduxSaga.effects.call(callBackVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(callback);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* getUnitList() {
  try {
    const data = yield window.ReduxSaga.effects.call(axios.get, "/service/unit/list");
    yield window.ReduxSaga.effects.put({
      type: "UNIT_LIST_SET",
      data: data?.data ?? [],
    });
  } catch (err) {
    console.log(err);
  }
}

function* getCategory() {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      "/service/category?sortBy=id&sortType=DESC&limit=10&page=1&term=%20"
    );
    yield window.ReduxSaga.effects.put({
      type: "CATEGORY_LIST_SET",
      data: data?.data ?? [],
    });
  } catch (err) {
    console.log(err);
  }
}

function twillioVideoEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(9);
        if (validateChannel) {
          let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
            iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
          });

          const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
          Notification.requestPermission();
          if (!Notification) {
            alert("Desktop notifications not available in your browser. Try Chromium.");
            return;
          }

          if (Notification.permission !== "granted") {
            Notification.requestPermission();
          } else {
            const notification = new Notification("Omnix Video Call", {
              icon: `${window.ASSET_URL}/images/favicon.png`,
              body: "New interaction video call from " + decryptData?.body?.name,
            });
            notification.onclick = function () {
              // history.push(`/${route}`);
              notification.close();
            };
          }
          emit({ type: "OPEN_INCOMING_VIDEO_CALL_SET", data: true });
          emit({ type: "VIDEO_CALL_SET", data: decryptData });
          emit({ type: "STATUS_VIDEO_CALL_SET", data: "RINGING" });
        }
      }
    };
    socket.default.twillioVideoCall(socketEvent);
    return () => {};
  });
}

function* twillioVideoWatcher() {
  try {
    const twillioVideo = yield window.ReduxSaga.effects.call(twillioVideoEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(twillioVideo);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function amiVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(1);
        if (validateChannel && voiceSetting === "ami") {
          const parsingJSON = JSON.parse(data);
          parsingJSON.data.src = parsingJSON.data.src
            ? parsingJSON.data.src?.toString()?.indexOf("0") === 0
              ? "+62" + parsingJSON.data.src?.toString()?.substring(1)
              : parsingJSON.data.src?.toString()
            : "";
          if (parsingJSON.data.event === "answer") {
            //clearInterval(intervalAmi);
            voiceCreateSession(parsingJSON, emit, "answer");
            const before = new Date();
            interval = setInterval(() => {
              const now = new Date();
              const timeDifference = now - before;
              const secondsInADay = 60 * 60 * 1000 * 24;
              const secondsInAHour = 60 * 60 * 1000;
              const hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
              const mins = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1);
              const secs = Math.floor(((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000) * 1);
              emit({
                type: "DURATION_SET",
                data: `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${
                  secs < 10 ? "0" + secs : secs
                }`,
              });
            }, 1000);
          }

          if (parsingJSON.data.event === "ringing") {
            emit({ type: "OPEN_INCOMING_SET", data: true });
            emit({ type: "CALL_SET", data: [0, 0, 0, parsingJSON.data.src] });
            emit({ type: "STATUS_CALL_SET", data: "RINGING" });
            // intervalAmi = setInterval(() => {
            //   emit({ type: "OPEN_INCOMING_SET", data: false });
            //   emit({ type: "STATUS_CALL_SET", data: false });
            //   clearInterval(intervalAmi);
            // }, 20000);
          }

          if (parsingJSON.data.event === "hangup") {
            clearInterval(interval);
            voiceCreateSession(parsingJSON, emit, "hangup");
          }

          if (parsingJSON.data.event === "unanswered") {
            emit({ type: "OPEN_INCOMING_SET", data: false });
            emit({ type: "STATUS_CALL_SET", data: false });
            //clearInterval(intervalAmi);
          }
        }
      }
    };
    socket.default.amiSocket(socketEvent);
    return () => {};
  });
}

function sixthsenseVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(1);
        if (validateChannel && voiceSetting === "sixthsense") {
          let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
            iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
          });

          const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
          const parsingJSON = { data: decryptData };
          parsingJSON.data.src = parsingJSON.data.src
            ? parsingJSON.data.src?.toString()?.indexOf("0") === 0
              ? "+62" + parsingJSON.data.src?.toString()?.substring(1)
              : parsingJSON.data.src?.toString()
            : "";
          if (parsingJSON.data.event === "answer") {
            //clearInterval(intervalAmi);
            voiceCreateSession(parsingJSON, emit, "answer");
            const before = new Date();
            interval = setInterval(() => {
              const now = new Date();
              const timeDifference = now - before;
              const secondsInADay = 60 * 60 * 1000 * 24;
              const secondsInAHour = 60 * 60 * 1000;
              const hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
              const mins = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1);
              const secs = Math.floor(((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000) * 1);
              emit({
                type: "DURATION_SET",
                data: `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${
                  secs < 10 ? "0" + secs : secs
                }`,
              });
            }, 1000);
          }

          if (parsingJSON.data.event === "ringing") {
            voiceCreateSession(parsingJSON, emit, "ringing");
            // intervalAmi = setInterval(() => {
            //   emit({ type: "OPEN_INCOMING_SET", data: false });
            //   emit({ type: "STATUS_CALL_SET", data: false });
            //   clearInterval(intervalAmi);
            // }, 20000);
          }

          if (parsingJSON.data.event === "hangup") {
            clearInterval(interval);
            voiceCreateSession(parsingJSON, emit, "hangup");
          }

          if (parsingJSON.data.event === "unanswered") {
            emit({ type: "OPEN_INCOMING_SET", data: false });
            emit({ type: "STATUS_CALL_SET", data: false });
            //clearInterval(intervalAmi);
          }
        }
      }
    };
    socket.default.sixthsenseSocket(socketEvent);
    return () => {};
  });
}

function* mizzuVoiceEventChannel() {
  const store = yield window.ReduxSaga.effects.getContext("store");
  const storage = store.getState();
  return new window.ReduxSaga.eventChannel((emit) => {
    if (isAuthenticated() && isAuthenticated().user.level === "agent") {
      const validateChannel = isAuthenticated()?.user.skill.includes(1);

      if (validateChannel && voiceSetting === "mizzu" && window.webphone_api) {
        window.webphone_api.parameters = {
          serveraddress: isAuthenticated()?.user.pabx_host,
          username: isAuthenticated()?.user.user_pbx,
          password: isAuthenticated()?.user.pwd_pbx,
          loglevel: 3,
          registerinterval: 30,
          callreceiver: -1,
          autoaccept: false,
          beeponincoming: 0,
          beeponconnect: 0,
          enginepriority_webrtc: 0,
          enginepriority_ns: 5,
        };

        console.log(window.webphone_api);

        window.webphone_api.onEvent(function (type, message) {
          if (type === "event") {
            var evtarray = message.split(",");
            const outCall = storage.outCall;
            if (evtarray[0] === "STATUS" && evtarray[2] === "Accepted") {
              const before = new Date();
              intervalMizzu = setInterval(() => {
                const now = new Date();
                const timeDifference = now - before;

                const secondsInADay = 60 * 60 * 1000 * 24;
                const secondsInAHour = 60 * 60 * 1000;

                const hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
                const mins = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1);
                const secs = Math.floor(
                  ((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000) * 1
                );

                emit({
                  type: "DURATION_SET",
                  data: `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${
                    secs < 10 ? "0" + secs : secs
                  }`,
                });
              }, 1000);
            }

            if (evtarray[0] === "STATUS" && evtarray[2] === "Ringing") {
              console.log("======>RINGING...", message);
              if (!outCall) {
                emit({ type: "OPEN_INCOMING_SET", data: true });
                emit({ type: "CALL_SET", data: evtarray });
              }
              emit({ type: "STATUS_CALL_SET", data: "RINGING" });
            }
          }
        });

        window.webphone_api.onAppStateChange(function (
          state //watch for webphone state changes
        ) {
          console.log("===> this state: ", state);
          if (state === "loaded") {
            window.webphone_api.start(); //start if not started automatically
            window.webphone_api.onCallStateChange(function (event, direction, peername, peerdisplayname, line, callid) {
              console.log("EVENT BOS : " + event);
              if (event === "callSetup") {
                if (direction === 1) {
                  console.log("====> OUTGOING CALL");
                } else if (direction === 2) {
                  console.log("====> INCOMING CALL");
                }
              }
              if (event === "callConnected" || event === "connected") {
                voiceCreateSession(
                  {
                    datetime: window.moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    event: "answer",
                    src:
                      peername?.toString()?.indexOf("0") === 0
                        ? "+62" + peername?.toString()?.substring(1)
                        : peername?.toString(),
                    extension: isAuthenticated()?.user.user_pbx,
                    ruid: new Date().toUTCString(),
                    uid: new Date().toUTCString(),
                  },
                  emit,
                  "answer"
                );
              }
              if (event === "callDisconnected" || event === "disconnected") {
                console.log("===> call disconnect :" + peername);
                voiceCreateSession(
                  {
                    datetime: window.moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    event: "hangup",
                    src:
                      peername?.toString()?.indexOf("0") === 0
                        ? "+62" + peername?.toString()?.substring(1)
                        : peername?.toString(),
                    extension: isAuthenticated()?.user.user_pbx,
                    ruid: new Date().toUTCString(),
                    uid: new Date().toUTCString(),
                  },
                  emit,
                  "hangup"
                );
              }
            });
          } else if (state === "started") {
            emit({ type: "STATUS_REGISTER_SET", data: "STARTED" });
            console.log("STARTED");
            console.log("ON START...");
          }
        });

        window.webphone_api.onRegStateChange(function (
          state //watch for webphone state changes
        ) {
          console.log("===>onRegStateChange:", state);
          emit({
            type: "STATUS_REGISTER_SET",
            data: state.toString().toUpperCase(),
          });
        });

        window.webphone_api.onCdr(function (
          caller,
          called,
          connecttime,
          duration,
          direction,
          peerdisplayname,
          reason,
          line
        ) {
          console.log("===>CRD:", caller, called, connecttime, duration, direction, peerdisplayname, reason, line);
        });
      }
    }
    return () => {};
  });
}

function* avayaEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const eventLoadV2 = () => {
      setTimeout(() => {
        if (window.VieraCTIAvayaV3 && voiceSetting === "avaya") {
          window.VieraCTIAvayaV3.event.onStartup = function (message) {
            emit({ type: "STATUS_REGISTER_SET", data: "STARTED" });
            if (message?.message === "login success") {
              emit({ type: "STATUS_REGISTER_SET", data: "REGISTERED" });
            } else {
              emit({ type: "STATUS_REGISTER_SET", data: "FAILED" });
            }
          };
          window.VieraCTIAvayaV3.event.onShutdown = function (message) {
            console.log(message);
          };
          window.VieraCTIAvayaV3.event.onRing = function (message) {
            const before = new Date();
            intervalAvaya = setInterval(() => {
              const now = new Date();
              const timeDifference = now - before;
              const secondsInADay = 60 * 60 * 1000 * 24;
              const secondsInAHour = 60 * 60 * 1000;
              const hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
              const mins = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1);
              const secs = Math.floor(((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000) * 1);
              emit({
                type: "DURATION_SET",
                data: `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${
                  secs < 10 ? "0" + secs : secs
                }`,
              });
            }, 1000);

            emit({ type: "CALL_SET", data: [0, 0, 0, message.data] });
            emit({ type: "OPEN_INCOMING_SET", data: true });

            const post = {
              data: {
                event: "answer",
                src: message.data,
                ext: message.message,
              },
            };
            voiceCreateSession(post, emit, "answer");
          };
          window.VieraCTIAvayaV3.event.onHangup = function (message) {
            clearInterval(intervalAvaya);
            const post = {
              data: {
                event: "hangup",
                src: message.data,
                ext: message.message,
              },
            };
            voiceCreateSession(post, emit, "hangup");
          };
          window.VieraCTIAvayaV3.event.onTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvayaV3.event.onInitTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvayaV3.event.onInitTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvayaV3.load = function () {
            window.VieraCTIAvayaV3.doLogin();
          };
          window.VieraCTIAvayaV3.doConnect();
        }
      }, 3000);
    };
    const eventLoadV3 = () => {
      setTimeout(() => {
        if (window.VieraCTIAvaya && voiceSetting === "avaya") {
          window.VieraCTIAvaya.event.onStartup = function (message) {
            console.log(message);
            emit({ type: "STATUS_REGISTER_SET", data: "STARTED" });
            if (message?.message === "login success") {
              emit({ type: "STATUS_REGISTER_SET", data: "REGISTERED" });
            } else {
              emit({ type: "STATUS_REGISTER_SET", data: "FAILED" });
            }
          };
          window.VieraCTIAvaya.event.onShutdown = function (message) {
            console.log(message);
          };
          window.VieraCTIAvaya.event.onRing = function (message) {
            const before = new Date();
            intervalAvaya = setInterval(() => {
              const now = new Date();
              const timeDifference = now - before;
              const secondsInADay = 60 * 60 * 1000 * 24;
              const secondsInAHour = 60 * 60 * 1000;
              const hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
              const mins = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1);
              const secs = Math.floor(((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000) * 1);
              emit({
                type: "DURATION_SET",
                data: `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${
                  secs < 10 ? "0" + secs : secs
                }`,
              });
            }, 1000);

            emit({ type: "CALL_SET", data: [0, 0, 0, message.data] });
            emit({ type: "OPEN_INCOMING_SET", data: true });

            const post = {
              data: {
                event: "answer",
                src: message.data,
                ext: message.message,
              },
            };
            voiceCreateSession(post, emit, "answer");
          };
          window.VieraCTIAvaya.event.onHangup = function (message) {
            clearInterval(intervalAvaya);
            const post = {
              data: {
                event: "hangup",
                src: message.data,
                ext: message.message,
              },
            };
            voiceCreateSession(post, emit, "hangup");
          };
          window.VieraCTIAvaya.event.onTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvaya.event.onInitTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvaya.event.onInitTransfer = function (message) {
            console.log(message);
          };
          window.VieraCTIAvaya.load = function () {
            window.VieraCTIAvaya.doLogin();
          };
          window.VieraCTIAvaya.doConnect();
        }
      }, 3000);
    };
    eventLoadV2();
    eventLoadV3();
    return () => {};
  });
}

function voiceGetTask(emit) {
  const state = store.default.getState();
  console.log("parsing data");
  axios
    .get(
      `/service/interaction/listTask?channel_id=1&sortType=DESC&taskType=assigned&limit=10&page=1&r=${Date.now()}&term=`
    )
    .then((res) => {
      console.log(res);
      const dataFiltered = _.orderBy(res?.data?.data, ["date_start"], ["desc"]);
      state.task["assigned"] = dataFiltered;
      emit({ type: "TASK_SET", task: state.task });
      emit({ type: "LOAD_MORE_SET", current: false });
    });
}

function voiceCreateSession(parsingJSON, emit, status) {
  const state = store.default.getState();
  let resultInteractionCurrent = state.interactionCurrent;
  axios
    .post("/service/voice/incoming", {
      date: parsingJSON?.datetime ? new Date(parsingJSON?.datetime).toISOString() : null,
      event: parsingJSON?.data.event,
      from_id: parsingJSON?.data.src,
      extension: parsingJSON?.data.ext,
      ruid:
        voiceSetting === "sixthsense"
          ? status === "hangup"
            ? resultInteractionCurrent.voice.ruid
            : parsingJSON?.data?.ruid
          : status === "hangup"
          ? parsingJSON?.data?.ruid
            ? parsingJSON?.data?.ruid
            : resultInteractionCurrent.voice.session_id
          : parsingJSON?.data?.ruid,
      uid: parsingJSON?.data?.uid,
      queue: parsingJSON?.data?.queue,
      recording: parsingJSON?.data?.rec,
      description: parsingJSON?.data?.description,
    })
    .then(async (res) => {
      if (res) {
        voiceGetTask(emit);
        emit({ type: "STATUS_CALL_SET", data: status?.toUpperCase() });
        if (status === "ringing") {
          Notification.requestPermission();
          if (!Notification) {
            alert("Desktop notifications not available in your browser. Try Chromium.");
            return;
          }

          if (Notification.permission !== "granted") {
            Notification.requestPermission();
          } else {
            const notification = new Notification("Omnix Voice", {
              icon: `${window.ASSET_URL}/images/favicon.png`,
              body: "New interaction voice from " + parsingJSON?.data.src,
            });
            notification.onclick = function () {
              // history.push(`/${route}`);
              notification.close();
            };
          }

          axios
            .get(`/customer?sortBy=id&sortType=DESC&limit=1&page=1&hp=${encodeURIComponent(parsingJSON.data.src)}`)
            .then((c) => {
              if (c.data?.data.length > 0) {
                emit({ type: "OPEN_INCOMING_SET", data: true });
                emit({
                  type: "CALL_SET",
                  data: [0, 0, 0, `${c.data?.data[0].name || "No Name"} / ${parsingJSON.data.src}`],
                });
                emit({ type: "STATUS_CALL_SET", data: "RINGING" });
              } else {
                emit({ type: "OPEN_INCOMING_SET", data: true });
                emit({ type: "CALL_SET", data: [0, 0, 0, parsingJSON.data.src] });
                emit({ type: "STATUS_CALL_SET", data: "RINGING" });
              }
            });
        }
        if (status === "answer") {
          setStorage("KPwpN5Bjh4Y2N2L1CC4sRQ==", "voice", false);
          resultInteractionCurrent.voice = res?.data;
          emit({ type: "CHANNEL_SET", channel: 1 });
          emit({
            type: "INTERACTION_CURRENT_SET",
            current: resultInteractionCurrent,
          });
        }
        if (status === "hangup") {
          emit({ type: "OPEN_INCOMING_SET", data: false });
          emit({ type: "STATUS_CALL_SET", data: false });
          emit({ type: "CALL_SET", data: [] });
        }
      }
    });
}

function* amiVoiceWatcher() {
  try {
    const amiVoice = yield window.ReduxSaga.effects.call(amiVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(amiVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function amiConnectVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(1);
        if (validateChannel && voiceSetting === "ami") {
          if (data) {
            emit({
              type: "STATUS_REGISTER_SET",
              data: "REGISTERED",
            });
          }
        }
      }
    };
    socket.default.amiSocketConnect(socketEvent);
    return () => {};
  });
}

function amiDisconnectVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(1);
        if (validateChannel && voiceSetting === "ami") {
          if (data) {
            emit({
              type: "STATUS_REGISTER_SET",
              data: "FAILED",
            });
          }
        }
      }
    };
    socket.default.amiSocketDisconnect(socketEvent);
    return () => {};
  });
}

function amiErrorVoiceEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      if (isAuthenticated() && isAuthenticated().user.level === "agent") {
        const validateChannel = isAuthenticated()?.user.skill.includes(1);
        if (validateChannel && voiceSetting === "ami") {
          emit({
            type: "STATUS_REGISTER_SET",
            data: "FAILED",
          });
        }
      }
    };
    socket.default.amiSocketError(socketEvent);
    return () => {};
  });
}

function trackingPetugasEventChannel() {
  return new window.ReduxSaga.eventChannel((emit) => {
    const socketEvent = (data) => {
      let decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      const state = store.default.getState();
      let result = [];
      let dirtyDataPetugas = state.listPetugas;
      if (dirtyDataPetugas.length > 0) {
        const dataIndex = dirtyDataPetugas.findIndex((v) => v.userid === decryptData.userid);
        if (dataIndex > 0) {
          dirtyDataPetugas[dataIndex] = decryptData;
          result = dirtyDataPetugas;
        } else {
          result = dirtyDataPetugas;
        }
      } else {
        result = dirtyDataPetugas;
      }
      emit({ type: "LIST_PETUGAS_SET", list: result });
      Emitter.emit("LIST_PETUGAS_SET", result);
    };
    socket.default.trackingPetugas(socketEvent);
    return () => {};
  });
}

function* amiConnectVoiceWatcher() {
  try {
    const amiVoice = yield window.ReduxSaga.effects.call(amiConnectVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(amiVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* amiDisconnectVoiceWatcher() {
  try {
    const amiVoice = yield window.ReduxSaga.effects.call(amiDisconnectVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(amiVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* amiErrorVoiceWatcher() {
  try {
    const amiVoice = yield window.ReduxSaga.effects.call(amiErrorVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(amiVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* trackingPetugasVoiceWatcher() {
  try {
    const tracking = yield window.ReduxSaga.effects.call(trackingPetugasEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(tracking);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* sixthsenseVoiceWatcher() {
  try {
    const sixthsense = yield window.ReduxSaga.effects.call(sixthsenseVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(sixthsense);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* mizzuVoiceWatcher() {
  try {
    const mizzuVoice = yield window.ReduxSaga.effects.call(mizzuVoiceEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(mizzuVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* avayaVoiceWatcher() {
  try {
    const avayaVoice = yield window.ReduxSaga.effects.call(avayaEventChannel);
    while (true) {
      const action = yield window.ReduxSaga.effects.take(avayaVoice);
      yield window.ReduxSaga.effects.put(action);
    }
  } catch (error) {
    console.log(error);
  }
}

function* getListPetugas() {
  try {
    const url = `/user/listPetugasDuty`;
    const data = yield window.ReduxSaga.effects.call(axios.get, url);
    yield window.ReduxSaga.effects.put({
      type: "LIST_PETUGAS_SET",
      list: data?.data ?? [],
    });
  } catch (err) {
    console.log(err);
  }
}

function* getJourneyFollow(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const indHome = action.journey.indNum ? `&indihomeNumber=${action.journey.indNum}` : "";
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/follow-up/journey?cust_id=${action.journey.cust_id}&limit=10&page=${action.journey.page}${indHome}`
    );

    if (action.journey.nextPage > 0) {
      result = state.journeyFollowUp.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data?.length === 0) {
      state.loadMore.list_journey = false;
    } else {
      state.loadMore.list_journey = true;
    }

    const dataFiltered = _.orderBy(result, ["id"], ["desc"]);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "ERROR_SET", error: false }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LOAD_MORE_SET",
        current: state.loadMore,
      }),
      window.ReduxSaga.effects.put({
        type: "JOURNEY_FOLLOW_SET",
        journey: dataFiltered,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_journey",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

function* getJourneyLogFollow(action) {
  try {
    const url = `/follow-up?sortBy=id&sortType=DESC&limit=10&page=${action?.data?.term ?? "1"}&term=${
      action?.data?.page ?? "%20"
    }`;
    const data = yield window.ReduxSaga.effects.call(axios.get, url);
    yield window.ReduxSaga.effects.put({
      type: "LOG_JOURNEY_SET",
      data: data?.data ?? null,
    });
  } catch (err) {
    console.log(err);
  }
}

function* getJourneyFollowDetail(action) {
  try {
    const url = `/follow-up/detail?session_id=${action?.data?.session_id}&channel_id=${action?.data?.channel_id}`;
    const data = yield window.ReduxSaga.effects.call(axios.get, url);
    yield window.ReduxSaga.effects.put({
      type: "JOURNEY_DETAIL_FOLLOW_UP_SET",
      data: data?.data ?? null,
    });
  } catch (err) {
    console.log(err);
  }
}

export function* getThresholdDuration(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(axios.get, `/service/threshold`);
    yield window.ReduxSaga.effects.put({
      type: "TRESHOLD_SET",
      data: data?.data ?? [],
    });
  } catch (error) {
    console.log(error);
  }
}

export function* watchUsers(context) {
  yield window.ReduxSaga.effects.setContext(context);
  yield window.ReduxSaga.effects.all([
    window.ReduxSaga.effects.takeEvery("CHANNEL_LIST_GET", getChannel),
    window.ReduxSaga.effects.takeEvery("INTERACTION_GET", getInteraction),
    window.ReduxSaga.effects.takeEvery("INTERACTION_HISTORY_GET", getInteractionHistory),
    window.ReduxSaga.effects.takeEvery("INTERACTION_CASE_GET", getInteractionCase),
    window.ReduxSaga.effects.takeEvery("TASK_GET", getTask),
    window.ReduxSaga.effects.takeEvery("TASK_COUNT_GET", getTaskCount),
    window.ReduxSaga.effects.takeEvery("LOG_SESSION_GET", getLogSession),
    window.ReduxSaga.effects.takeEvery("LOG_INTERACTION_GET", getLogInteraction),
    window.ReduxSaga.effects.takeEvery("PROFILE_GET", getProfile),
    window.ReduxSaga.effects.takeEvery("GROUP_GET", getGroup),
    window.ReduxSaga.effects.takeEvery("USER_GET", getUser),
    window.ReduxSaga.effects.takeEvery("CUSTOMER_GET", getCustomer),
    window.ReduxSaga.effects.takeEvery("JOURNEY_GET", getJourney),
    window.ReduxSaga.effects.takeEvery("TICKET_STATUS_GET", ticketing.getTicketStatus),
    window.ReduxSaga.effects.takeEvery("TICKET_LIST_GET", ticketing.getTicketList),
    window.ReduxSaga.effects.takeEvery("TICKET_PRIORITY_GET", ticketing.getTicketPriority),
    window.ReduxSaga.effects.takeEvery("TICKET_JOURNEY_GET", ticketing.getJourneyTicket),
    window.ReduxSaga.effects.takeEvery("TICKET_HISTORY_GET", ticketing.getHistoryTicket),
    window.ReduxSaga.effects.takeEvery("UNIT_LIST_GET", getUnitList),
    window.ReduxSaga.effects.takeEvery("CATEGORY_LIST_GET", getCategory),
    window.ReduxSaga.effects.takeEvery("TICKET_LOG_GET", ticketing.getTicketLog),
    window.ReduxSaga.effects.takeEvery("TICKET_LOG_DETAIL_GET", ticketing.getTicketDetailLog),
    window.ReduxSaga.effects.takeEvery("LIST_PRODUCT_SALES_GET", sales.getSalesProductCall),
    window.ReduxSaga.effects.takeEvery("LIST_CAMPAIGN_SALES_GET", sales.getSalesCampaignCall),
    window.ReduxSaga.effects.takeEvery("LIST_PRODUCT_ADMIN_SALES_GET", sales.getSalesAdminProductCall),
    window.ReduxSaga.effects.takeEvery("LIST_CAMPAIGN_ADMIN_SALES_GET", sales.getSalesAdminCampaignCall),
    window.ReduxSaga.effects.takeEvery("LIST_SUB_REASON_SALES_GET", sales.getListSubReasonCallSales),
    window.ReduxSaga.effects.takeEvery("LIST_REASON_CALL_SALES_GET", sales.getListReasonCallSales),
    window.ReduxSaga.effects.takeEvery("LIST_STATUS_CALL_SALES_GET", sales.getListStatusCallSales),
    window.ReduxSaga.effects.takeEvery("LIST_TASK_SALES_GET", sales.getListTaskSales),
    window.ReduxSaga.effects.takeEvery("LIST_JOURNEY_SALES_GET", sales.getJourneSales),
    window.ReduxSaga.effects.takeEvery("GET_AGENT_PERFOMANCE", dashboard.getAgentPerfomance),
    window.ReduxSaga.effects.takeEvery("GET_INTERVAL_CHANNEL", dashboard.intervalChannel),
    window.ReduxSaga.effects.takeEvery("GET_SUMMARY_CHANNEL", dashboard.summaryChannel),
    window.ReduxSaga.effects.takeEvery("GET_STATUS_TICKET", dashboard.statusTicket),
    window.ReduxSaga.effects.takeEvery("GET_MARKETER_SUMMARY_CHANNEL", dashboard.marketerSummaryChannel),
    window.ReduxSaga.effects.takeEvery("GET_TOP_CATEGORY", dashboard.topCategory),
    window.ReduxSaga.effects.takeEvery("GET_SUMMARY_CASE", dashboard.summaryCase),
    window.ReduxSaga.effects.takeEvery("GET_SUMMARY_STATUS_CALL", dashboard.summaryStatusCall),
    window.ReduxSaga.effects.takeEvery("GET_STATUS_CALL_CAMPAIGN", dashboard.statusCallCampaign),
    window.ReduxSaga.effects.takeEvery("GET_SUMMARY_REASON", dashboard.summaryReason),
    window.ReduxSaga.effects.takeEvery("GET_SUMMARY_SUB_REASON", dashboard.summarySubReason),
    window.ReduxSaga.effects.takeEvery("GET_VOICE_CALL", dashboard.voiceCall),
    window.ReduxSaga.effects.takeEvery("FLEXMONSTER_GET", tabels.flexMonster),
    window.ReduxSaga.effects.takeEvery("LIST_CUSTOM_REPORT_GET", tabels.customReportList),
    window.ReduxSaga.effects.takeEvery("JOURNEY_FOLLOW_UP_GET", getJourneyFollow),
    window.ReduxSaga.effects.takeEvery("FOLLOW_UP_DETAIL_GET", getJourneyFollowDetail),
    window.ReduxSaga.effects.takeEvery("LIST_PETUGAS_GET", getListPetugas),
    window.ReduxSaga.effects.takeEvery("LOG_JOURNEY_GET", getJourneyLogFollow),
    window.ReduxSaga.effects.takeEvery("GET_TOTAL_CALL", dashboard.totalCall),
    window.ReduxSaga.effects.takeEvery("TRESHOLD_GET", getThresholdDuration),
    window.ReduxSaga.effects.fork(socketInteraction),
    window.ReduxSaga.effects.fork(socketUpdateInteraction),
    window.ReduxSaga.effects.fork(socketTotalQueue),
    window.ReduxSaga.effects.fork(socketTotalHandled),
    window.ReduxSaga.effects.fork(socketTotalTicket),
    window.ReduxSaga.effects.fork(socketNewQueue),
    window.ReduxSaga.effects.fork(socketNewHandled),
    window.ReduxSaga.effects.fork(sixthsenseVoiceWatcher),
    window.ReduxSaga.effects.fork(twillioVideoWatcher),
    window.ReduxSaga.effects.fork(amiVoiceWatcher),
    window.ReduxSaga.effects.fork(amiConnectVoiceWatcher),
    window.ReduxSaga.effects.fork(amiDisconnectVoiceWatcher),
    window.ReduxSaga.effects.fork(amiErrorVoiceWatcher),
    window.ReduxSaga.effects.fork(mizzuVoiceWatcher),
    window.ReduxSaga.effects.fork(avayaVoiceWatcher),
    window.ReduxSaga.effects.fork(socketVideoChatEvent),
    window.ReduxSaga.effects.fork(socketCallBackVoice),
    window.ReduxSaga.effects.fork(trackingPetugasVoiceWatcher),
  ]);
}
