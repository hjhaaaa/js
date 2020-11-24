<template>
    <div class="activa-code">
        <a-card title="激活码管理">
            <a-form layout="inline" :form="form" style="margin-bottom: 10px;font-size: 16px">
                <a-form-item label="激活码">
					<a-input v-model="form.CardCode" placeholder="请输入激活码" />
				</a-form-item>
                <a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>
                <a-form-item label="工位ID">
					<a-input v-model="form.WorkstationId" placeholder="请输入工位ID" />
				</a-form-item>
                <a-form-item label="状态">
					<a-select
						style="width: 100px"
						v-model="form.Status"
                        :options="statusOptions"
					>
					</a-select>
				</a-form-item>
                <a-form-item>
					<a-button icon="search" type="primary" @click="search">查询</a-button>
				</a-form-item>
                <a-form-item>
					<a-button icon="search" type="primary" @click="accountRecharge">账户充值</a-button>
				</a-form-item>
            </a-form>
        </a-card>
    </div>
</template>
<script>
import { PageList } from '@/api/tk/activationCode.js'

export default {
    name: 'ActivationCode',
    data() {
        return {
            form: {
                CardCode: '',
                UserName: '',
                WorkstationId: '',
                Status: -1
            },
            pageList: {
                PageNum: 1,
                PageSize: 20
            },
            statusOptions: [],
            tableList: []
        }
    },
    created() {
        this.getPageList()
    },
    methods: {
        getPageList() {
            const params = Object.assign({}, this.form, this.pageList)
            PageList(params).then(res => {
                console.log('page---', res)
            })
        },
        search() {},
        accountRecharge() {}
    }
}
</script>