<template>
  <div class="search">
    <Card>
      <!-- 查询 -->
      <Row v-show="openSearch" @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="130">
            <FormItem label="企业名称/单位名称" prop="entName">
              <Input type="text" v-model="searchForm.entName" placeholder="请输入企业名称/单位名称" clearable style="width: 200px"/>
            </FormItem>
          <FormItem style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </FormItem>
        </Form>
      </Row>

      <!-- 表格操作相关按钮 -->
      <Row class="operation">
        <Button @click="add" type="primary" icon="md-add">添加</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Button @click="getDataList" icon="md-refresh">刷新</Button>
        <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? "关闭搜索" : "开启搜索"}}</Button>
        <Button type="dashed" @click="openTip=!openTip">{{openTip ? "关闭提示" : "开启提示"}}</Button>
      </Row>
      <Alert show-icon v-show="openTip">
        已选择
        <span class="select-count">{{selectList.length}}</span> 项
        <a class="select-clear" @click="clearSelectAll">清空</a>
      </Alert>

      <!-- 表格 -->
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect" />
      
      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        />
      </Row>

      <addEdit :data="form" :type="showType" v-model="showDrawer" @on-submit="getDataList" />
    </Card>
  </div>
</template>

<script>
import { getEnterpriseInfoMangeList, deleteEnterpriseInfoMange } from "@/api/entpriseinfoManage";
import addEdit from "./addEdit.vue";
import { shortcuts } from "@/libs/shortcuts";
export default {
  name: "enterpriseinfoMange",
  components: { addEdit },
  data() {
    return {
      openSearch: true, // 显示搜索
      openTip: true, // 显示提示
      showType: "0", // 添加或编辑标识
      showDrawer: false, // 显示添加编辑抽屉
      loading: true, // 表单加载状态
      searchForm: { // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
      },
      total: 0, // 表单数据总数
      selectList: [], // 多选数据
      form: {},
      columns: [  // 表头
        { type: "selection", width: 60, align: "center", fixed:"left" },
        { type: "index",title:'序号', width: 80, align: "center", fixed:"left" },
        { title: "企业名称/单位名称", key: "entName", minWidth: 160,  sortable: false },
        { title: "营业执照", key: "entBusinessLicense", minWidth: 120, sortable: false },
        { title: "负责人", key: "leadingCadre", minWidth: 120, sortable: false },
        { title: "联系人", key: "contacts", minWidth: 120, sortable: false },
        { title: "地址", key: "address", minWidth: 120, sortable: false },
        { title: "板块", key: "plateIds", minWidth: 200, sortable: false },
        { title: "审核级别", key: "auditLevel", minWidth: 120, sortable: false },
        { title: "所属于城市", key: "cityId", minWidth: 120, sortable: false },
        { title: "所选择城市",  key: "cityIds",  minWidth: 120,  sortable: false },
        { title: "操作", key: "action", align: "center", width: 150, fixed:"right", render: (h, params) => {
            return h("div", [ 
              h( "a", {
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                }, "编辑" ),
              h("Divider", {
                props: { type: "vertical" }
              }),
              h("a", {
                style : {color: '#ed4014'},
                on: {
                  click: () => {
                    this.remove(params.row);
                  }
                }
              },"删除" )
            ]);
          }
        }
      ],
      data: [] // 表单数据   
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getDataList();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      // 重新加载数据
      this.getDataList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
    },
    getDataList() {
      this.loading = true;
      getEnterpriseInfoMangeList(this.searchForm).then(res => {
        if (res.success) {
          this.data = res.result.records || [];
          this.total = res.result.total || 0;
          if (this.data.length == 0 && this.searchForm.pageNumber > 1) {
            this.searchForm.pageNumber -= 1;
            this.getDataList();
          }
        }
      }).finally(_ => {
        this.loading = false;
      });
    },
    add() {
      this.showType = "2";
      this.showDrawer = true;
    },
    edit(v) {
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.form = data;
      this.showType = "1";
      this.showDrawer = true;
    },
    remove(v) {
      this.$Modal.confirm({ title: "确认删除", content: "您确认要删除该条数据?", loading: true,
        onOk: () => {
          // 删除
          deleteEnterpriseInfoMange({ids: v.id}).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    },
    delAll() {
      if (this.selectList.length <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({ title: "确认删除", content: "您确认要删除所选的 " + this.selectList.length + " 条数据?", loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量删除
          deleteEnterpriseInfoMange({ids: ids}).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
// 建议引入通用样式 具体路径自行修改 可删除下面样式代码
// @import "@/styles/table-common.less";
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page {
        margin-top: 2vh;
    }
    .drop-down {
        margin-left: 5px;
    }
}
</style>