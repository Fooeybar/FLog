const flog=(()=>{
    const flogname='flog.io';
    const io=function(
        _config={
            name:typeof 'string'
            ,writeconsole:typeof 'boolean'
            ,readconsole:typeof 'boolean'
            ,sockets:typeof 'object'
            ,emitname:typeof 'string'
            ,parents:typeof 'object'
            ,children:typeof 'object'          
        }){
        //==================================================================================================================
        this.print=function(){
            try{
                let arr=Array.from(arguments);
                _print(arr,false);
                for(let i in this.config.parents){
                    for(let j=0;j<arr.length;j++){this.config.parents[i].print(arr[j]);}
                }
            }
            catch(err){console.log(err,this.config.name+'.print() error > check arguments:',arguments);}
        };
        this.addsocket=(_socket)=>{
            try{
                if(typeof _socket.emit==='undefined'){this.print(_socket,'^emit: not found');return false;}
                if(typeof _socket.emit!=='function'){this.print(_socket,'^emit: not a function');return false;}
                if(family(this.config.sockets,_socket,'add')){
                    this.print(this.config.name+'.addsocket() -> duplicate socket');
                    return false;
                }
                send('test message',true,_socket);
            }
            catch(err){this.print(err);}
        };
        this.addchild=(_child)=>{
            try{
                if(_child===this){this.print(this.config.name+'.addchild(\''+this.config.name+'\') -> cannot be child of itself');return false;}
                if(!(_child instanceof flog.io)){this.print(this.config.name+'.addchild(',_child,') -> not an instance of '+flogname);return false;}
                if(family(this.config.parents,_child)){this.print(this.config.name+'.addchild(\''+_child.config.name+'\') -> already a parent');return false;}
                if(family(_child.config.children,this)){this.print(_child.config.name+'.addparent(\''+this.config.name+'\') -> already a child');return false;}
                if(family(this.config.children,_child,'add')){this.print(this.config.name+'.addchild(\''+_child.config.name+'\') -> already a child');return false;}
                if(family(_child.config.parents,this,'add')){this.print(_child.config.name+'.addparent(\''+this.config.name+'\') -> already a parent');return false;}
                _child.config.writeconsole=false;
                return true;
            }
            catch(err){this.print(err);}
        };
        this.addparent=(_parent)=>{
            try{
                if(_parent===this){this.print(this.config.name+'.addparent(\''+this.config.name+'\') -> cannot be parent of itself');return false;}
                if(!(_parent instanceof flog.io)){this.print(this.config.name+'.addparent(',_parent,') -> not an instance of '+flogname);return false;}
                if(family(this.config.children,_parent)){this.print(this.config.name+'.addparent(\''+_parent.config.name+'\') -> already a child');return false;}
                if(family(_parent.config.parents,this)){this.print(_parent.config.name+'.addparent(\''+this.config.name+'\') -> already a parent');return false;}
                if(family(this.config.parents,_parent,'add')){this.print(this.config.name+'.addparent(\''+_parent.config.name+'\') -> already a parent');return false;}
                if(family(_parent.config.children,this,'add')){this.print(_parent.config.name+'.addparent(\''+this.config.name+'\') -> already a child');return false;}
                this.config.writeconsole=false;
                return true;
            }
            catch(err){this.print(err);}
        };
        this.removesocket=(_socket)=>{
            try{
                if(!family(this.config.sockets,_socket,'delete')){this.print(this.config.name+'.removesocket(\''+''+'\') -> socket not found');return false;}
                return true;
            }
            catch(err){this.print(err);}
        };
        this.removechild=(_child)=>{
            try{
                if(typeof(_child)==='undefined'){return false;}
                if(!(_child instanceof io)){this.print(this.config.name+'.removechild(',_child,') -> not an instance of '+flogname);return false;}
                if(!family(this.config.children,_child,'delete')){this.print(this.config.name+'.removeparent(\''+_child.config.name+'\') -> child not found');}
                if(!family(_child.config.parents,this,'delete')){this.print(this.config.name+'.removeparent(\''+_child.config.name+'\') -> parent not found');}
                if(_child.config.parents.length===0){_child.config.writeconsole=_child.config.writeinit;}
                return true;
            }
            catch(err){this.print(err);}
        };
        this.removeparent=(_parent)=>{
            try{
                if(typeof(_parent)==='undefined'){return false;}
                if(!(_parent instanceof io)){this.print(this.config.name+'.removeparent(',_parent,') -> not an instance of '+flogname);return false;}
                if(!family(_parent.config.children,this,'delete')){this.print(this.config.name+'.removeparent(\''+_parent.config.name+'\') -> child not found');}                
                if(!family(this.config.parents,_parent,'delete')){this.print(this.config.name+'.removeparent(\''+_parent.config.name+'\') -> parent not found');}
                if(this.config.parents.length===0){this.config.writeconsole=this.config.writeinit;}
                return true;
            }
            catch(err){this.print(err);}
        };
        //===================================================
        let family=(arr,_obj,mod='')=>{
            try{
                for(let i=0;i<arr.length;i++){
                    if(arr[i]===_obj){
                        if(mod==='return'){return arr[i];}
                        if(mod==='delete'){arr.splice(i,1);}
                        return true;
                    }
                }
                if(mod==='add'){arr.push(_obj);}
                return false;
            }
            catch(err){this.print(err);}
        };
        let send=(_msg,test,sock)=>{
            let emit=(socket,msg)=>{
                try{socket.emit(this.config.emitname,msg);return true;}
                catch(err){this.print(err);return false;}
            };
            if(test){return emit(sock,_msg);}
            try{
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
            }
            catch(err){this.print(err);}
        };
        let _print=(_input,_fromconsole)=>{
            try{
                if(typeof(_input)==='undefined'){_input='---empty print---';}
                if(typeof(_fromconsole)!=='boolean'){_fromconsole=false;}  
                for(let i in _input){
                    if(!this.config.readconsole){
                        if(this.config.writeconsole){console.log(_input[i]);send(_input[i]);}
                        else{send(_input[i]);}
                    }
                    else{
                        if(this.config.writeconsole){
                            if(!_fromconsole){console.log(_input[i]);}
                            else{send(_input[i]);}
                        }
                        else{send(_input[i]);}
                    }
                }
            }
            catch(err){this.print(err);}
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

    };
return{io};})();
module.exports=flog;