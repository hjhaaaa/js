<template>
    <div>
        <a-card>
            <a-button type="link"
                      @click="back"
                      icon="double-left">
                返回上一页
            </a-button>
        </a-card>
        <a-card title="用户详情"
                :bordered="false">
            <a-card>
                <a-row>
                    <a-col :span="6">淘客ID：{{item.TkId}}</a-col>
                    <a-col :span="6">昵称：{{item.WeChatNick}}</a-col>
                    <a-col :span="6">电话：{{item.Mobile}}</a-col>
                    <a-col :span="6">微信号：{{item.WeChatId}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="6">注册时间：{{item.RegisterTime}}</a-col>
                    <a-col :span="6">渠道授权：{{item.IsChannel?'是':'否'}}</a-col>
                    <a-col :span="6">是否付费：{{item.IsPay?'是':'否'}}</a-col>
                    <a-col :span="6">用户属性：
                        <a-select @change="(e)=>{handleChange(2,e)}"
                                  v-model="item.UserProperty"
                                  style="width: 120px">
                            <a-select-option :value="i"
                                             v-for="(v,i) in userPropertyList"
                                             :key="i">
                                {{v}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="6">承接阶段：
                        <a-select @change="(e)=>{handleChange(3,e)}"
                                  v-model="item.Stage"
                                  style="width: 120px">
                            <a-select-option :value="i"
                                             v-for="(v,i) in stageList"
                                             :key="i">
                                {{v}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">加入社群：
                        <a-select @change="(e)=>{handleChange(6,e)}"
                                  v-model="item.Community"
                                  style="width: 120px">
                            <a-select-option :value="i"
                                             v-for="(v,i) in CommunityList"
                                             :key="i">
                                {{v}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">淘客身份：
                        <a-select @change="(e)=>{handleChange(7,e)}"
                                  v-model="item.TkRole"
                                  style="width: 120px">
                            <a-select-option :value="v.value"
                                             v-for="(v,i) in ShenFenList"
                                             :key="i">
                                {{v.text}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
            </a-card>
            <a-card title="淘客维护记录">
                <a-form :form="form">
                    <a-form-item label="标题">
                        <a-input v-model="form.title" />
                    </a-form-item>
                    <a-form-item label="详情">
                        <a-textarea v-model="form.value"
                                    :rows="4"
                                    :maxLength="1000" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 1, offset: 0 }">
                        <a-button type="primary"
                                  @click="handleSubmit">
                            确定
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
            <a-row>
                <a-col :span="12">
                    <a-card title="推广跟进日志">
                        <a-card :title="v.Title"
                                v-for="(v,i) in logList"
                                v-if="v.Type == 1"
                                :key="i">
                            <span slot="extra">操作人：{{v.Operator}}</span>
                            <pre>{{v.Details}}</pre>
                            <p>{{v.CTime}}</p>
                        </a-card>
                    </a-card>
                </a-col>
                <a-col :span="12">
                    <a-card title="运营跟进日志">
                        <a-card :title="v.Title"
                                v-for="(v,i) in logList"
                                v-if="v.Type == 0"
                                :key="i">
                            <span slot="extra">操作人：{{v.Operator}}</span>
                            <pre>{{v.Details}}</pre>
                            <p>{{v.CTime}}</p>
                        </a-card>
                    </a-card>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
    const _form = {
        tkId: null,
        updateType: 5,
        title: '',
        value: '',
    }
    import moment from 'moment'
    import { getRecordItem, getLog, updateRecord, getHeadList } from '@/api/newUserFollowUp.js'
    export default {
        name: 'tk-newUserFollowUp',
        data() {
            return {
                id: null,
                item: {},
                userPropertyList: {
                    0: '普通',
                    1: 'KA淘客',
                    2: '潜在KA'
                },
                stageList: {
                    '0': '新淘客',
                    '1': '入门承接',
                    '2': '商学院培训',
                    '3': '成长期',
                    '4': '衰退期',
                    '5': '已流失'
                },
                CommunityList: {
                    '0': '起飞营',
                    '1': '管家群',
                    '2': '雪豹群'
                },
                ShenFenList: [
                    {value: 1, text: '抖快红人'},
                    {value: 2, text: '返利淘客'},
                    {value: 3, text: '商家'},
                    {value: 0, text: '其他淘客'},
                ],
                logList: [],
                form: {
                    ..._form
                }
            }
        },
        methods: {
            getData() {
                getRecordItem({
                    tkId: this.id,
                }).then(res => {
                    res.UserProperty > -1 && (res.UserProperty = res.UserProperty.toString());
                    res.Stage > -1 && (res.Stage = res.Stage.toString());
                    res.Community > -1 && (res.Community = res.Community.toString())
                    if(res.TkRole !== 0 && !res.TkRole){
                        res.TkRole = ''
                    }

                    this.item = res;
                })
            },
            getItemLog() {
                getLog({
                    TkId: this.id
                }).then(res => {
                    this.logList = res || [];
                })
            },
            handleChange(type, e) {
                let postData = {
                    tkId: this.id,
                    updateType: type,
                    value: e
                }
                updateRecord(postData).then(res => {
                    if (!res.code || (res.hasOwnProperty('code') && res.code == 0)) {
                        this.$message.success('操作成功');
                        this.form = {
                            ..._form
                        }
                        this.form.tkId = this.id;
                        this.getItemLog();
                    }
                })
            },
            handleSubmit() {
                updateRecord(this.form).then(res => {
                    if (!res.code || (res.hasOwnProperty('code') && res.code == 0)) {
                        this.$message.success('操作成功');
                        this.form = {
                            ..._form
                        }
                        this.form.tkId = this.id;
                        this.getItemLog();
                    }
                })
            },
            back() {
                this.$router.back(-1)
            }
        },
        created() {
            this.id = Number(this.$route.params.id);
            this.form.tkId = this.id;
            this.getItemLog();
            this.getData();
        }
    }
</script>