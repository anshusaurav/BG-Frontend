import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import Home from './Home'
class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
        this.toggleLoggedIn = this.toggleLoggedIn.bind(this)
    }
    toggleLoggedIn() {
        this.setState({ isLoggedIn: !this.state.isLoggedIn })
    }
    componentDidMount() {
        if (
            localStorage.getItem('jwttoken') &&
            localStorage.getItem('loggedInUser')
        )
            this.setState({ isLoggedIn: true })
    }
    render() {
        const { jwttoken } = localStorage;

        return (
            <Router>
                <Switch>
                    <Route exact path='/signin'>
                        {!jwttoken ? <SignInForm toggleLoggedIn={this.toggleLoggedIn} />
                            : <Redirect to='/' />
                        }
                    </Route>
                    <Route exact path='/signup'>
                        {!jwttoken ? <SignUpForm />
                            : <Redirect to='/' />
                        }
                    </Route>
                    <Route exact path='/'>
                        {jwttoken ? <Home toggleLoggedIn={this.toggleLoggedIn} />
                            : <Redirect to="/signin" />
                        }
                    </Route>
                </Switch>
            </Router>
        )
    }
}
export default Main