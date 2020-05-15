import install from './install';
import createMatcher from './create-matcher';
import HashHistory from './history/hash'
export default class VueRouter{
    constructor(options){
        // 1.什么叫路由 核心根据不同的路径跳转不同的组件
        // 将用户传递的routes 转化成好维护的结构 

        // match 负责匹配路径 {'/':'记录','about':'记录'}
        // addRoutes 动态添加路由配置
        this.matcher = createMatcher(options.routes || []);

        // 创建路由系统 根据模式 来创建不同的路由对象
        this.mode = options.mode || 'hash';
        
        this.history = new HashHistory(this);

    }
    init(app){ // new Vue app指代的是根实例
        // 如何初始化 先根据当前路径 显示到指定的 组件
        const history = this.history;
        const setupHashLister = ()=>{
            history.setupListener();
        }
        history.transitionTo(
            history.getCurrentLocation(), // 后续要监听路径变化
            setupHashLister
        )
        history.listen((route)=>{ // 发布订阅方法 
          debugger
            app._route = route; // 视图就可以刷新了
        })
    } // 用来匹配路径的方法
    match(location){
        return this.matcher.match(location);
    }
}
// 默认会调用install方法
VueRouter.install = install