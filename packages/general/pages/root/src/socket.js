const CryptoJS = window.CryptoJS;
const { getStorage, encrypt } = require("./helper");
let params = null;
let paramsAmi = null;
let paramsVidcall = null;
let extension = null;
let isSkillVidcall = false;
const storage = getStorage("h/zkD4TZprsOwTyHV2rxgg==", true);
const tenant = localStorage.getItem("UBrwj66nplRT/Cy0YpmhyA==");
const voiceSetting = getStorage("e2g7ooGzLTllsrEjL2aAyQ==", false);
const amiUrl = getStorage("pabx_ami_url", true);

if (storage) {
  const parameter = JSON.stringify({
    tenant_id: tenant,
    userid: storage.user.id,
    level: storage.user.level,
    group_id: storage.user.group_id,
    unit_id: storage.user.unit_id,
    user_pbx: storage.user.user_pbx,
  });
  const parameterVidcall = JSON.stringify({
    tenant_id: tenant,
    userid: storage.user.id,
    type: "agent",
  });
  extension = storage.user.user_pbx;
  params = encrypt(parameter);
  paramsVidcall = encrypt(parameterVidcall);
  paramsAmi =
    voiceSetting === "ami"
      ? `userId=${storage.user.id}&tenant_id=${tenant}&extension=${storage.user.user_pbx}`
      : null;
  isSkillVidcall = storage.user.skill?.includes(9) ? true : false;
}

let socket = params
  ? io(`${process.env.API_URL}`, {
      path: `/${tenant}/socket.io`,
      query: {
        data: params,
      },
      transports: ["websocket"],
    })
  : null;

let socketAmi = paramsAmi
  ? io(amiUrl?.value1 ? amiUrl?.value1 : process.env.AMI_URL, {
      query: paramsAmi,
      transports: ["websocket"],
    })
  : null;

let socketVidcall =
  paramsVidcall && isSkillVidcall
    ? io(process.env.VIDCALL_URL, {
        path: `/${tenant}/socket.io`,
        query: { data: paramsVidcall },
        transports: ["websocket"],
      })
    : null;
export default {
  onMessage(cb) {
    if (!socket) return;
    socket.on("newChat", (data) => cb(data));
  },
  onCase(cb) {
    if (!socket) return;
    socket.on("newCase", (data) => cb(data));
  },
  onQueue(cb) {
    if (!socket) return;
    socket.on("newQueue", (data) => cb(data));
  },
  onHandled(cb) {
    if (!socket) return;
    socket.on("newHandled", (data) => cb(data));
  },
  updateMessage(cb) {
    if (!socket) return;
    socket.on("updateStatusChat", (data) => cb(data));
  },
  totalQueue(cb) {
    if (!socket) return;
    socket.on("totalQueue", (data) => cb(data));
  },
  totalHandled(cb) {
    if (!socket) return;
    socket.on("totalHandled", (data) => cb(data));
  },
  totalTicket(cb) {
    if (!socket) return;
    socket.on("totalTicket", (data) => cb(data));
  },
  ping(cb) {
    if (!socket) return;
    socket.on("PING", (data) => cb(data));
  },
  callBackVoice(cb) {
    if (!socket) return;
    socket.on("callbackVoice", (data) => cb(data));
  },
  sendMessage(message) {
    if (!socket) return;
    socket.send(message);
  },
  sixthsenseSocket(cb) {
    return socket
      ? socket.on(`event_voice`, (data, cbb) => {
          cbb("events-get:event_voice");
          cb(data);
        })
      : null;
  },
  trackingPetugas(cb) {
    return socket ? socket.on(`trackingPetugas`, (data) => cb(data)) : null;
  },
  amiSocket(cb) {
    return socketAmi
      ? socketAmi.on(`ami-socket-${tenant}:${extension}`, (data, cbb) => {
          cbb("sukses");
          cb(data);
        })
      : null;
  },
  amiSocketConnect(cb) {
    return socketAmi
      ? socketAmi.on(`connect`, () => {
          cb(socketAmi.connected);
        })
      : null;
  },
  amiSocketDisconnect(cb) {
    return socketAmi
      ? socketAmi.on(`disconnect`, (data) => {
          cb(data);
        })
      : null;
  },
  amiSocketError(cb) {
    return socketAmi
      ? socketAmi.on(`error`, (data) => {
          cb(data);
        })
      : null;
  },
  twillioVideoCall(cb) {
    if (!socketVidcall) return;
    socketVidcall.on("incoming_video_call", (data) => cb(data));
  },
  videoCallChat(cb) {
    if (!socket) return;
    socket.on("newChatVideoCall", (data) => cb(data));
  },
};
