function FLog(_name='nameless :(',_socketable=false,_consol=false,_parent=false){
    let name=_name+' FLog';
    this.GetName=()=>{let temp=name;return temp;}
    let socketable=_socketable;
    let socket;
    let autosave=socketable;
    let consol=_consol;
    let fromconsole=false;
    let parent=_parent;
    let lines=['       **********//////////// Begin '+name+' Socket-Init Package \\\\\\\\\\\\\\\\\\\\\\\\**********'];

    if(_parent){
        this.BindChild=(_childlog)=>{
            if(_childlog!==undefined){
                _childlog.print=this.print.bind(_childlog.print);
            }
        };
    }

    let Print=function(_msg='',_lines=undefined){
        if(_lines===undefined)_lines=lines;
        if(_msg===''){_msg='---?? print test ??---';fromconsole=false;}
        if(autosave){
            if(consol)if(fromconsole)for(let i in _msg)_lines.push(_msg[i]);
            else if(!consol)_lines.push(_msg);
        }
        if(socketable&&socket!==undefined){
            if(!fromconsole)socket.emit(name,[_msg]);
        }
        if(!fromconsole){
            if(parent)console.log(_msg);
        }
        fromconsole=false;
    };
    
    if(socketable){
        this.SetSocket=(_socket)=>{
            if(socket===undefined){
                socket=_socket;
                let testmsg=['?? socket test message ??'];
                socket.emit(name,testmsg);
                Print();
                lines.push('       **********//////////// End '+name+' Socket-Init Package \\\\\\\\\\\\\\\\\\\\\\\\**********');
                socket.emit(name,lines);
                autosave=false;
            }
            else Print('       ~~~|| '+name+': socket previously set ||~~~');
        };
    }

    this.print=(_msg='---?? Log.print test ??---')=>{
            fromconsole=false;
            Print(_msg);
        };
    if(consol){
        console.everything=[];
        let printconsole=()=>{
            fromconsole=true;
            Print(console.everything);
            console.everything.length=0;
        };
        console.defaultLog=console.log.bind(console);
        console.log=function(){
            console.everything.push(Array.from(arguments));
            console.defaultLog.apply(console, arguments);
            printconsole();
        }
        console.defaultError=console.error.bind(console);
        console.error=function(){
            console.everything.push(Array.from(arguments));
            console.defaultError.apply(console, arguments);
            printconsole();
        }
        console.defaultWarn=console.warn.bind(console);
        console.warn=function(){
            console.everything.push(Array.from(arguments));
            console.defaultWarn.apply(console, arguments);
            printconsole();
        }
        console.defaultDebug=console.debug.bind(console);
        console.debug=function(){
            console.everything.push(Array.from(arguments));
            console.defaultDebug.apply(console, arguments);
            printconsole();
        }
    }

};
module.exports=FLog;

