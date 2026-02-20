import type { Component } from "vue";

type RemoteModule = { default: Component };
type RemoteLoader = () => Promise<RemoteModule>;

function createRemotePage(loader: () => Promise<RemoteModule>): RemoteLoader {
  return async () => {
    try {
      return await loader();
    } catch (error) {
      console.error("[remote] failed to load remote page:", error);
      return import("./components/RemoteFallback.vue");
    }
  };
}

export const RemoteHomePage: RemoteLoader = createRemotePage(() => import("web_asset/HomePage"));
export const RemoteDashboardPage: RemoteLoader = createRemotePage(() => import("web_asset/DashboardPage"));
export const RemoteAgentPage: RemoteLoader = createRemotePage(() => import("web_asset/AgentPage"));
export const RemoteTradePage: RemoteLoader = createRemotePage(() => import("web_asset/TradePage"));
export const RemoteReportPage: RemoteLoader = createRemotePage(() => import("web_asset/ReportPage"));
export const RemoteLabPage: RemoteLoader = createRemotePage(() => import("web_asset/LabPage"));
export const RemoteHistoryPage: RemoteLoader = createRemotePage(() => import("web_asset/HistoryPage"));
