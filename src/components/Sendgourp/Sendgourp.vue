<template>
	<div>
		<a-modal
			:title="sendGroupTitle"
			:visible="sendGroupVisible"
			:closable="true"
			:footer="null"
			width="60%"
			@cancel="sendGroupHandleCancel"
		>
			<p>功能提示：群Pid的优先级要高于工位绑定的Pid，所有发到群里的商品都会被优先转成群Pid；如果没有设置群Pid，则会转链成发单人的Pid</p>
			<p>玩法建议：建议单独生成群Pid，可以将群作为跑单群，不同的团队都可以发招商品，所有的佣金都会记在群Pid上,普通版工位可以绑定10个发单群，如需更多发单群可使用增强版工位</p>
			<p></p>
			<p></p>
			<p></p>
			<a-table
				:columns="sendGroupColumns"
				:dataSource="sendGroupData"
				rowKey="Id"
				:loading="sendGroupTableLoading"
				:pagination="false"
			>
				<template slot="editRemarks" slot-scope="text, row">
					<editable-cell
						:text="text"
						@change="sendGroupRemarksChange(row, 'Remarks', $event)"
						editTitle="编辑备注"
					/>
				</template>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="!!row.IsEnable"
						@change="sendGroupEditStatus(row)"
					/>
				</div>
				<div class="table operation" slot="action" slot-scope="row">
					<a type="link" @click="semdGroupRemove(row)">删除</a>
					<a type="link" @click="setConfig(row)">指定配置</a>
					<a type="link" @click="setGroup(row)">指定分组</a>
				</div>
			</a-table>
			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="sendGroupForm.pageSize"
					v-model="sendGroupForm.pageNum"
					@change="sendGroupPageChange"
					:total="sendGroupTotal"
					showQuickJumper
					:showTotal="total => `共${total}条`"
				/>
			</div>
		</a-modal>
		<BasicsConfig :configType="3" ref="basicsConfig"></BasicsConfig>
		<SetClassifyGroup :targetType="3" ref="setClassifyGroup"></SetClassifyGroup>
	</div>
</template>
	
<script>
import EditableCell from '@/components/Table/EditableCell.vue'
import BasicsConfig from '@/components/Config/BasicsConfig.vue'
import tipMessage from '@/utils/messageUtil.js'
import SetClassifyGroup from '@/components/ClassifyGroup/SetClassifyGroup.vue'
import {
	SendGroupList,
	DeleteSendGroup,
	UpdateSendGroupStatus,
	UpdateSendGroupRemark
} from '@/api/sendGroupApi.js'

export default {
	components: { EditableCell, BasicsConfig, SetClassifyGroup },
	data() {
		return {
			sendGroupData: [],
			sendGroupTableLoading: false,
			sendGroupVisible: false,
			sendGroupTitle: '发单群',
			sendGroupForm: {
				workstationId: 0,
				pageSize: 20,
				pageNum: 1
			},
			sendGroupTotal: 0,
			sendGroupColumns: [
				{
					title: '群名称',
					width: '150px',
					dataIndex: 'GroupName'
				},
				{
					title: '备注',
					Key: 'Remarks',
					width: '250px',
					dataIndex: 'Remarks',
					scopedSlots: { customRender: 'editRemarks' }
				},
				{
					title: '绑定时间',
					Key: 'CTime',
					width: '150px',
					dataIndex: 'CTime'
				},
				{
					title: '状态',
					key: 'Status',
					width: '100px',
					scopedSlots: { customRender: 'opSwitchStatus' }
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'action' }
				}
			]
		}
	},
	methods: {
		openSendgroup(row) {
			this.sendGroupForm.pageNum = 1
			this.sendGroupForm.workstationId = row.Id
			this.querySendGroup()
			this.sendGroupTitle = '工位' + row.Id + '的发单群'
			this.sendGroupVisible = true
		},
		querySendGroup() {
			this.sendGroupTableLoading = true
			SendGroupList(this.sendGroupForm)
				.then(res => {
					this.sendGroupData = res.Data
					this.sendGroupTotal = res.TotalCount
					this.sendGroupTableLoading = false
				})
				.catch(() => {
					this.sendGroupTableLoading = false
				})
		},
		sendGroupPageChange(p, s) {
			this.sendGroupForm.pageNum = p
			this.querySendGroup()
		},
		sendGroupHandleCancel() {
			this.sendGroupVisible = false
			this.sendGroupForm.workstationId = 0
		},
		sendGroupRemarksChange(row, key, value) {
			if (!value) return
			UpdateSendGroupRemark(row.Id, value)
				.then(res => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
					} else {
						tipMessage.error('保存失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
		sendGroupEditStatus(row) {
			let nowRow = this.sendGroupData.find(item => {
				return item.Id == row.Id
			})

			var newValue = !row.IsEnable
			UpdateSendGroupStatus(row.Id, newValue)
				.then(res => {
					nowRow.IsEnable = newValue
					tipMessage.success('操作成功')
				})
				.catch(() => {
					tipMessage.error('操作失败:' + res.Msg)
					nowRow.IsEnable = !newValue
				})
		},
		semdGroupRemove(row) {
			let v = this //保存外层this对象
			//删除工位
			this.$confirm({
				title: '提示',
				content: '删除发送群不可恢复,确定继续?',
				okText: '确定',
				okType: 'danger',
				onOk() {
					v.sendGroupTableLoading = true
					DeleteSendGroup(row.Id)
						.then(res => {
							if (res.IsSuccess) {
								v.querySendGroup()
								tipMessage.success('删除工位成功')
							} else {
								tipMessage.error('操作失败:' + res.Msg)
							}
							v.sendGroupTableLoading = false
						})
						.catch(() => {
							v.sendGroupTableLoading = false
						})
				},
				onCancel() {}
			})
		},
		setConfig(row) {
			this.$refs.basicsConfig.openBasicsConfig(
				row.Id,
				'指定发送群配置【' + row.GroupName + '】'
			)
		},
		setGroup(row) {
			this.$refs.setClassifyGroup.openSetClassify(row)
		}
	}
	// created() {
	// 	this.querySendGroup()
	// }
}
</script>

<style lang="scss" scoped>
.setRole-content {
	height: 400px;
	.left-block,
	.btnbox-block,
	.right-block {
		float: left;
		width: 180px;
		height: 400px;
	}
	.left,
	.right {
		width: 180px;
		height: 400px;
		border: 1px solid #ccc;
		overflow: auto;
		.ant-btn-primary {
			margin-bottom: 10px;
		}
	}
	.btnbox-block {
		width: 100px;
		border: 0 none;
	}
}
.table.operation a {
	padding-right: 10px;
}
.tip {
	margin-bottom: 10px;
}
.WXAvatar {
	width: 80px;
	height: 80px;
}
.wxOp button:not(:last-child) {
	margin-bottom: 4px;
}
</style>
