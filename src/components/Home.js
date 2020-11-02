import React from 'react'
import { withRouter } from 'react-router-dom'
import { Icon, Card } from 'semantic-ui-react'
import ReactPlayer from "react-player";

const repeat = (a, n) => Array(n).fill(a).flat();
class Home extends React.Component {
    state = { videos: null }
    saveVideos = async () => {

        const url = 'http://localhost:4000/api/user/videos'

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            let data = await response.json()
            console.log(data)
            this.setState({ videos: repeat(data.videos, 8) })

        } catch (error) {
            console.error('Error:', error)

        } finally {
            this.setState({ isBtnLoading: false })
        }
    }
    handleLogout = (event) => {
        this.props.toggleLoggedIn();
        localStorage.removeItem('jwttoken');
        localStorage.removeItem('loggedInUser');
        this.props.history.push('/');
    }
    componentDidMount() {
        this.saveVideos();
    }
    render() {
        const { videos } = this.state;
        return (
            <div class="container-home">
                <div className="header">
                    <p>Videos</p>
                    <Icon name='power off' color='black' onClick={this.handleLogout} />
                </div>
                <div>
                    <div class="videos-wrapper">
                        {
                            videos && videos.map(video => (
                                <Card>
                                    <ReactPlayer url={video.videoUrl} controls={true} width="100%" />
                                    <Card.Content>
                                        <Card.Header>{video.link}</Card.Header>
                                        <Card.Meta>
                                            <span className='date'>{video.noOfViews} views</span>
                                        </Card.Meta>
                                        <Card.Description>
                                            {video.description}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }


                    </div>

                </div>
            </div>
        )
    }
}
export default withRouter(Home)