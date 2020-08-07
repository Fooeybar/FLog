const flog=(()=>{
    const flogname='flog.io';
    const dir=__dirname+'/'+flogname;
    const arrow=' >> ';
    const fs=require('fs');
    fs.mkdir(dir,(err)=>{});
    const io=function(
        _config={
            name:typeof 'string'
            ,writeconsole:typeof 'boolean'
            ,readconsole:typeof 'boolean'
            ,sockets:typeof 'object'
            ,emitname:typeof 'string'
            ,parents:typeof 'object'
            ,children:typeof 'object'
            ,logfile:typeof 'boolean'
        }){
        //==================================================================================================================
        this.print=function(){
            let arr=Array.from(arguments);
            _print(arr,false);
            for(let i in this.config.parents){
                for(let j=0;j<arr.length;j++){this.config.parents[i].print(arr[j]);}
            }
        };
        this.addsocket=(_socket)=>{
            if(typeof _socket.emit==='undefined'){this.print(_socket,'^emit: not found');return false;}
            if(typeof _socket.emit!=='function'){this.print(_socket,'^emit: not a function');return false;}
            for(let i=0;i<this.config.sockets.length;i++){
                if(this.config.sockets[i]===_socket){
                    this.print(this.config.name+'.addsocket()'+arrow+'duplicate socket');
                    return false;
                }
            }
            if(!send('test message',true,_socket)){return false;}
            this.config.sockets.push(_socket);
            return true;
        };
        this.removesocket=(_socket)=>{
            if(!arrdel(this.config.sockets,_socket)){this.print(this.config.name+'.removesocket(\''+_socket+'\')'+arrow+'not found');return false;}
            return true;
        };        
        this.addchild=(_child)=>{
            if(_child===this){this.print(this.config.name+'.addchild(\''+this.config.name+'\')'+arrow+'cannot be child of itself');return false;}
            if(!isflog(_child,'addchild')){return false;}
            if(related(_child,'addchild')){this.print(this.config.name+'.addchild(\''+_child.config.name+'\')'+arrow+'already relatives');return false;}
            this.config.children.push(_child);
            _child.config.parents.push(this);
            _child.config.writeconsole=false;
            return true;
        };
        this.addparent=(_parent)=>{
            if(_parent===this){this.print(this.config.name+'.addparent(\''+this.config.name+'\')'+arrow+'cannot be parent of itself');return false;}
            if(!isflog(_parent,'addparent'))return false;
            if(related(_parent,'addparent')){this.print(this.config.name+'.addparent(\''+_parent.config.name+'\')'+arrow+'already relatives');return false;}
            this.config.parents.push(_parent);
            _parent.config.children.push(this);
            this.config.writeconsole=false;
            return true;
        };
        this.removechild=(_child)=>{
            if(!isflog(_child,'removechild')){return false;}
            let cdel=arrdel(this.config.children,_child);
            let pdel=arrdel(_child.config.parents,this);
            if(!cdel&&!pdel){
                this.print(this.config.name+'.removechild(\''+_child.config.name+'\')'+arrow+'not found');
                return false;
            }
            if(_child.config.parents.length===0){_child.config.writeconsole=_child.config.writeinit;}
            return true;
        };
        this.removeparent=(_parent)=>{
            if(!isflog(_parent,'removeparent')){return false;}
            let pdel=arrdel(this.config.parents,_parent);
            let cdel=arrdel(_parent.config.children,this);
            if(!pdel&&!cdel){
                this.print(this.config.name+'.removeparent(\''+_parent.config.name+'\')'+arrow+'not found');
                return false;
            }
            if(this.config.parents.length===0){this.config.writeconsole=this.config.writeinit;}
            return true;
        };
        //===================================================
        let isflog=(_obj,_func)=>{
            if(!(_obj instanceof io)){
                if(_func!==undefined){this.print(this.config.name+'.'+_func+'(\''+_obj.constructor.name+'\')'+arrow+'not instance of '+flogname);}
                return false;
            }
            return true;
        };
        let related=(_relative,_func)=>{
            let ancestor=(_rel,_arr)=>{
                for(let i=0;i<_arr.length;i++){
                    if(_arr[i]===_rel){return true;}
                    if(ancestor(_rel,_arr[i].config.parents)){return true;}
                }
                return false;
            };
            let descendant=(_rel,_arr)=>{
                for(let i=0;i<_arr.length;i++){
                    if(_arr[i]===_rel){return true;}
                    if(descendant(_rel,_arr[i].config.children)){return true;}
                }
                return false;
            };
            if(ancestor(_relative,this.config.parents)||descendant(_relative,this.config.children)){return true;}
            return false;
        };
        let send=(_msg,test,sock)=>{
            let emit=(socket,msg)=>{
                try{socket.emit(this.config.emitname,msg);return true;}
                catch(err){this.print(err);return false;}
            };
            if(test){return emit(sock,_msg);}
            for(let s=0;s<this.config.sockets.length;s++){
                if(typeof(_msg)==='object'){
                    let temp='{';
                    for(let i in _msg){temp+=(typeof(_msg[i])==='function')?(' '+i+': function,'):(' '+i+': '+_msg[i]+',');}
                    temp=temp.slice(0,temp.length-1);
                    temp+=' }';
                    emit(this.config.sockets[s],temp);
                }
                else{emit(this.config.sockets[s],_msg);}
            }
        };
        let _print=(_input,_fromconsole)=>{
            try{
                if(typeof(_input)==='undefined'){_input='---empty print---';}
                if(typeof(_fromconsole)!=='boolean'){_fromconsole=false;}  
                for(let i in _input){
                    if(!this.config.readconsole){
                        if(this.config.writeconsole){console.log(_input[i]);}
                        send(_input[i]);
                        file(_input[i]);
                    }
                    else{
                        if(this.config.writeconsole){
                            if(!_fromconsole){console.log(_input[i]);}
                            else{send(_input[i]);file(_input[i]);}
                        }
                        else{send(_input[i]);file(_input[i]);}
                    }
                }
            }
            catch(err){console.log(err,this.config.name+'.print() error > check arguments:',arguments);}
        };
        let arrdel=(_arr,_obj)=>{
            for(let i=0;i<_arr.length;i++){
                if(_arr[i]===_obj){
                    _arr.splice(i,1);
                    return true;
                }
            }
            return false;
        };
        let file=(_msg='empty call',_new=false)=>{
            if(!this.config.logfile){return false;}
            if(file.nme===undefined){file.nme=dir+'/'+this.config.name+'-'+Date.now()+'.txt';}
            if(_new){
                try{fs.appendFile(file.nme,'['+Date.now()+']'+arrow+'------new '+flogname+' log------',(_err)=>{if(_err){this.print(err);}});return true;}
                catch(err){this.print(err);return false;}
            }
            fs.appendFile(file.nme,'\n['+Date.now()+']'+_msg,(err)=>{if(err){this.print(err);}});
        };
        //==================================================================================================================
        this.config={};

        if(_config.name===undefined||typeof _config.name!=='string')Object.defineProperty(this.config,'name',{value:flogname,enumerable:true,writable:false});
        else Object.defineProperty(this.config,'name',{value:_config.name,enumerable:true,writable:false});

        if(_config.writeconsole===undefined||typeof _config.writeconsole!=='boolean')Object.defineProperty(this.config,'writeconsole',{value:true,enumerable:true,writable:true});
        else Object.defineProperty(this.config,'writeconsole',{value:_config.writeconsole,enumerable:true,writable:false});
        Object.defineProperty(this.config,'writeinit',{value:this.config.writeconsole,enumerable:true,writable:false});

        if(_config.readconsole===undefined||typeof _config.readconsole!=='boolean')Object.defineProperty(this.config,'readconsole',{value:false,enumerable:true,writable:false});
        else Object.defineProperty(this.config,'readconsole',{value:_config.readconsole,enumerable:true,writable:false});

        if(_config.sockets===undefined||!(Array.isArray(_config.sockets)))Object.defineProperty(this.config,'sockets',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(this.config,'sockets',{value:_config.sockets,enumerable:true,writable:true});

        if(_config.emitname===undefined||typeof _config.emitname!=='string')Object.defineProperty(this.config,'emitname',{value:flogname,enumerable:true,writable:false});
        else Object.defineProperty(this.config,'emitname',{value:_config.emitname,enumerable:true,writable:false});

        if(_config.parents===undefined||!(Array.isArray(_config.parents)))Object.defineProperty(this.config,'parents',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(this.config,'parents',{value:_config.parents,enumerable:true,writable:true});

        if(_config.children===undefined||!(Array.isArray(_config.children)))Object.defineProperty(this.config,'children',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(this.config,'children',{value:_config.children,enumerable:true,writable:true});

        if(_config.logfile===undefined||typeof _config.logfile!=='boolean')Object.defineProperty(this.config,'logfile',{value:false,enumerable:true,writable:false});
        else Object.defineProperty(this.config,'logfile',{value:_config.logfile,enumerable:true,writable:false});

        if(this.config.readconsole){
            try{
                let oldlog=console.log;
                console.log=function(){
                    oldlog.apply(this,arguments);
                    _print(_msg=Array.from(arguments),true);
                }
                let olderr=console.error;
                console.error=function(){
                    olderr.apply(console,arguments);
                    _print(Array.from(arguments),true);
                }
                let oldwarn=console.warn;
                console.warn=function(){
                    oldwarn.apply(console,arguments);
                    _print(Array.from(arguments),true);
                }
                let olddeb=console.debug;
                console.debug=function(){
                    olddeb.apply(console,arguments);
                    _print(Array.from(arguments),true);
                }
            }
            catch(err){this.print(err);}
        }
        if(this.config.sockets.length>0){
            try{
                let socks=this.config.sockets;
                this.config.sockets=[];
                for(let i=0;i<socks.length;i++){this.addsocket(socks[i]);}
                delete socks;
            }
            catch(err){this.print(err);}
        }
        if(this.config.parents.length>0){
            try{
                let rents=this.config.parents;
                this.config.parents=[];
                for(let i=0;i<rents.length;i++){this.addparent(rents[i]);}
                delete rents;
            }
            catch(err){this.print(err);}
        }
        if(this.config.children.length>0){
            try{
                let kids=this.config.children;
                this.config.children=[];               
                for(let i=0;i<kids.length;i++){this.addchild(kids[i]);}
                delete kids;
            }
            catch(err){this.print(err);}
        }
        if(this.config.logfile){
            file(undefined,true);
        }
    };
return{io};})();
module.exports=flog;


