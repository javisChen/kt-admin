<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="分类名称">
              <a-input v-model="queryParam.projectName" placeholder=""/>
            </a-form-item>
          </a-col>
          <!--                <a-col :md="8" :sm="24">-->
          <!--                  <a-form-item label="使用状态">-->
          <!--                    <a-select v-model="queryParam.status" placeholder="请选择" :default-value="0"-->
          <!--                              @change="handleQueryStatusChange">-->
          <!--                      <a-select-option v-for="(value, key) in routeStatusDictionary"-->
          <!--                                       :key="key"-->
          <!--                                       :value="key">-->
          <!--                        {{ value }}-->
          <!--                      </a-select-option>-->
          <!--                    </a-select>-->
          <!--                  </a-form-item>-->
          <!--                </a-col>-->
          <a-col :md="!advanced && 8 || 24" :sm="24">
                              <span class="table-page-search-submitButtons"
                                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                                <a-button type="primary" @click="loadTableData">查询</a-button>
                                <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>
                              </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="showForm">添加分类</a-button>
    </div>

    <a-table
      v-if="tableData && tableData.length > 0"
      bordered
      @change="handleTableChange"
      :pagination="pagination"
      :loading="tableLoading"
      :size="'small'"
      :indent-size="15"
      :row-key="rowKey"
      :columns="columns"
      :data-source="tableData">

      <template slot="level" slot-scope="text, record">
        {{ getLevelDesc(record.level) }}
      </template>

      <template slot="setting" slot-scope="text, record">
        <a v-if="record.level < 3" @click.prevent="toChildren(record)">查看下级</a>&nbsp;
      </template>

      <template slot="action" slot-scope="text, record">
        <k-tooltip-button title="查看" @click="handleView(record)" icon="search"/>
      </template>
    </a-table>
    <a-empty v-else/>

    <commodity-category-form ref="commodityCategoryForm"
                             @success="handleFormOnSuccess"
                             @cancel="handleEditFormCancel"/>

  </a-card>


</template>

<script>

import {getInfo, getPageList} from '@/api/commodity/category-api'
import CommodityCategoryForm from "./components/CommodityCategoryForm";

const levelDict = {
  1: '一级菜单',
  2: '二级菜单',
  3: '三级菜单'
}

const pagination = {
  showSizeChanger: true,
  position: 'bottom',
  size: 'default',
  showQuickJumper: true,
  pageSizeOptions: ['15', '25', '35', '50'],
  defaultCurrent: 1,
  defaultPageSize: 15,
  total: 0
}

const queryParam = {
  name: '',
  pid: undefined,
  level: undefined,
  current: 1,
  size: 15,
}

export default {
  name: 'CommodityCategory',
  components: {
    CommodityCategoryForm
  },
  data() {
    return {
      pagination,
      tableLoading: false,
      advanced: false,
      queryParam: Object.assign({}, queryParam),
      tableData: [],
      columns: [
        {
          title: '分类名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'level',
          scopedSlots: {customRender: 'level'},
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'gmtCreate',
        },
        {
          title: '设置',
          align: 'center',
          scopedSlots: {customRender: 'setting'},
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {customRender: 'action'},
        }
      ],
      selectedRoute: {},
      roleFormVisible: false,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(newValue, oldValue) {
        this.initQueryParams()
        this.loadTableData();
      }
    },
  },
  created() {
    this.loadTableData();
  },
  methods: {
    initQueryParams(query) {
      if (this.$route.query) {
        const {pid , level} = this.$route.query;
        this.queryParam.pid = pid
        this.queryParam.level = level
      }
    },
    toChildren(record) {
      this.$router.push({
        path: '/commodity/category',
        query: {
          pid: record.id,
          level: record.level + 1
        },
      })
    },
    getLevelDesc(value) {
      return levelDict[value]
    },
    async handleView(record) {
      const {data} = await getInfo({id: record.id})
      this.$refs['commodityCategoryForm'].open(data, 'view')
    },
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.current = pagination.current
      this.loadTableData()
    },
    resetQueryParams() {
      this.queryParam = Object.assign(this.queryParam, queryParam)
      this.loadTableData()
    },
    handleQueryStatusChange(value) {
      this.loadTableData()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleFormOnSuccess() {
      this.$message.success('保存成功')
      this.loadTableData()
    },
    handleEditFormCancel() {
    },
    showForm(e, mode = 'add', record) {
      console.log(e)
      console.log(mode)
      if (!record) {
        record = {
          pid: this.queryParam.pid
        }
      }
      this.$refs['commodityCategoryForm'].open(mode, record)
    },
    rowKey(record) {
      return record.id
    },
    toggleLoading() {
      this.tableLoading = !this.tableLoading
    },
    async loadTableData() {
      this.toggleLoading()
      const {data} = await getPageList(this.queryParam)
      this.tableData = data.records;
      this.pagination.total = data.total
      this.toggleLoading()
    }
  }
};

</script>

<style lang="css">

input:focus {
  border: 0;
  outline: none;
}

</style>