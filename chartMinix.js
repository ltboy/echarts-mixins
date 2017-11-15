import {
    mapActions,
    mapGetters
} from 'vuex'
import echarts from "echarts"
export default {
    props:{
        show:{
            default:false
        }
    },
    //设置chart的id 并在store进行注册 防止相同id存在
    data() {
        return {
            options: null, //初始化配置为空
            myChart: null, //echart对象
            timeout: null, //定时器 延时调用myChart
            setOption_time: null,
            mounted_time: null,
        }
    },
    methods: {
        //初始化chart
        initChart() {
            var _this = this
            this.myChart = echarts.init(_this.$refs.chart);
            this.myChart.showLoading();
            if (_this.options) {
                _this.setOption()
            }
            this.myChart.on("click",(v)=>{
              this.$emit("chartClick",v.value[0]);
            });
        },

        //   获取chart options配置项
        setOption() {
            this.setOption_time && clearTimeout(this.setOption_time)
            this.setOption_time = setTimeout(() => {
                if(this.myChart){
                    this.myChart.clear()
                    this.myChart.setOption(this.options);
                    this.myChart.hideLoading()
                } 
            }, 30)
        },
        //   获取DOM宽度
        getWidth() {
            this.timeout && clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.myChart.resize();
            }, 30)
        }
    },
    // 监听options来实现chart重渲染
    watch: {
        show(){
            if (!this.myChart){
                return
            }
            if(this.show){
                this.myChart.showLoading();
            }
            else{this.myChart.hideLoading();}
        },
        data: function() {
            this.getOption();
        },
        options: function() {
            this.setOption()
        },
        bodyWidth: function() {
            this.getWidth();
        }
    },
    computed: {
        ...mapGetters(['bodyWidth'])
    },
    beforeDestroy() {
        this.timeout = null;
        this.setOption_time = null;
        this.mounted_time = null;
    },
    // 渲染chart
    mounted() {
        this.mounted_time && clearTimeout(this.mounted_time)
        this.mounted_time = setTimeout(() => {
            this.initChart()
        }, 20)
    },
}
