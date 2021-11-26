<!-- 轨道交通 -->

<template>
  <div>
    <Card>
      <!-- 查询条件 -->
      <Form ref="searchForm" :model="searchForm" inline :label-width="60" style="position:relative">
        <FormItem label="年份" prop="quarterYear">
          <DatePicker v-model="searchForm.quarterYear" type="year" placeholder="年份" @on-change="changeHandle" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="queryHandle">查询</Button>
          <Button style="margin-left:10px;" @click="resetHandle">重置</Button>
        </FormItem>
        <FormItem style="position:absolute;right:0;top:0;">
          <Button type="primary" @click="createYearDataHanlde">创建年度数据</Button>
        </FormItem>
      </Form>

      <!-- 列表 -->
      <Table ref="table" border :loading="loading" :columns="columns" :data="listData" />

      <!-- 分页 show-total:显示总数，show-elevator，显示电梯：可以快速切换到某一页，show-sizer：显示分页，用来改变page-size-->
      <Row type="flex" justify="end" style="margin-top:10px;">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          :page-size-opts="[10, 20, 50]"
          size="small"
          show-total
          show-elevator
          show-sizer
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        />
      </Row>
    </Card>

    <!-- 创建年度数据 组件 -->
    <create-year-data
      v-model="showCreateYearData"
      @close="showCreateYearData = false"
    />
  </div>
</template>

<script>
import createYearData from "./createYearData";
import {ajaxQueryDataList} from "@/api/transitManage"
export default {
  name : 'transit-manage',
  components : {createYearData},
  provide() {
    return {
      form: this.$refs.modalForm
    }
  },
  data() {
    return {
      searchForm : {
        quarterYear : '', // 年份季度
        pageNumber: 1, // 页码
        pageSize: 10, // 每页条数
        order : '', // 升序、降序
        sort : '' // 排序字段
      },
      total : 0, // 总共页数
      loading : false, //  列表加载loading
      showCreateYearData : false, // 创建年度数据组件是否显示
      columns: [ // 表头数据
        {type:'index', title:'序号', width: 70, align: "center", fixed: "left"},
        {title: "年度季度", key: "quarterYear", minWidth: 120, fixed: "left"},
        {title: "年度期末在册车辆数(辆)", key: "carCountYearOn", minWidth: 190},
        {title: "年度期末运行车辆数(辆)", key: "carCountYearUse", minWidth: 190},
        {title: "总行程(万公里)", key: "totalLine", minWidth: 140},
        {title: "客运量(万人次)", key: "totalPerson", minWidth: 135},
        {title: "旅客周转量(万人公里)", key: "totalTurnover", minWidth: 180},
        {title: "能量消耗量(折标煤)", key: "standardCoalQuantity", minWidth: 170},
        {title: "温室气体排放量(tCO2)", key: "tco2Quantity", minWidth: 190},
        {title: "辅助设施能源消耗(折标煤)", key: "", minWidth: 210},
        {title: "辅助设施能源消耗(tCO2)", key: "", minWidth: 200},
        {title: "附属设施能源消耗(折标煤)", key: "", minWidth: 210},
        {title: "附属设施能源消耗(tCO2)", key: "", minWidth: 200},
        {title: "状态", key: "state", width: 100, align:"center", render: (h, params) => {
            if (params.row.status === '0') {
              return h("Badge", { props: { status: "success", text: "已提交" } });
            } else if (params.row.status == '-1') {
              return h("Badge", { props: { status: "error", text: "未提交" } });
            }
          }
        },
        {title: "操作", key: "action", width: 170,align: "center", fixed: "right", render : (h, params) => {
          return h('div', [
            h('Button', {
              props : {type : 'text', size : 'small'},
              style : {color: '#19be6b'},
              on : {
                click : () => {
                  this.lookHandle(params.row)
                  console.log(params)
                }
              }
            }, '查看'),
            h('Button', {
              props : {type : 'text', size : 'small'},
              style : {color: '#ed4014'},
              on : {
                click : () => {
                  console.log(params.index)
                }
              }
            }, '删除')
          ])
        }}
      ],
      listData : [] // 列表数据
      
    }
  },
  created(){
    this.queryHandle()
  },
  methods : {
    // 查询 按钮
    queryHandle(){
      this.getListData()
    },

    // 重置 按钮
    resetHandle(){
      this.searchForm = this.$options.data().searchForm
      this.total = 0
    },

    // 创建年度数据 按钮
    createYearDataHanlde(){
      this.showCreateYearData = true
    },

    // 查看 按钮
    lookHandle(row){

    },

    // 获取表格数据
    getListData(){
      ajaxQueryDataList(this.searchForm).then(res => {
        this.listData = res.result.records || []
        this.total = res.result.total
      })
    },

    // 年度选择时赋值，查询条件
    changeHandle(date){
      this.searchForm.quarterYear = date
    },

    // 页码改变
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getListData();
    },

    // 每页条数改变
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getListData()
    },

    // 排序时有效，当点击排序时触发
    changeSort(){},

    // 在多选模式下有效，只要选中项发生变化时就会触发
    showSelect(){}
  }
}
</script>
