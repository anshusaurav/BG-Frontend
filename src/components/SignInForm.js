import React, { createRef } from 'react'
import { Button, Form, Divider, Input, Message } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
class SignInForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            isSubmitable: false,
            isBtnLoading: false,
            errorMsgs: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.usernameRef = createRef()
    }

    handleChange(event, { name, value }) {
        this.setState({ [name]: value })
        if (this.checkValidUser().result) {
            this.setState({ isSubmitable: true })
        } else {
            this.setState({ isSubmitable: false })
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.setState({ isBtnLoading: true });
        this.submitLogin()
    }

    async submitLogin() {
        const { email, password } = this.state
        const { history, toggleLoggedIn } = this.props
        const user = { user: { email, password } }
        const url = 'https://bg-backend-task.herokuapp.com/api/user/login'

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            let data = await response.json()
            // console.log(data)
            if (!data.errors) {

                localStorage.setItem('jwttoken', data.user.token)
                localStorage.setItem('loggedInUser', JSON.stringify(data.user))
                toggleLoggedIn()
                history.push('/')
            } else {
                const errors = []
                for (const [key, value] of Object.entries(data.errors)) {
                    errors.push(`${key} ${value}`)
                }
                this.setState({ errorMsgs: errors })
            }
        } catch (error) {
            console.error('Error:', error)
            const errors = []
            errors.push(error.toString())
            this.setState({ errorMsgs: errors }, () => {
                setTimeout(() => {
                    this.setState({
                        errorMsgs: null
                    });
                }, 5000)
            })
        } finally {
            this.setState({ isBtnLoading: false })
        }
    }
    checkValidUser() {
        const { email } = this.state
        let data = []
        let res = true
        if (email.length < 5 || email.indexOf('@') <= 0) {
            res = false
            data.push('email')
        }
        if (res) return { result: true, data }

        return { result: false, data }
    }
    componentDidMount() {
        this.usernameRef.current.focus();
    }
    render() {
        const { email, password, errorMsgs } = this.state;
        return (
            <div className='form-container'>
                <div className='form-complete-div'>
                    <div className='form-container-outer-div'>
                        <div className='form-container-inner-div' >
                            <h2>Log in</h2>


                            <Form size='large'>

                                <Input
                                    fluid
                                    placeholder='Enter email'
                                    name='email'
                                    value={email}
                                    onChange={this.handleChange}
                                    ref={this.usernameRef}
                                    required
                                />
                                <Input
                                    fluid
                                    placeholder='Enter password'
                                    type='password'
                                    name='password'
                                    minLength='6'
                                    defaultValue={password}
                                    onChange={this.handleChange}
                                    required
                                />

                                <Button
                                    color='green'
                                    fluid
                                    size='large'
                                    onClick={this.handleSubmit}
                                    disabled={!this.state.isSubmitable}
                                    loading={this.state.isBtnLoading}>
                                    Login
                                </Button>

                            </Form>
                            <Divider inverted />
                            <div className='form-extra-links-single'>

                                <Link to='signup'>

                                    <Button className='remove-design-btn'>Sign up for an account</Button>
                                </Link>

                            </div>

                        </div>
                    </div>
                    <div className='error-msgs'>
                        {errorMsgs &&
                            errorMsgs.map((msg, index) => (
                                <Message key={index} color='black'>
                                    {msg}
                                </Message>
                            ))}
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(SignInForm);