export const salesListProductReducer = (state, action) => {
  switch (action.type) {
    case "LIST_PRODUCT_SALES_GET":
      return state || [];
    case "LIST_PRODUCT_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesListCampaignReducer = (state, action) => {
  switch (action.type) {
    case "LIST_CAMPAIGN_SALES_GET":
      return state || [];
    case "LIST_CAMPAIGN_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesListStatusCallReducer = (state, action) => {
  switch (action.type) {
    case "LIST_STATUS_CALL_SALES_GET":
      return state || [];
    case "LIST_STATUS_CALL_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesListReasonCallReducer = (state, action) => {
  switch (action.type) {
    case "LIST_REASON_CALL_SALES_GET":
      return state || [];
    case "LIST_REASON_CALL_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesListSubReasonReducer = (state, action) => {
  switch (action.type) {
    case "LIST_SUB_REASON_SALES_GET":
      return state || [];
    case "LIST_SUB_REASON_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesCurrentDetailReducer = (state, action) => {
  switch (action.type) {
    case "CURRENT_DETAIL_SALES_GET":
      return state || null;
    case "CURRENT_DETAIL_SALES_SET":
      return action.data;
    default:
      return state || null;
  }
};

export const salesListTaskReducer = (state, action) => {
  switch (action.type) {
    case "LIST_TASK_SALES_GET":
      return state || null;
    case "LIST_TASK_SALES_SET":
      return action.data;
    default:
      return state || null;
  }
};

export const salesInfoReducer = (state, action) => {
  switch (action.type) {
    case "INFO_SALES_GET":
      return (
        state || {
          currentTypeSidebar: 0,
          selectedProduct: null,
          selectedCampaign: null,
          listCurrentPage: 1,
          journeyPage: 1,
        }
      );
    case "INFO_SALES_SET":
      return action.data;
    default:
      return (
        state || {
          currentTypeSidebar: 0,
          selectedProduct: null,
          selectedCampaign: null,
          listCurrentPage: 1,
          journeyPage: 1,
        }
      );
  }
};

export const salesJourneyReducer = (state, action) => {
  switch (action.type) {
    case "LIST_JOURNEY_SALES_GET":
      return state || [];
    case "LIST_JOURNEY_SALES_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const salesCallStatus = (state = false, action) => {
  switch (action.type) {
    case "SALES_CALL_STATUS_GET":
      return state;
    case "SALES_CALL_STATUS_SET":
      return action.data;
    default:
      return state;
  }
};
