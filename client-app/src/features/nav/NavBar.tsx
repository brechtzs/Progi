import React from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'

interface IProps {
    openCreateForm: () => void;
}

export const NavBar: React.FC<IProps> = ({openCreateForm}) => {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/progi_logo.jpg" alt="logo" style={{marginRight: '10px'}}/>
                    Progi
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button onClick={openCreateForm} color='black' content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
