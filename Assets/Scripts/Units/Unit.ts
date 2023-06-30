import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Agent from './Agent';

export enum UnitType
{
    GoodsCollector
}

export default abstract class Unit extends ZepetoScriptBehaviour {
    public type: UnitType;
    
    public abstract UnitAction();
}