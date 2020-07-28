const flog=(()=>{
    const flogname='flog.io';
    const io=function(config={
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
        ,lock:false
    }){
        if(config.name===undefined||config.name==='')config.name=flogname;
        if(config.readconsole===undefined)config.readconsole=false;
        else config.readconsole=!!config.readconsole;
        if(config.writeconsole===undefined)config.writeconsole=true;
        else config.writeconsole=!!config.writeconsole;
        if(config.formatting===undefined)config.formatting=true;
        else config.formatting=!!config.formatting;
        if(config.prefix===undefined||config.prefix==='')config.prefix='\> ';
        if(config.nametag===undefined||config.nametag==='')config.nametag=config.name;
        if(config.suffix===undefined||config.suffix==='')config.suffix=' \> ';
        if(config.logtag===undefined||config.logtag==='')config.logtag='\-\-';
        if(config.errtag===undefined||config.errtag==='')config.errtag='\!\!';
        if(config.warntag===undefined||config.warntag==='')config.warntag='\~\~';
        if(config.testtag===undefined||config.testtag==='')config.testtag='\?\?';
        if(config.emitname===undefined||config.emitname==='')config.emitname=flogname;
        if(config.save===undefined||!(config.save instanceof Number))config.save=100;
        if(config.lock===undefined)config.lock=false;
        else config.lock=!!config.lock;

        let params=config;
        let socket=config.socket;
        this.nametag=params.nametag;
        this.logtag=params.logtag;
        this.errtag=params.errtag;
        this.warntag=params.warntag;
        this.testtag=params.testtag;
        
        if(params.save>0){
            var lines=[];
            var save=params.save>0?true:false;
            var saveformat=(params.formatting)?params.logtag+params.prefix:'';
            var PushPop=(line,_params)=>{
                let format=_params.formatting?_params.logtag+_params.prefix:saveformat;
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
            let _params={};
            if(_config===undefined)_params.readconsole=false;
            else _params.readconsole=!!_config.readconsole;
            if(_config===undefined)_params.writeconsole=false;
            else _params.writeconsole=!!_config.writeconsole;
            if(_config===undefined)_params.formatting=false;
            else _params.formatting=!!_config.formatting;
            if(_config===undefined)_params.prefix='\> ';
            else _params.prefix=_config.prefix;
            if(_config===undefined)_params.nametag=params.nametag;
            else _params.nametag=_config.nametag;
            if(_config===undefined)_params.suffix=' \> ';
            else _params.suffix=_config.suffix;
            if(_config===undefined)_params.logtag='\-\-';
            else _params.logtag=_config.logtag;
            if(_config===undefined)_params.errtag='\!\!';
            else _params.errtag=_config.errtag;
            if(_config===undefined)_params.warntag='\~\~';
            else _params.warntag=_config.warntag;
            if(_config===undefined)_params.testtag='\?\?';
            else _params.testtag=_config.testtag;
            if(_config===undefined)_params.emitname=params.emitname;
            else _params.emitname=_config.emitname;
            if(_config===undefined)_params.save=params.save;
            else _params.save=(_config.save instanceof Number)?_config.save:100;
            let msg=_msg;
            let preformmsg=_tag+_params.prefix+_params.nametag+_params.suffix+_msg;
            if(_params.readconsole){
                if(fromconsole){
                    PushPop(msg,_params);
                    if(socket!==undefined)socket.emit(_params.emitname,[_params.formatting?preformmsg:msg]);
                    fromconsole=false;
                }
                else{
                    if(_params.formatting)msg=preformmsg;
                    if(_params.writeconsole)console.log(msg);
                }
            }
            else{
                if(_params.formatting)msg=preformmsg;
                PushPop(msg,_params);
                if(socket!==undefined)socket.emit(_params.emitname,[msg]);
                if(_params.writeconsole)console.log(msg);
            }
        return};

        this.GetName=()=>''+params.name;
        this.GetParams=()=>params;
        this.SetSocket=(_socket,_tag=params.errtag)=>{
            if(socket===undefined||!params.lock){
                socket=_socket;
                let testtags=params.formatting?_tag+params.prefix+this.GetName()+params.suffix:'';
                socket.emit(params.emitname,[testtags+'socket test message']);
                _Print('socket set',_tag);
                PushPop('End '+params.name+' Socket-Init Package',params);
                PushPop(undefined,params);
                _Print('saved flog dumped to socket',_tag);
            }
            else _Print('socket locked',_tag);
        return;};

        this.AddChild=(_child,_params)=>{
            if(_child instanceof flog.io){
                let _config=_params!==undefined?_params:params;
                _child.Print=(_msg='Log.print()',_tag=params.logtag,_params=params)=>{this.Print(_msg,_tag,_child.GetParams());}
                _Print(params.name+'.AddChild('+_child.GetName()+')',params);
            }
            else _Print(params.name+'.AddChild() \>'+_child+' not '+flogname+' object',params.errtag);
        return;};
        this.Print=(_msg='Log.print()',_tag=params.logtag,_params=params)=>_Print(_msg,_tag,_params);
        



        
        if(params.readconsole){
            var fromconsole=false;
            if(console.flog===undefined)console.flog=[];
            let printconsole=(_tag)=>{
                console.flog.length=0;
                fromconsole=true;
                for(let i in console.flog)_Print(console.flog[i],_tag);

            };
            console.defaultLog=console.log.bind(console);
            console.log=function(){
                if(console.flog===undefined){
                    console.flog.push(Array.from(arguments));
                    console.defaultLog.apply(console,arguments);
                }
                printconsole(params.logtag);
            }
            console.defaultError=console.error.bind(console);
            console.error=function(){
                console.flog.push(Array.from(arguments));
                console.defaultError.apply(console,arguments);
                printconsole(params.errtag);
            }
            console.defaultWarn=console.warn.bind(console);
            console.warn=function(){
                console.flog.push(Array.from(arguments));
                console.defaultWarn.apply(console,arguments);
                printconsole(params.warntag);
            }
            console.defaultDebug=console.debug.bind(console);
            console.debug=function(){
                console.flog.push(Array.from(arguments));
                console.defaultDebug.apply(console,arguments);
                printconsole(params.testtag);
            }
        }




        


    };
return {io};
})();
module.exports=flog;
