/*
    ---------------------------------------------------------
    DASHBOARD AGENT
    ---------------------------------------------------------
  */
//======SERVICE DATA========//
const summaryChannelDefault = (state) => {
  return (
    state || {
      label: [],
      value: [],
      summary: [],
    }
  );
};
export const summaryChannel = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_CHANNEL":
      return summaryChannelDefault(state);
    case "SET_SUMMARY_CHANNEL":
      return action.data;
    default:
      return summaryChannelDefault(state);
  }
};

export const agentPerfomance = (state, action) => {
  switch (action.type) {
    case "GET_AGENT_PERFOMANCE":
      return state || null;
    case "SET_AGENT_PERFOMANCE":
      return action.data;
    default:
      return state || null;
  }
};

const intervalChannelDefault = (state) => {
  return (
    state || {
      channel: 2,
      interval: {
        label: [],
        value: [],
      },
    }
  );
};

export const intervalChannel = (state, action) => {
  switch (action.type) {
    case "GET_INTERVAL_CHANNEL":
      return intervalChannelDefault(state);
    case "SET_INTERVAL_CHANNEL":
      return action.data;
    default:
      return intervalChannelDefault(state);
  }
};

const statusTicketDefault = (state) => {
  return (
    state || {
      status: [],
      statusCount: [],
    }
  );
};

export const statusTicket = (state, action) => {
  switch (action.type) {
    case "GET_STATUS_TICKET":
      return statusTicketDefault(state);
    case "SET_STATUS_TICKET":
      return action.data;
    default:
      return statusTicketDefault(state);
  }
};
export const summaryCase = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_CASE":
      return state || null;
    case "SET_SUMMARY_CASE":
      return action.data;
    default:
      return state || null;
  }
};

const topCategoryDefault = (state) => {
  return (
    state || {
      label: [],
      value: [],
      summary: [],
    }
  );
};

export const topCategory = (state, action) => {
  switch (action.type) {
    case "GET_TOP_CATEGORY":
      return topCategoryDefault(state);
    case "SET_TOP_CATEGORY":
      return action.data;
    default:
      return topCategoryDefault(state);
  }
};

//======SALES DATA========//
export const totalCall = (state, action) => {
  switch (action.type) {
    case "GET_TOTAL_CALL":
      return state || null;
    case "SET_TOTAL_CALL":
      return action.data;
    default:
      return state || null;
  }
};

const summaryCallDefault = (state) => {
  return (
    state || {
      label: [],
      value: [],
      summary: [],
    }
  );
};

export const summaryCall = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_CALL":
      return summaryCallDefault(state);
    case "SET_SUMMARY_CALL":
      return action.data;
    default:
      return summaryCallDefault(state);
  }
};

const summarySalesDefault = (state) => {
  return (
    state || {
      label: [],
      value: [],
      summary: [],
    }
  );
};

export const summaryStatusCall = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_STATUS_CALL":
      return summarySalesDefault(state);
    case "SET_SUMMARY_STATUS_CALL":
      return action.data;
    default:
      return summarySalesDefault(state);
  }
};

export const summaryReason = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_REASON":
      return summarySalesDefault(state);
    case "SET_SUMMARY_REASON":
      return action.data;
    default:
      return summarySalesDefault(state);
  }
};

export const summarySubReason = (state, action) => {
  switch (action.type) {
    case "GET_SUMMARY_SUB_REASON":
      return summarySalesDefault(state);
    case "SET_SUMMARY_SUB_REASON":
      return action.data;
    default:
      return summarySalesDefault(state);
  }
};

export const statusCallCampaign = (state, action) => {
  switch (action.type) {
    case "GET_STATUS_CALL_CAMPAIGN":
      return state || [];
    case "SET_STATUS_CALL_CAMPAIGN":
      return action.data;
    default:
      return state || null;
  }
};

//======Marketer DATA========//
const markterSummaryChannelDefault = (state) => {
  return (
    state || {
      summary: [],
      total: 0,
      success: 0,
      persentase: 0,
    }
  );
};
export const markterSummaryChannel = (state, action) => {
  switch (action.type) {
    case "GET_MARKETER_SUMMARY_CHANNEL":
      return markterSummaryChannelDefault(state);
    case "SET_MARKETER_SUMMARY_CHANNEL":
      return action.data;
    default:
      return markterSummaryChannelDefault(state);
  }
};

//======PABX DATA========//
export const voiceCall = (state, action) => {
  switch (action.type) {
    case "GET_VOICE_CALL":
      return state || null;
    case "SET_VOICE_CALL":
      return action.data;
    default:
      return state || null;
  }
};