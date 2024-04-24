const redux = require("redux");
const dashboardReducer = require("./dasboard");
const ticketReducer = require("./ticket");
const salesReducer = require("./sales");
const tabelsReducer = require("./tabels");

const draftDefault = (state) => {
  return state || {};
};

const listPetugasReducer = (state, action) => {
  switch (action.type) {
    case "LIST_PETUGAS_GET":
      return state || [];
    case "LIST_PETUGAS_RELOAD":
      return state || [];
    case "LIST_PETUGAS_SET":
      return action.list;
    default:
      return state || [];
  }
};

const customerReducer = (state, action) => {
  switch (action.type) {
    case "CUSTOMER_GET":
      return state || [];
    case "CUSTOMER_SET":
      return action.customer;
    default:
      return state || [];
  }
};

const customerCurrentReducer = (state, action) => {
  switch (action.type) {
    case "CUSTOMER_CURRENT_GET":
      return state || false;
    case "CUSTOMER_CURRENT_SET":
      return action.current;
    default:
      return state || false;
  }
};

const interactionCurrentReducer = (state, action) => {
  switch (action.type) {
    case "INTERACTION_CURRENT_GET":
      return (
        state || {
          voice: null,
          email: null,
          chat: null,
          sms: null,
          telegram: null,
          facebookComment: null,
          facebookMessage: null,
          twitterComment: null,
          videocall: null,
          line: null,
          instagramComment: null,
          whatsapp: null,
          twitterMessage: null,
          walkIn: null,
          contactUs: null,
          instagramMessage: null,
          alertSystem: null,
          va: null,
        }
      );
    case "INTERACTION_CURRENT_SET":
      return action.current;
    default:
      return (
        state || {
          voice: null,
          email: null,
          chat: null,
          sms: null,
          telegram: null,
          facebookComment: null,
          facebookMessage: null,
          twitterComment: null,
          videocall: null,
          line: null,
          instagramComment: null,
          whatsapp: null,
          twitterMessage: null,
          walkIn: null,
          contactUs: null,
          instagramMessage: null,
          alertSystem: null,
          va: null,
        }
      );
  }
};

const channelReducer = (state, action) => {
  switch (action.type) {
    case "CHANNEL_GET":
      return state || 0;
    case "CHANNEL_SET":
      return action.channel;
    default:
      return state || 0;
  }
};

const allRtcReducer = (state, action) => {
  switch (action.type) {
    case "ALL_RTC_GET":
      return state || 0;
    case "ALL_RTC_SET":
      return action.allRtc;
    default:
      return state || 0;
  }
};

const nallRtcReducer = (state, action) => {
  switch (action.type) {
    case "NALL_RTC_GET":
      return state || 0;
    case "NALL_RTC_SET":
      return action.nallRtc;
    default:
      return state || 0;
  }
};

const channelListReducer = (state, action) => {
  switch (action.type) {
    case "CHANNEL_LIST_GET":
      return state || false;
    case "CHANNEL_LIST_SET":
      return action.channel;
    default:
      return state || false;
  }
};

const loadingReducer = (state, action) => {
  switch (action.type) {
    case "LOADING_GET":
      return (
        state || {
          list_customer: false,
          list_sales: false,
          list_journey: false,
          list_journey_ticket: false,
          list_journey_sales: false,
          log_interaction_body: false,
          list_log_journey: false,
          list_log_interaction: false,
          list_log_detail_ticket: false,
          list_log_ticket: false,
          interaction_body: false,
          submit_case: false,
          history_interaction: false,
          list_history_rtc: false,
          list_group: false,
          list_user: false,
          list_case: false,
          footer_case: false,
          list_task: false,
          is_upload: false,
          upload_data: null,
          end_interaction: false,
          list_ticket_status: false,
        }
      );

    case "LOADING_SET":
      return action.loading;
    default:
      return (
        state || {
          list_customer: false,
          list_sales: false,
          list_journey: false,
          list_journey_ticket: false,
          list_journey_sales: false,
          log_interaction_body: false,
          list_log_journey: false,
          list_log_interaction: false,
          list_log_detail_ticket: false,
          list_log_ticket: false,
          interaction_body: false,
          submit_case: false,
          history_interaction: false,
          list_history_rtc: false,
          list_group: false,
          list_user: false,
          list_case: false,
          footer_case: false,
          list_task: false,
          is_upload: false,
          upload_data: null,
          end_interaction: false,
        }
      );
  }
};

const errorReducer = (state, action) => {
  switch (action.type) {
    case "ERROR_GET":
      return state || false;
    case "ERROR_SET":
      return action.error;
    default:
      return state || false;
  }
};

const isUpdateReducer = (state, action) => {
  switch (action.type) {
    case "IS_UPDATE_GET":
      return state || false;
    case "IS_UPDATE_SET":
      return action.data;
    default:
      return state || false;
  }
};

const interactionReducer = (state, action) => {
  switch (action.type) {
    case "INTERACTION_GET":
      return state || [];
    case "INTERACTION_SET":
      return action.interaction;
    case "INTERACTION_RESET":
      return [];
    default:
      return state || [];
  }
};

const interactionHistoryReducer = (state, action) => {
  switch (action.type) {
    case "INTERACTION_HISTORY_GET":
      return state || [];
    case "INTERACTION_HISTORY_SET":
      return action.interaction;
    default:
      return state || [];
  }
};

const interactionCaseReducer = (state, action) => {
  switch (action.type) {
    case "INTERACTION_CASE_GET":
      return state || [];
    case "INTERACTION_CASE_SET":
      return action.interaction;
    default:
      return state || [];
  }
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "TASK_GET":
      return state || { unassigned: [], assigned: [], resolved: [] };
    case "TASK_SET":
      return action.task;
    default:
      return state || { unassigned: [], assigned: [], resolved: [] };
  }
};

const taskCountReducer = (state, action) => {
  switch (action.type) {
    case "TASK_COUNT_GET":
      return state || { unassigned: 0, assigned: 0, resolved: 0 };
    case "TASK_COUNT_SET":
      return action.task;
    default:
      return state || { unassigned: 0, assigned: 0, resolved: 0 };
  }
};

const defaultLoadMore = (state) => {
  return (
    state || {
      list_customer: false,
      list_task: false,
      list_journey: false,
      list_group: false,
      list_user: false,
      list_sales: false,
      list_log_interaction: false,
      list_log_ticket: false,
      list_ticket_status: false,
      history_interaction: false,
      journey_interaction: false,
      journey_ticket: false,
      journey_sales: false,
      history_ticket: false,
    }
  );
};
const loadMoreReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_MORE_GET":
      return defaultLoadMore(state);
    case "LOAD_MORE_SET":
      return action.current;
    default:
      return defaultLoadMore(state);
  }
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFICATION_GET":
      return state || [];
    case "NOTIFICATION_SET":
      return action.notification;
    default:
      return state || [];
  }
};

const groupReducer = (state, action) => {
  switch (action.type) {
    case "GROUP_GET":
      return state || [];
    case "GROUP_SET":
      return action.group;
    default:
      return state || [];
  }
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "USER_GET":
      return state || [];
    case "USER_SET":
      return action.user;
    default:
      return state || [];
  }
};

const draftReducer = (state, action) => {
  switch (action.type) {
    case "DRAFT_GET":
      return state || [];
    case "DRAFT_SET":
      return action.draft;
    default:
      return state || [];
  }
};

const totalQueueReducer = (state, action) => {
  switch (action.type) {
    case "TOTAL_QUEUE_GET":
      return state || 0;
    case "TOTAL_QUEUE_SET":
      return action.total;
    default:
      return state || 0;
  }
};

const totalHandledReducer = (state, action) => {
  switch (action.type) {
    case "TOTAL_HANDLED_GET":
      return state || 0;
    case "TOTAL_HANDLED_SET":
      return action.total;
    default:
      return state || 0;
  }
};

const zoomReducer = (state, action) => {
  switch (action.type) {
    case "ZOOM_GET":
      return state || true;
    case "ZOOM_SET":
      return action.zoom;
    default:
      return state || true;
  }
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case "MODAL_GET":
      return state || false;
    case "MODAL_SET":
      return action.modal;
    default:
      return state || false;
  }
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case "PROFILE_GET":
      return state || false;
    case "PROFILE_SET":
      return { ...action.profile, ...{ call: action.profile?.hp ?? null } };
    case "PROFILE_RESET":
      return null;
    default:
      return state || false;
  }
};

const alertReducer = (state, action) => {
  switch (action.type) {
    case "ALERT_GET":
      return state || false;
    case "ALERT_SET":
      return action.alert;
    default:
      return state || false;
  }
};

const alertTypeReducer = (state, action) => {
  switch (action.type) {
    case "ALERT_TYPE_GET":
      return state || false;
    case "ALERT_TYPE_SET":
      return action.alert;
    default:
      return state || false;
  }
};

const asideReducer = (state, action) => {
  switch (action.type) {
    case "ASIDE_GET":
      return state || "profile";
    case "ASIDE_SET":
      return action.aside;
    default:
      return state || "profile";
  }
};

const interactionTypeReducer = (state, action) => {
  switch (action.type) {
    case "INTERACTION_TYPE_GET":
      return state || "now";
    case "INTERACTION_TYPE_SET":
      return action.interaction;
    default:
      return state || "now";
  }
};

const unitListReducer = (state, action) => {
  switch (action.type) {
    case "UNIT_LIST_GET":
      return state || [];
    case "UNIT_LIST_SET":
      return action.data;
    default:
      return state || [];
  }
};

const categoryListReducer = (state, action) => {
  switch (action.type) {
    case "CATEGORY_LIST_GET":
      return state || [];
    case "CATEGORY_LIST_SET":
      return action.data;
    default:
      return state || [];
  }
};

const collapseChannelReducer = (state, action) => {
  switch (action.type) {
    case "COLLAPSE_CHANNEL_GET":
      return state || false;
    case "COLLAPSE_CHANNEL_SET":
      return action.collapse;
    default:
      return state || false;
  }
};

const customerCaseReducer = (state, action) => {
  switch (action.type) {
    case "CUSTOMER_CASE_GET":
      return state || false;
    case "CUSTOMER_CASE_SET":
      return action.customer;
    default:
      return state || false;
  }
};

const journeyReducer = (state, action) => {
  switch (action.type) {
    case "JOURNEY_GET":
      return state || [];
    case "JOURNEY_SET":
      return action.journey;
    case "JOURNEY_RESET":
      return [];
    default:
      return state || [];
  }
};

const emailDetailDefault = (state) => {
  return (
    state || {
      isReply: false,
      isForward: false,
      isReplyAll: false,
    }
  );
};
const emailDetailReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_DETAIL_GET":
      return emailDetailDefault(state);
    case "EMAIL_DETAIL_SET":
      return action.data;
    default:
      return emailDetailDefault(state);
  }
};

const emailReplyDefault = (state) => {
  return (
    state || {
      addCc: false,
      emailList: [],
      emailUser: "",
      emailCcList: [],
      emailBccList: [],
      emailCcUser: [],
      emailAttachment: [],
      subject: "",
      message: "",
      loading: false,
      isZoom: false,
    }
  );
};
const emailReplyReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_REPLY_GET":
      return emailReplyDefault(state);
    case "EMAIL_REPLY_SET":
      return action.data;
    default:
      return emailReplyDefault(state);
  }
};

const emailReplyDraftReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_REPLY_DRAFT_GET":
      return draftDefault(state);
    case "EMAIL_REPLY_DRAFT_SET":
      return action.data;
    default:
      return draftDefault(state);
  }
};

const instagramDetailDefault = (state) => {
  return (
    state || {
      feed: null,
      interactions: [],
    }
  );
};
const instagramDetailReducer = (state, action) => {
  switch (action.type) {
    case "IG_DETAIL_GET":
      return instagramDetailDefault(state);
    case "IG_DETAIL_SET":
      return action.data;
    default:
      return instagramDetailDefault(state);
  }
};

const logInteractionReducer = (state, action) => {
  switch (action.type) {
    case "LOG_INTERACTION_GET":
      return state || [];
    case "LOG_INTERACTION_SET":
      return action.data;
    default:
      return state || [];
  }
};

const logSessionReducer = (state, action) => {
  switch (action.type) {
    case "LOG_SESSION_GET":
      return state || [];
    case "LOG_SESSION_SET":
      return action.data;
    default:
      return state || [];
  }
};

const logCurrentReducer = (state, action) => {
  switch (action.type) {
    case "LOG_CURRENT_GET":
      return state || null;
    case "LOG_CURRENT_SET":
      return action.data;
    default:
      return state || null;
  }
};

const openIncomingReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_INCOMING_GET":
      return state || false;
    case "OPEN_INCOMING_SET":
      return action.data;
    default:
      return state || false;
  }
};

const callReducer = (state, action) => {
  switch (action.type) {
    case "CALL_GET":
      return state || [];
    case "CALL_SET":
      return action.data;
    default:
      return state || [];
  }
};

const statusCallReducer = (state, action) => {
  switch (action.type) {
    case "STATUS_CALL_GET":
      return state || false;
    case "STATUS_CALL_SET":
      return action.data;
    default:
      return state || false;
  }
};

const durationReducer = (state, action) => {
  switch (action.type) {
    case "DURATION_GET":
      return state || "00:00:00";
    case "DURATION_SET":
      return action.data;
    default:
      return state || "00:00:00";
  }
};

const openIncomingVideoCallReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_INCOMING_VIDEO_CALL_GET":
      return state || false;
    case "OPEN_INCOMING_VIDEO_CALL_SET":
      return action.data;
    default:
      return state || false;
  }
};

const videoCallReducer = (state, action) => {
  switch (action.type) {
    case "VIDEO_CALL_GET":
      return state || [];
    case "VIDEO_CALL_SET":
      return action.data;
    default:
      return state || [];
  }
};

const statusVideoCallReducer = (state, action) => {
  switch (action.type) {
    case "STATUS_VIDEO_CALL_GET":
      return state || false;
    case "STATUS_VIDEO_CALL_SET":
      return action.data;
    default:
      return state || false;
  }
};

const statusMetaReducer = (state, action) => {
  switch (action.type) {
    case "STATUS_META_GET":
      return state || false;
    case "STATUS_META_SET":
      return action.data;
    default:
      return state || false;
  }
};

const videoDurationReducer = (state, action) => {
  switch (action.type) {
    case "VIDEO_DURATION_GET":
      return state || "00:00:00";
    case "VIDEO_DURATION_SET":
      return action.data;
    default:
      return state || "00:00:00";
  }
};

const outCallReducer = (state, action) => {
  switch (action.type) {
    case "OUTCALL_GET":
      return state || false;
    case "OUTCALL_SET":
      return action.data;
    default:
      return state || false;
  }
};

const statusRegisterReducer = (state, action) => {
  switch (action.type) {
    case "STATUS_REGISTER_GET":
      return state || false;
    case "STATUS_REGISTER_SET":
      return action.data;
    default:
      return state || false;
  }
};

const journeyFollowReducer = (state, action) => {
  switch (action.type) {
    case "JOURNEY_FOLLOW_GET":
      return state || [];
    case "JOURNEY_FOLLOW_SET":
      return action.journey;
    case "JOURNEY_RESET":
      return [];
    default:
      return state || [];
  }
};

const journeyDetailFollowReducer = (state, action) => {
  switch (action.type) {
    case "JOURNEY_DETAIL_FOLLOW_UP_GET":
      return state || null;
    case "JOURNEY_DETAIL_FOLLOW_UP_SET":
      return action.data;
    default:
      return state || null;
  }
};

const journeyLogFollowReducer = (state, action) => {
  switch (action.type) {
    case "LOG_JOURNEY_GET":
      return state || { list: [], detail: null };
    case "LOG_JOURNEY_SET":
      return action.data;
    default:
      return state || { list: [], detail: null };
  }
};

export const threshold = (state, action) => {
  switch (action.type) {
    case "TRESHOLD_GET":
      return state || [];
    case "TRESHOLD_SET":
      return action.data;
    default:
      return state || [];
  }
};

const sourceManualKipReducer = (state, action) => {
  switch (action.type) {
    case "SOURCE_MANUAL_KIP_GET":
      return state || { list: [], detail: null };
    case "SOURCE_MANUAL_KIP_SET":
      return action.data;
    default:
      return state || { list: [], detail: null };
  }
};

const pelaporReducer = (state, action) => {
  switch (action.type) {
    case "PELAPOR_GET":
      return state || null;
    case "PELAPOR_SET":
      return action.data;
    default:
      return state || null;
  }
};

const pasienReducer = (state, action) => {
  switch (action.type) {
    case "PASIEN_GET":
      return state || null;
    case "PASIEN_SET":
      return action.data;
    default:
      return state || null;
  }
};

const caseDraftReducer = (state, action) => {
  switch (action.type) {
    case "CASE_DRAFT_GET":
      return draftDefault(state);
    case "CASE_DRAFT_SET":
      return action.data;
    default:
      return draftDefault(state);
  }
};

const ticketDraftReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_DRAFT_GET":
      return draftDefault(state);
    case "TICKET_DRAFT_SET":
      return action.data;
    default:
      return draftDefault(state);
  }
};

const appReducer = redux.combineReducers({
  customer: customerReducer,
  customerCurrent: customerCurrentReducer,
  interactionCurrent: interactionCurrentReducer,
  channel: channelReducer,
  allRtc: allRtcReducer,
  nallRtc: nallRtcReducer,
  channelList: channelListReducer,
  loading: loadingReducer,
  error: errorReducer,
  interaction: interactionReducer,
  interactionHistory: interactionHistoryReducer,
  interactionCase: interactionCaseReducer,
  task: taskReducer,
  taskCount: taskCountReducer,
  loadMore: loadMoreReducer,
  notification: notificationReducer,
  totalQueue: totalQueueReducer,
  totalHandled: totalHandledReducer,
  zoom: zoomReducer,
  modal: modalReducer,
  profile: profileReducer,
  aside: asideReducer,
  ticketList: ticketReducer.ticketingListReducer,
  ticketStatus: ticketReducer.ticketStatusReducer,
  ticketDetail: ticketReducer.ticketDetailReducer,
  ticketCurrent: ticketReducer.ticketCurrentReducer,
  ticketPriority: ticketReducer.ticketPriorityReducer,
  ticketJourney: ticketReducer.ticketJourneyReducer,
  ticketHistory: ticketReducer.ticketHistoryReducer,
  ticketForm: ticketReducer.ticketFormReducer,
  ticketInfo: ticketReducer.ticketInfoReducer,
  ticketTab: ticketReducer.ticketTabReducer,
  ticketLog: ticketReducer.ticketLogReducer,
  ticketLogDetail: ticketReducer.ticketLogDetailReducer,
  totalTicket: ticketReducer.totalTicketReducer,
  unitList: unitListReducer,
  categoryList: categoryListReducer,
  collapseChannel: collapseChannelReducer,
  customerCase: customerCaseReducer,
  journey: journeyReducer,
  emailDetail: emailDetailReducer,
  emailReply: emailReplyReducer,
  emailReplyDraft: emailReplyDraftReducer,
  igDetail: instagramDetailReducer,
  interactionType: interactionTypeReducer,
  draft: draftReducer,
  logInteraction: logInteractionReducer,
  logSession: logSessionReducer,
  logCurrent: logCurrentReducer,
  alert: alertReducer,
  alertType: alertTypeReducer,
  group: groupReducer,
  user: userReducer,
  salesListProduct: salesReducer.salesListProductReducer,
  salesListCampaign: salesReducer.salesListCampaignReducer,
  salesListStatusCall: salesReducer.salesListStatusCallReducer,
  salesListReasonCall: salesReducer.salesListReasonCallReducer,
  salesListSubReason: salesReducer.salesListSubReasonReducer,
  salesCurrentDetail: salesReducer.salesCurrentDetailReducer,
  salesListTask: salesReducer.salesListTaskReducer,
  salesInfoTask: salesReducer.salesInfoReducer,
  salesJourney: salesReducer.salesJourneyReducer,
  salesCallStatus: salesReducer.salesCallStatus,
  openIncoming: openIncomingReducer,
  call: callReducer,
  statusCall: statusCallReducer,
  duration: durationReducer,
  openIncomingVideoCall: openIncomingVideoCallReducer,
  videoCall: videoCallReducer,
  statusVideoCall: statusVideoCallReducer,
  videoDuration: videoDurationReducer,
  statusMeta: statusMetaReducer,
  outCall: outCallReducer,
  statusRegister: statusRegisterReducer,
  summaryChannel: dashboardReducer.summaryChannel,
  agentPerfomance: dashboardReducer.agentPerfomance,
  intervalChannel: dashboardReducer.intervalChannel,
  statusTicket: dashboardReducer.statusTicket,
  totalCall: dashboardReducer.totalCall,
  summaryCall: dashboardReducer.summaryChannel,
  marketerSummaryChannel: dashboardReducer.markterSummaryChannel,
  summaryCase: dashboardReducer.summaryCase,
  topCategory: dashboardReducer.topCategory,
  summaryStatusCall: dashboardReducer.summaryStatusCall,
  statusCallCampaign: dashboardReducer.statusCallCampaign,
  summaryReason: dashboardReducer.summaryReason,
  summarySubReason: dashboardReducer.summarySubReason,
  voiceCall: dashboardReducer.voiceCall,
  flexmonster: tabelsReducer.flexMonster,
  listCustomReport: tabelsReducer.customReportList,
  journeyFollowUp: journeyFollowReducer,
  journeyLogFollow: journeyLogFollowReducer,
  journeyDetailFollow: journeyDetailFollowReducer,
  isUpdateReducer: isUpdateReducer,
  threshold: threshold,
  sourceManualKip: sourceManualKipReducer,
  ticketAdditional: ticketReducer.ticketAdditionalReducer,
  ticketAdditionalField: ticketReducer.ticketFormAdditionalReducer,
  pelapor: pelaporReducer,
  pasien: pasienReducer,
  listPetugas: listPetugasReducer,
  caseDraft: caseDraftReducer,
  ticketDraft: ticketDraftReducer,
});

export default appReducer;
