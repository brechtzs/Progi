import { action, computed, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from './rootStore';

export default class UserStore {
    rootStore: RootStore;
    constructor(rootstore: RootStore) {
        this.rootStore = rootstore
    }

    @observable user: IUser | null = null;

    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values: IUserFormValues) => {
        try {
            console.log(values);
            const user = await agent.User.login(values);
            console.log("user");
            console.log(user);
            runInAction(() => {
                this.user = user;
                
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}