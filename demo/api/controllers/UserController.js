/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    new: async function (req, res){
    
        // data = await req.body.name;
       // data= req.param("name");
       
  User.find(function(err,result) {
   // console.log(res);
   var list=[];
    for(let i=0;i<result.length;i++)
    {
     list.push(result[i].name);
     console.log(result[i].name);
    }
    return res.render( 'user/new'  ,{status: true,data:list}) ; 
  });
 
     
}
};

