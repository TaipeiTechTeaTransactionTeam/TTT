function isDebug()
{
    return location.hash.search("debug")!==-1;
}
var Nawa=Nawa||{};
Nawa.Class=Nawa.Class||{};
/**
 * 採用miniCart標準
 * amount = 價格
 * quantity = 數量
 * total = 單項總價
 */
Nawa.Class.CheckOut=
class CheckOut
{
    constructor(miniCart)
    {
        this.miniCart=miniCart;
        this.cart=this.miniCart.cart;
    }
    get items()
    {
        return this.cart.items();
    }
}
Nawa.Class.CheckOutProduct=
class CheckOutProduct
{
    constructor(cartItem,cartView,checkView)
    {
        this.cartItem=cartItem;
        this.cartItem.on("change",updateViews);
        this.cartItem.on("destroy",removeViews);
        this.cartView=cartView;
        this.checkView=checkView;
        this.cartView.closeOnclick=()=>this.cartItem.destroy();
        this.
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
    constructor(cartItem,number,moneySymbol="$")
    {
        this.createFields();
        this.addClasses();
        this.moneySymbol=moneySymbol;
        this.addEventListeners();
        this.attrFromCartItem(cartItem);
        this.number=number||1;
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
        this.closeButton.addEventListener("click",()=>this.closeOnclick());
    }
    plusOnclick(){}
    minusOnclick(){}
    closeOnclick(){}
    createFields()
    {
        this.display=document.createElement("tr");
        this.display.append
        (
            this.numField=document.createElement("td"),
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
    set number(val)
    {
        this.numField.innerText=val;
    }
    get number()
    {
        return parseInt(this.numField.innerText);
    }
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
    constructor(inputItem,moneySymbol="$")
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
            var tb=document.querySelector("tbody");
            var calList=document.getElementById("test");
            for(var i in paypal.minicart.cart.items())
            {
                var item=paypal.minicart.cart.items()[i];
                tb.append((new Nawa.Class.ProductCartView(item,i)).display);
                calList.append((new Nawa.Class.ProductCheckView(item)).display);
            }
            calList.append((new Nawa.Class.ProductCheckView({name:"總金額",total:paypal.minicart.cart.total()})).display);
                
        }
    }
);
