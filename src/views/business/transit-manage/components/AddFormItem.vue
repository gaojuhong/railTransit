<template>
  <div>
    <Form ref="itemListForm" :model="itemListForm" inline>
      <Row v-for="(item, idx) in itemListForm.itemList" :key="idx">
        <FormItem label="燃料种类" :prop="'itemList.' + idx + '.energyTypeId'" :label-width="160" 
          :rules="[{ required: true, message: '燃料种类不能为空', trigger: 'change' }]">
          <dict dict="energy_type" v-model="item.energyTypeId" style="width: 144px" />
        </FormItem>
        <FormItem label="燃料消耗量" :prop="'itemList.' + idx + '.energyConsumeQuantity'" :label-width="160"
          :rules="[{ required: true, type: 'number', message: '燃料消耗量不能为空', trigger: 'blur' }]">
          <InputNumber v-model="item.energyConsumeQuantity" :precision="4"  controls-outside :min="0" />
        </FormItem>
        <Button type="error" shape="circle" icon="md-remove" v-if="hasShowBtn" @click="removeItemHander(idx)"
          style="margin-right: 10px" />
        <Button type="success" shape="circle" icon="md-add" v-if="idx === itemListForm.itemList.length - 1"
          @click="addItemhander" />
      </Row>
    </Form>
  </div>
</template>

<script>
  import dict from "@/views/my-components/xboot/dict";
  export default {
    name : 'AddFormItem',
    components: { dict },
    props: { },
    data() {
      return {
        itemListForm: {
          itemList: [{
            energyTypeId: "", // 能源种类
            energyConsumeQuantity: "", // 能源数量
          }]
        }
      };
    },
    computed: {
      hasShowBtn() {
        if (this.itemListForm.itemList.length <= 1) {
          // 删除按钮只有第一个不显示，添加按钮只有最后一个显示
          return false;
        }
        return true;
      },
    },
    methods: {
      submit() {
        return new Promise((resolve, reject) => {
          const { itemList } = this.itemListForm
          this.$refs.itemListForm.validate(valid => {
            if (valid) {
              resolve([...itemList])
            } else {
              resolve(false)
            }
          })
        })
      },
      removeItemHander(idx) {
        this.itemListForm.itemList.splice(idx, 1);
      },
      addItemhander() {
        this.itemListForm.itemList.push({
          energyTypeId: "", // 能源种类
          energyConsumeQuantity: "", // 能源数量
        });
      },
    },
  };
</script>