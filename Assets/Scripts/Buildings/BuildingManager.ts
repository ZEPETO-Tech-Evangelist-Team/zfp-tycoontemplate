import { GameObject, Resources, Transform } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GoodsManager from '../Goods/GoodsManager';
import PlayerManager from '../Player/PlayerManager';
import UIManager from '../UI/UIManager';
import JSONParser from '../Utils/JSONParser';
import Building from './Building';

export interface BuildingInfo
{
    prefabId: string,
    iconId: string,
    resourceCosts: number[][];
    prefabBuilding: GameObject;
    prefabIcon: GameObject;
}

interface BuildingData
{
    buildings: Map<string, BuildingInfo>;
}

export default class BuildingManager extends ZepetoScriptBehaviour {
    public static GetInstance(): BuildingManager
    {
        if (BuildingManager.instance == undefined)
        {
            BuildingManager.instance = GameObject.Find("BuildingManager").GetComponent<BuildingManager>();
        }

        return this.instance;
    }
    
    private static instance: BuildingManager;
    
    private data: BuildingData;
    
    private currentPreview: Transform;
    private buildingLevels: Map<string, number> = new Map<string, number>();
    
    Awake()
    {
        this.gameObject.name = "BuildingManager";
    }
    
    Start() {
        this.Initialize();
    }
    
    public Initialize()
    {
        this.LoadBuildings();
    }
    
    public LoadBuildings()
    {
        this.data = JSONParser.ParseJSON<BuildingData>("Configs/Buildings");

        this.data.buildings.forEach((info, prefabId) => {
            info.prefabBuilding = Resources.Load<GameObject>("Buildings/" + info.prefabId);
            info.prefabIcon = Resources.Load<GameObject>("Icons/" + info.iconId);
            
            this.buildingLevels.set(info.prefabId, 0);

            let button: Button = UIManager.GetInstance().AddBuilding(info);
            button.onClick.AddListener(() => { this.Preview(info.prefabId); });
        });
    }
    
    public Preview(id: string)
    {
        if (this.currentPreview != undefined) { GameObject.Destroy(this.currentPreview.gameObject); }
        
        let building: BuildingInfo = this.data.buildings.get(id);
        let dockPoint: Transform = PlayerManager.dockPoint;
        this.currentPreview = GameObject.Instantiate<GameObject>(building.prefabBuilding, dockPoint).transform;
        this.currentPreview.gameObject.name = id;
        UIManager.GetInstance().ShowPreview(true, building.resourceCosts[this.GetBuildingLevel(id)]);
    }
    
    public GetBuildingLevel(id: string): number
    {
        return this.buildingLevels.get(id);
    }
    
    public Build()
    {
        if (this.currentPreview == undefined) {return;}

        let id: string = this.currentPreview.gameObject.name;
        let info: BuildingInfo = this.data.buildings.get(id);
        let costs: number[] = info.resourceCosts[this.GetBuildingLevel(id)];
        
        if (!GoodsManager.GetInstance().CheckCost(costs)) 
        { 
            console.error("Not Enough Funds!");
            GameObject.Destroy(this.currentPreview.gameObject);
            UIManager.GetInstance().ShowPreview(false);
            this.currentPreview = undefined;
            return; 
        }
        
        this.currentPreview.SetParent(null);
        UIManager.GetInstance().ShowPreview(false);
        
        let building: Building = this.currentPreview.GetComponent<Building>();
        
        building.onBuild(info);
        let curLevel = this.buildingLevels.get(id);
        this.buildingLevels.set(id, curLevel + 1);
        GoodsManager.GetInstance().SpendCollectedCoods(costs);
        
        this.currentPreview = undefined;
    }
}