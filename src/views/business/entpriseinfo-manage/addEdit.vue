<template>
  <div>
    <!-- Drawer抽屉 -->
    <Modal v-model="visible" scrollable :width="1100" :mask-closable="type=='0'">
      <p slot="header">{{title}}</p>
      <Form ref="form" :model="form" :rules="formValidate" :label-width="140">
        <Row :gutter="32">
          <Col span="8">
            <FormItem label="企业名称/单位名称" prop="entName" >
              <Input v-model="form.entName" clearable/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="营业执照" prop="entBusinessLicense" >
              <Input v-model="form.entBusinessLicense" clearable/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="负责人" prop="leadingCadre" >
              <Input v-model="form.leadingCadre" clearable/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">   
          <Col span="8">
            <FormItem label="联系人" prop="contacts" >
              <Input v-model="form.contacts" clearable/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="地址" prop="address" >
              <Input v-model="form.address" clearable/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="审核级别" prop="auditLevel" >
              <Select v-model="form.auditLevel" style="width:194px">
                <Option v-for="item in auditLevelOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="8">
            <FormItem label="所属于城市" prop="cityId" >
              <Input v-model="form.cityId" clearable/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="所选择城市" prop="cityIds">
              <Select v-model="form.cityIds" style="width:194px">
                <Option v-for="item in auditLevelOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="板块" prop="plateIds">
              <CheckboxGroup v-model="form.plateIds" @on-change="changeHandle">
                <Checkbox v-for="(plate, index) in plateIdsOptions" :key="index" :label="plate.label" />
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" v-show="type!='0'">
        <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
        <Button @click="visible = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { addEnterpriseInfoMange, editEnterpriseInfoMange } from "@/api/entpriseinfoManage";
  import dict from "@/views/my-components/xboot/dict";
export default {
  name: "addEdit",
  components: { dict },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    type: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      visible: this.value,
      title: "",
      submitLoading: false,
      maxHeight: 510,
      form: { // 添加或编辑表单对象初始化数据
        entName: "",
        entBusinessLicense: "",
        leadingCadre: "",
        contacts: "",
        address: "",
        plateIds: [],
        auditLevel: "",
        cityId: "",
        cityIds: "",
        typeCode : '0', // 0企业 1审核单位
      },
      // 表单验证规则
      formValidate: {
        entName: [{ required: true, message: "企业名称/单位名称不能为空", trigger: "change" }],
      },
      auditLevelOptions : [ // 审核级别选项
        { value: "1", label: '初审' },
        { value: "2", label: '复审' },
      ],
      plateIdsOptions: [ //  板块选项
        { value: "1", label: '轨道交通' },
        { value: "2", label: '航空运输' },
        { value: "3", label: '道路客运' },
        { value: "4", label: '公交客运' },
        { value: "5", label: '出租客运' },
        { value: "6", label: '港口作业' },
        { value: "7", label: '水路客运' },
      ]
    };
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    },
    visible(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          alert(1)
          const formData = {...this.form};
            console.log(formData)
          formData.plateIds = formData.plateIds.split(',').join('_')
          console.log(formData.plateIds)
          // if (this.type == "1") {
          //   // 编辑
          //   this.submitLoading = true; 
          //   editEnterpriseInfoMange(this.form).then(res => {
          //     this.submitLoading = false;
          //     if (res.success) {
          //       this.$Message.success("操作成功");
          //       this.$emit("on-submit", true);
          //       this.visible = false;
          //     }
          //   });
          // } else {
          //   // 添加
          //   this.submitLoading = true;
          //   addEnterpriseInfoMange(this.form).then(res => {
          //     this.submitLoading = false;
          //     if (res.success) {
          //       this.$Message.success("操作成功");
          //       this.$emit("on-submit", true);
          //       this.visible = false;
          //     }
          //   });
          // }
        }
      });
    },
    setCurrentValue(value) {
      if (value === this.visible) {
        return;
      }
      if (this.type == "1") {
        this.title = "编辑企业";
        this.maxHeight =
          Number(document.documentElement.clientHeight - 121) + "px";
      } else if (this.type == "2") {
        this.title = "添加企业";
        this.maxHeight =
          Number(document.documentElement.clientHeight - 121) + "px";
      } else {
        this.title = "详细信息";
        this.maxHeight = "100%";
      }
      // 清空数据
      this.$refs.form.resetFields();
      if (this.type == "0" || this.type == "1") {
        // 回显数据处理
        this.form = this.data;
      } else {
        // 添加
        delete this.form.id;
      }
      this.visible = value;
    },
    changeHandle(val){
      console.log(val)
    }
  }
};
</script>
