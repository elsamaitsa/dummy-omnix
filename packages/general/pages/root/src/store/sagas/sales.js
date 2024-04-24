const store = require("..");
export function* getJourneSales(action) {
  try {
    let result = [];
    const state = store.default.getState();
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `journey/contactByCallId?call_id=${action.data.callId}&limit=10&page=${action?.data?.page}`
    );

    if (action.data.nextPage > 0) {
      result = state.salesJourney.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.journey_sales = false;
    } else {
      state.loadMore.journey_sales = true;
    }
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LIST_JOURNEY_SALES_SET",
        data: result,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_journey_sales",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getListTaskSales(action) {
  try {
    let result = [];
    const state = store.default.getState();
    let query = `/sales/transaction/listTask?sortBy=id&sortType=DESC&limit=10&page=${
      action?.data?.page
    }&r=${Date.now()}&term=${action.data.searchValue || "%20"}&campaign_id=${
      action.data.campaign_id
    }`;
    if (action.data.is_new) {
      query += "&taskType=new";
    }
    if (action.data.is_promised) {
      query += "&taskType=follow_up";
    }
    if (action.data.is_done) {
      query += "&taskType=done";
    }

    const { data } = yield window.ReduxSaga.effects.call(axios.get, query);
    if (action.data.nextPage > 0) {
      result = state.salesListTask.concat(data?.data);
    } else {
      result = data?.data;
    }

    if (data?.data.length === 0) {
      state.loadMore.list_sales = false;
    } else {
      state.loadMore.list_sales = true;
    }

    console.log(result);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
      window.ReduxSaga.effects.put({
        type: "LIST_TASK_SALES_SET",
        data: result,
      }),
    ]);
  } catch (err) {
    console.log(err);
    yield window.ReduxSaga.effects.all([
      window.ReduxSaga.effects.put({
        type: "ERROR_SET",
        error: "list_sales",
      }),
      window.ReduxSaga.effects.put({ type: "LOADING_SET", loading: null }),
    ]);
  }
}

export function* getListStatusCallSales(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/sales/StatusCall/list`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_STATUS_CALL_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getListReasonCallSales(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/sales/reasonCall/list/${props.data.status_id}`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_REASON_CALL_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getListSubReasonCallSales(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/sales/subreasonCall/list/${props.data.reason_call_id}`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_SUB_REASON_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getSalesCampaignCall(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/campaignAgent/campaignList/${props.data.product_id}`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_CAMPAIGN_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getSalesProductCall(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/campaignAgent/productList`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_PRODUCT_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getSalesAdminCampaignCall(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/sales/campaign/list/${props.data.product_id}`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_CAMPAIGN_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}

export function* getSalesAdminProductCall(props) {
  try {
    const data = yield window.ReduxSaga.effects.call(
      axios.get,
      `/sales/product/list`
    );
    yield window.ReduxSaga.effects.put({
      type: "LIST_PRODUCT_SALES_SET",
      data: data?.data ?? null,
    });
  } catch (error) {}
}
