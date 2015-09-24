module.exports = function ( app ) {
    //查看購物車商品
    app.get('/cart', function(req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "請重新登錄:"
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id,"cStatus":false}, function (error, docs) {
                res.render('cart',{carts:docs});
            });
        }
    });
    //添加購物車商品
    app.get("/addToCart/:id", function(req, res) {
       //req.params.id 获取商品ID号
        if(!req.session.user){
            req.session.error = "重新登錄:"
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,doc){
                //商品已存在 +1
                if(doc){
					
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 }},function(error,doc){
                        //成功返回1  失败返回0
						console.log(doc);
                        if(doc> 0){
                            res.redirect('/home');
						
                        }
                    });
                //商品未存在，添加
                }else{
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc) {
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cPrice: doc.price,
                                cImgSrc: doc.imgSrc,
                                cQuantity : 1
                            },function(error,doc){
                                if(doc){
                                    res.redirect('/home');
                                }
                            });
                        } else {

                        }
                    });
                }
            });
        }
    });

    //刪除購物車商品
    app.get("/delFromCart/:id", function(req, res) {
        //req.params.id獲取商品ID
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
			
            //成功返回1 失敗返回0
            if(doc){
				
                res.redirect('/cart');
            }
        });
    });

    //購物車結帳
    app.post("/cart/clearing",function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id":req.body.cid},{$set : { cQuantity : req.body.cnum,cStatus:true }},function(error,doc){
            //更新成功返回1  失敗返回0
            if(doc.ok > 0){
                res.send(200);
            }
        });
    });


}

