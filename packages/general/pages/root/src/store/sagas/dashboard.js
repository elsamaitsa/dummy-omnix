const store = require("..");
const axios = window.axios.default;

export function* getAgentPerfomance(action) {
  try {
    let Agent = {};
    const performance = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/service/performance?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );
    const staffedTimeAgent = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/staffedTimeAgent`
    );
    Agent = {
      ...performance.data[0],
      ...staffedTimeAgent.data,
    };
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_AGENT_PERFOMANCE",
        data: Agent,
      }),
    ]);
  } catch (error) {}
}

export function* intervalChannel(action) {
  try {
    const intervalChannel = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/service/intervalChannel?start_date=${action.data.startDate}&end_date=${action.data.endDate}&channel_id=${action.data.channel}`
    );
    if (intervalChannel && intervalChannel.data.length > 0) {
      const respon = Object.keys(intervalChannel.data[0]).filter((val) =>
        val.includes("hour")
      );
      const label = respon.map((val) => {
        const clock = val.replace("hour_", "");
        return clock.length > 1 ? `${clock}:00` : `0${clock}:00`;
      });
      const value = respon.map((val) => {
        return intervalChannel.data[0][val];
      });

      yield window.ReduxSaga.effects.all([
        window.ReduxSaga.effects.put({
          type: "SET_INTERVAL_CHANNEL",
          data: {
            channel: action.data.channel,
            interval: {
              label,
              value,
            },
          },
        }),
      ]);
    } else {
      yield window.ReduxSaga.effects.all([
        window.ReduxSaga.effects.put({
          type: "SET_INTERVAL_CHANNEL",
          data: {
            channel: action.data.channel,
            interval: {
              label: [],
              value: [],
            },
          },
        }),
      ]);
    }
  } catch (error) {
    console.log("action", error);
  }
}

export function* summaryChannel(action) {
  try {
    const state = store.default.getState();
    let channelList = state.channelList;
    if (!channelList) {
      const channel = yield window.ReduxSaga.effects.call(
        axios.get,
        `/service/channel`
      );
      channelList = channel.data;
    }
    console.log(channelList);

    const summaryChannel = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/service/summaryChannel?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );

    if (summaryChannel.data && summaryChannel.data.length > 0) {
      const label = summaryChannel.data.map((val) => {
        const channel = channelList?.filter((v) => val.channel_id === v.id)[0];
        return channel.name;
      });
      const value = summaryChannel.data.map((val) => {
        return parseInt(val.total);
      });
      const summary = summaryChannel.data.map((val) => {
        const channel = channelList.filter((v) => val.channel_id === v.id)[0];
        return `${channel.name} (${val.total})`;
      });
      yield window.ReduxSaga.effects.all([
        window.ReduxSaga.effects.put({
          type: "SET_SUMMARY_CHANNEL",
          data: {
            label,
            summary,
            value,
          },
        }),
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

export function* statusTicket(action) {
  try {
    const status = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticketStatus/list`
    );
    const statusCount = yield window.ReduxSaga.effects.call(
      axios.get,
      `dashboard/service/summaryTicket?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_STATUS_TICKET",
        data: {
          statusCount: statusCount.data,
          status: status.data,
        },
      }),
    ]);
  } catch (error) {
    console.log("error", error);
  }
}

export function* totalCall(action) {
  try {
    const totalCampaignProduct = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/totalCampaignProduct?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );
    const summaryCall = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/summaryCall?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_TOTAL_CALL",
        data: {
          product: totalCampaignProduct.data.product[0]?.total || 0,
          campaign: totalCampaignProduct.data.campaign[0]?.total || 0,
          duration: summaryCall.data[0].total_duration,
          attemp: summaryCall.data[0].total,
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* marketerSummaryChannel(action) {
  try {
    const state = store.default.getState();
    let channelList = state.channelList;
    if (!channelList) {
      const channel = yield window.ReduxSaga.effects.call(
        axios.get,
        `/service/channel`
      );
      channelList = channel.data;
    }

    const performance = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/marketer/SummaryChannel?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );

    let total = 0;
    let success = 0;
    const result = performance.data.map((val) => {
      total += parseInt(val.total ?? 0);
      success += parseInt(val.total_success ?? 0);
      return {
        total: parseInt(val.total ?? 0),
        total_fail: parseInt(val.total_fail ?? 0),
        total_success: parseInt(val.total_success ?? 0),
        channel: channelList.filter((res) => res.id === val.channel_id)[0],
      };
    });

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_MARKETER_SUMMARY_CHANNEL",
        data: {
          summary: result,
          total,
          success,
          persentase: isNaN(((success / total) * 100).toFixed(2))
            ? 0
            : ((success / total) * 100).toFixed(2),
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* topCategory(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/service/topCategory?start_date=${action.data.startDate}&end_date=${action.data.endDate}&top=10`
    );
    const label = respon.data.map((val) => val.category);
    const value = respon.data.map((val) => val.total);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_TOP_CATEGORY",
        data: {
          label,
          value,
          summary: respon.data,
        },
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* summaryCase(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/service/summaryCase?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_SUMMARY_CASE",
        data: respon.data[0],
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* summaryStatusCall(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/summaryStatusCall?start_date=${action.data.startDate}&end_date=${action.data.endDate}&top=10`
    );
    const label = respon.data.map((val) => val.name);
    const value = respon.data.map((val) => val.total);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_SUMMARY_STATUS_CALL",
        data: {
          label,
          value,
          summary: respon.data,
        },
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* summaryReason(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/summaryReasonCall?start_date=${action.data.startDate}&end_date=${action.data.endDate}&top=10`
    );
    const label = respon.data.map((val) => val.name);
    const value = respon.data.map((val) => val.total);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_SUMMARY_REASON",
        data: {
          label,
          value,
          summary: respon.data,
        },
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* summarySubReason(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/summarySubreasonCall?start_date=${action.data.startDate}&end_date=${action.data.endDate}&top=10`
    );
    const label = respon.data.map((val) => val.name);
    const value = respon.data.map((val) => val.total);

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_SUMMARY_SUB_REASON",
        data: {
          label,
          value,
          summary: respon.data,
        },
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* statusCallCampaign(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/dashboard/sales/statusCallCampaign?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_STATUS_CALL_CAMPAIGN",
        data: respon.data,
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}

export function* voiceCall(action) {
  try {
    const respon = yield window.ReduxSaga.effects.call(
      axios.get,
      `/pabx/sumCalls?start_date=${action.data.startDate}&end_date=${action.data.endDate}`
    );

    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "SET_VOICE_CALL",
        data: respon.data,
      }),
    ]);
  } catch (error) {
    console.log("respon", error);
  }
}
