import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {useAuth} from './AuthProvider';
import {Task} from './schemas';

const TaskContext = React.createContext(null);

const TaskProvider = ({children, projectId}) => {
  const {user} = useAuth()
  const [tasks, setTasks] = useState([])

  const realmRef = useRef(null);

  useEffect(() => {
    if(user == null) {
      console.warn('User must be authenticated')
      return
    }

    // Define the configuration for the realm to use the Task schema. Base the
    // sync configuration on the user settings and use the project ID as the
    // partition value. This will open a realm that contains all objects where
    // object.ition == projectId.

    const config = {
      schema: [Task.schema],
      sync: {
        user,
        partitionValue: projectId,
      }
    }

    console.log(`Attempting to open realm ${projectId} for user ${user.identity} with config ${JSON.stringify(config)}`)

    let canceled = false;

    Realm.open(config)
    .then(openedRealm => {
      if(canceled) {
        openedRealm.close()
        return
      }

      realmRef.current = openedRealm;

      const syncTasks = openedRealm.objects('Task')
      
      // / Watch for changes to the tasks collection.
      openedRealm.addListener('change', () => {
        // On change, update the tasks state variable and re-render.
        setTasks([...syncTasks]);
      })

      // Set the tasks state variable and re-render.
      setTasks([...syncTasks])
    })
    .catch(error => console.warn('Failed to open realm:', error));


    // Return the cleanup function to be called when the component is unmounted.
    return () => {
      // Update the canceled flag shared between both this callback and the
      // realm open success callback above in case this runs first.
      canceled = true;

      const realm = realmRef.current;

      // If there is an open realm, we must close it.
      if(realm != null) {
        realm.removeAllListeners();
        realm.close();
        realmRef.current = null
      }
    }
  }, [user, projectId]) // Declare dependencies list in the second parameter to useEffect().

  const createTask = (newTaskName) => {
    const realm = realmRef.current;

    realm.write(() => {
      realm.create('Task', new Task({name: newTaskName || 'New Task', partition: projectId}))
    })
  }

  const setTaskStatus = (task, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.

    if(![Task.STATUS_COMPLETE,Task.STATUS_IN_PROGRESS,Task.STATUS_OPEN].includes(status)) 
      throw new Error(`Invalid Status ${status}`)
      
    const realm = realmRef.current

    realm.write(() => {
      task.status = status
    })
  }

  const deleteTask = (task) => {
    const realm = realmRef.current;

    realm.write(() => {
      realm.delete(task)
    })
  }

  return (
    <TaskContext.Provider
      value={{
        createTask,
        deleteTask,
        setTaskStatus,
        tasks,
        projectId
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

const useTasks = () => {
  const value = useContext(TaskContext);

  if(value == null) {
    throw new Error('useTask() called outside of a TaskProvider?');
  }

  return value;

}

export {TaskProvider, useTasks}