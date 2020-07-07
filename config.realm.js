import Realm from 'realm'

let app;

export function RealmApp() {
  if(app === undefined) {
    const appId = 'realm-app-lhwmo';
    const appConfig = {
      id: appId,
      timeout: 10000,
      app: {
        name: 'default',
        verion: '0',
      },
    };

    app = new Realm.App(appConfig);

  }

  return app
}