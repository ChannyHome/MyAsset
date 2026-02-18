import { defineAsyncComponent, type Component } from "vue";

import RemoteFallback from "./components/RemoteFallback.vue";
import RemoteLoading from "./components/RemoteLoading.vue";

function createRemotePage(loader: () => Promise<{ default: Component }>): Component {
  return defineAsyncComponent({
    loader,
    loadingComponent: RemoteLoading,
    errorComponent: RemoteFallback,
    delay: 150,
    timeout: 7000,
  });
}

export const RemoteHomePage = createRemotePage(() => import("web_asset/HomePage"));
export const RemoteDashboardPage = createRemotePage(() => import("web_asset/DashboardPage"));
export const RemoteAgentPage = createRemotePage(() => import("web_asset/AgentPage"));
export const RemoteReportPage = createRemotePage(() => import("web_asset/ReportPage"));
export const RemoteLabPage = createRemotePage(() => import("web_asset/LabPage"));
export const RemoteHistoryPage = createRemotePage(() => import("web_asset/HistoryPage"));
