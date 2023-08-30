import React from 'react'

const AttendanceControl = (props) => {

    return (
        <div style={{ padding: '20px', height: '100%', flex: '1' }}>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    border: '1px solid grey'
                }}>
                <div
                    style={{
                        height: '100%',
                        flex: '1',
                        backgroundColor: 'white'
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            backgroundColor: 'white'
                        }}>
                        <div
                            style={{
                                fontSize: '50px',
                                paddingTop: '100px',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <table
                                id="attendance-table"
                                style={{
                                    textAlign: 'left',
                                    fontSize: '16px',
                                    color: 'black',
                                    borderCollapse: 'collapse'
                                }}>
                                <style>{style}</style>
                                <tr>
                                    <td>Нийт: </td>
                                    <td style={{ paddingLeft: '20px' }}>
                                        {total}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Бүртгүүлсэн: </td>
                                    <td style={{ paddingLeft: '20px' }}>
                                        {registered}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Бүртгүүлээгүй: </td>
                                    <td style={{ paddingLeft: '20px' }}>
                                        {total - registered}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div
                            style={{
                                flex: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}>
                            <span
                                style={{
                                    color: 'black',
                                    fontSize: '18px'
                                }}>
                                Код:
                            </span>
                            <Input
                                name="code"
                                style={{
                                    width: '20%',
                                    height: '40px',
                                    fontSize: '30px',
                                    textAlign: 'center',
                                    marginLeft: '10px'
                                }}
                                maxLength={4}
                                readOnly
                                value={code}
                            />
                        </div>
                        <div
                            style={{
                                height: '200px',
                                textAlign: 'center'
                            }}>
                            <Button
                                type="primary"
                                onClick={this.startAttendance}
                                style={{ marginLeft: '10px' }}
                                disabled={startBtn}>
                                Start
                            </Button>
                            <Button
                                type="primary"
                                onClick={this.finishAttendance}
                                style={{ marginLeft: '10px' }}
                                disabled={finishBtn}>
                                Finish
                            </Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: '10px' }}
                                onClick={this.changeScreenSize}>
                                Maximize
                            </Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: '10px' }}
                                onClick={this.test}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        flex: '1',
                        borderLeft: '1px solid grey',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                    <div
                        style={{
                            flex: '1',
                            minHeight: 'calc(50%)',
                            borderBottom: '1px solid grey'
                        }}
                        id="chart-attendance"></div>
                    <div
                        style={{
                            flex: '1',
                            maxHeight: 'calc(50%)',
                            padding: '20px 20px 10px 60px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        <div>
                            <span
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>
                                Ирцийн мэдээлэл:
                            </span>
                        </div>
                        <div
                            style={{
                                marginTop: '20px',
                                marginBottom: '10px',
                                overflow: 'hidden'
                            }}>
                            <table
                                style={{
                                    tableLayout: 'fixed',
                                    height: 'calc(100%)',
                                    overflow: 'hidden',
                                    color: 'grey'
                                }}>
                                {users.map(user => {
                                    return (
                                        <tr>
                                            <td>
                                                {user.lastname}
                                                &nbsp;&nbsp;
                                            </td>
                                            <td>{user.firstname}</td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceControl