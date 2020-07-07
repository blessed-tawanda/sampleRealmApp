import React from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import {Button} from 'react-native-elements';
import {useAuth} from './AuthProvider';
import {LogIn} from './screens/LogIn';
import {AuthProvider} from './AuthProvider';
import {TaskProvider} from './TasksProvider';
import {Tasks} from './screens/Tasks';

const App = () => {
  return (
    <AuthProvider>
      <AppBody />
    </AuthProvider>
  );
};

// The AppBody is the main view within the App. If a user is not logged in, it
// renders the login view. Otherwise, it renders the tasks view. It must be
// within an AuthProvider.
function AppBody() {

  const {user, logOut} = useAuth();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          {user == null ? (
            <LogIn />
          ) : (
            <TaskProvider projectId="My Project">
              <Tasks />
          </TaskProvider>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;