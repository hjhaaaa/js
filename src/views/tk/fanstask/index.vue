<template>
	<div>
		<a-card title="涨粉任务">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="推广日期">
					<a-date-picker
						v-model="form.startDate"
						valueFormat="YYYY-MM-DD"
						placeholder="推广日期"
					/>
				</a-form-item>

				<a-form-item label="任务名称">
					<a-input v-model="form.TaskName" placeholder="请输入任务名称" />
				</a-form-item>

				<a-form-item label="任务状态">
					<a-select
						style="width: 100px"
						v-model="form.Status"
						default-value="-1"
					>
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="3">未开始</a-select-option>
						<a-select-option value="4">进行中</a-select-option>
						<a-select-option value="5">已结束</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item label="承接方式">
					<a-select
						style="width: 100px"
						v-model="form.UnderTakeType"
						default-value="-1"
					>
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="0">官方工具承接</a-select-option>
						<a-select-option value="1">自行承接</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>

				<a-form-item>
					<a-button type="primary" icon="plus-circle" @click="addFansTask">创建任务</a-button>
				</a-form-item>

				<!-- <a-form-item>
					<a-button type="primary" icon="pay-circle" @click="addPayFansTask">充值</a-button>
				</a-form-item> -->

				<a-form-item>
					<!-- <span>免单商品余量：</span><span>{{ leftProductCount }}</span> -->
					<a-tooltip>
						<a-icon type="exclamation-circle" style="margin-left: 5px;color: #faad14;margin-right: 5px;"/>
						<template slot="title">
							粉丝满足条件时承接号将自动发送免单商品口令；
							当余量不足时将暂停自动发送，充值后恢复
						</template>
					</a-tooltip>
					<a>查看教程</a>
				</a-form-item>
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<div slot="StatusValue" slot-scope="row">
					<div v-if="row.Status == 0">
						<a-tag color="#ff4d4f">{{row.StatusValue}}</a-tag>
					</div>
					<div v-else-if="row.Status == 5">
						<a-tag style="background-color: rgb(214 220 212);">{{row.StatusValue}}</a-tag>
					</div>
					<div v-else>
						<a-tag color="#87d068">{{row.StatusValue}}</a-tag>
					</div>
				</div>

				<div slot="rweChatStatus" slot-scope="row">
					<div v-if="row.RFansTaskUnderTakeWechat[0].WeChatStatus == '在线'">
						<a-span>{{ row.RFansTaskUnderTakeWechat[0].WechatId }}</a-span><a-tag color="#87d068" style="position: absolute;">在线</a-tag>
					</div>
					<div v-else>
						<a-span>{{ row.RFansTaskUnderTakeWechat[0].WechatId }}</a-span><a-tag style="position: absolute;">离线</a-tag>
					</div>
				</div>

				<div slot="gweChatStatus" slot-scope="row">
					<div v-if="row.GFansTaskUnderTakeWechat[0].WeChatStatus == '在线'">
						<a-span>{{ row.GFansTaskUnderTakeWechat[0].WechatId }}</a-span><a-tag color="#87d068" style="position: absolute;">在线</a-tag>
					</div>
					<div v-else>
						<a-span>{{ row.GFansTaskUnderTakeWechat[0].WechatId }}</a-span><a-tag style="position: absolute;">离线</a-tag>
					</div>
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
		</a-card>

	    <a-modal title="新建任务" :visible="fansTaskVisible" @ok="addHandleOk" @cancel="addHandleCancel" width="800px">
			<a-form :form="aform" :label-col="{ span: 3 }" :model="addInfo" :rules="addRules" ref="aform">
				<a-form-item label="任务名称" :wrapper-col="{ span: 12 }" prop="TaskName">
					<a-input v-model="addInfo.TaskName" v-decorator="addRules.TaskName" placeholder="请输入任务名称"/>
				</a-form-item>
				<a-form-item label="承接方式" :wrapper-col="{ span: 12 }" prop="UnderTakeType">
					<a-radio-group v-model="addInfo.UnderTakeType" v-decorator="addRules.UnderTakeType" @change="underTakeTypeChange">
						<a-radio :value=0>官方工具承接</a-radio>
						<a-radio :value=1>自行承接</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="推广日期" :wrapper-col="{ span: 12 }" prop="PromotionDate">
					<a-date-picker
						v-model="addInfo.PromotionDate" v-decorator="addRules.PromotionDate"
						format="YYYY-MM-DD"
						placeholder="选择您期望的推广日期"
						:disabled-date="disabledDate"
      					:disabled-time="disabledDateTime"
					/>
					<a-tooltip>
						<a-icon type="exclamation-circle" style="margin-left: 5px;color: #faad14;margin-right: 5px;"/>
						<template slot="title">推广时间为9点至21点，请提前做好承接准备</template>
					</a-tooltip>
				</a-form-item>
				<a-form-item label="目标粉丝数" :wrapper-col="{ span: 12 }" prop="FansCount">
					<a-select
						style="width: 100px"
						v-model="addInfo.FansCount"
						@change="persionCountChange"
					>
						<a-select-option value="100">100人</a-select-option>
						<a-select-option value="200">200人</a-select-option>
						<a-select-option value="300">300人</a-select-option>
					</a-select>
				    <span style="margin-left: 20px;">预计需触达</span><span>{{ persioncount }}</span>人
					<a-tooltip>
						<a-icon type="exclamation-circle" style="margin-left: 5px;color: #faad14;margin-right: 5px;"/>
						<template slot="title">按2%转化率计算触达人数（实际转化率可能受其他因素影响与预估有一定偏差）</template>
					</a-tooltip>
				</a-form-item>
				<a-form-item label="接粉号" :wrapper-col="{ span: 12 }" prop="RFansTaskUnderTakeWechat" v-show="rFansTaskUnderTakeWechatVisible">
					<a-select
						style="width: 100px"
						ref="sltPddSessionId"
						placeholder="请选择接粉号"
						v-model="addInfo.RFansTaskUnderTakeWechat"
						v-decorator="addRules.RFansTaskUnderTakeWechat"
					>
						<a-select-option v-for="d in rfansTaskUnderTakeWechatData" :key="d.Id">{{d.WxId}}</a-select-option>
					</a-select>
				    <span style="margin-left: 20px;">仅可从已登录工位的微信中选择</span>
					<a-tooltip>
						<a-icon type="exclamation-circle" style="margin-left: 5px;color: #faad14;margin-right: 5px;"/>
						<template slot="title">承接粉丝好友申请、引导入群及免单发放</template>
					</a-tooltip>
				</a-form-item>
				<a-form-item label="群管号" :wrapper-col="{ span: 17 }" prop="GFansTaskUnderTakeWechat" v-show="gFansTaskUnderTakeWechatVisible">
					<a-select
						style="width: 100px"
						ref="sltPddSessionId"
						placeholder="请选择群管号"
						v-model="addInfo.GFansTaskUnderTakeWechat"
						v-decorator="addRules.GFansTaskUnderTakeWechat"
					>
						<a-select-option v-for="d in gfansTaskUnderTakeWechatData" :key="d.Id">{{d.WxId}}</a-select-option>
					</a-select>
				    <span style="margin-left: 20px;">需为粉丝群管理员，仅可从已登录工位的微信中选择</span>
				    <a-tooltip>
						<a-icon type="exclamation-circle" style="margin-left: 5px;color: #faad14;margin-right: 5px;"/>
						<template slot="title">通过粉丝入群申请，发送入群欢迎语及开群公告等</template>
					</a-tooltip>
				</a-form-item>
				<a-form-item label="粉丝群" :wrapper-col="{ span: 18 }" prop="Wechatgroup" v-show="fansGroupVisible">
					<a-select
						style="width: 100px"
						ref="sltPddSessionId"
						placeholder="请选择粉丝群"
						v-model="addInfo.Wechatgroup"
						v-decorator="addRules.Wechatgroup"
					>
						<a-select-option v-for="d in wechatgroupData" :key="d.Id">{{d.GroupName}}</a-select-option>
					</a-select>
				    <span style="margin-left: 20px;">仅可从已开通承接功能的群中选择，请确保接粉号及群管号已在该群内</span>
				</a-form-item>
			    <a-form-item label="接粉号" :wrapper-col="{ span: 5 }" prop="TxtRFansTaskUnderTakeWechat" v-show="rWechatVisible">
					<a-input v-model="addInfo.TxtRFansTaskUnderTakeWechat" 
					v-decorator="addRules.TxtRFansTaskUnderTakeWechat"
					placeholder="请输入接粉号"/>
				</a-form-item>
				<a-form-item label="需支付卡密" :wrapper-col="{ span: 15 }">
				    <span>{{ payCardKeyCount }}个</span>（账户卡密数90）<span style="margin-left: 20px;">触达单价8个/1000人</span>
				</a-form-item>
				<a-form-item label="注意">
				    <span>*请确保免单口令余量充足，余量不足时免单口令将暂停发放</span>
				</a-form-item>
			</a-form>
		</a-modal>

		<a-modal title="免单充值" :visible="fansTaskPayVisible" @ok="showPayConfirm" @cancel="addPayHandleCancel" width="1000px" ok-text="确认支付">
			<a-form :form="payform" :model="rechargeParams" ref="payform">
				<a-card class="box-card">
					<ul class="msg-box">
					<li>
						<h4>我要充值</h4>
					</li>
					<li>
						<h4 style="margin-bottom: 15px">充值金额</h4>
						<a-radio-group v-model="countVal" @change="amountChange">
							<a-radio :value=500>500条/￥1950.00</a-radio>
							<a-radio :value=1000>1000条/￥3900.00</a-radio>
							<a-radio :value=2000>2000条/￥7800.00</a-radio>
							<a-radio :value="''">自定义</a-radio>
						</a-radio-group>
					</li>
					<li>
						<h4 style="margin-bottom: 15px">充值方式</h4>
						<a-radio-group v-model="rechargeParams.paymentType" @change="paymentTypeChange">
							<a-radio :value=0>支付宝</a-radio>
							<a-radio :value=1>微信暂不支持</a-radio>
						</a-radio-group>
					</li>
					<li style="border-bottom: 0px;">
						<h4 style="margin-bottom: 15px">充值条数</h4>
						<a-input
						:disabled="disabled"
						clearable
						v-model="rechargeParams.productCount"
						placeholder="请输入条数"
						style="width: 150px"
						type='number'
						@input='oninput'
						></a-input>
						<a-input
						:disabled='true'
						v-show="payAmountVisible"
						placeholder="金额"
						style="width: 150px;color: red;"
						v-model="rechargeParams.totalAmount"
						></a-input>
						<span style="font-size: 12px; margin-left: 10px">3.9元/条</span>
					</li>
					</ul>
				</a-card>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import { CreateFansTask, FansTaskList, CreateOrder, FansTaskUnderTakeWechatList, FansTaskWechatGroupList } from '@/api/tk/fansTaskApi.js'
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'

/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
export const formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}

export default {
	name: 'fansTaskList',
	data() {
		return {
			form: {
				TaskName: '',
				startDate: undefined,
				UnderTakeType: '-1',
				endDate: undefined,
				Status: '-1',
				pageSize: 10,
				pageNum: 1
			},
			addInfo: {
				TaskName: '',
				UnderTakeType: 0,
				PromotionDate: '',
				FansCount: '100',
				RFansTaskUnderTakeWechat: 0,
				GFansTaskUnderTakeWechat: 0,
				Wechatgroup: 0,
				TxtRFansTaskUnderTakeWechat: ''
			},
			leftProductCount: 0, // 剩余数量
			countVal: 500, // 条数
			amountVal: '', // 金额
			disabled: true, // 充值条数input
			payAmountVisible: false, // 充值金额
			persioncount: 10000, // 预计需触达人数
			rfansTaskUnderTakeWechatData: undefined, // 接粉号数据
			gfansTaskUnderTakeWechatData: undefined, // 群管号数据
			wechatgroupData: undefined, // 粉丝群数据
			rFansTaskUnderTakeWechatVisible: true, // 接粉号显示/隐藏
			gFansTaskUnderTakeWechatVisible: true, // 群管号显示/隐藏
			fansGroupVisible: true, // 粉丝群显示/隐藏
			rWechatVisible: false, // 接粉号显示/隐藏
			payCardKeyCount: 80, // 需支付卡密
			// 充值参数
			rechargeParams: {
				productCount: 500, // 条数
				totalAmount: '', // 金额
				paymentType: 0 // 支付方式[0:支付宝,1:微信]
			},
			aform: this.$form.createForm(this),
			payform: this.$form.createForm(this),
			columns: [
				{
					title: '创建时间',
					Key: 'CTime',
					width: '120px',
					dataIndex: 'CTime'
				},
				{
					title: '任务名称',
					Key: 'TaskName',
					width: '100px',
					dataIndex: 'TaskName'
				},
				{
					title: '承接方式',
					Key: 'UnderTakeTypeValue',
					width: '100px',
					dataIndex: 'UnderTakeTypeValue'
				},
				{
					title: '任务状态',
					Key: 'StatusValue',
					width: '100px',
					scopedSlots: { customRender: 'StatusValue' },
				},
				{
					title: '目标粉丝数',
					Key: 'FansCount',
					width: '100px',
					dataIndex: 'FansCount'
				},
				{
					title: '接粉号',
					key: 'RFansTaskUnderTakeWechat',
					width: '100px',
					scopedSlots: { customRender: 'rweChatStatus' }
				},
				{
					title: '群管号',
					key: 'GFansTaskUnderTakeWechat',
					width: '100px',
					scopedSlots: { customRender: 'gweChatStatus' }
				},
				{
					title: '粉丝群',
					width: '100px',
					key: 'FansTaskWechatGroup',
					customRender: (text) => {
						return text.FansTaskWechatGroup[0].GroupName
					}
				},
				{
					title: '推广日期',
					Key: 'PromotionDate',
					width: '100px',
					dataIndex: 'PromotionDate',
					customRender: (text) => moment(text).format("YYYY-MM-DD")
				},
				{
					title: '费用',
					key: 'Amount',
					width: '100px',
					dataIndex: 'Amount',
					customRender: (text) => formatMoney(text / 100, 2)
				}
			],
			addRules: {
				TaskName: [ 'TaskName', { rules: [{required: true, message: '任务名称不能为空!'} ]}],
				PromotionDate: [ 'PromotionDate', { rules: [{required: true, message: '推广日期不能为空!'} ]}],
				RFansTaskUnderTakeWechat: [ 'RFansTaskUnderTakeWechat', { rules: [{required: true, message: '接粉号必选!' } ]}],
				GFansTaskUnderTakeWechat: [ 'GFansTaskUnderTakeWechat', { rules: [{required: true, message: '群管号必选!' } ]}],
				Wechatgroup: [ 'Wechatgroup', { rules: [{required: true, message: '粉丝群必选!'} ]}],
				TxtRFansTaskUnderTakeWechat: [ 'TxtRFansTaskUnderTakeWechat', { rules: [{required: false, message: '推广日期不能为空!'}, {validator: this.cusvalidator} ]}]
			},
			data: [],
			total: 0,
			tableLoading: false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
			fansTaskVisible: false,
			fansTaskPayVisible: false // 充值弹框
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			params.Status *= 1
			params.UnderTakeType *= 1
			FansTaskList(params)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
					this.leftProductCount = res.ObjData
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		// 获取数据
		getFansTaskUnderTakeWechat() {
			// 接粉号
			FansTaskUnderTakeWechatList({
			})
			.then((res) => {
			    if (res.IsSuccess) {
					this.rfansTaskUnderTakeWechatData = res.Data
				} else {
					tipMessage.error(res.Msg)
				}
			})
			.catch(() => {})

			// 群管号
			FansTaskUnderTakeWechatList({
			})
			.then((res) => {
			    if (res.IsSuccess) {
					this.gfansTaskUnderTakeWechatData = res.Data
				} else {
					tipMessage.error(res.Msg)
				}
			})
			.catch(() => {})

			// 粉丝群
			FansTaskWechatGroupList({
			})
			.then((res) => {
			    if (res.IsSuccess) {
					this.wechatgroupData = res.Data
				} else {
					tipMessage.error(res.Msg)
				}
			})
			.catch(() => {})
		},
		handleSearch() {
			this.form.pageNum = 1
			this.query()
		},
		pageChange(p, s) {
			this.form.pageNum = p
			this.query()
		},
		addFansTask() {
			this.fansTaskVisible = true
		},
		cusvalidator(rule, value, callback) {
			if (this.rWechatVisible === true) {
				if (value === undefined) {
					callback('请输入接粉号')
					return // 校验不通过结束当前校验
				}
			}
            callback();//必须调用，参数为空视为校验通过     
        },
		// 新建任务
		addHandleOk(row) {
			console.log(this.addInfo)
			this.aform.validateFieldsAndScroll((err, values) => {
				this.addInfo.FansCount = parseInt(this.addInfo.FansCount)
				if (!err) {
					CreateFansTask(this.addInfo)
					.then((res) => {
						tipMessage.success('操作成功')
						this.fansTaskVisible = false
						this.query()
					})
					.catch(() => {

					})
				}
			})
		},
		addHandleCancel() {
			this.fansTaskVisible = false
		},
		moment,
		range(start, end) {
			const result = []
			for (let i = start; i < end; i++) {
				result.push(i)
			}
			return result
		},
		disabledDate(current) {
			// Can not select days before today and today
			return current && current < moment().endOf('day')
		},
		disabledDateTime() {
			return {
				disabledHours: () => this.range(0, 24).splice(4, 20),
				disabledMinutes: () => this.range(30, 60),
				disabledSeconds: () => [55, 56],
			}
		},
		addPayFansTask() {
			this.fansTaskPayVisible = true
		},
		addPayHandleCancel() {
			this.fansTaskPayVisible = false
		},
		oninput(e) {
			if	(this.rechargeParams.productCount < 0) {
				this.rechargeParams.productCount = 1
				this.rechargeParams.totalAmount = '￥' + formatMoney(this.rechargeParams.productCount * 3.9, 2)
			} else {
        		this.rechargeParams.totalAmount = '￥' + formatMoney(this.rechargeParams.productCount * 3.9, 2)
			}
		},
		showPayConfirm() {
			let that = this
			if (that.rechargeParams.productCount === 0) {
				this.$message.warning('请输入要充值的条数')
				return
			}

			this.$confirm({
				title: '确定要支付?',
				content: '支付金额' + '￥' + formatMoney(this.rechargeParams.productCount * 3.9, 2),
				onOk(){
					that.surePay()
				},
				onCancel() {}
			})
		},
		// 充值金额
		amountChange(e) {
			var val = e.target.value
			this.rechargeParams.productCount = val
			if (val === '') {
				this.disabled = false
				this.payAmountVisible = true
				this.rechargeParams.totalAmount = '￥0.00'
				this.rechargeParams.productCount = 0
			} else {
				this.disabled = true
				this.payAmountVisible = false
			}
		},
		// 支付方式
		paymentTypeChange(e) {
			var val = e.target.value
			if (val === 1) {
				this.rechargeParams.paymentType = 0
				return
			}
			this.rechargeParams.paymentType = val
		},
		// 确认支付
		async surePay() {
			if (this.rechargeParams.productCount === 0) {
				this.$message.warning('请输入要充值的条数')
				return
			}

			// 创建订单
			this.rechargeParams.productCount = parseInt(this.rechargeParams.productCount)
			const res = await CreateOrder(this.rechargeParams)
				.then(function (result) {
					return result
				})
			const { Code, Msg, Data} = res
			if (Code === 0) {
				// 支付方式跳转
				if (this.rechargeParams.paymentType == 0) {
				this.$message.success("支付宝支付");
				const payDiv = document.getElementById("payDiv");
				if (payDiv) {
					document.body.removeChild(payDiv);
				}
				const div = document.createElement("div");
				div.id = "payDiv";
				div.innerHTML = Data.FormHtml;
				document.body.appendChild(div);
				document
					.getElementById("payDiv")
					.getElementsByTagName("form")[0]
					.submit();
				}
			} else {
				this.$message.error(Msg);
			}
		},
		// 预计需触达人数
		persionCountChange(e) {
			this.persioncount = (parseInt(e) + 1) * 100 / 0.02
			this.payCardKeyCount = this.persioncount / 1000 *8
		},
		// 承接方式
		underTakeTypeChange(e) {
			var val = e.target.value
			if (val === 1) {			
				this.aform.resetFields()
				this.rFansTaskUnderTakeWechatVisible = false
				this.gFansTaskUnderTakeWechatVisible = false
				this.fansGroupVisible = false
				this.rWechatVisible = true
				this.aform.setFieldsValue({RFansTaskUnderTakeWechat: 0, GFansTaskUnderTakeWechat:0, Wechatgroup:0});
			} else {
				this.aform.resetFields()
				this.rFansTaskUnderTakeWechatVisible = true
				this.gFansTaskUnderTakeWechatVisible = true
				this.fansGroupVisible = true
				this.rWechatVisible = false
			}
		}
	},
	created() {
		this.query()
		this.getFansTaskUnderTakeWechat()
	}
}
</script>

<style scoped>
/* 信息列表样式 */
.msg-box > li {
  list-style: none;
  border-bottom: 1px solid #c5c5c5;
  padding: 20px 10px;
}
</style>