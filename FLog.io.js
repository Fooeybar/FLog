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
                for(let i in self.config.parents){
                    for(let j=0;j<arr.length;j++){self.config.parents[i](arr[j]);}
                }
            }
            catch(err){console.log(err,self.config.name+'.print() error > check arguments:',arguments);}
        };
        this.addsocket=(_socket)=>{
            if(typeof _socket.emit==='undefined')this.print(_socket,'^emit: not found');
            else if(typeof _socket.emit==='function'){
                for(let i=0;i<this.config.sockets.length;i++){
                    if(this.config.sockets[i]===_socket){
                        this.print(this.config.name+'.addsocket() ->',_socket,'^duplicate socket');
                        return;
                    }}
                try{if(send('test message',true,_socket))this.config.sockets.push(_socket);}
                catch(err){this.print(err);}
            }
            else this.print(_socket,'^emit: not a function');
        };
        this.addchild=(_child)=>{
            if(_child instanceof flog.io){
                if(!family(_child)){
                    _child.config.writeconsole=false;
                    _child.config.parents.push(this.print);
                    this.config.children.push(_child);
                }
                else{this.print(_child,'^already a child');}
            }
            else this.print(this.config.name+'.addchild() ->',_child,'^not an instance of '+flogname);
        };
        this.addparent=(_parent)=>{
            if(_parent instanceof flog.io){
                if(!family(_parent)){
                    this.config.writeconsole=false;
                    this.config.parents.push(_parent.print);
                    _parent.config.children.push(this);
                }
                else{this.print(_parent,'^already a parent');}
            }
            else this.print(this.config.name+'.addparent() ->',_parent,'^not an instance of '+flogname);
        };
        this.remove=(_obj)=>{
            if(_removesocket(_obj)){return;}
            if(_removechild(_obj)){return;}
            if(_removeparent(_obj)){return;}
            {this.print(this.config.name+'.remove() ->',_obj,'^not found');}
        };
        //===================================================
        let _removesocket=(_socket)=>{
            for(let i=0;i<this.config.sockets.length;i++){
                if(this.config.sockets[i]===_socket){
                    this.config.sockets.splice(i,1);
                    return true;
                }
            }
            return false;
        };
        let _removechild=(_child)=>{
            for(let i=0;i<this.config.children.length;i++){
                if(this.config.children[i]===_child){
                    this.config.children.splice(i,1);
                    if(_child.config.parents.length===0)_child.config.writeconsole=true;
                    return true;
                }
            }
            return false;
        };
        let _removeparent=(_parent)=>{
            for(let i=0;i<this.config.parents.length;i++){
                if(this.config.parents[i]===_parent){
                    this.config.parents.splice(i,1);
                    if(this.config.parents.length===0){this.config.writeconsole=true;}
                    return true;
                }
            }
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
        };
        let family=(obj)=>{
            for(let i=0;i<this.config.children.length;i++)if(this.config.children[i]===obj){return true;}
            for(let i=0;i<this.config.parents.length;i++)if(this.config.parents[i]===obj){return true;}
            return false;
        };
        //==================================================================================================================
        let newconfig={};
        if(_config.name===undefined||typeof _config.name!=='string')Object.defineProperty(newconfig,'name',{value:flogname,enumerable:true,writable:false});
        else Object.defineProperty(newconfig,'name',{value:_config.name,enumerable:true,writable:false});

        if(_config.writeconsole===undefined||typeof _config.writeconsole!=='boolean')Object.defineProperty(newconfig,'writeconsole',{value:true,enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'writeconsole',{value:_config.writeconsole,enumerable:true,writable:false});

        if(_config.readconsole===undefined||typeof _config.readconsole!=='boolean')Object.defineProperty(newconfig,'readconsole',{value:false,enumerable:true,writable:false});
        else Object.defineProperty(newconfig,'readconsole',{value:_config.readconsole,enumerable:true,writable:false});

        if(_config.sockets===undefined||typeof _config.sockets!=='object')Object.defineProperty(newconfig,'sockets',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'sockets',{value:_config.sockets,enumerable:true,writable:true});

        if(_config.emitname===undefined||typeof _config.emitname!=='string')Object.defineProperty(newconfig,'emitname',{value:flogname,enumerable:true,writable:false});
        else Object.defineProperty(newconfig,'emitname',{value:_config.emitname,enumerable:true,writable:false});

        if(_config.parents===undefined||typeof _config.parents!=='object')Object.defineProperty(newconfig,'parents',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'parents',{value:_config.parents,enumerable:true,writable:true});

        if(_config.children===undefined||typeof _config.children!=='object')Object.defineProperty(newconfig,'children',{value:[],enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'children',{value:_config.children,enumerable:true,writable:true});

        this.config=newconfig;
        delete newconfig;
        const self=this;

        if(this.config.readconsole){
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
        if(this.config.sockets.length>0){
            let socks=this.config.sockets;
            this.config.sockets=[];
            for(let i=0;i<socks.length;i++){this.addsocket(socks[i]);}
        }
        if(this.config.children.length>0){
            let kids=this.config.children;
            this.config.children=[];
            for(let i=0;i<kids.length;i++){this.addchild(kids[i]);}
        }
        if(this.config.parents.length>0){
            let rents=this.config.parents;
            this.config.parents=[];
            for(let i=0;i<rents.length;i++){this.addparent(rents[i]);}
        }
    };
return{io};})();
module.exports=flog;
module.exports.default=flog;