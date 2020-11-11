import { observable, action, runInAction, computed } from "mobx";
import { RootStore } from "./rootStore";
import { IProfile } from "../models/model";
import agent from "../api/agent";

export default class profileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username
        } else {
            return false
        }
    }

    @action loadProfile = async (username: string) => {
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }
}