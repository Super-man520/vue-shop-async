<template>
  <div class="params">
     <div class="block">
        <el-carousel trigger="click" >
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 class="small">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .params,
  .block,
  .el-carousel,
  .el-carousel-item {
    width: 100%;
    height: 100%;
  }
   .el-carousel__item h3 {
    color: #e92322;
    font-size: 54px;
    opacity: 0.75;
    text-align: center;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(3) {
     background: url('../../assets/01.jpg');
  }

  .el-carousel__item:nth-child(4) {
     background: url('../../assets/02.jpg');
  }

  .el-carousel__item:nth-child(5) {
     background: url('../../assets/03.jpg');
  }

  .el-carousel__item:nth-child(6) {
     background: url('../../assets/04.jpg');
  }
</style>
<style lang="less">
  .el-carousel__container {
    height: 100%;
  }
</style>
