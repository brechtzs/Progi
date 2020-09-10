import React from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'

export const NavBar = () => {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/progi_logo.jpg" alt="logo" style={{marginRight: '10px'}}/>
                    Progi
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
