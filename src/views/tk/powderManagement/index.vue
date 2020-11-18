<template>
    <div class="powder">
        <a-card title="接粉管理">
            <a-form layout="inline" :form="form" style="margin-bottom: 10px;font-size: 16px">
                <a-form-item label="微信昵称">
					<a-input v-model="form.NickName" placeholder="请输入微信昵称" />
				</a-form-item>
                <a-form-item label="用户账号">
					<a-input v-model="form.UserName" placeholder="请输入用户账号" />
				</a-form-item>
                <a-form-item label="微信状态">
					<a-select
						style="width: 100px"
						v-model="form.Status"
                        :options="wxOptions"
					>
					</a-select>
				</a-form-item>
                <a-form-item label="接粉状态">
					<a-select
						style="width: 100px"
						v-model="form.IsAutoPassFriends"
                        :options="powderStatus"
					>
					</a-select>
				</a-form-item>
                <a-form-item>
					<a-button icon="search" type="primary" @click="handleSearch">查询</a-button>
				</a-form-item>
                <a-form-item>
					<div style="width: 360px;line-height: 19px">*请使用接粉号登录工位后给自己发送“<font color="red">开通接粉权限</font>”进行权限开通</div>
				</a-form-item>
                <a-form-item>
					<a-switch checked-children="开" un-checked-children="关" :checked="totalSwitch == '1'" @change="totalOnChange(totalSwitch)" />
				</a-form-item>
            </a-form>
            <a-table :columns="columns" :dataSource="tabData" rowKey="Id" :loading="tabLoading" align="center" :pagination="false" >
                <div slot="wxNickName" slot-scope="row">
                    <div>{{row.NickName}}</div>
                </div>
                <div slot="userAccount" slot-scope="row">
                    <div>{{row.UserName}}</div>
                </div>
                <div slot="wxStatus" slot-scope="row">
                    <div :class="row.Status == 1 ? 'online' : 'offline'">{{row.Status | wxStatusMap}}</div>
                </div>
                <div slot="IsAutoPassFriends" slot-scope="row">
                    <!-- <div>{{row.IsAutoPassFriends}}</div> -->
                    <a-switch checked-children="开" un-checked-children="关" :disabled="totalSwitch == '1' ? false : true" :checked="!!row.IsAutoPassFriends == 1" @change="onChange(row)" />
                </div>
                <div slot="ReceivinTemplateList" slot-scope="row" class="powder-tab">
                    <div v-if="row.ReceivinTemplateList[0]">{{row.ReceivinTemplateList[0].TemplateName}}</div>
                    <div class="powder-choose"><a @click="clickChoose(row, 0)">选择</a></div>
                </div>
                <div slot="JoinGroupTemplateList" slot-scope="row">
                    <div v-if="row.JoinGroupTemplateList[0]">{{row.JoinGroupTemplateList[0].TemplateName}}</div>
                    <div class="powder-choose"><a @click="clickChoose(row, 1)">选择</a></div>
                </div>
                <div slot="freeCondition" slot-scope="row">
                    <div>{{row.NickName}}</div>
                    <!-- <div class="powder-choose"><a @click="clickUpdate()">修改</a></div> -->
                </div>
                <div slot="remark" slot-scope="row">
                    <div>{{row.Remarks}}</div>
                    <div class="powder-choose"><a @click="clickUpdate(row)">修改</a></div>
                </div>
            </a-table>
            <div style="margin-top: 50px" class="page-box">
                <a-pagination
                    size="small"
                    :pageSize="queryList.PageSize"
                    v-model="queryList.pageNum"
                    @change="pageChange"
                    :total="total"
                    showQuickJumper
                    :showTotal="(total) => `共${total}条`"
                />
		    </div>
            
            <div class="d-modal">
                <!-- <a-modal v-model="visible" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal"> -->
                <a-modal v-model="visible" :title="dialogModal == 1 ? '选择欢迎模板' : (dialogModal == 2 ? '免单条件' : '修改备注')" :footer="null" @ok="hideModal" wrapClassName="dialog-modal">
                    <a-form :form="dialogForm">
                        <a-form-item label="微信昵称">
                            <span>{{dialogForm.NickName}}</span>
                            <!-- <a-input v-model="form.NickName" placeholder="请输入微信昵称" /> -->
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 1" label="欢迎模板">
                            <a-select
                                style="width: 100px"
                                v-model="dialogForm.selectText"
                                :options="dialogSelect.TemplateName"
                            >
                            </a-select>
                            <a class="edit-tem">编辑模板</a>
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 2" label="免单条件">
                            <a-select
                                style="width: 100px"
                                v-model="dialogForm.selectText"
                                :options="dialogSelect.TemplateName"
                            >
                            </a-select>
                            <a class="edit-tem">编辑模板</a>
                        </a-form-item>
                        <a-form-item v-if="dialogModal == 3" label="备注">
                            <a-input v-model="dialogForm.Remarks" placeholder="请输入" />
                        </a-form-item>
                    </a-form>
                    <div class="subBtn">
                        <a-button @click="submitCancal">取消</a-button>
                        <a-button type="primary" @click="submitDialogUpdate">确定</a-button>
                    </div>
                 </a-modal>
                 <a-modal v-model="switchStatus" title="温馨提示" :footer="null" @ok="hideModal" wrapClassName="dialog-switch">
                     <div>
                        <span style="font-size: 14px">若关闭本功能，所有接粉号将暂停自动通过粉丝好友申请、引导入群及免单发放等功能</span><br>
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
import { PageList, listSwitch, totalSwitch, selectList, updateRemark } from '@/api/tk/powderManagement.js'
import tipMessage from '@/utils/messageUtil.js'


// Duplicate keys detected: 'wxStatus'. This may cause an update error.

export default {
    name: 'powder',
    filters: {
        wxStatusMap(value) {
            if(value == 1) return '在线'
            if(value == 0) return '离线'
        },
        // 接粉状态
        powderStatusMap(value) {
            if(value == 1) return '开'
            if(value == 0) return '关'
        }
    },
    data() {
        return {
            form: {
                NickName: '',
                UserName: '',
                Status: -1,
                IsAutoPassFriends: -1
            },
            totalSwitch: '',
            switchStatus: false,
            queryList: {
                PageNum: 1,
                PageSize: 20
            },
            total: 0,
            wxOptions: [
                { label: '全部', value: -1 },
                { label: '在线', value: 1 },
                { label: '离线', value: 2 }
            ],
            powderStatus: [
                { label: '全部', value: -1 },
                { label: '开启', value: 0 },
                { label: '关闭', value: 1 }
            ],
            tabLoading: false,
            alignCenter: 'center',
            columns: [
                {
                    title: '微信昵称',
                    scopedSlots: { customRender: 'wxNickName' },
                },
                {
                    title: '用户账号',
                    scopedSlots: { customRender: 'userAccount' },
                },
                {
                    title: '微信状态',
                    scopedSlots: { customRender: 'wxStatus' },
                },
                {
                    title: '接粉状态',
                    scopedSlots: { customRender: 'IsAutoPassFriends' },
                },
                {
                    title: '接粉欢迎',
                    scopedSlots: { customRender: 'ReceivinTemplateList' },
                },
                {
                    title: '入群送免单',
                    scopedSlots: { customRender: 'JoinGroupTemplateList' },
                },
                {
                    title: '免单条件',
                    scopedSlots: { customRender: 'freeCondition' },
                },
                {
                    title: '备注',
                    scopedSlots: { customRender: 'remark' },
                },
            ],
            tabData: [],
            visible: false,
            dialogModal: 1,
            dialogForm: {
                selectText: '',
                NickName: '',
                Remarks: ''
            }, 
            dialogSelect: [],
            //备注
            remarkData: {
                Remark: '',
                Id: ''
            }
        }
    },
    created() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.tabLoading = true
            const params = Object.assign({}, this.queryList, this.form)
            PageList(params).then(res => {
                this.tabData = res.Data
                console.log('1m--', res)
                this.tabLoading = false
                this.totalSwitch = res.ObjData
                this.total = res.TotalCount
                this.queryList.PageSize = res.PageSize
                this.queryList.PageNum = res.PageNum
            })
        },
        handleSearch() {
            this.getDataList()
        },
        // 总开关
        totalSwitchStatus() {
            const newSta = this.totalSwitch == '1' ? '0' : '1' 
            totalSwitch({Value: newSta}).then(res => {
                this.totalSwitch = newSta
                this.switchStatus = false

            })
        },
        totalOnChange(sta) {
            if(sta == '1') {
                this.switchStatus = true
            }
            // return
            if(sta == '0') {
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
            var newValue = data.IsAutoPassFriends == 1 ? 0 : 1
            listSwitch({Status: newValue, Id: data.Id}).then(res => {
                data.IsAutoPassFriends = newValue
                tipMessage.success('操作成功')
            })
        },
        // 列表选择、修改
        clickChoose(data, num) {
            this.visible = true
            this.dialogForm.NickName = data.NickName
            if(num == 0) {
                this.dialogModal = 1
            }
            if(num == 1) {
                this.dialogModal = 2
            }
            console.log('this.visible', this.visible)
            const selectObj =  Object.assign({}, this.queryList, {CategoryName: num})
            selectList(selectObj).then(res => {
                this.dialogSelect = res.Data
            })
        },
        clickUpdate(row) {
            this.visible = true
            this.dialogModal = 3
            this.dialogForm.NickName = row.NickName
            this.remarkData.Remark = row.Remarks
            this.remarkData.Id = row.Id
        },
        // dialog hide
        hideModal() {
            this.visible = false
        },
        submitDialogUpdate() {
            this.remarkData.Remark = this.dialogForm.Remarks
            if(this.dialogModal == 3) {
                if(!this.remarkData.Remark) {
                    return this.$alert('1')
                }
                updateRemark(this.remarkData).then(res => {
                    if(res.IsSuccess) {
                        this.visible = false
                        tipMessage.success('操作成功')
                        this.getDataList()
                    }
                })
            }
        },
        submitCancal() {
            this.visible = false
        },
        // 
        // fen ye
        pageChange(p, s) {
            this.queryList.PageNum = p
            this.getDataList()
        }
    }
}
</script>
<style lang="scss">
.dialog-modal, .dialog-switch{
    .ant-modal-header{
        border-bottom: 0;
        .ant-modal-title{
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
.dialog-switch{
    .subBtn{
        width: 36%;
        margin-top: 30px;
    }
}
.powder {
    .ant-table table, .ant-form label{
        font-size: 16px;
    }
    .ant-card-head-title{
        font-size: 18px;
        font-weight: 600;
    }
    // .ant-table-body{
    //     tr{
    //         text-align: center;
    //     }
    // }
    // .ant-table-thead{
    //     th{
    //         text-align: center;
    //     }
    // }
}
</style>
<style lang="scss" scoped>
.powder {
    // .ant-card-head-title{
    //     font-size: 18px;
    //     font-weight: 600;
    // }
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