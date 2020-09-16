import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Item, Label } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    const activityStore = useContext(ActivityStore);
    const {deleteActivity} = activityStore;
    return (
        <Item key={activity.id} >
            <Item.Content>
                <Item.Header as='a'>{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                    <div>{activity.description}</div>
                    <div>{activity.city}, {activity.venue}</div>
                </Item.Description>
                <Item.Extra>
                    <Button 
                        onClick={() => deleteActivity(activity.id)} 
                        floated='right' 
                        content='Delete' 
                        color='blue'/>
                    <Button 
                        as={Link} to={`/activities/${activity.id}`} 
                        floated='right' 
                        content='View' 
                        color='blue'/>
                    
                    <Label basic content={activity.category} />
                </Item.Extra>
            </Item.Content>
        </Item>
    )
}
