/**
 * @function isDebug
 * 在網址後方加入#debug 判斷為True
 * 
 */
function isDebug()
{
    return location.hash.search("debug")!==-1;
}
var Nawa=Nawa||{};
Nawa.Class=Nawa.Class||{};
/*
  採用miniCart標準
  amount = 價格
  quantity = 數量
  total = 單項總價
 */

/**
 * 結算總管物件
 * @Class CheckOut
 *  
 */
Nawa.Class.CheckOut=
class CheckOut
{
    constructor(cart)
    {
        this.cart=cart;
        this.cartTable=new Nawa.Class.ShoppingCartTable();
        this.checkoutList=new Nawa.Class.CheckOutList(cart);
        this.checkoutList.updateTotal();
        this.layoutSetup();
        this.productItems=[];
       // this.number=1;
        for(var cartItem of this.items)
        {
            this.append(cartItem);
            //this.number++;
        }
        this.cart.on("remove",this.onRemove,this);
        this.onViewsChange();

    }
    onRemove()
    {
        this.onChange();
        this.onViewsChange();
    }
    onAdd()
    {
        this.onChange();
        this.onViewsChange();
    }
    onChange()
    {
        this.checkoutList.updateTotal();
    }
    onViewsChange()
    {
        if(this.items.length==0)
        {
            this.checkoutList.title="快去逛逛吧....";
            this.cartTable.hide();
        }
            
        if(this.items.length>=1)
        {
            this.checkoutList.title="結算";
            this.cartTable.show();
        }
            
    }
    append(cartItem)
    {
       // i=typeof i === "undefined"?this.number:i;
        var product=new Nawa.Class.CheckOutProduct(cartItem,new Nawa.Class.ProductCartView(cartItem/*,this.number*/),new Nawa.Class.ProductCheckView(cartItem));
        product.closeOnclick=(sender)=>{this.removeItem(sender);sender.cartView.remove();sender.checkView.remove();}
        var that = this;
        product.onChange=()=>this.onChange();
        this.productItems.push(product);
        this.cartTable.display.append(product.cartView.display);
        this.checkoutList.append(product.checkView.display);
        this.onViewsChange();
    }
    layoutSetup()
    {
        this.rigthDisplay=document.querySelector(".checkout-right");
        this.rigthDisplay.innerHTML="";
        this.leftDisplay=document.querySelector(".checkout-left");
        this.rigthDisplay.append(this.cartTable.display);
        this.rigthDisplay.append(this.cartTable.emptyDisplay);
        this.leftDisplay.prepend(this.checkoutList.display);
    }
    removeItem(item)
    {
        if(typeof item==="undefined")return;
        switch(item.constructor.name)
        {
            case "CheckOutProduct":
                item=item.cartItem;
            break;
            case "c":
            default:
        }
        this.cart.remove(this.items.indexOf(item));
    }
    get items()
    {
        return this.cart.items();
    }
}
/**
 * 購物車表格
 */
Nawa.Class.ShoppingCartTable=
class ShoppingCartTable
{
    constructor()
    {
        this.createElements();
        this.display.classList.add("timetable_sub");
        this.emptyText="這裡空空如也...";
        this.hide();
    }
    createElements()
    {
        this.display=document.createElement("table");
        this.display.innerHTML=
        `<thead>
            <tr>	
                <th>商品</th>
                <th>數量</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th>刪除</th>
            </tr>
        </thead>`;
        this.display.append(this.bodyDisplay=document.createElement("tbody"));
        this.emptyDisplay=document.createElement("div");
    }
    show()
    {this.visible=true;}
    hide()
    {
        this.visible=false;
    }
    set emptyText(val)
    {
        this.emptyDisplay.innerHTML=val;
    }
    get emptyText()
    {
        return this.emptyDisplay.innerHTML;
    }
    set visible(val)
    {
        if(val!==this.visible)
        {
            if(val)
            {
                this.display.classList.remove("d-none");
                this.emptyDisplay.classList.add("d-none");
            }
            else
            {
                this.display.classList.add("d-none");
                this.emptyDisplay.classList.remove("d-none");
            }
        }
    }
    get visible()
    {
        return !this.display.classList.contains("d-none");
    }
    
}
/**
 * 結算清單的列表Html管理物件
 */
Nawa.Class.CheckOutList=
class CheckOutList
{
    constructor(cart)
    {
        this.totalObject=new Nawa.Class.ProductCheckView({name:"總額",total:0});
        this.createElements();
        this.display.classList.add("checkout-left-basket");
        this.cart=cart;
    }
    get total()
    {
        return this.cart.total();
    }
    set total(val)
    {
        this.totalObject.total=val;
    }
    set title(val)
    {
        this.titleDisplay.innerText=val;
    }
    get title()
    {
        return this.titleDisplay.innerText;
    }
    updateTotal()
    {
        this.total=this.total;
    }
    append(display)
    {
        this.listDisplay.insertBefore(display,this.totalObject.display);
    }
    createElements()
    {
        this.display=document.createElement("div");
        this.display.append
        (
            this.titleDisplay=document.createElement("h4"),
            this.listDisplay=document.createElement("ul")
        );
        this.listDisplay.append(this.totalObject.display);
    }
    
}
/**
 * 單個物品的關聯、處理(model)
 */
Nawa.Class.CheckOutProduct=
class CheckOutProduct
{
    constructor(cartItem,cartView,checkView)
    {
        this.cartItem=cartItem;
        this.cartView=cartView;
        this.checkView=checkView;
        this.cartItem.on("change",()=>{this.onChange();this.updateViews();});
        this.cartView.closeOnclick=()=>{this.closeOnclick(this);}
        this.cartView.plusOnclick=()=>{this.quantity++;};
        this.cartView.minusOnclick=()=>{this.quantity>=1?this.quantity--:"nothing";}
    }
    closeOnclick(product){}
    onChange()
    {
    }
    removeViews()
    {
        this.cartView.remove();
        this.checkView.remove();
    }
    updateViews()
    {
        this.cartView.attrFromCartItem(this.cartItem);
        this.checkView.attrFromCartItem(this.cartItem);
    }
    set quantity(val)
    {
        this.cartItem.set("quantity",val);
    }
    get quantity()
    {
        return this.cartItem.get("quantity");
    }
}
/**
 * @class ProductCartView
 * 作為checkout頁面上方列表中一個tuple所有html Element的管理物件
 */
Nawa.Class.ProductCartView=
class ProductCartView
{
    constructor(cartItem,/*number,*/moneySymbol="NT$")
    {
        this.createFields();
        this.addClasses();
        this.moneySymbol=moneySymbol;
        this.addEventListeners();
        this.attrFromCartItem(cartItem);
        //this.number=number||1;
    }
    attrFromCartItem(cartItem)
    {
        if(typeof cartItem==="undefined")
            return;
        this.name=cartItem.get("item_name")||"no name";
        this.quantity=cartItem.get("quantity")||"1";
        this.imgSrc=cartItem.get("imgSrc");
        this.amount=cartItem.total();
    }
    addEventListeners()
    {
        this.plusButton.addEventListener("click",()=>this.plusOnclick());
        this.minusButton.addEventListener("click",()=>this.minusOnclick());
        this.closeButton.addEventListener("click",()=>{this.closeOnclick()});
    }
    plusOnclick(){}
    minusOnclick(){}
    closeOnclick(){}
    createFields()
    {
        this.display=document.createElement("tr");
        this.display.append
        (
           // this.numField=document.createElement("td"),
            this.createImageField(),
            this.createQuantityField(),
            this.nameField=document.createElement("td"),
            this.amoutField=document.createElement("td"),
            this.createCloseField()
        );
    }
    addClasses()
    {
        for(var td of this.display.cells)
            td.classList.add("invert");
        this.addImageClass();
        this.addQuantityClass();
        this.addCloseClass();
    }
    createQuantityField()
    {
        this.quantityField=document.createElement("td");
        var quantitySelect=document.createElement("div");
        this.minusButton=document.createElement("div");
        this.quantityDisplay=document.createElement("div");
        this.plusButton=document.createElement("div");
        this.quantityField.append(quantitySelect);
        quantitySelect.append(this.minusButton,this.quantityDisplay,this.plusButton);
        return this.quantityField;
    }
    addQuantityClass()
    {
        this.quantityField.querySelector("div").classList.add("quantity-select");
        this.minusButton.classList.add("entry","value-minus");
        this.plusButton.classList.add("entry","value-plus");
        this.quantityDisplay.classList.add("entry","value");
    }
    createImageField()
    {
        this.imageField=document.createElement("td");
        this.imageField.append(this.imageLink=document.createElement("a"));
        this.imageLink.append(this.image=document.createElement("img"));
        return this.imageField;
    }
    addImageClass()
    {
        this.imageField.classList.remove("invert");
        this.imageField.classList.add("invert-image");
        this.image.classList.add("img-responsive");
    }
    createCloseField()
    {
        this.closeField=document.createElement("td");
        var container=document.createElement("div");
        this.closeField.append(container);
        container.append(this.closeButton=document.createElement("div"));
        return this.closeField;
    }
    addCloseClass()
    {
        this.closeField.querySelector("div").classList.add("rem");
        this.closeButton.classList.add("closeBtn");
    }
    set imgSrc(val)
    {
        this.image.src=val;
    }
    get imgSrc()
    {
        return this.image.src;
    }
    set imgLink(val)
    {
        this.imageLink.href=val;
    }
    get imgLink()
    {
        return this.imageLink.href;
    }
    set quantity(val)
    {
        this.quantityDisplay.innerText=val>0?val:this.quantityDisplay.innerText;
    }
    get quantity()
    {
        return parseInt(this.quantityDisplay.innerText);
    }
    set amount(val)
    {
        this._amount=val;
        this.amoutField.innerText=this.moneySymbol+val;
    }
    get amount()
    {
        return parseFloat(this._amount);
    }
    /*set number(val)
    {
        this.numField.innerText=val;
    }*/
    // get number()
    // {
    //     return parseInt(this.numField.innerText);
    // }
    set name(val)
    {
        this.nameField.innerText=val;
    }
    get name()
    {
        return this.nameField.innerText;
    }
    remove()
    {
        this.display.remove();
    }
}
/**
 * @class ProductCheckView
 * 結算清單中每個項目的Html管理物件
 */
Nawa.Class.ProductCheckView=
class ProductCheckView
{
    constructor(inputItem,moneySymbol="NT$")
    {
        this.moneySymbol=moneySymbol;
        this.createElements();
        this.attrFromInputItem(inputItem);
    }
    attrInput(name,total)
    {
        this.name=name||"no name";
        this.total=total||0;
    }
    attrFromInputItem(inputItem)
    {
        if(typeof inputItem=="undefined")
            return;
        if(inputItem.constructor.name==="c")//inputCartItem
            this.attrFromCartItem(inputItem);
        if(inputItem.name)
            this.attrInput(inputItem.name,inputItem.total);
    }
    attrFromCartItem(cartItem)
    {
        if(typeof cartItem==="undefined")
            return;
        this.attrInput(cartItem.get("item_name"),cartItem.total());
    }
    createElements()
    {
        this.display=document.createElement("li");
        var i=document.createElement("i");
        i.innerText='-';
        this.display.append
        (
            this.nameDisplay=document.createTextNode(""),
            i,
            this.totalDisplay=document.createElement("span")
        );
    }
    get name()
    {
        return this.nameDisplay.data;
    }
    set name(val)
    {
        this.nameDisplay.data=val;
    }
    get total()
    {
        return this._amount;
    }
    set total(val)
    {
        this._total=val;
        this.totalDisplay.innerText=this.moneySymbol+val;
    }
    remove()
    {
        this.display.remove();
    }
}
$(
    function()
    {
        if(isDebug())
        {

        }
        checkOut=new Nawa.Class.CheckOut(paypal.minicart.cart);
    }
);
