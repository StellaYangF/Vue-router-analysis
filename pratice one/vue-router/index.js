import install from './install';
import createMatcher from './create-matcher';
import HashHistory from './history/hash'
export default class VueRouter{
    constructor(options){
        this.matcher = createMatcher(options.routes || []);
        this.mode = options.mode || 'hash';
        this.history = new HashHistory(this);
    }
    init(app){
        const history = this.history;
        const setupHashLister = ()=>{
            history.setupListener();
        }
        history.transitionTo(
            history.getCurrentLocation(),
            setupHashLister
        )
        history.listen((route)=>{
            app._route = route;
        })
    }
    match(location){
        return this.matcher.match(location);
    }
}
VueRouter.install = install