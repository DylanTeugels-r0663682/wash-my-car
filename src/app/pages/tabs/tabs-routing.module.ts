import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      { path: "", redirectTo: "feed", pathMatch: "full" },
      {
        path: "feed",
        loadChildren: () =>
          import("../feed/feed.module").then((m) => m.FeedPageModule),
      },
      {
        path: "feed/detail/:id/:owner",
        loadChildren: () =>
          import("../feed-detail/feed-detail.module").then((m) => m.FeedDetailPageModule),
      },
      {
        path: "my-cars",
        loadChildren: () =>
        import("../my-cars/my-cars.module").then((m) => m.MyCarsPageModule),
      },
      {
        path: "my-cars/detail/:id",
        loadChildren: () =>
        import("../my-cars-detail/my-cars-detail.module").then((m) => m.MyCarsDetailPageModule),
      },
      {
        path: "add-car",
        loadChildren: () =>
          import("../add-car/add-car.module").then((m) => m.AddCarPageModule),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("../calendar/calendar.module").then((m) => m.CalendarPageModule),
      },
      {
        path: "calendar/requests",
        loadChildren: () =>
          import("../requests/requests.module").then((m) => m.RequestsPageModule),
      },
      {
        path: "my-profile",
        loadChildren: () =>
          import("../my-profile/my-profile.module").then(
            (m) => m.MyProfilePageModule
          ),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("../settings/settings.module").then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: "user-profile/:uid",
        loadChildren: () =>
          import("../user-profile/user-profile.module").then(
            (m) => m.UserProfilePageModule
          ),
      },
      {
        path: "review/:washerId/:washId/:carId",
        loadChildren: () =>
          import("../review/review.module").then(
            (m) => m.ReviewPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
