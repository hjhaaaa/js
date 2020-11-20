<template>
    <div class="group-manage">
        <a-card title="入群管理">
            <a-form layout="inline" :form="form" style="margin-bottom: 10px;font-size: 16px">
                <a-form-item label="群名称">
					<a-input v-model="form.GroupName" placeholder="请输入微信昵称" />
				</a-form-item>
                <a-form-item label="用户账号">
					<a-input v-model="form.UserName" placeholder="请输入用户账号" />
				</a-form-item>
                <a-form-item label="入群状态">
					<a-select
						style="width: 100px"
						v-model="form.IsAutoPass"
                        :options="groupStatusList"
					>
					</a-select>
				</a-form-item>
                <a-form-item label="微信状态">
					<a-select
						style="width: 100px"
						v-model="form.Status"
                        :options="wxStatusList"
					>
					</a-select>
				</a-form-item>
                <a-form-item>
					<a-button icon="search" type="primary" @click="handleSearch">查询</a-button>
				</a-form-item>
                <a-form-item>
					<div style="width: 360px;line-height: 19px">
                        *请使用群管号登录工位后在目标群中发送“绑定粉丝群”进行绑定，发送“解绑粉丝群”可进行解绑，后续可换号绑定
                    </div>
				</a-form-item>
                <a-form-item>
                    <span>自动入群开关</span>
                    <span style="display: inline-block; width: 16px;height: 16px;line-height: 16px;text-align: center;color: #fff;margin: 0 6px;border-radius: 8px;background: rgb(250, 173, 20);">!</span>
					<a-switch checked-children="开" un-checked-children="关" :checked="totalSwitch == '1'" @change="totalOnChange(totalSwitch)" />
				</a-form-item>
            </a-form>
            <a-table :columns="columns" :dataSource="groupData" rowKey="Id" :loading="tabLoading" :pagination="false" >
                <div slot="GroupName" slot-scope="row" align="center">
                    <div>{{row.GroupName}}</div>
                </div>
                <div slot="UserName" slot-scope="row" align="center">
                    <div>{{row.UserName}}</div>
                </div>
                <div slot="IsAutoPass" slot-scope="row" align="center">
                    <!-- <div>{{row.IsAutoPass}}</div> -->
                    <a-switch checked-children="开" un-checked-children="关" :checked="!!row.IsAutoPass == 1" :disabled="totalSwitch == '1' ? false : true" @change="onChange(row)" />
                </div>
                <div slot="JoinGroupWelcomeTemplateList" slot-scope="row" align="center" class="powder-tab">
                    <div v-if="row.JoinGroupWelcomeTemplateList[0]">{{row.JoinGroupWelcomeTemplateList[0].TemplateName}}</div>
                    <div class="powder-choose"><a @click="clickChoose(row, 0)">选择</a></div>
                </div>
                <div slot="PushMessageRuleList" slot-scope="row" align="center">
                    <div v-if="row.PushMessageRuleList[0]">进群{{row.PushMessageRuleList[0].PersonCount}}人或{{row.PushMessageRuleList[0].TimeCount}}秒</div>
                    <div class="powder-choose"><a @click="clickChoose(row, 1)">修改</a></div>
                </div>
                <div slot="WxId" slot-scope="row" align="center">
                    <div>{{row.WxId}}</div>
                </div>
                <div slot="Status" slot-scope="row" align="center">
                    <div :class="row.Status == 0 ? 'offline' : 'online'">{{row.Status | wxStatusMap}}</div>
                    <!-- <div class="powder-choose"><a @click="clickUpdate()">修改</a></div> -->
                </div>
                <div slot="Remarks" slot-scope="row" align="center">
                    <div>{{row.Remarks}}</div>
                    <div class="powder-choose"><a @click="clickChoose(row, 2)">修改</a></div>
                </div>
            </a-table>
            <div style="margin-top: 50px" class="page-box">
                <a-pagination
                    size="small"
                    :pageSize="QueryList.PageSize"
                    v-model="QueryList.pageNum"
                    @change="pageChange"
                    :total="total"
                    showQuickJumper
                    :showTotal="(total) => `共${total}条`"
                />
		    </div>
            <div class="d-modal">
                <!-- <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal"> -->
                <a-modal v-model="visible" :title="dialogModal == 1 ? '选择欢迎模板' : (dialogModal == 2 ? '免单条件' : '修改备注')" :footer="null" @ok="hideModal" wrapClassName="dialog-group">
                    <a-form :form="dialogForm">
                        <a-form-item label="群名称">
                            <span>{{dialogForm.NickName}}</span>
                            <!-- <a-input v-model="form.NickName" placeholder="请输入微信昵称" /> -->
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 1" label="入群模板">
                            <a-select
                                style="width: 160px"
                                v-model="dialogForm.selectText"
                                :options="dialogSelect.dialogGroupList"
                            >
                            </a-select>
                            <a class="edit-tem">编辑模板</a>
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 2" label="发送规则">
                            进群
                            <a-input v-model="dialogForm.PersonCount" placeholder="人数" />
                            人或
                            <a-input v-model="dialogForm.TimeCount" placeholder="时间" />
                            秒自动发送欢迎语
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 3" label="备注">
                            <a-input v-model="dialogForm.Remarks" placeholder="请输入" style="width: 186px"/>
                        </a-form-item>
                    </a-form>
                    <div class="subBtn">
                        <a-button @click="submitCancal">取消</a-button>
                        <a-button type="primary" @click="submitDialogUpdate">确定</a-button>
                    </div>
                 </a-modal>
                 <a-modal v-model="switchStatus" title="温馨提示" :footer="null" @ok="hideModal" wrapClassName="dialog-switch-btn">
                     <div>
                        <span style="font-size: 14px">若关闭本功能，所有群管号将暂停自动通过粉丝入群申请，发送入群欢迎语及开群公告等功能</span><br>
                        <span style="font-size: 18px">确认关闭吗？</span>
                     </div>
                     <div class="subBtn">
                        <a-button @click="switchCancelDialog">取消</a-button>
                        <a-button type="primary" @click="switchSureDialog">确认关闭</a-button>
                    </div>
                 </a-modal>
            </div>
        </a-card>
    </div>
</template>
<script>
import { PageList, totalSwitch, UpdateWeChatJoinGroupStatus, updateRemark, CreatePushMessageRule, UpdatePushMessageRule } from '@/api/tk/groupManagement.js'
import { selectList } from '@/api/tk/powderManagement.js'

import tipMessage from '@/utils/messageUtil.js'

export default {
    name: 'GroupManage',
    filters: {
        wxStatusMap(value) {
            if(value == 1) return '在线'
            if(value == 0) return '离线'
        }
    },
    data() {
        return {
            form: {
                UserName: '',
                GroupName: '',
                IsAutoPass: -1,
                Status: -1
            },
            QueryList: {
                PageNum: 1,
                PageSize: 20
            },
            groupStatusList: [
                { label: '全部', value: -1},
                { label: '停', value: 0 },
                { label: '开', value: 1 }
            ],
            wxStatusList: [
                { label: '全部', value: -1},
                { label: '离线', value: 0 },
                { label: '在线', value: 1 }
            ],
            totalSwitch: '',
            switchStatus: false,
            total: 0,
            groupData: [],
            tabLoading: false,
            columns: [
                {
                    title: '群名称',
                    align: 'center',
                    scopedSlots: { customRender: 'GroupName' },
                },
                {
                    title: '用户账号',
                    align: 'center',
                    scopedSlots: { customRender: 'UserName' },
                },
                {
                    title: '自动入群',
                    align: 'center',
                    scopedSlots: { customRender: 'IsAutoPass' },
                },
                {
                    title: '入群欢迎',
                    align: 'center',
                    scopedSlots: { customRender: 'JoinGroupWelcomeTemplateList' },
                },
                {
                    title: '发送规则',
                    align: 'center',
                    scopedSlots: { customRender: 'PushMessageRuleList' },
                },
                {
                    title: '群管号',
                    align: 'center',
                    scopedSlots: { customRender: 'WxId' },
                },
                {
                    title: '微信状态',
                    align: 'center',
                    scopedSlots: { customRender: 'Status' },
                },
                {
                    title: '备注',
                    align: 'center',
                    scopedSlots: { customRender: 'Remarks' },
                },
            ],
            dialogModal: 1,
            visible: false,
            dialogForm: {
                Id: '',
                NickName: '',
                selectText: '',
                // 2
                TimeCount: '',
                PersonCount: '',
                GroupId: '',//
                ruleText: '',
                Remarks: ''
            },
            dialogSelect: [],
            // 入群模板select
            groupDialogModel: [],
            // 规则
            groupDialogRule: {
                Id: null,
                TimeCount: null,
                PersonCount: null,
                GroupId: null,
            },
            // 备注
            remarkData: {
                Remark: '',
                Id: ''
            }
        }
    },
    created() {
        this.getGroupList()
    },
    methods: {
        // 搜索
        handleSearch() {
            this.getGroupList()
        },
        getGroupList() {
            this.tabLoading = true
            const params = Object.assign({}, this.QueryList, this.form)
            PageList(params).then(res => {
                this.tabLoading = false
                this.groupData = res.Data
                this.totalSwitch = res.ObjData
                this.total = res.TotalCount
                this.QueryList.PageNum = res.PageNum
                this.QueryList.PageSize = res.PageSize
                console.log('group-', res)
            })
        },
        // fen ye
        pageChange(p, s) {
            this.QueryList.PageNum = p
            this.getGroupList()
        },
        // 开关
        totalSwitchStatus() {
            var newStatus = this.totalSwitch == '1' ? 0 : 1
            totalSwitch({Status: newStatus}).then(res => {
                this.totalSwitch = newStatus
                this.switchStatus = false
            })
        },
        totalOnChange(num) {
            if(num == '1') {
                this.switchStatus = true
            }
            if(num == '0') {
                this.totalSwitchStatus()
            }
        },
        switchCancelDialog() {
            this.switchStatus = true
        },
        switchSureDialog() {
            this.totalSwitchStatus()
        },
        // 列表开关
        onChange(data) {
            var newSta = data.IsAutoPass == 1 ? 0 : 1
            UpdateWeChatJoinGroupStatus({Status: newSta, Id: data.Id}).then(res => {
                data.IsAutoPass = newSta
            })
        },
        // select
        clickChoose(data, num) {
            console.log('data----mb--', data)
            this.visible = true
            this.dialogForm.Id = data.Id
            this.dialogForm.NickName = data.GroupName
            if(num == 0) {
                this.dialogModal = 1
                const selectObj = Object.assign({}, this.QueryList, {TemplateType: 2})
                selectList(selectObj).then(res => {
                    console.log('2----sel--', res)
                    this.dialogSelect = res.Data
                })
            } else if (num == 1) {
                this.dialogModal = 2
                this.groupDialogRule.GroupId = data.PushMessageRuleList[0].GroupId
                // if(!data.PushMessageRuleList[0]) {
                //     CreatePushMessageRule({TimeCount: data.PushMessageRuleList[0].TimeCount, PersonCount: data.PushMessageRuleList[0].PersonCount, GroupId: data.PushMessageRuleList[0].GroupId}).then(res => {
                //         console.log('create--select', res)
                //     })
                // }
            } else if (num == 2) {
                this.dialogModal = 3
                this.remarkData.Remark = data.Remarks
                this.remarkData.Id = data.Id
            }
        },
        // bei zhu
        clickUpdate() {},
        // 弹窗
        submitCancal() {
            this.visible = false
        },
        submitDialogUpdate() {
            this.visible = false
            if(this.dialogModal == 2) {
                this.groupDialogRule.Id = this.dialogForm.Id
                this.groupDialogRule.TimeCount = Number(this.dialogForm.TimeCount)
                this.groupDialogRule.PersonCount = Number(this.dialogForm.PersonCount)
                UpdatePushMessageRule(this.groupDialogRule).then(res => {
                    tipMessage.success('操作成功')
                    this.getGroupList()
                })
            }
            if(this.dialogModal == 3) {
                this.remarkData.Remark = this.dialogForm.Remarks
                updateRemark(this.remarkData).then(res => {
                    tipMessage.success('操作成功')
                    this.getGroupList()
                })
            }
        },
        hideModal() {
            this.visible = false
        }
    }
}
</script>
<style lang="scss">
// .group-manage{
//     .ant-table{
//         font-size: 14px !important;
//     }
// }
.dialog-group, .dialog-switch-btn{
    .ant-modal-header{
        border-bottom: 0;
        .ant-modal-title{
            font-size: 18px;
            text-align: center;
            font-weight: 600;
        }
    }
    .ant-form{
        font-size: 16px;
        .ant-form-item{
            display: flex;
            font-size: 14px;
            .ant-form-item-label{
                font-size: 14px;
            }
            .ant-form-item-control-wrapper{
                .ant-input{
                    width: 60px;
                    margin: 0 3px;
                }
            }
            .edit-tem{
                margin-left: 20px;
                text-decoration: underline;
            }
        }
    }
    .subBtn{
        width: 33%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }
}
//  .group-manage{
     .dialog-switch-btn{
        .subBtn{
            width: 36%;
            margin-top: 30px;
        }
    }
//  }
</style>
<style lang="scss" scoped>
.group-manage {
    .online{
        width: 60px;
        height: 30px;
        text-align: center;
        line-height: 26px;
        font-size: 14px;
        border-radius: 5px;
        color: rgba(24, 144, 255, 1);
        border: 2px solid rgba(24, 144, 255, 1)
    }
    .offline{
        width: 60px;
        height: 30px;
        text-align: center;
        line-height: 26px;
        border-radius: 5px;
        color: rgba(255, 0, 0, 1);
        border: 2px solid rgba(255, 0, 0, 1);
    }
    .powder-choose{
        text-decoration: underline;
    }
    .page-box{
        text-align: center;
        ul{
            font-size: 16px;
        }
    }
}
</style>