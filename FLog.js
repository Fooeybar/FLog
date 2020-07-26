function FLog(_name='nameless :(',_writeconsole=false,_readconsole=false){
    let name=_name+' FLog';
    this.GetName=()=>{let temp=name;return temp;}
    let socket;
    let autosave=true;
    let readconsole=!!_readconsole;
    let fromconsole=false;
    let writeconsole=!!_writeconsole;
    let lock=false;
    let lines=['**********//////////// Begin '+name+' Socket-Init Package \\\\\\\\\\\\\\\\\\\\\\\\**********'];

    let Print=(_msg='---?? print test ??---')=>{
            if(autosave){
                if(readconsole)if(fromconsole)for(let i in _msg)lines.push(_msg[i]);
                else if(!readconsole)lines.push(_msg);
            }
            if(!fromconsole){
                if(socket!==undefined)socket.emit(name,[_msg]);
                if(writeconsole)console.log(_msg);
            }
            fromconsole=false;
        };

    if(readconsole){
        console.flog=[];
        let printconsole=()=>{
            fromconsole=true;
            Print(console.flog);
            console.flog.length=0;
        };
        console.defaultLog=console.log.bind(console);
        console.log=function(){
            console.flog.push(Array.from(arguments));
            console.defaultLog.apply(console,arguments);
            printconsole();
        }
        console.defaultError=console.error.bind(console);
        console.error=function(){
            console.flog.push(Array.from(arguments));
            console.defaultError.apply(console,arguments);
            printconsole();
        }
        console.defaultWarn=console.warn.bind(console);
        console.warn=function(){
            console.flog.push(Array.from(arguments));
            console.defaultWarn.apply(console,arguments);
            printconsole();
        }
        console.defaultDebug=console.debug.bind(console);
        console.debug=function(){
            console.flog.push(Array.from(arguments));
            console.defaultDebug.apply(console,arguments);
            printconsole();
        }
    }

    this.SetSocket=(_socket,_lock=false)=>{
        lock=!!_lock;
        if(socket===undefined||(_socket!==undefined&&!lock)){
            socket=_socket;
            let testmsg=['?? socket test message ??'];
            socket.emit(name,testmsg);
            Print();
            lines.push('       **********//////////// End '+name+' Socket-Init Package \\\\\\\\\\\\\\\\\\\\\\\\**********');
            socket.emit(name,lines);
            autosave=false;
        }
        else Print('       ~~~|| '+name+': socket locked ||~~~');
    };

    this.AddChild=(_child)=>{
        if(_child instanceof FLog)_child.print=this.Print.bind(_child.print);
    };
    
    this.Print=(_msg='---?? Log.print test ??---')=>{
        fromconsole=false;
        Print(_msg);
    };

};
module.exports=FLog;

