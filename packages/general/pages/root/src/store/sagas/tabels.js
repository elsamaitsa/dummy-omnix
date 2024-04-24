const store = require("..");
const axios = window.axios.default;

export function* flexMonster(action) {
  try {
    yield window.ReduxSaga.effects.put({
      type: "FLEXMONSTER_SET",
      data: action?.data ?? [],
    });
  } catch (error) {
    console.log("respon", error);
  }
}

export function* customReportList(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      (`report/custom?sortBy=order&sortType=ASC&limit=1000&page=1&time=${moment().unix()}`)
    );
    // {
    //   params: {
    //     sortBy: "order",
    //     sortType: "ASC",
    //     limit: 1000,
    //     page: 1,
    //     time: moment().unix(),
    //   },
    // }
    const reportcostume = respon.data.data?.map((val) => ({
      name: val.name,
      id: val.id,
      path: `/custom-report?id=${val.id}`,
    }));
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "LIST_CUSTOM_REPORT_SET",
        data: reportcostume,
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
}
