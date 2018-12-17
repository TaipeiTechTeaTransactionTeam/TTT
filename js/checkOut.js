function isDebug()
{
    return location.hash.search("debug")!==-1;
}
var Nawa=Nawa||{};
Nawa.Class=Nawa.Class||{};
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
    constructor()
    {

    }
    set quantity(val)
    {
        
    }
}
/**
 * @class ProductCartView
 * 作為checkout頁面上方列表中一個tuple所有html Element的管理物件
 */
Nawa.Class.ProductCartView=
class ProductCartView
{
    constructor(cartItem,number)
    {
        this.createFields();
        this.addClasses();
        this.moneySymbol="$";
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
$(
    function()
    {
        if(isDebug())
        {
            var tb=document.querySelector("tbody");
            for(var i in paypal.minicart.cart.items())
                tb.append((new Nawa.Class.ProductCartView(paypal.minicart.cart.items()[i],i)).display);
        }
    }
);
