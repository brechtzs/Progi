import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    @action loadActivities = async() => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction('load activities error', () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }        
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                runInAction('get activity error', () => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
            })
        } catch (error) {
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    @action deleteActivity = async (id: string) => {
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activities', () => {
                this.activityRegistry.delete(id);
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default createContext(new ActivityStore())