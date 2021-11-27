<!-- 创建年度数据 -->

<template>
  <div>
    <!-- Drawer抽屉 -->
    <Drawer title="创建年度数据" v-model="visible" width="720" draggable :mask-closable="false" :styles="styles"
      @on-close="closeHandle">
      <div>
        <!-- 条件 -->
        <Form label-colon ref="drawerForm" :model="drawerForm" :rules="drawerRule" inline :label-width="90">
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
    <Modal v-model="showModal" scrollable :width="1100" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <Form ref="modalForm" :model="modalForm" :rules="modalRule" inline>
        <!-- 企业生产数据 -->
        <div v-if="modalIndex === '1'">
          <div class="title">基本信息</div>
          <FormItem label="年度期末运营车辆数" prop="carCountYearUse" :label-width="160">
            <InputNumber v-model="modalForm.carCountYearUse" controls-outside :min="0" />
            <!-- <InputNumber v-model="modalForm.carCountYearUse" controls-outside :min="0" /> -->
          </FormItem>
          <FormItem label="年度期末在册车辆数" prop="carCountYearOn" :label-width="160">
            <InputNumber v-model="modalForm.carCountYearOn" controls-outside :min="0" />
          </FormItem>
          <FormItem label="投运时间(可按线路填写)" prop="useTime" :label-width="180">
            <DatePicker v-model="modalForm.useTime" type="date" placeholder="投运时间" style="width: 144px" />
          </FormItem>

          <div class="title">生产信息</div>
          <FormItem label="总行程(万公里)" prop="totalLine" :label-width="160">
            <InputNumber v-model="modalForm.totalLine" controls-outside :min="0" />
          </FormItem>
          <FormItem label="客运量(万人次)" prop="totalPerson" :label-width="160">
            <InputNumber v-model="modalForm.totalPerson" controls-outside :min="0" />
          </FormItem>
          <FormItem label="旅客周转量(万人公里)" prop="totalTurnover" :label-width="180">
            <InputNumber v-model="modalForm.totalTurnover" controls-outside :min="0" />
          </FormItem>

          <div class="title">能耗信息</div>
          <add-form-item ref="energyInfo" />

        </div>

        <!-- 辅助设施能耗信息 -->
        <div v-else-if="modalIndex === '2'">
          <FormItem label="辅助设施名称" prop="energyTypeName" :label-width="150">
            <Input v-model="drawerForm.energyTypeName" placeholder="辅助设施名称" clearable />
          </FormItem>
          <add-form-item key="10" />
        </div>

        <!-- 附属设施能耗信息 -->
        <div v-else-if="modalIndex === '3'">
          <FormItem label=" 附属设施名称" prop="year" :label-width="150">
            <Input v-model="drawerForm.year" placeholder="附属设施名称" clearable />
          </FormItem>
          <add-form-item  key="11" />
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="okHandle">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dict from "@/views/my-components/xboot/dict";
  import AddFormItem from "./components/AddFormItem";
  import {
    ajaxYearDataInput
  } from "@/api/transitManage"
  export default {
    name: 'createYearData',
    components: { dict, AddFormItem},
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        visible: false, // 抽屉 - 是否显示
        showModal: false, // modal - 是否显示
        modalTitle: '', // 根据不同的添加按钮，modal中显示不同标题
        modalIndex: '', // 根据不同的添加按钮，modal中显示不同内容4
        quarterYear : '', // 季度年份
        drawerForm: { //  抽屉 - 表单数据
          year: '', // 填报年份
          quarter: '', // 填报季度
        },
        drawerRule: { //  抽屉 - 填报年份和季度校验
          year: [{ required: true, message: '填报年度不能为空', trigger: 'change' }],
          quarter: [{ required: true, message: '填报季度不能为空', trigger: 'change' }]
        },
        modalForm: { // modal - 表单数据
          carCountYearUse: null, // 年度期末运营车辆数
          carCountYearOn: null, // 年度期末在册车辆数
          useTime: '', // 投运时间
          totalLine: null, // 总行程(人公里)
          totalPerson: null, // 客运量(万人次)
          totalTurnover: null, // 旅客周转量(万人公里)
        },
        modalRule: {
          carCountYearUse: [{ required: true, message: '年度期末运营车辆数不能为空', type: 'number', trigger: 'blur' }],
          carCountYearOn: [{ required: true, message: '年度期末在册车辆数不能为空', type: 'number', trigger: 'blur' }],
          useTime: [{ required: true, message: '投运时间不能为空', type: 'date', trigger: 'blur' }],
          totalLine: [{ required: true, message: '总行程不能为空', type: 'number', trigger: 'blur' }],
          totalPerson: [{ required: true, message: '客运量不能为空', type: 'number', trigger: 'blur' }],
          totalTurnover: [{ required: true, message: '旅客周转量不能为空', type: 'number', trigger: 'blur' }]
        },
        quarterOptions: [ //  抽屉 - 填报季度选项
          { value: "1", label: '一季度' },
          { value: "2", label: '二季度' },
          { value: "3", label: '三季度' },
          { value: "4", label: '四季度' }
        ],
        columns: [ // 抽屉-基本信息表头数据
          { title: "年度期末在册车辆数", key: "carCountYearOn", minWidth: 170 },
          { title: "年度期末运行车辆数", key: "carCountYearUse", minWidth: 170 },
          { title: "投运时间(可按线路填写)", key: "useTime", minWidth: 190 },
          { title: "总行程(万公里)", key: "totalLine", minWidth: 140 },
          { title: "客运量(万人次)", key: "totalPerson", minWidth: 135 },
          { title: "旅客周转量(万人公里)", key: "totalTurnover", minWidth: 180 },
          { title: "其他", key: "status2", minWidth: 100, align: "center"  },
          { title: "操作", key: "action", width: 70, align: "center", fixed: "right", render: (h, params) => {
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
                  props: { type: 'text', size: 'small' },
                  style: { color: '#ed4014' },
                  on: {
                    click: () => {
                      this.deleteHandle(params.row, '1')
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        listData: [], // 抽屉-基本信息列表数据

        columns1: [ // 抽屉辅助设施能耗信息-表头数据
          { title: "设施名称", key: "facilitiesName", minWidth: 170 },
          { title: "燃料种类", key: "energyTypeName", minWidth: 120 },
          { title: "消耗量", key: "energyConsumeQuantity", minWidth: 120 },
          { title: "操作", key: "action", width: 70, align: "center", fixed: "right", render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: { type: 'text', size: 'small' },
                  style: { color: '#ed4014' },
                  on: {
                    click: () => {
                      this.deleteHandle(params.row, '2')
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columns2: [ // 抽屉附属设施能耗信息-表头数据
          { title: "设施名称", key: "facilitiesName", minWidth: 170 },
          { title: "燃料种类", key: "energyTypeName", minWidth: 120  },
          { title: "消耗量", key: "energyConsumeQuantity", minWidth: 120 },
          { title: "操作", key: "action", width: 70, align: "center", fixed: "right", render: (h, params) => {
            return h('div', [
                h('Button', {
                  props: { type: 'text', size: 'small' },
                  style: { color: '#ed4014' },
                  on: {
                    click: () => {
                      this.deleteHandle(params.row, '3')
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        listData1: [], // 抽屉辅助设施能耗信息-列表数据
        listData2: [], // 抽屉附属设施能耗信息-列表数据
        styles: { // 抽屉样式
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
      }
    },
    computed: {},
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        if (!val) this.$emit('close', val)
      }
    },
    methods: {
      // 添加 按钮
      addHanlde(val) {
        this.$refs.drawerForm.validate((valid) => {
          if (valid) {
            this.showModal = true
            this.modalIndex = val
            this.quarterYear = this.drawerForm.year+'-'+this.drawerForm.quarter
            if (val === '1') { //  添加 企业生产数据
              this.modalTitle = '添加企业生产数据'
            } else if (val === '2') { // 添加 辅助设施能耗信息
              this.modalTitle = '添加辅助设施能耗信息'
            } else if (val === '3') { // 添加 
              this.modalTitle = '添加附属设施能耗信息'
            }
          }
        })
      },

      // 删除 按钮
      deleteHandle(row, val) {
        if (val === '1') { //  删除 年度数据

        } else if (val === '2') { // 删除 辅助设施能耗信息

        } else if (val === '3') { // 删除 附属设施能耗信息

        }
      },

      // 抽屉 提交 按钮
      submitHandle() {},

      // modal显示状态改变
      handleVisibleChange(val) {
        if (!val) this.closeModal()
      },

      closeModal() {
        this.modalForm = this.$options.data().modalForm
      },

      // 抽屉 取消 按钮
      closeHandle() {
        this.visible = false
      },

      // modal 确定 按钮
      okHandle() {
        this.$refs.modalForm.validate(async valid => {
          if (valid) {
            const itemList = await this.$refs.energyInfo.submit()
            if (itemList) {
              await this.SaveYearDataInput(itemList)
            }
          }
        })
      },

      // modal 取消 按钮
      cancelHandle() {
        this.showModal = false
        this.$refs.modalForm.resetFields()
      },

      // 年度数据录入
      SaveYearDataInput(energyConsumptionList=[]) {
        let params = Object.assign({}, {
          quarterYear : this.quarterYear
        }, this.modalForm, {energyConsumptionList:JSON.stringify(energyConsumptionList)})
        console.log(params,'params')

        ajaxYearDataInput(params).then(res => {
          this.cancelHandle()
          this.$Modal.remove()
        })
      },

      // 填报年度选择时赋值，条件
      changeHandle(date) {
        console.log(date)
        this.drawerForm.year = date
      },
    }
  };
</script>

<style lang="less">
  @import "@/styles/drawer-common.less";

  .title {
    position: relative;
    margin-bottom: 14px;
    font-size: 16px;
    color: #17233d;
    font-weight: 500;

    .ivu-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>