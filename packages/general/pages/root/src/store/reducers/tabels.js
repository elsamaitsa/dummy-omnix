export const flexMonster = (state, action) => {
  switch (action.type) {
    case "FLEXMONSTER_GET":
      return state || [];
    case "FLEXMONSTER_SET":
      return action.data;
    default:
      return state || [];
  }
};

export const customReportList = (state, action) => {
  switch (action.type) {
    case "LIST_CUSTOM_REPORT_GET":
      return state || [];
    case "LIST_CUSTOM_REPORT_SET":
      return action.data;
    default:
      return state || [];
  }
};
