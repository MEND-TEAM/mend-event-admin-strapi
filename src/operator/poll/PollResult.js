import { Button, Col, Row } from 'antd';
import axios from 'axios';
import React from 'react';
import config from '../../config';
import Auth from '../../lib/auth';

class PollResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pollOptions: []
        };
    }

    componentDidMount() {
        this.updateResult();
    }

    updateResult = async () => {
        const self = this;
        await axios
            .post(
                `${config.API_DOMAIN}/eventpolls/poll/list`,
                {
                    pollId: this.props.pollId
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(function(response) {
                if (response.status == 200) {
                    console.log('pollOPtions: ', response.data);
                    const pollOptions = response.data.data;
                    if (pollOptions && pollOptions.length > 0) {
                        const list = pollOptions.map(option => ({
                            option: option.option,
                            answer: option.answer,
                            count: option.count
                        }));
                        self.setState({ pollOptions: list });
                    }
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    render() {
        return (
            <div>
                <Row style={{ height: '100vh' }}>
                    <Col span={3}>
                        <div
                            style={{ paddingTop: '30px', paddingLeft: '30px' }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.props.hidePollResult}>
                                Minimize
                            </Button>
                        </div>
                    </Col>
                    <Col
                        span={18}
                        style={{
                            height: '100vh',
                            paddingTop: '30px',
                            fontSize: '40px'
                        }}
                        align="center">
                        <div>
                            {/* <div style={{textAlign: 'left'}}>
                                {this.props.question}
                            </div> */}
                            <div>
                                <table style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3">
                                                {this.props.question}
                                            </td>
                                        </tr>
                                        {this.state.pollOptions.map(option => (
                                            <tr>
                                                <td
                                                    style={{
                                                        padding:
                                                            '20px 50px 20px 0px',
                                                        width: '80px'
                                                    }}>
                                                    {option.option})
                                                </td>
                                                <td
                                                    style={{
                                                        padding:
                                                            '20px 50px 20px 0px'
                                                    }}>
                                                    {option.answer}
                                                </td>
                                                <td
                                                    style={{
                                                        padding:
                                                            '20px 50px 20px 0px'
                                                    }}>
                                                    [нийт: {option.count}]
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                    <Col span={3}></Col>
                </Row>
            </div>
        );
    }
}

export default PollResult;
