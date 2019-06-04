import { Dictionary } from "../Utils/Dictionary";

//观察者
export class Delegate {
    //回调
    private listener: Function = null;
    //上下文,调用者
    private caller: any = null;
    //回调参数
    private args: any[] = null;
    //调用这的名字
    private mCallerName: string = "";
    constructor(caller: any, listener: Function, ...args: any[]) {
        this.listener = listener;
        this.caller = caller;
        if (args) {
            this.args = args;
        }
    }
    //发送消息
    dispatch(...args: any[]): void {
        if (args) {
            this.args = args;
        }
        this.listener.call(this.caller, this.listener, this.callerName, this.args);
    }
    //比较上下文
    compare(caller): boolean {
        return this.caller == caller;
    }

    public set callerName(name: string) {
        this.mCallerName = name;
    }
    public get callerName(): string {
        return this.mCallerName;
    }
}

//事件处理管理
export class ListenerManager {
    //单例
    private static instance: ListenerManager = null;
    //存储当前所有的监听
    private mListeners: Dictionary<Delegate[]> = new Dictionary<Delegate[]>();

    public static getInstance(): ListenerManager {
        if (this.instance == null) {
            this.instance = new ListenerManager();
        }
        return this.instance;
    }
    //注册
    register(type: string, caller: any, listener: Function, ...args: any[]): void {
        cc.log("ListenerManager.register => className = %s", caller.getUrl());
        let delegates: Delegate[] = this.mListeners.get(type);
        if (!delegates) {
            delegates = [];
        }
        let delegate = new Delegate(caller, listener, ...args);
        //获取名字
        let path = type.split("/");
        let className = path[path.length - 1];
        delegate.callerName = className;
        delegates.push(delegate);

        this.mListeners.add(type, delegates);
    }
    //注册
    registerDelegate(type: string, delegate: Delegate): void {
        cc.log("ListenerManager.registerDelegate");
        let delegates: Delegate[] = this.mListeners.get(type);
        if (!delegates) {
            delegates = [];
        }
        //获取名字
        let path = type.split("/");
        let className = path[path.length - 1];
        delegate.callerName = className;
        delegates.push(delegate);

        this.mListeners.add(type, delegates);
    }
    //发送监听
    dispatch(type: string, ...args: any[]): void {
        let delegates: Delegate[] = this.mListeners.get(type);
        if (delegates == null || delegates.length <= 0) {
            cc.log("[ListenerManager]" + type + ": is empty!![function:dispatch]");
            return;
        }
        for (let i = 0; i < delegates.length; ++i) {
            let delegate = delegates[i];
            delegate.dispatch(...args);
        }
    }
    //删除指定的事件 
    remove(type: string, caller: any, listener: Function) {
        let delegates: Delegate[] = this.mListeners.get(type);
        if (delegates == null || delegates.length <= 0) {
            cc.log("[ListenerManager]" + type + ": is empty!![function:remove]");
            return;
        }
        for (let i = 0; i < delegates.length; ++i) {
            let delegate = delegates[i];
            if (delegate.compare(caller)) {
                delegates.splice(i, 1);
            }
        }
        if (delegates.length <= 0) {
            this.mListeners.remove(type);
        }
    }
    //删除所有监听
    removeAll() {
        cc.log("[ListenerManager] remove all listener");
        this.mListeners.clear();
    }
}