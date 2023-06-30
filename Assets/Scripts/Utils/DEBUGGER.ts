import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Input, KeyCode, Transform} from "UnityEngine";
import Agent from '../Units/Agent';
import Unit from '../Units/Unit';
import UnitGoodsCollector from '../Units/UnitGoodsCollector';

export default class DEBUGGER extends ZepetoScriptBehaviour {
    @Header("Goods Collector Unit Debugging")
    public units: GameObject[];
    public spawnPosition : Transform;
    
    public GetRandomUnit() : UnitGoodsCollector
    {
        let rand : number = Math.floor(Math.random() * this.units.length);
        let unit : UnitGoodsCollector = GameObject.Instantiate<GameObject>(this.units[rand], this.spawnPosition.position, this.spawnPosition.rotation).GetComponent<UnitGoodsCollector>();
        return unit;
    }
    
    Start() {    

    }

    public SpawnUnit()
    {
        let unit: Unit = this.GetRandomUnit();
        unit.UnitAction();
    }

    Update()
    {
        if(Input.GetKeyDown(KeyCode.F))
        {
            this.SpawnUnit();
        }
    }
}