<template>
    <div class="sell-total">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>销售数据统计</h3>
            </div>
            <div class="text item">
                <el-form 
                    :inline="true"
                    :model="SellTotalForm" 
                    size="small"
                    >
                        <el-form-item label="时间">
                            
                            <el-date-picker 
                            type="date" 
                            placeholder="选择日期"
                            v-model="SellTotalForm.date1" 
                            style="width: 150px"
                            ></el-date-picker>
                        
                            <span>--</span>

                            <el-date-picker 
                            placeholder="选择时间" 
                            v-model="SellTotalForm.date2" 
                            style="width: 150px"></el-date-picker>
                        
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="SellTotalForm.region" placeholder="销售情况统计">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                </el-form>
                <div id="sellcharts" style="height:400px"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                SellTotalForm :{
                   region:"",
                   date1:"",
                   date2:""
                }
            }
        },
        mounted(){
            this.selltotal();
        },
        methods:{
            onSubmit(){

            },
            selltotal(option){
                // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('sellcharts'));

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted(){
           // 指定图表的配置项和数据
                var option = {
                        title: {
                            text: '销售统计',
                            left: 'center'
                        },
                        xAxis: {
                            type: 'category',
                            data: ['2019-06-10', '2019-06-11', '2019-06-12', '2019-06-13', '2019-06-14', '2019-06-15', '2019-06-16']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line'
                        }]
                };
            
            //调用echarts函数
            this.selltotal(option)
        }
        
    }
</script>

<style lang="less">
    .sell-total{
          .el-card{
               border:1px solid #ccc;
              .el-card__header{
                 padding: 12px 20px;
                 background:#f2f2f2;
                 h3 {
                     font-size:16px;
                 }
              }
          }
      }
</style>