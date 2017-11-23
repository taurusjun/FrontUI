import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Popconfirm, Modal } from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];
class DepartmentAdminTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalDepartment: 0,
    detailModalVisible: false,
    currentRecord: {},
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalDepartment: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalDepartment = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.department, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalDepartment });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  onDetail = (flag, record={}) => {
    this.setState({
      detailModalVisible: !!flag,
      currentRecord: record,
    });
  }


  render() {
    const { selectedRowKeys, totalDepartment, detailModalVisible } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['生效', '审批中', '未生效'];

    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
      },
      {
        title: '部门',
        dataIndex: 'department',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '管理者',
        dataIndex: 'controllers',
        sorter: true,
        align: 'left',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <a onClick={() => this.onDetail(true, record)}>详情</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => this.props.onDeleteRow(record.key)}>
              <a href="#">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                总计部门 <span style={{ fontWeight: 600 }}>{selectedRowKeys.length}</span>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        <Modal
          title="部门管理详情"
          visible={detailModalVisible}
          onOk={() => this.onDetail(false)}
          onCancel={() => this.onDetail(false)}
        >
          <div>部门：{this.state.currentRecord.department}</div>
          <div>描述：{this.state.currentRecord.description}</div>
          <div>管理者：{this.state.currentRecord.controllers}</div>
        </Modal>
      </div>
    );
  }
}

export default DepartmentAdminTable;
