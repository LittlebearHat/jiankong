import { createRouter, createWebHashHistory } from "vue-router";
import sellerpage from "@/views/SellerPage.vue";
import trendpage from "@/views/TrendPage.vue";
import mappage from "@/views/MapPage.vue";
import rankpage from "@/views/RankPage.vue";
import hotpage from "@/views/HotPage.vue";
import stockpage from "@/views/StockPage.vue";
import screenpage from "@/views/ScreenPage.vue";
const routes = [
  {
    path: "/",
    name: "",
    redirect: "screenpage",
  },
  {
    path: "/screenpage",
    name: "screenpage",
    component: screenpage,
  },
  {
    path: "/sellerpage",
    name: "sellerpage",
    component: sellerpage,
  },
  {
    path: "/trendpage",
    name: "trendpage",
    component: trendpage,
  },
  {
    path: "/mappage",
    name: "mappage",
    component: mappage,
  },
  {
    path: "/rankpage",
    name: "rankpage",
    component: rankpage,
  },
  {
    path: "/hotpage",
    name: "hotpage",
    component: hotpage,
  },
  {
    path: "/stockpage",
    name: "stockpage",
    component: stockpage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
