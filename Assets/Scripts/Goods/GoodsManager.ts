import {GameObject, Transform, WaitForSeconds} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Good from './Good';
import UIManager from '../UI/UIManager';

export enum GoodsType
{
    TYPE1 = 0,
    TYPE2 = 1,
    TYPE3 = 2,
    TYPE4 = 3,
    MAX = 4
}

export enum GoodsStatus
{
    READY,
    MARKEDFORPICKUP,
    INTRANSIT,
    DELIVERED,
    MAX
}

export default class GoodsManager extends ZepetoScriptBehaviour {
    public static GetInstance(): GoodsManager
    {
        if (GoodsManager.instance == undefined)
        {
            GoodsManager.instance = GameObject.Find("GoodsManager").GetComponent<GoodsManager>();
        }

        return this.instance;
    }
    
    public deliveryPointTransform: Transform;
    
    private goodsMap: Map<GoodsType, Good[]> = new Map<GoodsType, Good[]>();
    private collectedGoods: Map<GoodsType, number> = new Map<GoodsType, number>();

    private static instance : GoodsManager;
    
    Awake()
    {
        this.gameObject.name = "GoodsManager";
        this.Initialize();
    }
    
    private Initialize()
    {
        for (let i = 0; i < GoodsType.MAX; i++)
        {
            this.collectedGoods.set(i as GoodsType, 0);
            //this.goodsMap.set(i as GoodsType, new Array<Good>());
        }
    }
    
    //All Goods in scene are initialized and added to this map in their respective Awake Functions.
    public AddGood(good: Good)
    {
        //If our map does not have the key for the good type, the array will not be initialized. 
        //Let's initialize the array here. 
        if (!this.goodsMap.has(good.type))
        {
            this.goodsMap.set(good.type, new Array<Good>());
        }
        
        //We'll cache the goods list for readability. 
        //Its good practice not to keep accessing the map unless necessary. 
        let goodsList = this.goodsMap.get(good.type);
        
        //Right now, all we need to do with this list is add the new good to it, but we have 
        //the cached list in case we need to add anything else to this function. 
        goodsList.push(good);

        //We'll parent the Goods to this transform so that we can keep track of goods in the scene more easily.
        good.transform.SetParent(this.transform, true);
    }

    public RemoveGood(good: Good)
    {
        if (!this.goodsMap.has(good.type))
        {
            return;
        }

        let goodsList = this.goodsMap.get(good.type);
        if (goodsList.includes(good))
        {
            let index = goodsList.indexOf(good);
            goodsList.splice(index,1);
        }
    }
    
    public CheckCost(amount: number[]): boolean
    {
        let check: boolean = false;
        for (let i = 0; i < GoodsType.MAX; i++)
        {
            check = (this.collectedGoods.get(i as GoodsType) >= amount[i]);
            if (!check) break;
        }
        
        return check;
    }
    
    public GetCollectedGoodValue(type: GoodsType): number
    {
        return this.collectedGoods.get(type);
    }
    
    public SpendCollectedCoods(amount: number[])
    {
        for (let i = 0; i < GoodsType.MAX; i++)
        {
            let curValue = this.collectedGoods.get(i as GoodsType);
            curValue -= amount[i];
            this.collectedGoods.set(i as GoodsType, Math.max(0, curValue));
        }
        
        UIManager.GetInstance().UpdateUI();
    }
    
    public CollectGood(good: Good)
    {
        let value: number = this.collectedGoods.get(good.type);
        this.collectedGoods.set(good.type, value + good.value);
        UIManager.GetInstance().UpdateUI();
    }
    
    public GetGoodByType(type: GoodsType): Good[]
    {
        if (!this.goodsMap.has(type))
        {
            return;
        }

        return this.goodsMap.get(type);
    }
    
    public GetNextAvailableGood(type: GoodsType)
    {
        let goodList = this.GetGoodByType(type);
        let foundGood: Good = undefined;
        
        for (let i = 0; i < goodList.length; i++)
        {
            if (goodList[i].status == GoodsStatus.READY)
            {
                foundGood = goodList[i];
                break;
            }
        }
        
        return foundGood;
    }
}