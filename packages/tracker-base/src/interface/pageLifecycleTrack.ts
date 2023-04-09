export interface PageLifecycleTrackInstance {

  pageOnShow: (pageKey: string) => void;

  pageOnHide: () => void;
}
