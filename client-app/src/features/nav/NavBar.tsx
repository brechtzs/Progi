import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    
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
                {user && 
                    <Menu.Item position='right'>
                        <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
                        <Dropdown pointing='top left' text={user.displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profile/username`} text='My profile' icon='user'/>
                                <Dropdown.Item  text='Logout' icon='power' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>}
            </Container>
        </Menu>
    )
}

export default observer(NavBar);
