import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';

const NavBar: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/progi_logo.jpg" alt="logo" style={{marginRight: '10px'}}/>
                    Progi
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button onClick={activityStore.openCreateForm} color='black' content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default observer(NavBar);
