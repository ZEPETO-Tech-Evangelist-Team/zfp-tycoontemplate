import {Renderer, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GoodsManager, {GoodsStatus, GoodsType } from './GoodsManager';

export default class Good extends ZepetoScriptBehaviour {
    public type: GoodsType;
    public status: GoodsStatus;
    
    public value: number = 1;
    public respawnTime: number = 3.0;
    public goodRenderer: Renderer;
    
    private startingPos: Vector3;
    
    Awake()
    {
        this.Initialize();
    }
    
    Update()
    {
        
    }
    
    public Initialize()
    {
        this.status = GoodsStatus.READY;
        this.startingPos = this.transform.position;
        GoodsManager.GetInstance().AddGood(this);
    }
    
    public OnDestroy()
    {
        GoodsManager.GetInstance().RemoveGood(this);
    }
    
    public MarkPickup()
    {
        this.status = GoodsStatus.MARKEDFORPICKUP;
    }
    
    public Pickup(dock: Transform)
    {
        //ParentObject to Docking Point
        this.transform.SetParent(dock, true);
        this.status = GoodsStatus.INTRANSIT;
    }
    
    public Deliver()
    {
        //Parent object to GoodsManager
        this.transform.SetParent(GoodsManager.GetInstance().transform);
        this.status = GoodsStatus.DELIVERED;
        this.goodRenderer.gameObject.SetActive(false);
        GoodsManager.GetInstance().CollectGood(this);
        this.StartCoroutine(this.Respawn());
    }
    
    public *Respawn()
    {
        yield new WaitForSeconds(this.respawnTime);
        //Play RespawnAnimation
        this.status = GoodsStatus.READY;
        this.transform.position = this.startingPos;
        this.goodRenderer.gameObject.SetActive(true);
    }
}