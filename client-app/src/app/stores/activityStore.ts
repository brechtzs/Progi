import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { observable, action, computed, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { history } from '../..';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { IActivity } from '../models/activity';
import { RootStore } from './rootStore';



export default class ActivityStore {
    rootStore: RootStore;
    constructor(rootstore: RootStore) {
        this.rootStore = rootstore
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable.ref hubConnection: HubConnection | null = null;

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:3000/chat/', {
                //skipNegotiation: true,
                //transport: HttpTransportType.WebSockets,
                accessTokenFactory: () => this.rootStore.commonStore.token!})
            .configureLogging(LogLevel.Information)
            .build();
        
        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                console.log('Attempting to join the group')
                this.hubConnection!.invoke('AddToGroup', activityId);
            })
            .catch(error => console.log('Error establishing connection: ', error));
        console.log("started")
        console.log(this.hubConnection!.state)

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })

        this.hubConnection.on('Send', message => {
            toast.info(message);
        } )
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
            .then(() => {
                this.hubConnection!.stop();
            })
            .then(() => console.log('Connection stopped'))
            .catch(error => console.log(error))
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
            console.log(values)
            console.log(this.hubConnection)
            await this.hubConnection!.invoke('SendComment', values)
        } catch(error) {
            console.log(error);
        }
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async() => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!)
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
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    setActivityProps(activity, this.rootStore.userStore.user!)
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
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
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            toast.error('Problem submitting data')
            console.log(error.response);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            toast.error('Problem submitting data')
            console.log(error.response);
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

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        try {
            await agent.Activities.attend(this.activity!.id)
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            })
        } catch (error) {
            toast.error('Problem signing up activity')
        }
    }

    @action cancelAttendance = async () => {
        try {
            await agent.Activities.unattend(this.activity!.id)
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                    a => a.username !== this.rootStore.userStore.user!.username
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            })
        } catch (error) {
            toast.error('Problem canceling activity')
        }
    }
}

