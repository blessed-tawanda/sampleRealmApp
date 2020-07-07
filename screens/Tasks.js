import React from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {useAuth} from '../AuthProvider';
import {useTasks} from '../TasksProvider';
import {TaskItem} from '../TaskItem';
import {AddTask} from './AddTask';

// The Tasks View displays the list of tasks of the parent TasksProvider.
// It has a button to log out and a button to add a new task.
export function Tasks() {
  // Get the logOut function from the useAuth hook.
  const {logOut} = useAuth();

  // Get the list of tasks and the projectId from the useTasks hook.

  const {tasks, projectId} = useTasks();


  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button type="outline" title="Log Out" onPress={logOut} />

        <AddTask />

      </View>
      <Text h2>{projectId}</Text>
      <ScrollView>
        {tasks.map(task => (

          <TaskItem key={`${task._id}`} task={task} />

        ))}
      </ScrollView>
    </>
  );
}