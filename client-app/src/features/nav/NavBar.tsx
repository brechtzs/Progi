import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';

const NavBar: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Menu fixed='top' inverted>
            <Container>
            <Menu.Item header as={NavLink} exact to='/'>
                    <img 
                        src="/assets/progi_logo.jpg" 
                        alt="logo" 
                        style={{marginRight: '10px'}}/>
                    Progi
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities' />
                <Menu.Item>
                    <Button 
                        as={NavLink} to='/createActivity'  
                        color='black' 
                        content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default observer(NavBar);
