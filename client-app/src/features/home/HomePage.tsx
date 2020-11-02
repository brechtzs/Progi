import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react'

const HomePage = () => {
    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/progi_logo.jpg' alt='logo' style={{marginBottom: 12}}/>
                    Progi
                </Header>
                <Header as='h2' inverted content='Welcome to Progi' />
                <Button as={Link} to='/login' size='huge' inverted>
                    Login
                </Button>
            </Container>
        </Segment>
    )
}

export default HomePage