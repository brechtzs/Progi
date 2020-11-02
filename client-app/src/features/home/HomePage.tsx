import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'

const HomePage = () => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;

    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/progi_logo.jpg' alt='logo' style={{marginBottom: 12}}/>
                    Progi
                </Header>
                {isLoggedIn && user ? (
                    <Fragment>
                        <Header as='h2' inverted content={`Welcome back ${user.displayName}`} />
                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to activities!
                        </Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Header as='h2' inverted content='Welcome to Progi' />
                        <Button as={Link} to='/login' size='huge' inverted>
                            Login
                        </Button>
                        <Button as={Link} to='/register' size='huge' inverted>
                            Register
                        </Button>
                    </Fragment>
                )}
                
            </Container>
        </Segment>
    )
}

export default HomePage