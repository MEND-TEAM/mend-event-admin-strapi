import React from 'react';
import auth from '../lib/auth';
import history from '../lib/history';

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            logging: false,
            message: ''
        }
    }

    componentDidMount() {
        if (auth.isLogged()) {
            history.push('/')
        }
    }

    changeValue = (type, ev) => {
        this.setState({ [type]: ev.target.value, message: '' })
    }

    login = async (ev) => {
        
        ev.preventDefault()
        this.setState({ logging: true })
        const { email, password } = this.state

        if (email && password) {
            try {
                let json = await auth.login(email, password)
                console.log(json)
                this.setState({ logging: false })


                // history.replace('/admin')
                window.location.replace('/')


            } catch (err) {
                console.log(err)
                this.setState({ logging: false, message: err.message })
            }
        } else {
            //TODO: alert error
        }
    }

    render() {
        return (
            <section className="container" id="contactus">
                <div className="ant-row-flex ant-row-flex-middle" style={{ height: '100vh' }}>
                    <div className="ant-col-sm-8 ant-col-sm-offset-8 ant-col-md-6 ant-col-md-offset-9 ant-col-lg-4 ant-col-lg-offset-10" style={{paddingTop: '20%'}}>
                        <div className="row">
                            <div className="col" align="center">
                                <h3 id="contacttitle" style={{fontWeight: 'bold'}}>Мэнд Эвэнт</h3>
                            </div>
                        </div>
                        <div id="contactinfo" className="row">
                            <div className="col">
                                {
                                    this.state.message &&
                                    <div>
                                        Алдаа гарав!<br />
                                        {this.state.message}
                                    </div>
                                }
                                <form>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group" style={{ paddingBottom: '10px' }}>
                                                <input className="form-control ant-input" type="text" placeholder="Имэйл хаяг" value={this.state.email} onChange={(ev) => this.changeValue('email', ev)} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group" style={{ paddingBottom: '10px' }}>
                                                <input className="form-control ant-input" type="password" placeholder="Нууц үг" value={this.state.password} onChange={(ev) => this.changeValue('password', ev)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group" align="center">                                                
                                                <button  style={{borderRadius: '5px', width: '100%', backgroundColor:'green', color: 'white', fontSize: 'bold'}} onClick={(ev) => this.login(ev)} >Нэвтрэх</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Login