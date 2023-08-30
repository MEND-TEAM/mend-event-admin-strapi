import {
    ArrowRightOutlined,
    DeleteOutlined,
    DislikeOutlined,
    EditOutlined,
    LikeOutlined,
    StarOutlined,
    CheckCircleOutlined,
    MinusCircleOutlined,
    IssuesCloseOutlined,
    SearchOutlined,
    MenuOutlined
} from '@ant-design/icons';
import {
    Button,
    Col,
    Icon,
    Input,
    message,
    Pagination,
    Popconfirm,
    Row,
    Switch,
    Table
} from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SelectProgram from '../../comps/events/SelectProgram';
import {
    likeQuestion,
    newQuestin as updateQuesion
} from '../../redux/app/actions';
import Api from '../api';
import QuestionEditModal from './QuestionEditModal';
import QuestionProcessModal from './QuestionProcessModal';
import arrayMove from 'array-move';
import {
    sortableContainer,
    sortableElement,
    sortableHandle
} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const DraggableBodyRow = list => ({ className, style, ...restProps }) => {
    // const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = list.findIndex(x => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
};

const DraggableContainer = onSortEnd => props => (
    <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        {...props}
    />
);

const questionColumn = props => {
    return [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',        
        // },
        {
            title: 'Асуулт',
            dataIndex: 'question',
            width: '60%'            
        },
        {
            title: 'Хэнээс',
            dataIndex: 'eventspeaker',
            render: (text, record, index) => {
                return (
                    <div>
                        {(
                            (props.speakers || []).find(
                                one => one.speaker_id == record.eventspeaker
                            ) || {}
                        ).speaker_name || ''}
                    </div>
                );
            }
        },       
        {
            // Rating
            title: () => {
                return <StarOutlined />;
            },
            dataIndex: 'rate',
            align: 'center',
            // sorter: (a, b) => a.rate - b.rate
            sorter: true,
            defaultSortOrder:
                props.sortField == 'rate' ? props.sortOrder : undefined
        },
        {
            // Like
            title: () => {
                return <LikeOutlined />;
            },
            dataIndex: 'up',
            align: 'center',
            sorter: true,
            defaultSortOrder:
                props.sortField == 'up' ? props.sortOrder : undefined
        },
        {
            // Dislike
            title: () => {
                return <DislikeOutlined />;
            },
            dataIndex: 'down',
            align: 'center',
            sorter: true,
            defaultSortOrder:
                props.sortField == 'down' ? props.sortOrder : undefined
        },
        {
            title: 'Үйлдэл',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div>
                        <EditOutlined
                            onClick={() => {
                                props.showEditQuestionModal(record);
                            }}
                            style={{ marginRight: '10px' }}
                        />
                        <ArrowRightOutlined
                            onClick={() => {
                                props.showProcessQuestionModal(record);
                            }}
                            style={{ marginRight: '10px' }}
                        />
                        <Popconfirm
                            title="Сонгосон асуултыг устгах уу?"
                            type="danger"
                            onConfirm={() => {
                                props.deleteQuestion(record.id);
                            }}
                            okText="Тийм"
                            cancelText="Үгүй"
                            icon={<DeleteOutlined color="red" />}>
                            <DeleteOutlined />
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
};

const confirmedColumn = props => {
    return [
        {
            title: '',
            dataIndex: 'sort',
            width: 30,
            className: 'drag-visible',
            render: () => <DragHandle />
        },
        // {
        //     title: 'ID',
        //     dataIndex: 'id'
        // },
        {
            title: 'Асуулт',
            dataIndex: 'question',
            width: '60%'
        },       
        {
            title: 'Хэнээс',
            dataIndex: 'eventspeaker',
            render: (text, record, index) => {
                return (
                    <div>
                        {(
                            (props.speakers || []).find(
                                one => one.speaker_id == record.eventspeaker
                            ) || {}
                        ).speaker_name || ''}
                    </div>
                );
            }
        },
        {
            title: 'Хариулсан',
            dataIndex: 'answered',
            render: text => {
                return text ? 'Y' : '';
            },
            align: 'center'
        },
        {
            // Rating
            title: () => {
                return <StarOutlined />;
            },
            dataIndex: 'rate',
            align: 'center'
        },
        {
            // Like
            title: () => {
                return <LikeOutlined />;
            },
            dataIndex: 'up',
            align: 'center'
        },
        {
            // Dislike
            title: () => {
                return <DislikeOutlined />;
            },
            dataIndex: 'down',
            align: 'center'
        },
        {
            title: 'Үйлдэл',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div>
                        <Popconfirm
                            title="Асуултыг сонголтоос хасах уу?"
                            type="danger"
                            onConfirm={() => {
                                props.removeConfirmed(record.id);
                            }}
                            okText="Тийм"
                            cancelText="Үгүй">
                            <MinusCircleOutlined
                                style={{ marginRight: '10px' }}
                            />
                        </Popconfirm>
                        <Popconfirm
                            title={
                                record.answered
                                    ? 'Aсуултыг хариулаагүй болгох уу?'
                                    : 'Асуултыг хариулсан болгох уу?'
                            }
                            type="danger"
                            onConfirm={() => {
                                props.toggleAnswered(
                                    record.id,
                                    record.answered ? 'NO' : 'YES'
                                );
                            }}
                            okText="Тийм"
                            cancelText="Үгүй">
                            {record.answered ? (
                                <IssuesCloseOutlined />
                            ) : (
                                <CheckCircleOutlined />
                            )}
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
};

class OperatorQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editQuestionModal: false,

            question: '',
            max: 15,
            questionPage: 1,
            questionTotal: 0,
            questionList: [],

            confirmedPage: 1,
            confirmedTotal: 0,
            confirmedList: [],

            fetchQuestion: false,
            fetchConfirmed: false,

            selectedQuestion: null,

            sortField: 'rate',
            sortOrder: 'descend',
            hideAnswered: false,
            speakers: []
        };
    }

    componentDidMount() {
        if (this.props.selectedProgram) {
            this.fetchSpeaker(this.props.selectedProgram);
        }
        this.fetchQuestionList({});
        this.fetchConfirmedQuestionList({});
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.selectedProgram !== this.props.selectedProgram &&
            this.props.selectedProgram
        ) {
            this.fetchSpeaker(this.props.selectedProgram);
            this.fetchQuestionList({ page: 1 });
            this.fetchConfirmedQuestionList({ page: 1 });
        }
    }

    fetchSpeaker = async program => {
        let json = await Api.fetchSpeakersByProgram({ event_program: program });

        if (json && !json.code && json.result) {
            let speakers = json.data || [];
            this.setState({ speakers });
        } else {
            this.setState({ speakers: [] });
        }
    };

    fetchQuestionList = async filter => {
        const eventId = this.props.selectedEvent;
        const programId = this.props.selectedProgram;
        if (!eventId || !programId) {
            this.setState({
                questionList: [],
                questionTotal: 0,
                questionPage: 1
            });
            return;
        }

        let params = {
            eventId,
            programId,
            page: this.state.questionPage,
            status: 'created',
            max: this.state.max,
            sortField: this.state.sortField,
            sortOrder: this.state.sortOrder
        };
        params = { ...params, ...filter };
        this.setState({ fetchQuestion: true });
        let json = await Api.fetchQuestionList(params);

        if (json && !json.code) {
            let total = json.total || 0;
            let list = (json.list || []).map(o => {
                return { ...o, rate: parseInt(o.up - o.down) };
            });
            this.setState({
                questionTotal: total,
                questionList: list,
                fetchQuestion: false
            });
        } else {
            this.setState({
                questionList: [],
                questionTotal: 0,
                fetchQuestion: false
            });
            message.error(
                <div>
                    Асуултын жагсаалт дуудахад алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    fetchConfirmedQuestionList = async filter => {
        const eventId = this.props.selectedEvent;
        const programId = this.props.selectedProgram;
        if (!eventId || !programId) {
            this.setState({
                confirmedList: [],
                confirmedTotal: 0,
                confirmedPage: 1
            });
            return;
        }

        let params = {
            eventId,
            programId,
            page: this.state.confirmedPage,
            hideAnswered: this.state.hideAnswered,
            status: 'confirmed',
            max: this.state.max,
            sortField: 'order'
        };
        params = { ...params, ...filter };
        this.setState({ fetchConfirmed: true });
        let json = await Api.fetchQuestionList(params);

        if (json && !json.code) {
            let total = json.total || 0;
            let list = (json.list || []).map(o => {
                return { ...o, rate: parseInt(o.up - o.down) };
            });
            this.setState({
                confirmedTotal: total,
                confirmedList: list,
                fetchConfirmed: false
            });
        } else {
            this.setState({
                confirmedList: [],
                confirmedTotal: 0,
                fetchConfirmed: false
            });
            message.error(
                <div>
                    Асуултын жагсаалт дуудахад алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    showCreateQuestionModal = () => {
        this.setState({ editQuestionModal: true, selectedQuestion: null });
    };

    showEditQuestionModal = question => {
        this.setState({
            editQuestionModal: true,
            selectedQuestion: question
        });
    };
    closeEditQuestionModal = question => {
        this.setState({
            editQuestionModal: false,
            selectedQuestion: null
        });
    };

    onChanged = ({ type, action = '' }) => {
        if (type == 'add' || type == 'update') {
            if (type == 'add') {
                this.setState({ questionPage: 1 });
            }
            this.fetchQuestionList({
                page: type == 'add' ? 1 : this.state.questionPage
            });
        } else if (type == 'process') {
            this.fetchQuestionList({});
            if (action == 'confirmed') {
                this.fetchConfirmedQuestionList({});
            }
        }
    };

    deleteQuestion = async id => {
        let json = await Api.deleteQuestion({ id });
        if (json && !json.code) {
            this.fetchQuestionList({});
        } else {
            message.error(
                <div>
                    Устгахад алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        this.handleSearch(selectedKeys, confirm)
                    }
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}>
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value, record) => {
            if (!record[dataIndex]) return false;
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    changeScreenSize = () => {
        window.open(
            `/operator/question/screen/${this.props.selectedEvent}/${this.props.selectedProgram}`,
            '_blank',
            'toolbar=no,status=no,fullscreen=yes,location=no'
        );
    };

    // onPageChange = (page) => {
    //     if (this.state.questionPage != page) {
    //         this.setState({ questionPage: page });
    //         this.fetchQuestionList({ page });
    //     }
    // };

    onPageChange = (pagination, filters, sorter) => {
        console.log('pagination', pagination);
        console.log('filters', filters);
        console.log('sorter', sorter);
        if (
            this.state.questionPage != pagination.current ||
            this.state.sortField != sorter.field ||
            this.state.sortOrder != sorter.order
        ) {
            this.setState({
                questionPage: pagination.current,
                sortField: sorter.field,
                sortOrder: sorter.order
            });
            this.fetchQuestionList({
                page: pagination.current,
                sortField: sorter.field,
                sortOrder: sorter.order
            });
        }
    };

    onConfirmedPageChange = page => {
        if (this.state.confirmedPage !== page) {
            this.setState({ confirmedPage: page });
            this.fetchConfirmedQuestionList({ page });
        }
    };

    showProcessQuestionModal = one => {
        this.setState({ processModal: true, selectedQuestion: one });
    };

    closeProcessQuestionModal = one => {
        this.setState({ processModal: false, selectedQuestion: null });
    };

    toggleAnswered = async (id, answered) => {
        let json = await Api.updateQuestionAnswered({ id, answered });
        if (json && !json.code) {
            if (json.success || false) {
                let confirmedList = (this.state.confirmedList || []).map(
                    one => {
                        if (one.id == id) {
                            return {
                                ...one,
                                answered: answered == 'YES' ? true : false
                            };
                        }
                        return one;
                    }
                );
                if (this.state.hideAnswered) {
                    confirmedList = confirmedList.filter(
                        one => one.answered != true
                    );
                }
                this.setState({ confirmedList });
            } else {
                message.error(
                    <div>
                        Алдаа гарав!<div>{json.message}</div>
                    </div>
                );
            }
        } else {
            message.error(
                <div>
                    Алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    removeConfirmed = async id => {
        let json = await Api.processQuestion({ id, confirm: 'created' });
        if (json && !json.code) {
            if (json.success || false) {
                this.fetchQuestionList({});
                this.fetchConfirmedQuestionList({});
            } else {
                message.error(
                    <div>
                        Алдаа гарав!<div>{json.message}</div>
                    </div>
                );
            }
        } else {
            message.error(
                <div>
                    Алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    filterChecked = hideAnswered => {
        let newState = { hideAnswered };
        if (this.state.hideAnswered != hideAnswered) {
            newState = { ...newState, confirmedPage: 1 };
            this.fetchConfirmedQuestionList({ hideAnswered, page: 1 });
        }

        this.setState(newState);
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { confirmedList } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove(
                [].concat(confirmedList),
                oldIndex,
                newIndex
            ).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.setState({ confirmedList: newData });

            let pairs = newData.map((d, i) => {
                return { id: d.id, order: i };
            });
            const eventId = this.props.selectedEvent;
            const programId = this.props.selectedProgram;

            let data = { eventId, programId, pairs };

            this.updateConfirmedQuestionOrder(data);
        }
    };

    updateConfirmedQuestionOrder = async data => {
        let json = await Api.updateConfirmedQuestionOrder(data);

        if (json && !json.code) {
            //donothing
        }
    };

    render() {
        const {
            questionList,
            questionTotal,
            questionPage,
            confirmedTotal,
            confirmedList,
            confirmedPage,
            speakers
        } = this.state;

        return (
            <div style={{ padding: '20px' }} className="event-list">
                <h3>Асуулт</h3>
                <SelectProgram />
                {this.props.selectedProgram ? (
                    <Fragment>
                        <div style={{ padding: '30px 20px 0px 20px' }}>
                            <Button
                                type="primary"
                                onClick={this.showCreateQuestionModal}>
                                Шинэ асуулт
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                style={{ marginLeft: '10px' }}
                                onClick={this.changeScreenSize}>
                                Томруулах
                            </Button>
                        </div>
                        <Row gutter={16}>
                            <Col xl={12} lg={24}>
                                <Table
                                    title={() => (
                                        <div
                                            style={{
                                                backgroundColor: '#1D96B2',
                                                borderRadius: '4px 4px 0px 0px',
                                                color: 'white',
                                                padding: '10px 10px 10px 20px'
                                            }}>
                                            Бүх асуултууд
                                        </div>
                                    )}
                                    style={{
                                        backgroundColor: 'white',
                                        marginTop: '20px',
                                        fontSize: '14px'
                                    }}
                                    columns={questionColumn({
                                        speakers,
                                        sortOrder: this.state.sortOrder,
                                        sortField: this.state.sortField,
                                        getColumnSearchProps: this
                                            .getColumnSearchProps,
                                        deleteQuestion: this.deleteQuestion,
                                        showEditQuestionModal: this
                                            .showEditQuestionModal,
                                        showProcessQuestionModal: this
                                            .showProcessQuestionModal
                                    })}
                                    dataSource={questionList}
                                    size="small"
                                    pagination={{
                                        current: questionPage,
                                        pageSize: this.state.max,
                                        total: this.state.questionTotal
                                    }}
                                    rowKey={one => one.id}
                                    onChange={this.onPageChange}
                                />
                                {/* {questionTotal > 0 &&
                                    questionTotal > this.state.max && (
                                        <Pagination
                                            current={questionPage}
                                            total={questionTotal}
                                            showTotal={total => (
                                                <span>Нийт: {total}</span>
                                            )}
                                            onChange={this.onPageChange}
                                        />
                                    )} */}
                            </Col>
                            <Col xl={12} lg={24}>
                                <Table
                                    title={() => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                backgroundColor: '#1D96B2',
                                                borderRadius: '4px 4px 0px 0px',
                                                color: 'white',
                                                padding: '10px 10px 10px 20px'
                                            }}>
                                            <div>Сонгогдсон асуултууд</div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Switch
                                                    checkedChildren="Хариултгүй"
                                                    unCheckedChildren="Бүгд"
                                                    onChange={checked =>
                                                        this.filterChecked(
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                    style={{
                                        backgroundColor: 'white',
                                        marginTop: '20px',
                                        fontSize: '14px'
                                    }}
                                    columns={confirmedColumn({
                                        removeConfirmed: this.removeConfirmed,
                                        toggleAnswered: this.toggleAnswered,
                                        speakers
                                    })}
                                    dataSource={confirmedList}
                                    size="small"
                                    pagination={false}
                                    rowKey={'id'}
                                    components={{
                                        body: {
                                            wrapper: DraggableContainer(
                                                this.onSortEnd
                                            ),
                                            row: DraggableBodyRow(confirmedList)
                                        }
                                    }}
                                />
                                {confirmedTotal > 0 &&
                                    confirmedTotal > this.state.max && (
                                        <Pagination
                                            current={confirmedPage}
                                            total={confirmedTotal}
                                            showTotal={total => (
                                                <span>Нийт: {total}</span>
                                            )}
                                            onChange={
                                                this.onConfirmedPageChange
                                            }
                                        />
                                    )}
                            </Col>
                        </Row>
                        {this.state.editQuestionModal && (
                            <QuestionEditModal
                                question={this.state.selectedQuestion}
                                event={this.props.selectedEvent}
                                program={this.props.selectedProgram}
                                speakers={this.state.speakers}
                                onClose={this.closeEditQuestionModal}
                                onChanged={this.onChanged}
                            />
                        )}
                        {this.state.processModal && (
                            <QuestionProcessModal
                                question={this.state.selectedQuestion}
                                event={this.props.selectedEvent}
                                program={this.props.selectedProgram}
                                onClose={this.closeProcessQuestionModal}
                                onChanged={this.onChanged}
                            />
                        )}
                    </Fragment>
                ) : (
                    <div
                        style={{
                            padding: '30px 20px 20px 70px',
                            fontSize: '18px'
                        }}>
                        {this.props.selectedEvent ? (
                            <div>Хөтөлбөр сонгоно уу!</div>
                        ) : (
                            <div>Эвэнт сонгоно уу!</div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const store = state => ({
    selectedEvent: state.app.selectedEvent,
    eventList: state.app.eventList,
    selectedProgram: state.app.selectedProgram
});

export default connect(store)(OperatorQuestion);
