import { createContext,ReactNode,useContext,useState } from "react";
import {ShoppingCart} from "../components/ShoppingCart"
import {useLocalStorage} from "../hooks/useLocalStorage"
type ShoppingCartProviderProps={
    children:ReactNode
}

type CartItem={
    id:number
    quantity:number
}

type ShoppingCartContext={
    openCart:()=>void
    closeCart:()=>void
    getItemQuantity:(id:number)=>number
    IncreaseCartQuantity:(id:number)=>void
    decreaseCartQuantity:(id:number)=>void
    removeFromCart:(id:number)=>void
    CartQuantity:number
    cartItems:CartItem[]
}

const ShoppingCartContext = createContext({} as 
    ShoppingCartContext)

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

export function ShoppingCartprovider({children}:
    ShoppingCartProviderProps){
        const [cartItems,setCartItems]=useLocalStorage<CartItem[]>("shopping-cart",[])
        const [isOpen,setIsopen]=useState(false);
const openCart = () =>setIsopen(true)
const closeCart = () =>setIsopen(false)

const CartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )

        function getItemQuantity(id:number){
            return cartItems.find(item=>item.id===id)?.quantity || 0
        }

        function IncreaseCartQuantity(id:number){
            setCartItems(currItems=>{
                if(currItems.find(item=>item.id===id)==null){
                    return [...currItems, {id,quantity:1}]
                } else {
                    return currItems.map(item =>{
                        if(item.id === id){
                            return {...item, quantity: item.quantity + 1}
                        }  else {
                            return item
                        }
                    })
                }
            })
        }

        function decreaseCartQuantity(id:number){
            setCartItems(currItems=>{
                if(currItems.find(item=>item.id===id)?.quantity ===1){
                    return currItems.filter(item => item.id!=id)
                } else {
                    return currItems.map(item =>{
                        if(item.id === id){
                            return {...item, quantity: item.quantity - 1}
                        }  else {
                            return item
                        }
                    })
                }
            })
        }

        function removeFromCart(id:number){
           setCartItems(currItems => {
        return currItems.filter(item => item.id !==id)
    })
        }

        return (
        <ShoppingCartContext.Provider value={{getItemQuantity,IncreaseCartQuantity,
            decreaseCartQuantity,removeFromCart
            ,cartItems,CartQuantity,
            openCart,
            closeCart}}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>

        )
    }