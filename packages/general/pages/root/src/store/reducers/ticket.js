export const ticketingListReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_LIST_GET":
      return state || [];
    case "TICKET_LIST_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketStatusReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_STATUS_GET":
      return state || [];
    case "TICKET_STATUS_SET":
      return action.ticketStatus;
    default:
      return state || [];
  }
};

export const ticketCurrentReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_CURRENT_GET":
      return state || null;
    case "TICKET_CURRENT_SET":
      return action.current;
    default:
      return state || null;
  }
};

export const ticketDetailReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_DETAIL_GET":
      return state || null;
    case "TICKET_DETAIL_SET":
      return action.data;
    default:
      return state || null;
  }
};

export const ticketPriorityReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_PRIORITY_GET":
      return state || [];
    case "TICKET_PRIORITY_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketJourneyReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_JOURNEY_GET":
      return state || [];
    case "TICKET_JOURNEY_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketHistoryReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_HISTORY_GET":
      return state || [];
    case "TICKET_HISTORY_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketFormReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_FORM_GET":
      return state || [];
    case "TICKET_FORM_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketFormAdditionalReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_FORM_ADDITIONAL_SET":
      return action.data;
    default:
      return state || null;
  }
};

export const ticketInfoReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_INFO_GET":
      return state || { type: "All", value: 0 };
    case "TICKET_INFO_SET":
      return action.data;
    default:
      return state || { type: "All", value: 0 };
  }
};

export const ticketLogReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_LOG_GET":
      return state || [];
    case "TICKET_LOG_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketLogDetailReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_LOG_DETAIL_GET":
      return state || null;
    case "TICKET_LOG_DETAIL_SET":
      return action.data;
    default:
      return state || null;
  }
};

export const ticketTabReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_TAB_GET":
      return state || [];
    case "TICKET_TAB_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const ticketAdditionalReducer = (state, action) => {
  switch (action.type) {
    case "TICKET_ADDITIONAL_GET":
      return state || [];
    case "TICKET_ADDITIONAL_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const totalTicketReducer = (state, action) => {
  switch (action.type) {
    case "TOTAL_TICKET_GET":
      return state || [];
    case "TOTAL_TICKET_SET":
      return action.total;
    default:
      return state || [];
  }
};
