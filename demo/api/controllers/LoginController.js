/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    test: async function (req, res){
        
        
        // data = await req.body.name;
       // data= req.param("name");
       useremail= await req.body.email;

         // data= req.param("name");
         userpassword= await req.body.password;
         console.log(useremail,userpassword);
    //    password= await req.body.;

    var finn = await Login.findOne({
        email: useremail,
        password: userpassword
      });
      
      if (!finn) {
        res.render('404');
      }
      else {
        // as logged in
        res.me = finn;
        res.render('login/show');
      }
      
      User.generateUserToken(user, function (err, token) {
        if (err) return res.send(500);
        
        return res.send(token, 201);
    })
         
    }



};

