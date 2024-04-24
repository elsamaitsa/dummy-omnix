const store = require("..");
const _ = require("lodash");

export function* getJourneyTicket(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticket/journey?cust_id=${action?.data?.cust_id}&limit=10&page=${action?.data?.page}`
    );

    if (action.data.nextPage > 0) {
      result = state.ticketJourney.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.journey_ticket = false;
    } else {
      state.loadMore.journey_ticket = true;
    }
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "TICKET_JOURNEY_SET",
        data: result,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_journey_ticket",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getHistoryTicket(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticket/history?id=${action?.data?.id}&limit=10&page=${action?.data?.page}`
    );

    if (action.data.nextPage > 0) {
      result = state.ticketHistory.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.history_ticket = false;
    } else {
      state.loadMore.history_ticket = true;
    }
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "TICKET_HISTORY_SET",
        data: result,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_history_ticket",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getTicketStatus() {
  try {
    const { data } = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticketStatus/list`
    );

    yield window.ReduxSaga.effects.put({
      type: "TICKET_STATUS_SET",
      ticketStatus: data,
    });
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

export function* getTicketList(props) {
  try {
    let query = `/service/ticket?sortBy=${
      props?.data?.sortBy || "id"
    }&sortType=DESC&limit=10&page=${props?.data?.page || 1}&term=${
      props?.data?.terms || "%20"
    }&unit_id=${props?.data?.unit_id || 0}&priority_id=0&status_id=${
      props?.data?.status_id || 0
    }&isUnassigned=1&timestamp=${new Date().getMilliseconds()}${
      props?.data?.isParent ? "" : `&isParent=true`
    }`;

    if (props?.data?.ticketId_masking) {
      query = `${query}&ticketId_masking=${props?.data?.ticketId_masking}`;
    }

    if (props?.data?.subject) {
      query = `${query}&subject=${props?.data?.subject}`;
    }

    if (props?.data?.startDate) {
      let isoStartDate = `${props?.data?.startDate}T00:00:00`;
      query = `${query}&start_date=${isoStartDate}`;
    }

    if (props?.data?.endDate) {
      let isoEndDate = `${props?.data?.endDate}T24:00:00`;
      query = `${query}&end_date=${isoEndDate}`;
    }

    if (props?.data?.createdBy) {
      query = `${query}&createdBy=${props?.data?.createdBy}`;
    }

    if (props?.data?.updatedBy) {
      query = `${query}&updatedBy=${props?.data?.updatedBy}`;
    }

    if (props?.data?.isParent) {
      query = `${query}&isParent=${props?.data?.isParent}`;
    }

    if (props.data?.customer) {
      query = `${query}&cust_name=${props?.data?.customer}`;
    }
    const data = yield window.ReduxSaga.effects.call(axios.get, query);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "TICKET_LIST_SET",
        data: data?.data ?? [],
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  } catch (err) {
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getTicketPriority() {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      "/service/ticketPriority/list"
    );
    yield window.ReduxSaga.effects.put({
      type: "TICKET_PRIORITY_SET",
      data: data?.data ?? [],
    });
  } catch (err) {
    console.log(err);
  }
}

export function* getTicketLog(props) {
  try {
    let result = [];
    const state = store.default.getState();
    let query = `/service/ticket/log?sortBy=date_create&sortType=DESC&limit=10&page=${props.data?.page}`;
    if (props.data.terms) {
      query += `&${props.data.terms}`;
    }
    if (props.data.subject) {
      query += `&subject=${props.data.subject}`;
    }
    if (props.data.unit_id) {
      query += `&unit_id=${props.data.unit_id}`;
    }
    if (props.data.priority_id) {
      query += `&priority_id=${props.data.priority_id}`;
    }
    if (props.data.status_id) {
      query += `&status_id=${props.data.status_id}`;
    }
    if (props.data.start_date) {
      query += `&start_date=${props.data.start_date}`;
    }
    if (props.data.end_date) {
      query += `&end_date=${props.data.end_date}`;
    }
    if (props.data.typeCase) {
      query += `&isEscalation=${props.data.typeCase === 1 ? 1 : 0}`;
    }

    if (props.data.agentId) {
      query += `&createdBy=${props.data.agentId}`;
    }
    const data = yield window.ReduxSaga.effects.call(axios.get, query);
    if (props.data.nextPage > 0) {
      result = state.ticketLog.concat(data?.data?.data);
    } else {
      result = data?.data?.data;
    }

    if (data?.data?.data.length === 0) {
      state.loadMore.list_log_ticket = false;
    } else {
      state.loadMore.list_log_ticket = true;
    }
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "TICKET_LOG_SET",
        data: result,
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  } catch (error) {
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_log_ticket",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getTicketDetailLog(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/service/ticket/detail/${
        props.data?.ticketId
      }?timestamp${new Date().getMilliseconds()}`
    );
    yield window.ReduxSaga.effects.put({
      type: "TICKET_LOG_DETAIL_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}
