import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import ActivityStore from '../stores/activityStore';
import agent from '../api/agent';
import {observer} from 'mobx-react-lite';


const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null); 
  const [editMode, setEditMode] = useState(false);
  
  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    })
  }

  const handleDeleteActivity = (id: string) => {
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)])
    })
  }

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
      
    </Fragment>
  );
  
}

export default observer(App);