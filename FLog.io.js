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
        const self=this;
        let newconfig={};
        
        if(_config.name===undefined||typeof _config.name!=='string')Object.defineProperty(newconfig,'name',{value:flogname,enumerable:true,writable:false});
        else Object.defineProperty(newconfig,'name',{value:_config.name,enumerable:true,writable:false});
        
        if(_config.writeconsole===undefined||typeof _config.writeconsole!=='boolean')Object.defineProperty(newconfig,'writeconsole',{value:true,enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'writeconsole',{value:_config.writeconsole,enumerable:true,writable:false});
        
        if(_config.readconsole===undefined||typeof _config.readconsole!=='boolean')Object.defineProperty(newconfig,'readconsole',{value:false,enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'readconsole',{value:_config.readconsole,enumerable:true,writable:false});
        
        if(_config.sockets===undefined||typeof _config.sockets!=='object')Object.defineProperty(newconfig,'sockets',{value:[],enumerable:true,writable:true});
        else{
            let arr=[];
            for(let i in _config.sockets){
                if(typeof _config.sockets[i].sockets.emit==='function'){arr.push(_config.sockets[i]);}
                else{console.log(_config.sockets[i],'^not a valid socket > emit is not a function');}
            }
            Object.defineProperty(newconfig,'sockets',{value:arr,enumerable:true,writable:true});
        }

        if(_config.emitname===undefined||typeof _config.emitname!=='string')Object.defineProperty(newconfig,'emitname',{value:flogname,enumerable:true,writable:true});
        else Object.defineProperty(newconfig,'emitname',{value:_config.emitname,enumerable:true,writable:false});
        
        if(_config.parents===undefined||typeof _config.parents!=='object')Object.defineProperty(newconfig,'parents',{value:[],enumerable:true,writable:true});
        else{
            let arr=[];
            for(let i in _config.parents){
                if(_config.parents[i] instanceof io){arr.push(_config.parents[i]);}
                else{console.log(_config.parents[i],'^not an instance of '+flogname);}
            }
            Object.defineProperty(newconfig,'parents',{value:arr,enumerable:true,writable:true});
        }

        if(_config.children===undefined||typeof _config.children!=='object')Object.defineProperty(newconfig,'children',{value:[],enumerable:true,writable:true});
        else{
            let arr=[];
            for(let i in _config.children){
                if(_config.children[i] instanceof io){arr.push(_config.children[i]);}
                else{console.log(_config.children[i],'^not an instance of '+flogname);}
            }
            Object.defineProperty(newconfig,'children',{value:arr,enumerable:true,writable:true});
        }

        this.config=newconfig;
        delete newconfig;
        //==================================================================================================================
        let send=(_msg)=>{
            for(let s=0;s<this.config.sockets.length;s++){
                if(typeof(_msg)==='object'){
                    let temp='{';
                    for(let i in _msg){
                        if(typeof(_msg[i])==='function'){temp+=' '+i+': function,';}
                        else {temp+=' '+i+': '+_msg[i]+',';}
                    }
                    temp=temp.slice(0,temp.length-1);
                    temp+=' }';
                    this.config.sockets[s].emit(this.config.emitname,temp);
                }
                else{this.config.sockets[s].emit(this.config.emitname,_msg);}
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
            try{
                if(typeof _socket.emit==='function'){
                    this.config.sockets.push(_socket);
                    this.print('socket set');
                }
                else this.print(_socket,'^not a valid socket > emit is not a function');
            }
            catch(err){console.log(err);}
        };
        let family=(obj)=>{
            for(let i in this.config.children)if(i===obj)return true;
            for(let i in this.config.parents)if(i===obj)return true;
        };
        this.addchild=(_child)=>{
            if(_child instanceof flog.io){
                if(!family(_child)){
                    _child.config.writeconsole=false;
                    _child.config.parents.push(this.print);
                }
            }
            else this.print(this.config.name+'.add() ->',_child,'^not an instance of '+flogname);
        };
        this.addparent=(_parent)=>{
            if(_parent instanceof flog.io){
                if(!family(_parent)){
                    this.config.writeconsole=false;
                    this.config.parents.push(_parent.print);
                }
            }
            else this.print(this.config.name+'.add() ->',_parent,'^not an instance of '+flogname);
        };
        //==================================================================================================================
        if(this.config.readconsole){
            let oldlog=console.log;console.log=function(){oldlog.apply(this,arguments);_print(_msg=Array.from(arguments),true);}
            let olderr=console.error;console.error=function(){olderr.apply(console,arguments);_print(Array.from(arguments),true);}
            let oldwarn=console.warn;console.warn=function(){oldwarn.apply(console,arguments);_print(Array.from(arguments),true);}
            let olddeb=console.debug;console.debug=function(){olddeb.apply(console,arguments);_print(Array.from(arguments),true);}
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