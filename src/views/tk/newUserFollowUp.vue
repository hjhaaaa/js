<template>
    <div class="new-user-follow">
        <a-card title="组团新用户跟进"
                :bordered="false">
            <a-form layout="inline"
                    :form="form"
                    style="margin-bottom: 10px">
                <a-form-item label="注册时间">
                    <a-range-picker v-model="rangeDate"
                                    @change="rangeDaeChange" />
                </a-form-item>
                <a-form-item label="淘客ID">
                    <a-input v-model="form.tkId" />
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model="form.email" />
                </a-form-item>
                <a-form-item label="昵称">
                    <a-input v-model="form.nick" />
                </a-form-item>
                <a-form-item label="用户类型">
                    <a-select v-model="form.queryType"
                              style="width: 150px">
                        <a-select-option v-for="(value, index) in typelist"
                                         :value="value.type"
                                         :key="index">{{value.name}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="运营承接人">
                    <a-select v-model="form.operateId"
                              style="width: 150px">
                        <a-select-option v-for="(value, index) in headList"
                                         :value="value.Id"
                                         :key="index">{{value.Des}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="推广承接人">
                    <a-select v-model="form.popularizeId"
                              style="width: 150px">
                        <a-select-option v-for="(value, index) in headList1"
                                         :value="value.Id"
                                         :key="index">{{value.Des}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="淘客身份">
                    <a-select v-model="form.tkRole" style="width: 150px">
                        <a-select-option :value="''">全部</a-select-option>
                        <a-select-option :value="1">抖快红人</a-select-option>
                        <a-select-option :value="2">返利淘客</a-select-option>
                        <a-select-option :value="3">商家</a-select-option>
                        <a-select-option :value="0">其他淘客</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary"
                              icon="search"
                              @click="handleSearch">查询</a-button>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary"
                              @click="setPopularized">运营指派</a-button>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary"
                              @click="setOperate">推广指派</a-button>
                </a-form-item>
            </a-form>

            <a-table :columns="columns"
                     :dataSource="data"
                     rowKey="TkId"
                     :loading="tableLoading"
                     :row-selection="rowSelection"
                     @change="tableChange"
                     :pagination="false">

                <a slot="TkId"
                   slot-scope="row"
                   style="color:#1890ff"
                   @click="showInfo(row)">{{row.TkId}}<br>{{row.Email}}</a>
                <span slot="WeChatNick"
                      slot-scope="row">
                    <span @click="remarkWechatNickItem(row, 0)">
                        <a-icon type="edit" /> {{row.WeChatNick}}
                    </span>
                </span>
                <span slot="WeChatId"
                      slot-scope="row">
                    <span @click="remarkWechatNickItem(row, 1)">
                        <a-icon type="edit" /> {{row.WeChatId}}
                    </span>
                </span>
                

                <span slot="IsPay"
                      slot-scope="row">{{row.IsPay ? '是': '否'}}</span>
                <span slot="IsChannel"
                      slot-scope="row">{{row.IsChannel ? '是': '否'}}</span>
                <span slot="UserProperty"
                      slot-scope="row">{{row.UserProperty == 0 || row.UserProperty > -1 ? userPropertyList[row.UserProperty] : '普通'}}</span>
                <span slot="Stage"
                      slot-scope="row">{{row.Stage == 0 || row.Stage > -1 ? stageList[row.Stage] : '新淘客'}}</span>
                <span slot="TkRole"
                      slot-scope="row">{{row.TkRole | TkRoleFilter}}</span>
                      
                <span slot="Community"
                      slot-scope="row">{{row.Community == 0 || row.Community > -1 ? CommunityList[row.Community] : '/'}}</span>
                <span slot="TdGmv"
                      slot-scope="row">{{row.TdGmv / 100 || 0}}</span>
                <span slot="TdAppKeyGmv"
                      slot-scope="row">{{row.TdAppKeyGmv / 100 || 0}}</span>
                <span slot="LastMonthGmv"
                      slot-scope="row">{{row.LastMonthGmv / 100 || 0}}</span>
                <span slot="Gmv_KeyGmvScale"
                      slot-scope="row">{{(row.Gmv_KeyGmvScale * 100).toFixed(3) || 0}}%</span>
                <span slot="OperateId"
                      slot-scope="row">
                    {{headList.length > 0 ? operateList[row.OperateId]: ''}}
                </span>
                <span slot="PopularizeId"
                      slot-scope="row">
                    {{headList1.length > 0 ? popularizeList[row.PopularizeId] : ''}}
                </span>
                <span slot="Remark"
                      slot-scope="row">
                    <span @click="remarkItem(row)">
                        <a-icon type="edit" /> {{row.Remark}}
                    </span>
                </span>
            </a-table>
            <div style="margin-top: 15px">
                <a-pagination size="small"
                              :pageSize.sync="form.pageSize"
                              v-model="form.pageNum"
                              @change="pageChange"
                              :total="total"
                              showQuickJumper
                              :showTotal="total => `共${total}条`" />
            </div>
        </a-card>
        <a-modal :title="gTitle"
                 :visible="visible"
                 @ok="handleOk"
                 @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item :label-col="{ span: 5 }"
                             :wrapper-col="{ span: 6 }">
                    <a-select v-model="selectUserId"
                              style="width: 150px">
                        <a-select-option v-for="(value, index) in headList2"
                                         :value="value.Id"
                                         :key="index">{{value.Des}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal :title="remarkTitle"
                 :visible="remarkVisible"
                 @ok="remarkOk"
                 @cancel="remarkVisible = false">
            <a-form :form="remarkForm">
                <a-form-item :label-col="{ span: 5 }"
                             :wrapper-col="{ span: 6 }">
                    <a-input placeholder="请输入"
                             style="width:472px"
                             v-model="remarkForm._updateValue" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment'
    import { getList, setAssign, updateRecord, getHeadList } from '@/api/newUserFollowUp.js'
    export default {
        name: 'tk-newUserFollowUp',
        data() {
            return {
                form: {
                    tkId: null,
                    email: null,
                    nick: null,
                    operateId: 0,
                    popularizeId: 0,
                    queryType: 0,
                    tkRole: '',
                    ctimeStart: null,
                    ctimeEnd: null,
                    pageSize: 20,
                    pageNum: 1,
                    order: null,
                    sort: null,
                },
                operateList: {},
                popularizeList: {},
                rangeDate: null,
                columns: [
                    {
                        title: '淘客ID',
                        align: 'left',
                        key: 'TkId',
                        scopedSlots: { customRender: 'TkId' },
                    },
                    {
                        title: '微信昵称',
                        align: 'left',
                        key: 'WeChatNick',
                        scopedSlots: { customRender: 'WeChatNick' },
                    },
                     {
                        title: '微信号',
                        align: 'left',
                        scopedSlots: { customRender: 'WeChatId' },
                    },
                    {
                        title: '手机号码',
                        align: 'left',
                        width: 56,
                        dataIndex: 'Mobile',
                        key: 'Mobile',
                    },
                    {
                        title: '是否付费',
                        align: 'left',
                        key: 'IsPay',
                        width: 40,
                        scopedSlots: { customRender: 'IsPay' },
                    }, {
                        title: '渠道授权',
                        align: 'left',
                        width: 40,
                        key: 'IsChannel',
                        scopedSlots: { customRender: 'IsChannel' },
                    }, {
                        title: '用户属性',
                        align: 'left',
                        width: 40,
                        key: 'UserProperty',
                        scopedSlots: { customRender: 'UserProperty' },

                    }, {
                        title: '承接阶段',
                        align: 'left',
                        key: 'Stage',
                        width: 50,
                        scopedSlots: { customRender: 'Stage' },
                    }, {
                        title: '淘客身份',
                        align: 'left',
                        key: 'TkRole',
                        width: 50,
                        scopedSlots: { customRender: 'TkRole' },
                    }, {
                        title: '加入社群',
                        align: 'left',
                        key: 'Community',
                        scopedSlots: { customRender: 'Community' },
                    },
                    {
                        title: '本月GMV',
                        align: 'left',
                        sorter: true,
                        sortDirections: ['descend', 'ascend'],
                        key: 'TdGmv',
                        scopedSlots: { customRender: 'TdGmv' },
                    }, {
                        title: '本月KeyGMV',
                        align: 'left',
                        sorter: true,
                        sortDirections: ['descend', 'ascend'],
                        key: 'TdAppKeyGmv',
                        scopedSlots: { customRender: 'TdAppKeyGmv' },
                    }, {
                        title: 'key : GMV',
                        align: 'left',
                        key: 'Gmv_KeyGmvScale',
                        scopedSlots: { customRender: 'Gmv_KeyGmvScale' },

                    }, {
                        title: '上月GMV',
                        align: 'left',
                        sorter: true,
                        sortDirections: ['descend', 'ascend'],
                        key: 'LastMonthGmv',
                        scopedSlots: { customRender: 'LastMonthGmv' },
                    }, {
                        title: '团队总人数',
                        align: 'left',
                        sorter: true,
                        sortDirections: ['descend', 'ascend'],
                        dataIndex: 'TeamCount'
                    }, {
                        title: '运营承接人',
                        align: 'left',
                        width: 50,
                        key: 'OperateId',
                        scopedSlots: { customRender: 'OperateId' },
                    }, {
                        title: '推广承接人',
                        align: 'left',
                        width: 50,
                        key: 'PopularizeId',
                        scopedSlots: { customRender: 'PopularizeId' },
                    }, {
                        title: '备注',
                        align: 'left',
                        key: 'Remark',
                        scopedSlots: { customRender: 'Remark' },
                    }, {
                        title: '注册时间',
                        align: 'left',
                        width: 80,
                        dataIndex: 'RegisterTime'
                    },
                    {
                        title: '到期时间',
                        align: 'left',
                        width: 80,
                        dataIndex: 'DueTime'
                    },
                ],
                data: [],
                total: 0,
                typelist: [{
                    type: 0,
                    name: '全部',
                }, {
                    type: 1,
                    name: '付费用户'
                }, {
                    type: 2,
                    name: '渠道授权'
                }],
                userPropertyList: {
                    0: '普通',
                    1: 'KA淘客',
                    2: '潜在KA'
                },
                stageList: {
                    0: '新淘客',
                    1: '入门承接',
                    2: '商学院培训',
                    3: '成长期',
                    4: '衰退期',
                    5: '已流失'
                },
                CommunityList: {
                    0: '起飞营', 1: '管家群', 2: '雪豹群'
                },
                tableLoading: false,
                headList: [],
                headList1: [],
                headList2: [],
                gTitle: '',
                visible: false,
                rowSelection: {
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.selectList = selectedRowKeys;
                    }
                },
                selectUserId: 0,
                assignType: 0,
                selectList: [],
                dialogData: {},
                dialogVisible: false,
                remarkVisible: false,
                remarkTitle: '',
                remarkType: 0,
                remarkForm: {
                    _updateValue: '',
                }
            }
        },
        methods: {
            query() {
                var params = Object.assign({}, this.form, {
                    tkId: this.form.tkId || null,
                    operateId: this.form.operateId || null,
                    popularizeId: this.form.popularizeId || null,
                })
                this.tableLoading = true
                getList(params).then(res => {
                    this.data = res.PData || []
                    this.total = res.TotalCount
                    this.tableLoading = false
                }).catch(() => { this.tableLoading = false })
            },
            getHead() {
                getHeadList({roleTypy: '运营'}).then(res => {
                    this.headList = [{ Id: 0, Des: '请选择' }, ...res];
                    for (let i = 0; i < this.headList.length; i++) {
                        const item = this.headList[i];
                        this.operateList[item.Id] = item.Des;
                    }
                })

                getHeadList({roleTypy: '推广'}).then(res => {
                    this.headList1 = [{ Id: 0, Des: '请选择' }, ...res];
                    for (let i = 0; i < this.headList1.length; i++) {
                        const item = this.headList1[i];
                        this.popularizeList[item.Id] = item.Des;
                    }
                })
            },
            rangeDaeChange(e) {
                if (e.length == 0) {
                    this.form.ctimeStart = null;
                    this.form.ctimeEnd = null;
                    return
                }
                this.form.ctimeStart = moment(e[0]).format('YYYY-MM-DD 00:00:00');
                this.form.ctimeEnd = moment(e[1]).format('YYYY-MM-DD 23:59:59');
            },
            setPopularized() {
                if (this.selectList.length == 0) {
                    return;
                }
                this.selectUserId = 0;
                this.assignType = 0;
                this.gTitle = '运营指派给';
                this.visible = true;
                this.headList2 = this.headList
            },
            setOperate() {
                if (this.selectList.length == 0) {
                    return;
                }
                this.selectUserId = 0;
                this.assignType = 1;
                this.gTitle = '推广指派给';
                this.visible = true;
                this.headList2 = this.headList1
            },
            handleOk() {
                if (this.selectUserId == 0) {
                    return;
                }
                setAssign({
                    TkIds: this.selectList,
                    assignType: this.assignType,
                    designeeId: this.selectUserId
                }
                ).then(res => {
                    if (!res.code || (res.hasOwnProperty('code') && res.code == 0)) {
                        this.$message.success('操作成功');
                        this.query();
                        this.visible = false;
                    }
                })
            },
            showInfo(row) {
                localStorage.setItem('followForm', JSON.stringify(this.form))
                this.$router.push({
                    path: '/tk/tkUserInfo/' + row.TkId
                })
            },
            remarkItem(item) {
                this.remarkVisible = true;
                this.remarkType = 4;
                this.remarkTitle = '修改备注'
                this.remarkForm = Object.assign({}, item, {
                    _updateValue: item.Remark
                })
            },
            remarkWechatNickItem(item, type) {
                this.remarkVisible = true;
                this.remarkType = type;
                if(type == 0){
                    this.remarkTitle = '修改微信昵称';
                    this.remarkForm = Object.assign({}, item, {
                        _updateValue: item.WeChatNick
                    })
                }
                if(type == 1){
                    this.remarkTitle = '修改微信号';
                    this.remarkForm = Object.assign({}, item, {
                        _updateValue: item.WeChatId
                    })
                }
            },
            remarkOk() {
                updateRecord({
                    tkId: this.remarkForm.TkId,
                    updateType: this.remarkType,
                    value: this.remarkForm._updateValue
                }).then(res => {
                    if (!res.code || (res.hasOwnProperty('code') && res.code == 0)) {
                        this.$message.success('操作成功');
                        this.remarkVisible = false;
                        this.query();
                    }
                })
            },
            handleCancel() {
                this.visible = false;
            },
            handleSearch() {
                this.form.pageNum = 1
                this.query()
            },
            pageChange(p, s) {
                this.form.pageNum = p
                this.query()
            },
            tableChange(p, f, s) {
                console.log(p, f, s)
                this.form.pageNum = 1;
                this.form.sort = s.columnKey;
                if (s.order == 'ascend') {// 正序 负数
                    this.form.order = 'ASC'
                } else if (s.order == 'descend') {// 倒序 正数
                    this.form.order = 'DESC'
                } else {
                    this.form.order = null;
                    this.form.sort = null
                }
                this.query();
            },
        },
        created() {
            let followForm = localStorage.getItem('followForm')
            if(followForm){
                this.form = JSON.parse(followForm)
                localStorage.removeItem('followForm')
            }
            this.query();
            this.getHead();
        },
        filters: {
            TkRoleFilter(val){
                let _val = '其他淘客'
                if(val == 0) _val = '其他淘客'
                if(val == 1) _val = '抖快红人'
                if(val == 2) _val = '返利淘客'
                if(val == 3) _val = '商家'
                return _val
            }
        }
    }
</script>

<style lang="scss">
.new-user-follow{
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        padding: 10px 5px;
    }
}
</style>
