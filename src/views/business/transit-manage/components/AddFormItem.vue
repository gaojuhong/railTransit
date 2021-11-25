<template>
  <Form label-colon ref="modalForm" :model="modalForm" :rules="modalRule" inline>
    <Row v-for="(item,idx) in modalForm.itemList" :key="idx">
      <FormItem label="" prop="year" :label-width="150">
       <dict dict="energy_type" v-model="item.value1" style="width: 144px" />
      </FormItem>
      <FormItem  label="" prop="year" :label-width="150">
        <InputNumber v-model="item.value2" controls-outside :min="0" />
      </FormItem>
      <Button type="success" shape="circle" icon="md-add" @click="addItemhander" style="margin-right:10px;" />
      <Button type="error" shape="circle"  v-if="hasShowBtn"  @click="removeItemHander(idx)" icon="md-remove" />
    </Row>
  </Form>
</template>

<script>
import dict from "@/views/my-components/xboot/dict";
  export default {
    components:{dict},
    data() {
      return {
        modalForm: {
          itemList: [{
            value1: "",
            value2: ""
          },
          {
            value1: "",
            value2: ""
          }
          ]
        }
      }
    },
    computed:{
      hasShowBtn(){
        let itemListLen=this.modalForm.itemList.length
        if(itemListLen<=1){
          return false
        }
        return true
      }
    },
    methods:{
      removeItemHander(idx){
       this.modalForm.itemList.splice(idx,1)
      },
      addItemhander(){
        this.modalForm.itemList.push({
            value1: "",
            value2: ""
        })
      }
    }

  }
</script>

<style>

</style>