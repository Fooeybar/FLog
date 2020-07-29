const flog=(()=>{
    const flogname='flog.io';
    const io=function(_params={
        name:''
        ,readconsole:false
        ,writeconsole:true
        ,formatting:true
        ,prefix:'\> '
        ,nametag:''
        ,suffix:' \> '
        ,logtag:'\-\-'
        ,errtag:'\!\!'
        ,warntag:'\~\~'
        ,testtag:'\?\?'
        ,emitname:flogname
        ,save:100
        ,socket:undefined
        ,lock:true
    }){
        if(_params.name===undefined||_params.name==='')_params.name=flogname;
        if(_params.readconsole===undefined)_params.readconsole=false;
        else _params.readconsole=!!_params.readconsole;
        if(_params.writeconsole===undefined)_params.writeconsole=true;
        else _params.writeconsole=!!_params.writeconsole;
        if(_params.formatting===undefined)_params.formatting=true;
        else _params.formatting=!!_params.formatting;
        if(_params.prefix===undefined||_params.prefix==='')_params.prefix='\> ';
        if(_params.nametag===undefined||_params.nametag==='')_params.nametag=_params.name;
        if(_params.suffix===undefined||_params.suffix==='')_params.suffix=' \> ';
        if(_params.logtag===undefined||_params.logtag==='')_params.logtag='\-\-';
        if(_params.errtag===undefined||_params.errtag==='')_params.errtag='\!\!';
        if(_params.warntag===undefined||_params.warntag==='')_params.warntag='\~\~';
        if(_params.testtag===undefined||_params.testtag==='')_params.testtag='\?\?';
        if(_params.emitname===undefined||_params.emitname==='')_params.emitname=flogname;
        if(_params.save===undefined||!(_params.save instanceof Number))_params.save=100;
        if(_params.lock===undefined)_params.lock=true;
        else _params.lock=!!_params.lock;
        const params=_params;
        const conlog='console.log';
        let socket=params.socket;
        this.nametag=(()=>{params.nametag;})();
        this.logtag=(()=>{params.logtag;})();
        this.errtag=(()=>{params.errtag;})();
        this.warntag=(()=>{params.warntag;})();
        this.testtag=(()=>{params.testtag;})();
        if(params.readconsole){
            let Events=require('events');
            let emitter=new Events.EventEmitter();
            var fromconsole=false;
            if(console.flog===undefined){
                console.flog=[];
                console.defaultLog=console.log.bind(console);
                console.log=function(){
                    console.flog.length=0;
                    console.flog.push(Array.from(arguments));
                    console.defaultLog.apply(console,arguments);
                    emitter.emit(conlog,params.logtag);
                }
                console.defaultError=console.error.bind(console);
                console.error=function(){
                    console.flog.length=0;
                    console.flog.push(Array.from(arguments));
                    console.defaultError.apply(console,arguments);
                    emitter.emit(conlog,params.errtag);
                }
                console.defaultWarn=console.warn.bind(console);
                console.warn=function(){
                    console.flog.length=0;
                    console.flog.push(Array.from(arguments));
                    console.defaultWarn.apply(console,arguments);
                    emitter.emit(conlog,params.warntag);
                }
                console.defaultDebug=console.debug.bind(console);
                console.debug=function(){
                    console.flog.length=0;
                    console.flog.push(Array.from(arguments));
                    console.defaultDebug.apply(console,arguments);
                    emitter.emit(conlog,params.testtag);
                }
            }
            emitter.on(conlog,(_tag)=>{
                for(let i in console.flog){
                    fromconsole=true;
                    this.Print(console.flog[i],_tag,params);
                }
            });
        }
        if(params.save>0){
            var lines=[];
            var save=params.save>0?true:false;
            var saveformat=(params.formatting)?params.logtag+params.prefix:'';
            var PushPop=(line,_params)=>{
                let format=_params.formatting?_params.logtag+_params.prefix+_params.nametag+_params.suffix:saveformat;
                if(line!==undefined){
                    if(save){
                        if(lines.length+1>params.save)lines.splice(0,lines.length+1-params.save);
                        lines.push(format+line);
                    }
                }
                else if(lines.length>0){
                    if(socket!==undefined)socket.emit(params.emitname,lines);
                    lines.length=0;
                    save=false;
                }
            };
            PushPop('Begin '+params.name+' Save Dump',params);
        }
        let _Print=(_msg,_tag,_config)=>{
            let _config_={};
            if(_config===undefined)_config_={
                readconsole:!!_config.readconsole
                ,writeconsole:!!_config.writeconsole
                ,formatting:!!_config.formatting
                ,prefix:''+_config.prefix
                ,nametag:''+_config.nametag
                ,suffix:''+_config.suffix
                ,logtag:''+_config.logtag
                ,errtag:''+_config.errtag
                ,warntag:''+_config.warntag
                ,testtag:''+_config.testtag
                ,emitname:''+_config.emitname
                ,save:(_config.save instanceof Number)?_config.save:100
            };
            _config_.readconsole=!!_config.readconsole;
            _config_.writeconsole=!!_config.writeconsole;
            _config_.formatting=!!_config.formatting;
            _config_.prefix=''+_config.prefix;
            _config_.nametag=''+_config.nametag;
            _config_.suffix=''+_config.suffix;
            _config_.logtag=''+_config.logtag;
            _config_.errtag=''+_config.errtag;
            _config_.warntag=''+_config.warntag;
            _config_.testtag=''+_config.testtag;
            _config_.emitname=''+_config.emitname;
            _config_.save=(_config.save instanceof Number)?_config.save:100;
            if(fromconsole){
                PushPop(_msg,_config_);
                if(socket!==undefined)socket.emit(_config_.emitname,[_msg]);
                fromconsole=false;
            }
            else{
                let msg=_msg;
                if(_config_.formatting!==undefined&&_config_.formatting)msg=_tag+_config_.prefix+_config_.nametag+_config_.suffix+_msg;
                if(!params.readconsole){
                    PushPop(_msg,_config_);
                    if(socket!==undefined)socket.emit(_config_.emitname,[msg]);
                }
                if(_config_.writeconsole)console.log(msg);
                msg=undefined;
            }
        return};
        this.GetName=()=>''+params.name;
        this.GetParams=()=>{let temp=params;delete temp.socket;return temp;}
        this.Print=(_msg,_tag,_params)=>{
            if(_msg===undefined)_msg='empty Print()';
            if(_tag===undefined)_tag=params.logtag;
            if(_params===undefined)_params=params;
            _Print(_msg,_tag,_params);
        }
        this.SetSocket=(_socket,_tag)=>{
            if(_tag===undefined||!(_tag instanceof String))_tag=params.errtag;
            if(socket===undefined||!params.lock){
                socket=_socket;
                let testtags=params.formatting?_tag+params.prefix+this.GetName()+params.suffix:'';
                socket.emit(params.emitname,[testtags+'socket test message']);
                let tempmsg='socket set';
                if(params.lock)tempmsg+=' and locked';
                else tempmsg+=' and unlocked';
                _Print(tempmsg,_tag,params);
                PushPop('End '+params.name+' Socket-Init Package',params);
                PushPop(undefined,params);
                _Print('saved flog dumped to socket',_tag,params);
            }
            else _Print('socket locked',_tag);
        return;};
        this.AddChild=(_child,_params_)=>{
            if(_child instanceof flog.io){
                let old=_child.Print;
                _child.Print=function(_msg,_tag,_params){
                    if(_tag===undefined)_tag=params.logtag;
                    if(_params===undefined)_params=_params_;
                    if(_params===undefined)_params=params;
                    _params.writeconsole=true;
                    old(_msg,_tag,_params);
                    _params.writeconsole=false;
                   fromconsole=false;
                    _Print(_msg,_tag,_params);
                };
                _Print(params.name+'.AddChild('+_child.GetName()+')',params.warntag,params);
            }
            else _Print(params.name+'.AddChild() \>'+_child+' not '+flogname+' object',params.warntag,params.errtag);
        return;};
    };
return {io};
})();
module.exports=flog;