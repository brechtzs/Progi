import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import {observer} from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityDashboard: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadActivities, setPage, page, totalPages} = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
  
    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
      loadActivities();
    }, [loadActivities]);
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
                <Button floated='right' positive content='More..' disabled={totalPages === page + 1} onClick={handleGetNext} loading={loadingNext} />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);
