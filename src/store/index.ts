import { createStore, Store } from "vuex";
import { InjectionKey } from "vue";
import { HistoryUrlRecord } from "@/popup/model";

export interface State {
  history: HistoryUrlRecord;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  state: {
    history: {},
  },
  mutations: {},
  actions: {},
  modules: {},
});
