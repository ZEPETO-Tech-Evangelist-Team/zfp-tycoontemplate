import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Unit from '../Units/Unit';
import UnitGoodsCollector from '../Units/UnitGoodsCollector';
import { BuildingInfo } from './BuildingManager';

export default class Building extends ZepetoScriptBehaviour {
    public unitPrefab: GameObject;
    
    private unit: Unit;
    private info: BuildingInfo;
    
    public onBuild(info: BuildingInfo)
    {
        this.info = info;
        this.unit = GameObject.Instantiate<GameObject>(this.unitPrefab, this.transform.position, this.transform.rotation).GetComponent<UnitGoodsCollector>();
        this.unit.UnitAction();
    }

}