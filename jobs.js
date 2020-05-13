module.exports.jobs=function(){

const request= require('request')
const fs=require('fs')
const cheerio=require('cheerio')
let obj={'Jobs':[]}
 gcount=0;
 const PromiseMaker=new Promise(function(resolve,rej){
    request('https://www.studentscircles.com/it-jobs/',function(err,res,html){
    if(err==null && res.statusCode==200 )
    {
    //console.log("Page Fetched")
    ParsePost(html)
    }
    else if(res.statusCode==404)
    console.log("Page Not Found")
    else
    console.log(err)
     })

  function ParsePost(html)
{
   let d= cheerio.load(html)
    let posts= d(".td-block-span12")
   
   
   for(i=0;i<posts.length;i++)
   {
      
       JobTitle= d(posts[i]).find(".item-details h3 a").attr("title")
       JobLink=d(posts[i]).find(".item-details h3 a").attr("href")
        GoToJobLink(JobLink,JobTitle)
      
   }
   
   
}

function GoToJobLink(Url,Title)
{
    //console.log("Finding Job Link ")
  gcount++;
  //console.log(gcount)
   request(Url,function(err,res,html){
    if(err==null && res.statusCode==200 )
    {

        gcount--;
        let item={}
   // console.log("Job Page Fetched")
     let url= ParseJobPage(html)
    // console.log(url)
     if(url!=undefined){
     item.Title=Title
     item.url=url
     obj.Jobs.push(item)
     }
      
     //console.log(gcount)
     if(gcount==0){
     //console.log(obj)
     fs.writeFileSync("./metadata.json", JSON.stringify(obj))
     resolve("done")
     }
    }
    else if(res.statusCode==404)
    console.log("Page Not Found")
    else
    console.log(err)
    }) 
    
}
function ParseJobPage(html)
 {
  let d=cheerio.load(html)
  let urls=d(".rank-math-link")
  let url
  for(i=0;i<urls.length;i++){
   if(d(urls[i]).text()=="Click Here"){
   return d(urls[i]).attr("href")
  }
  }
}
 })
 return PromiseMaker;
}
