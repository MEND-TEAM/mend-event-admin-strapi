import { Button, Form, Input, message, Select, Tabs } from 'antd';
import axios from 'axios';
import CheckBox from 'rc-checkbox';
import React from 'react';
import config from '../../config';
import Auth from '../../lib/auth';
import WrappedEventPayment from '../events/EventPayment';
import UserEvent from '../events/UserEvent';

const { Option } = Select;
const { TabPane } = Tabs;
const columns = [
    {
        title: 'Нэр',
        dataIndex: 'title'
    },
    {
        title: 'Эхлэх цаг',
        dataIndex: 'open_time'
    },
    {
        title: 'Дуусах цаг',
        dataIndex: 'close_time'
    }
];

class UpdateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            registerNumber: '',
            universities: '',
            professions: '',
            phone: '',
            professionType: '',
            hospital: '',
            userName: '',
            password: '',
            hospitalList: [],
            professionTypeList: [],
            professionList: [],
            universityList: [],
            objectList: {},
            email: '',
            provider: '',
            blocked: false,
            confirmed: false
        };
    }

    async componentDidMount() {
        let {
            firstName,
            lastName,
            registerNumber,
            professionType,
            professions,
            hospital,
            universities,
            userName,
            password,
            phone,
            email,
            provider,
            blocked,
            confirmed
        } = this.state;
        let {
            hospitalList,
            professionTypeList,
            professionList,
            universityList
        } = this.state;

        let response = await fetch(
            `${config.API_DOMAIN}/doctors?id=${this.props.userId}`,
            {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            }
        );
        if (response.ok) {
            let user = await response.json();
            if (user && user[0]) {
                user = user[0];
                firstName = user.firstname;
                lastName = user.lastname;
                phone = user.phone;
                registerNumber = user.register_number;
                if (user.professions && user.professions[0]) {
                    professions = user.professions[0].id;
                }
                if (user && user.professionType) {
                    professionType = user.profession_type[0].id;
                }
                if (user.hospital && user.hospital[0]) {
                    hospital = user.hospital[0].id;
                }
                if (user.universities && user.universities[0]) {
                    universities = user.universities[0].id;
                }
            }
        }

        axios
            .get(
                `${config.API_DOMAIN}/doctors/getLoginInfo/${this.props.userId}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(async function(response) {
                if (response.data.result) {
                    const user = response.data.data.user;
                    userName = user.username;
                    confirmed = user.confirmed;
                    blocked = user.blocked;
                    provider = user.provider;
                    email = user.email;
                }
            })
            .catch(function(error) {
                console.log(error);
            });

        response = await fetch(`${config.API_DOMAIN}/hospitals`, {
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
        if (response.ok) {
            hospitalList = await response.json();
        }

        response = await fetch(`${config.API_DOMAIN}/professiontypes`, {
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
        if (response.ok) {
            professionTypeList = await response.json();
        }

        response = await fetch(`${config.API_DOMAIN}/professions`, {
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
        if (response.ok) {
            professionList = await response.json();
        }

        response = await fetch(`${config.API_DOMAIN}/universities`, {
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
        if (response.ok) {
            universityList = await response.json();
        }

        response = await fetch(`${config.API_DOMAIN}/universities`, {
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
        if (response.ok) {
            universityList = await response.json();
        }

        this.setState({
            hospitalList,
            professionTypeList,
            professionList,
            universityList,
            firstName,
            lastName,
            registerNumber,
            professions,
            professionType,
            hospital,
            universities,
            userName,
            phone,
            email,
            provider,
            blocked,
            confirmed
        });
    }

    update = () => {
        Object.keys(this.state.objectList).map(key => {
            this.state.objectList[key].update();
        });
    };

    updateGeneralInfo = () => {
        event.preventDefault();
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     console.log('error is : ', err);
        //     if (!err) {
        //         console.log('validate....err is false');

        //     } else {
        //         console.log('validate....err is true');
        //     }
        // });

        const self = this;
        const { firstName, lastName, registerNumber, phone } = this.state;

        const data = {
            userId: this.props.userId,
            firstname: firstName,
            lastname: lastName,
            register_number: registerNumber,
            phone
        };

        axios
            .post(`${config.API_DOMAIN}/doctors/updateGeneralInfo`, data, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
            .then(async function(response) {
                if (response.status == 200) {
                    message.success('Хадгалагдлаа');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    saveProfession = () => {
        event.preventDefault();
        const form = document.getElementById('profession-form');
        axios
            .post(
                `${config.API_DOMAIN}/doctors/updateProfession`,
                new FormData(form),
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(async function(response) {
                if (response.ok) {
                    console.log('user: ', response.json());
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    updateLogin = event => {
        event.preventDefault();
        const self = this;
        const {
            userName,
            password,
            email,
            provider,
            blocked,
            confirmed
        } = this.state;
        const data = {
            userId: this.props.userId,
            username: userName,
            password: password,
            email,
            confirmed,
            blocked,
            provider
        };

        axios
            .post(`${config.API_DOMAIN}/doctors/updateLoginInfo`, data, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
            .then(async function() {
                message.success('Хадгалагдлаа');
                return Promise.resolve();
            })
            .catch(function(error) {
                message.error('Алдаа гарлаа');
            });
    };

    save = event => {
        event.preventDefault();
        const form = document.getElementById('create-user-form');
        axios
            .post(
                `${config.API_DOMAIN}/doctors/customCreate`,
                new FormData(form),
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(async function(response) {
                if (response.ok) {
                    console.log('user: ', response.json());
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    firstNameOnChange = event => {
        this.setState({ firstName: event.target.value });
    };

    lastNameOnChange = event => {
        this.setState({ lastName: event.target.value });
    };

    registerNumberOnChange = event => {
        this.setState({ registerNumber: event.target.value });
    };

    professionsOnChange = value => {
        this.setState({ professions: value });
        this.props.form.setFieldsValue({ professions: value });
    };

    professionTypeOnChange = value => {
        this.setState({ professionType: value });
        this.props.form.setFieldsValue({ profession_type: value });
    };

    universitiesOnChange = value => {
        this.setState({ universities: value });
        this.props.form.setFieldsValue({ universities: value });
    };

    hospitalOnChange = value => {
        this.setState({ hospital: value });
        this.props.form.setFieldsValue({ hospital: value });
    };

    userNameOnChange = event => {
        this.setState({ userName: event.target.value });
    };

    passwordOnChange = event => {
        this.setState({ password: event.target.value });
    };

    phoneOnChange = event => {
        this.setState({ phone: event.target.value });
    };

    emailOnChange = event => {
        this.setState({ email: event.target.value });
    };

    providerOnChange = event => {
        this.setState({ provider: event.target.value });
    };

    blockOnChange = event => {
        this.setState({ blocked: event.target.checked });
    };

    confirmedOnChange = event => {
        this.setState({ confirmed: event.target.checked });
    };

    render() {
        const {
            firstName,
            lastName,
            registerNumber,
            professionType,
            professions,
            hospital,
            universities,
            userName,
            password,
            phone,
            email,
            provider,
            blocked,
            confirmed
        } = this.state;
        const {
            hospitalList,
            universityList,
            professionTypeList,
            professionList
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 }
            }
        };
        const customItemLayout = {
            wrapperCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        return (
            <div
                style={{
                    background: 'white',
                    padding: '30px',
                    marginRight: '60px'
                }}>
                <input type="hidden" value={this.props.userId} name="userId" />
                <Tabs
                    id="form"
                    onSubmit={this.save}
                    style={{ marginLeft: '70px' }}
                    tabPosition="left"
                    style={{ widht: '100%' }}>
                    <TabPane tab="Ерөнхий мэдээлэл" key="1">
                        <Form
                            id="general-form"
                            onSubmit={this.updateGeneralInfo}
                            {...formItemLayout}>
                            <input
                                type="hidden"
                                name="userId"
                                value={this.props.userId}
                            />
                            <div className="event-list">
                                <div className="">
                                    <Form.Item label="Нэр">
                                        {getFieldDecorator('firstname', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Нэр оруулна уу'
                                                }
                                            ],
                                            initialValue: firstName
                                        })(
                                            <Input
                                                type="text"
                                                name="firstname"
                                                onChange={
                                                    this.firstNameOnChange
                                                }
                                                style={{ width: '60%' }}
                                            />
                                        )}
                                        {/* <Input type='text' name="firstname"  value={firstName} style={{ width: "60%" }} /> */}
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Овог">
                                        {getFieldDecorator('Овог', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Овог оруулна уу'
                                                }
                                            ],
                                            initialValue: lastName
                                        })(
                                            <Input
                                                type="text"
                                                name="lastname"
                                                onChange={this.lastNameOnChange}
                                                style={{ width: '60%' }}
                                            />
                                        )}
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Утас">
                                        {getFieldDecorator('phone', {
                                            rules: [
                                                {
                                                    // required: true,
                                                    message: 'Утас оруулна уу'
                                                }
                                            ],
                                            initialValue: phone
                                        })(
                                            <Input
                                                type="text"
                                                name="phone"
                                                onChange={this.phoneOnChange}
                                                style={{ width: '60%' }}
                                            />
                                        )}
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Регистер">
                                        {getFieldDecorator('Регистер', {
                                            rules: [
                                                {
                                                    message:
                                                        'Регистер оруулна уу'
                                                }
                                            ],
                                            initialValue: registerNumber
                                        })(
                                            <Input
                                                type="text"
                                                name="register_number"
                                                onChange={this.register_number}
                                                style={{ width: '60%' }}
                                            />
                                        )}
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Зураг">
                                        <input
                                            type="file"
                                            name="avatar"
                                            style={{
                                                width: '60%',
                                                padding: '0px'
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="saveButton">
                                    <Form.Item {...customItemLayout}>
                                        <Button
                                            htmlType="submit"
                                            type="primary">
                                            Update
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane tab="Мэргэжил" key="2">
                        <Form
                            id="profession-form"
                            onSubmit={this.saveProfession}
                            {...formItemLayout}>
                            <input
                                type="hidden"
                                name="userId"
                                value={this.props.userId}
                            />
                            <input
                                type="hidden"
                                name="universities"
                                value={universities}
                            />
                            <input
                                type="hidden"
                                name="professions"
                                value={professions}
                            />
                            <input
                                type="hidden"
                                name="profession_type"
                                value={professionType}
                            />
                            <input
                                type="hidden"
                                name="hospital"
                                value={hospital}
                            />
                            <div className="">
                                <Form.Item label="Сургууль">
                                    {getFieldDecorator('universities', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Регистер оруулна уу'
                                            }
                                        ],
                                        initialValue: universities
                                    })(
                                        <Select
                                            name="universities"
                                            onChange={this.universitiesOnChange}
                                            style={{ width: '60%' }}>
                                            {universityList.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="">
                                <Form.Item label="Мэргэжил">
                                    {getFieldDecorator('profession_type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Регистер оруулна уу'
                                            }
                                        ],
                                        initialValue: professionType
                                    })(
                                        <Select
                                            name="profession_type"
                                            onChange={
                                                this.professionTypeOnChange
                                            }
                                            style={{ width: '60%' }}>
                                            {professionTypeList.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item label="Мэргэшил">
                                    {getFieldDecorator('professions', {
                                        rules: [],
                                        initialValue: professions
                                    })(
                                        <Select
                                            name="professions"
                                            onChange={this.professionsOnChange}
                                            style={{ width: '60%' }}>
                                            {professionList.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item label="Эмнэлэг">
                                    {getFieldDecorator('hospital', {
                                        rules: [],
                                        initialValue: hospital
                                    })(
                                        <Select
                                            name="hospital"
                                            onChange={this.hospitalOnChange}
                                            style={{ width: '60%' }}>
                                            {hospitalList.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="saveButton">
                                <Form.Item {...customItemLayout}>
                                    <Button htmlType="submit" type="primary">
                                        Хадгалах
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane tab="Логин" key="3">
                        <Form
                            id="login-form"
                            onSubmit={this.updateLogin}
                            {...formItemLayout}>
                            <div className="">
                                <Form.Item label="Нэвтрэх нэр">
                                    {getFieldDecorator('Нэвтрэх нэр', {
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    'Нэвтрэх нэр оруулна уу'
                                            }
                                        ],
                                        initialValue: userName
                                    })(
                                        <Input
                                            type="text"
                                            name="username"
                                            disabled
                                            onChange={this.userNameOnChange}
                                            style={{ width: '60%' }}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Нууц үг">
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    'Please input your password!'
                                            },
                                            {
                                                validator: null
                                            }
                                        ],
                                        initialValue: password
                                    })(
                                        <Input
                                            name="password"
                                            onChange={this.passwordOnChange}
                                            style={{ width: '60%' }}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Email">
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                // required: true,
                                                message:
                                                    'Please input your email!'
                                            },
                                            {
                                                validator: null
                                            }
                                        ],
                                        initialValue: email
                                    })(
                                        <Input
                                            name="email"
                                            onChange={this.emailOnChange}
                                            style={{ width: '60%' }}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Provider">
                                    {getFieldDecorator('provider', {
                                        rules: [
                                            {
                                                // required: true,
                                                message:
                                                    'Please input your email!'
                                            },
                                            {
                                                validator: null
                                            }
                                        ],
                                        initialValue: provider
                                    })(
                                        <Input
                                            name="provider"
                                            onChange={this.providerOnChange}
                                            style={{ width: '60%' }}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Confirmed">
                                    <CheckBox
                                        checked={confirmed}
                                        onChange={
                                            this.confirmedOnChange
                                        }></CheckBox>
                                </Form.Item>
                                <Form.Item label="Block">
                                    <CheckBox
                                        checked={blocked}
                                        onChange={
                                            this.blockOnChange
                                        }></CheckBox>
                                </Form.Item>

                                <div className="saveButton">
                                    <Form.Item {...customItemLayout}>
                                        <Button
                                            htmlType="submit"
                                            type="primary">
                                            Хадгалах
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane tab="Төлбөр" key="4">
                        <WrappedEventPayment
                            userId={this.props.userId}
                            eventId={this.props.eventId}
                            objectList={this.state.objectList}
                            update={this.update}
                        />
                    </TabPane>
                    <TabPane tab="Эвент" key="5">
                        <UserEvent
                            userId={this.props.userId}
                            objectList={this.state.objectList}
                            update={this.update}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

// const WrappedUpdateUser = Form.create({ name: 'updateUser' })(UpdateUser);
export default UpdateUser;
