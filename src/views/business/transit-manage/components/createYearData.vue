<!-- 创建年度数据 -->

<template>
  <div>
    <!-- Drawer抽屉 -->
    <Drawer
      title="创建年度数据"
      v-model="visible"
      width="720"
      draggable
      :mask-closable="false"
      :styles="styles"
      @on-close="closeHandle"
    >
      <div style="padding-bottom:53px;">
        <!-- 条件 -->
        <Form label-colon ref="drawerForm" :model="drawerForm" :rules="drawerRule" inline :label-width="75">
          <FormItem label="填报年份" prop="year">
            <DatePicker v-model="drawerForm.year" type="year" placeholder="填报年份" @on-change="changeHandle" />
          </FormItem>
          <FormItem label="填报季度" prop="quarter">
            <Select v-model="drawerForm.quarter" style="width:210px;">
              <Option v-for="item in quarterOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Row style="margin-bottom:2vh">
          <Button type="primary" @click="addHanlde('1')">添加</Button>
        </Row>

        <!-- 基本信息、生产信息、能耗信息 -->
        <Row :gutter="16">
          <Col span="24">
            <Table ref="table" border :columns="columns" :data="listData" :max-height="500" />
          </Col>
        </Row>
        <Divider />
        <Row :gutter="24" class="table-wrap">
          <!-- 辅助设施能耗信息 -->
          <Col span="12">
            <div class="title">辅助设施能耗信息 
              <Button type="primary" @click="addHanlde('2')">添加</Button>
            </div>
            <Table ref="table" border :columns="columns1" :data="listData1" :max-height="500" />
          </Col>

          <!-- 附属设施能耗信息 -->
          <Col span="12">
            <div class="title">附属设施能耗信息 
              <Button type="primary" @click="addHanlde('3')">添加</Button>
            </div>
            <Table ref="table" border :columns="columns2" :data="listData2" :max-height="500" />
          </Col>
      </Row>
      </div>
      <div class="drawer-footer br">
        <Button type="primary" @click="submitHandle">保存</Button>
        <!-- <Button @click="closeHandle">取消</Button> -->
      </div>
    </Drawer>

    <!-- 添加数据 -->
    <Modal
      v-model="showModal"
      :width="1000"
      :title="modalTitle"
      :mask-closable="false"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">

      <Form label-colon ref="modalForm" :model="modalForm" :rules="modalRule" inline>
        <!-- 年度数据 -->
        <div v-if="modalIndex === '1'">
          <div class="title">基本信息</div>
          <FormItem label="年度期末运营车辆数" prop="year" :label-width="150">
            <InputNumber v-model="drawerForm.year" controls-outside :min="0" />
          </FormItem>
          <FormItem label="年度期末在册车辆数" prop="year" :label-width="150">
            <InputNumber v-model="drawerForm.year" controls-outside :min="0" />
          </FormItem>
          <FormItem label="投运时间(可按线路填写)" prop="year" :label-width="180">
            <DatePicker v-model="drawerForm.year" type="date" placeholder="投运时间" style="width: 144px" />
          </FormItem>

          <div class="title">生产信息</div>
          <FormItem label="总行程(万公里)" prop="year" :label-width="150">
            <InputNumber v-model="drawerForm.year" controls-outside :min="0" />
          </FormItem>
          <FormItem label="总行程(万人次)" prop="year" :label-width="150">
            <InputNumber v-model="drawerForm.year" controls-outside :min="0" />
          </FormItem>
          <FormItem label="旅客周转量(万人公里)" prop="year" :label-width="180">
            <InputNumber v-model="drawerForm.year" controls-outside :min="0" />
          </FormItem>

          <div class="title">能耗信息</div>
         <add-form-item />
        </div>

        <!-- 辅助设施能耗信息 -->
        <div v-else-if="modalIndex === '2'">
          <FormItem label="辅助设施名称" prop="year" :label-width="150">
            <Input v-model="drawerForm.year" placeholder="辅助设施名称" clearable />
          </FormItem> 
           <add-form-item/>
        </div>

        <!-- 附属设施能耗信息 -->
        <div v-else-if="modalIndex === '3'">
          <FormItem label=" 附属设施名称" prop="year" :label-width="150">
            <Input v-model="drawerForm.year" placeholder="附属设施名称" clearable /> 
          </FormItem> 
          <add-form-item />
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import dict from "@/views/my-components/xboot/dict";
import AddFormItem from "./AddFormItem.vue";
export default {
  name : 'createYearData',
  components : {
    dict,
    AddFormItem
    },
  props : {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data(){
    return {
      visible: false,
      showModal : false, // 是否显示添加数据modal
      modalTitle: '', // 根据不同的添加按钮，modal中显示不同标题
      modalIndex : '', // 根据不同的添加按钮，modal中显示不同内容
      drawerForm : {
        year : '', // 填报年份
        quarter : '', // 填报季度
      },
      quarterOptions : [ //  填报季度选项
        {value : "1", label : '一季度'},
        {value : "2", label : '二季度'},
        {value : "3", label : '三季度'},
        {value : "4", label : '四季度'}
      ],
      drawerRule : [],
      columns: [ // 表头数据
        {title: "年度期末在册车辆数", key: "nickname", minWidth: 170},
        {title: "年度期末运行车辆数", key: "avatar", minWidth: 170},
        {title: "投运时间(可按线路填写)", key: "dateTime", minWidth: 190},
        {title: "总行程(万公里)", key: "departmentTitle", minWidth: 140},
        {title: "客运量(万人次)", key: "mobile", minWidth: 135},
        {title: "旅客周转量(万人公里)", key: "email", minWidth: 180},
        {title: "汽油(升)", key: "sex", minWidth: 120, align:"center"},
        {title: "柴油(升)", key: "type", minWidth: 120, align:"center"},
        {title: "CNG(m3)", key: "createTime", minWidth:120, align:"center"},
        {title: "LNG(吨)", key: "status", minWidth: 120, align:"center"},
        {title: "电力(度)", key: "status", minWidth: 120, align:"center"},
        {title: "液化石油气(吨)", key: "status1", minWidth: 140, align:"center"},
        {title: "其他", key: "status2", minWidth: 100, align:"center"},
        {title: "操作", key: "action", width: 70, align:"center", fixed: "right", render : (h, params) => {
          return h('div', [
            // h('Button', {
            //   props : {type : 'success', shape : 'circle', icon : 'md-add'},
            //   style : {width: '20px', height: '20px',fontSize: '12px',marginRight: '5px'},
            //   on : {
            //     click : () => {
            //       console.log(params.row, '添加')
            //     }
            //   }
            // }),
            h('Button', {
              props : {type : 'text', size : 'small'},
              style : {color: '#ed4014'},
              on : {
                click : () => {
                  this.deleteHandle(params.row, '1')
                  console.log(params.index)
                }
              }
            }, '删除')
          ])
        }}
      ],
      listData : [ // 列表数据
        {nickname:'1234', avatar:'3455', dateTime:'2021年12月31日', departmentTitle:'120', mobile:'145', email:'199', sex:'1', type:'124', createTime:'2345', status:'-1', status1 : '12', status2:'23'}
      ],
      columns1: [ // 表头数据
        {title: "设施名称", key: "nickname", minWidth: 170},
        {title: "能耗种类", key: "avatar", minWidth: 120},
        {title: "消耗量", key: "dateTime", minWidth: 120},
        {title: "操作", key: "action", width: 70, align:"center", fixed: "right", render: (h, params) => {
          return h('div', [
            h('Button', {
              props : {type : 'text', size : 'small'},
              style : {color: '#ed4014'},
              on : {
                click : () => {
                  this.deleteHandle(params.row, '2')
                  console.log(params.index)
                }
              }
            }, '删除')
          ])
        }}
      ],
      columns2: [ // 表头数据
        {title: "设施名称", key: "nickname", minWidth: 170},
        {title: "能耗种类", key: "avatar", minWidth: 120},
        {title: "消耗量", key: "dateTime", minWidth: 120},
        {title: "操作", key: "action", width: 70, align:"center", fixed: "right", render: (h, params) => {
          return h('div', [
            h('Button', {
              props : {type : 'text', size : 'small'},
              style : {color: '#ed4014'},
              on : {
                click : () => {
                  this.deleteHandle(params.row, '3')
                  console.log(params.index)
                }
              }
            }, '删除')
          ])
        }}
      ],
      listData1 : [ // 列表数据
        {nickname:'1234', avatar:'3455', dateTime:'12324343'}
      ],
      listData2 : [ // 列表数据
        {nickname:'1234', avatar:'3455', dateTime:'123243435'}  
      ],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        // paddingBottom: '53px',
        position: 'static'
    },
    }
  },
  computed : {
  },
  watch : {
    value(val){
      this.visible = val
    },
    visible(val) {
      if (!val) this.$emit('close', val)
    }
  },
  methods : {
    // 添加 按钮
    addHanlde(val){
      this.showModal = true
      this.modalIndex = val
      if (val === '1') { //  添加 年度数据
        this.modalTitle = '添加年度数据'
      } else if (val === '2') { // 添加 辅助设施能耗信息
        this.modalTitle = '添加辅助设施能耗信息'
      } else if (val === '3') { // 添加 
        this.modalTitle = '添加附属设施能耗信息'
      }
    },

    // 删除 按钮
    deleteHandle(row, val){
      if (val === '1') { //  删除 年度数据

      } else if (val === '2') { // 删除 辅助设施能耗信息

      } else if (val === '3') { // 删除 附属设施能耗信息

      }
    },

    // 提交 按钮
    submitHandle(){},

    // 取消 按钮
    closeHandle(){
      this.visible = false
    },

    // 添加数据 确定 按钮
    okHandle(){},

    // 添加数据 删除 按钮
    cancelHandle(){},

    // 填报年度选择时赋值，条件
    changeHandle(date){
      this.drawerForm.year = date
    },
  }
};
</script>

<style lang="less">
@import "@/styles/drawer-common.less";
.title{position:relative;margin-bottom:14px;font-size: 16px; color: #17233d; font-weight: 500;
  .ivu-btn{position:absolute;top:0;right:0;}
}

</style>

