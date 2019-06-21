<template>
    <div class="system-info">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>系统信息</h3>
            </div>
            <div class="text item">
                <el-alert
                    title="成功提示的文案"
                    type="success"
                    show-icon>
                </el-alert>
                <el-alert
                    title="消息提示的文案"
                    type="info"
                    show-icon>
                </el-alert>
            </div>

            <el-row :gutter="30">
                <el-col :span="13">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <h4>销售排行</h4>
                        </div>
                        <div class="text item">
                            <el-table
                                :data="sellRank"
                                >
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    width="350">
                                </el-table-column>
                                <el-table-column
                                    prop="sellNum"
                                    label="销量">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="11">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <h4>缺货的商品</h4>
                        </div>
                        <div class="text item">
                             <el-table
                                :data="stockout"
                                style="width: 100%">
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="inventory"
                                    label="库存"
                                   >
                                </el-table-column>
                                <el-table-column
                                    prop="operation"
                                    label="操作">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
         
    </div>
</template>

<script>
    export default {
        data(){
            return {
                sellRank : [//销售排行
                    {
                        goodsName : "老干妈",
                        sellNum : 100
                    },
                    {
                        goodsName : "霸王洗发水",
                        sellNum : 50
                    }
                ],
                stockout : [//缺货商品
                     {
                         goodsName : "可乐",
                         inventory : "0",
                         operation : "入库"
                     }
                ]
            }
        }
    }
</script>

<style lang="less">
      .system-info{
          .el-card{
               border:1px solid #ccc;
              .el-card__header{
                 padding: 12px 20px;
                 background:#f2f2f2;
                 h3 {
                     font-size:16px;
                 }
              }
              .el-card__body{
                  .el-alert:last-child{
                      margin:20px auto;
                  }
              }
          }
      }
</style>