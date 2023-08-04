// Init for the web
import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';
import { Device } from '@capacitor/device';

export class AnalyticsService {
  analyticsEnabled = true;

  constructor() {
    this.toggleAnalytics();
  }

  async initFb() {
    Device.getInfo()
        .then(info => {
            if (info.platform === "web"){
                FirebaseAnalytics.initializeFirebase({
                    apiKey: "AIzaSyDAPxRiDSx7VPJJN-85cco7oZTm2XFhOqY",
                    authDomain: "recipeade-85add.firebaseapp.com",
                    projectId: "recipeade-85add",
                    storageBucket: "recipeade-85add.appspot.com",
                    messagingSenderId: "273092375018",
                    appId: "1:273092375018:web:fccff27c95104fc38a8293",
                    measurementId: "G-S8ZQJSGB9G"
                  });
            }
        })
        .catch(err => {console.log(err)});
  }

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
    this.analyticsEnabled = !this.analyticsEnabled;
    FirebaseAnalytics.setCollectionEnabled({
      enabled: true,
    });
  }
}

export const analyticsService = new AnalyticsService();

