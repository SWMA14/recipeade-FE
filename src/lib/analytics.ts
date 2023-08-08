// Init for the web
import {FirebaseAnalytics} from "@capacitor-community/firebase-analytics";

export class AnalyticsService {
  analyticsEnabled = true;

  constructor() {}

  async logEvent(name:string,param: object) {
    await FirebaseAnalytics.logEvent({
      name: name,
      params: param
      });
  }

  setScreenName(screenName : any) {
    FirebaseAnalytics.setScreenName({
      screenName,
    });
  }

  toggleAnalytics() {
    FirebaseAnalytics.setCollectionEnabled({
      enabled: true,
    });
  }
}

export const analyticsService = new AnalyticsService();

