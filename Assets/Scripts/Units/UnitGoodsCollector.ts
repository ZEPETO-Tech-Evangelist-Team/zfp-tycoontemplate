import { Transform, WaitForSeconds } from "UnityEngine";
import Agent from "./Agent";
import Good from "../Goods/Good";
import GoodsManager, { GoodsStatus, GoodsType } from "../Goods/GoodsManager";
import Unit from "./Unit";

export default class UnitGoodsCollector extends Unit {
    public targetGoodType: GoodsType;
    public dockTransform: Transform;
    
    private agent: Agent;
    private goodInTransit: Good;
    
    Awake()
    {
        this.agent = this.GetComponent<Agent>();
        this.agent.onDestinationReached.AddListener(() => {
            this.GoodsAction();
        });
    }
    
    public UnitAction()
    {
        this.FindGood();
    }
    
    public FindGood()
    {
        this.goodInTransit = GoodsManager.GetInstance().GetNextAvailableGood(this.targetGoodType);
        
        
        //All goods have been delivered. Let's wait for the good to respawn.
        if (this.goodInTransit == undefined)
        {
            this.StartCoroutine(this.TryFindGoodAgain());
            console.log("Couldn't Find any Goods. Trying again in 2 secds");
        }
        //We've found a good to collect. Move to the target good.
        else
        {
            this.goodInTransit.MarkPickup();
            this.agent.SetTarget(this.goodInTransit.transform);
            console.log(`Found Good: ${this.goodInTransit.name}. Status: ${this.goodInTransit.status} Type: ${this.goodInTransit.type}`);
        }
    }
    
    //Called only when all goods of this unit's type have been collected. We'll wait one second before attempting another search. 
    public *TryFindGoodAgain()
    {
        yield new WaitForSeconds(2.0);
        this.FindGood();
    }
    
    public GoodsAction()
    {
        if (this.goodInTransit == undefined) {return;}
        
        switch(this.goodInTransit.status)
        {
            case GoodsStatus.MARKEDFORPICKUP:
                this.PickupGood(this.goodInTransit);
                break;
            case GoodsStatus.INTRANSIT:
                this.DeliverGood(this.goodInTransit);
                break;
        }
    }
    
    public PickupGood(good: Good)
    {
        good.Pickup(this.dockTransform);
        this.agent.SetTarget(GoodsManager.GetInstance().deliveryPointTransform);
    }
    
    public DeliverGood(good: Good)
    {
        good.Deliver();
        this.UnitAction();
    }

}