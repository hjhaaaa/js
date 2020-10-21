<template>
	<div class="collection">
		<a-card title="工位采集">
			<div>
				<!-- <p class="subtitle" >      Group title    </p> -->

				<a-table
					:columns="columns"
					:dataSource="data"
					rowKey="Id"
					:loading="tableLoading"
					:pagination="false"
					:scroll="{ x: 1000 }"
				>
					<template slot="editFromNickName" slot-scope="text, row">
						<editable-cell
							:text="text"
							@change="editFromNickNameChange(row, 'FromNickName', $event)"
							editTitle="编辑昵称"
						/>
					</template>
					<template slot="editGroupName" slot-scope="text, row">
						<editable-cell
							:text="text"
							@change="editGroupNameChange(row, 'GroupName', $event)"
							editTitle="编辑群名称"
						/>
					</template>

					<div class="table operation" slot="action" slot-scope="row">
						<a type="link" @click="remove(row)">删除</a>
						<a type="link" @click="setGroup(row)">指定分組</a>
					</div>
					<div slot="opSwitchIsOpen" class="wxOp" slot-scope="row">
						<a-switch
							checked-children="开"
							un-checked-children="关"
							:checked="!!row.IsOpen"
							@change="EditStatusChange(row)"
						/>
					</div>
				</a-table>
				<div style="margin-top: 15px">
					<a-pagination
						size="small"
						:pageSize.sync="form.pageSize"
						v-model="form.pageNum"
						@change="pageChange"
						:total="total"
						showQuickJumper
						:showTotal="(total) => `共${total}条`"
					/>
				</div>
			</div>
			<div>
				<!-- <a-form layout="inline" :form="form" >

				</a-form>-->
			</div>
			<div></div>
		</a-card>
		<div style="margin-top: 15px">
			<a-card title="采集日志">
				<div>
					<!-- <p class="subtitle" >      Group title  @click="reloadLog"  </p> -->
					<!-- <p class="subtitle">工位采集</p> -->
					<a-button
						ref="queryLogBtn"
						type="primary"
						:disabled="queryLogBtnDisabled"
						:loading="queryLogBtnLoading"
						style="margin-bottom: 15px"
						@click="queryLogClick"
						>刷新</a-button
					>
					<a-table
						:columns="logColumns"
						:dataSource="logData"
						rowKey="Id"
						:loading="logTableLoading"
						:pagination="false"
						:scroll="{ x: 800 }"
					>
						<div slot="messageType" slot-scope="row">
							<a-tag v-if="row.MessageType == 1">文本</a-tag>
							<a-tag v-else-if="row.MessageType == 2" color="blue">图片</a-tag>
							<a-tag v-else-if="row.MessageType == 3" color="purple"
								>视频</a-tag
							>
							<a-tag v-else-if="row.MessageType == 4" color="orange"
								>表情</a-tag
							>
						</div>
					</a-table>
				</div>
				<div>
					<!-- <a-form layout="inline" :form="form" >

					</a-form>-->
				</div>
				<div></div>
			</a-card>
		</div>
		<SetCollectionGroup ref="setCollectionGroup"></SetCollectionGroup>
	</div>
</template>

<script>
import SetCollectionGroup from '@/components/ClassifyGroup/SetCollectionGroup.vue'
import EditableCell from '@/components/Table/EditableCell.vue'
import tipMessage from '@/utils/messageUtil.js'
import {
	GetCollectionGroupList,
	GetCollectionGroupLogList,
	DeleteCollectionGroup,
	EditCollectionGroupName,
	EditCollectionGroupStatus,
} from '@/api/tk/collectionGroupApi.js'
export default {
	components: { SetCollectionGroup, EditableCell },
	data() {
		return {
			form: this.$form.createForm(this),
			columns: [
				{
					title: '工位Id',
					width: '100px',
					dataIndex: 'WorkstationId',
				},

				{
					title: '群Id',
					width: '180px',
					dataIndex: 'GroupId',
				},
				{
					title: '采集对象',
					width: '180px',
					dataIndex: 'FromWXId',
				},
				{
					title: '群名称',
					width: '200px',
					dataIndex: 'GroupName',
					scopedSlots: { customRender: 'editGroupName' },
				},
				{
					title: '采集对象昵称',
					width: '200px',
					dataIndex: 'FromNickName',
					scopedSlots: { customRender: 'editFromNickName' },
				},
				{
					title: '采集状态',
					key: 'IsOpen',
					width: '150px',
					scopedSlots: { customRender: 'opSwitchIsOpen' },
				},
				{
					title: '操作',
					width: '200px',
					scopedSlots: { customRender: 'action' },
				},
			],
			form: {
				pageNum: 1,
				pageSize: 20,
			},
			data: [],
			total: 0,
			tableLoading: false,
			logColumns: [
				{
					title: '序号',
					width: '100px',
					dataIndex: 'Id',
				},
				{
					title: '工位Id',
					width: '100px',
					dataIndex: 'WorkstationId',
				},
				{
					title: '采集微信',
					width: '150px',
					dataIndex: 'FromWXId',
				},
				{
					title: '采集时间',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '群Id',
					width: '150px',
					dataIndex: 'GroupId',
				},
				{
					title: '消息类型',
					width: '80px',
					scopedSlots: { customRender: 'messageType' },
				},
				{
					title: '采集内容',
					width: '200px',
					dataIndex: 'ContentText',
				},
			],
			logData: [],
			logTableLoading: false,
			timer: null,
			queryLogSecond: 60,
			queryLogBtnDisabled: false,
			queryLogBtnLoading: false,
		}
	},
	created() {
		this.query()
		this.queryLog()
	},
	methods: {
		query() {
			this.tableLoading = true
			GetCollectionGroupList(this.form)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		remove(row) {
			let v = this //保存外层this对象
			//删除
			this.$confirm({
				title: '提示',
				content: '删除后不可恢复,确定继续?',
				okText: '确定',
				okType: 'danger',
				onOk() {
					v.tableLoading = true
					DeleteCollectionGroup(row.Id)
						.then((res) => {
							if (res.IsSuccess) {
								v.query()
								tipMessage.success('删除成功')
							} else {
								tipMessage.error(res.Msg)
							}
							v.tableLoading = false
						})
						.catch(() => {
							v.tableLoading = false
						})
				},
				onCancel() {},
			})
		},
		setGroup(row) {
			this.$refs.setCollectionGroup.openSetClassify(row)
		},
		pageChange() {},
		queryLog() {
			this.logTableLoading = true
			GetCollectionGroupLogList({
				pageNum: 1,
				pageSize: 10,
			})
				.then((res) => {
					this.logData = res.Data
					this.logTableLoading = false
				})
				.catch(() => {
					this.logTableLoading = false
				})
		},
		queryLogClick() {
			console.log('aaaa', this.$refs.queryLogBtn)
			this.queryLogBtnDisabled = true
			this.queryLogBtnLoading = true
			this.queryLogSecond = 59
			this.doCountDown()
			this.queryLog()
			this.queryLogBtnLoading = false
		},
		doCountDown() {
			if (!this.timer) {
				this.timer = setInterval(() => {
					this.$refs.queryLogBtn.$el.innerText = `刷新(${this.queryLogSecond})`
					// console.log(this.queryLogSecond)
					if (this.queryLogSecond > 0) {
						this.queryLogSecond--
					} else {
						this.stopCountDown()
					}
				}, 1000)
			}
		},
		stopCountDown() {
			clearInterval(this.timer)
			this.timer = null
			this.queryLogBtnDisabled = false
			this.$refs.queryLogBtn.$el.innerText = `刷新`
		},
		editFromNickNameChange(row, key, value) {
			console.log('编辑昵称')
			if (!value) return
			EditCollectionGroupName(row.Id, value, 2)
				.then((res) => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
					} else {
						tipMessage.error('保存失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
		editGroupNameChange(row, key, value) {
			console.log('编辑群名称')
			if (!value) return
			EditCollectionGroupName(row.Id, value, 1)
				.then((res) => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
					} else {
						tipMessage.error('保存失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
		EditStatusChange(row) {
			var newStaus=!row.IsOpen
			EditCollectionGroupStatus(row.Id, newStaus)
				.then((res) => {
					if (res.IsSuccess) {
						this.query()
						tipMessage.success('保存成功')
					} else {
						tipMessage.error('保存失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
	},
}
</script>

<style lang="scss" scoped>
.collection {
	.subtitle {
		font-size: 15px;
		color: rgba(0, 0, 0, 0.85);
		margin-bottom: 15px;
		font-weight: 500;
	}
	.table.operation a {
		padding-right: 10px;
	}
	.ant-table-body {
		overflow-x: auto !important;
	}
}
</style>



