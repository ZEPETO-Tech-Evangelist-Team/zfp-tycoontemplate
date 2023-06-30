import { TextMeshProUGUI } from 'TMPro';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Transform} from "UnityEngine";
import GoodsManager, { GoodsType } from '../Goods/GoodsManager';
import BuildingManager, { BuildingInfo } from '../Buildings/BuildingManager';
import { Button } from 'UnityEngine.UI';
import { ScrollView } from 'UnityEngine.UIElements';
import { UnityAction$1, UnityEvent$1 } from 'UnityEngine.Events';

export default class UIManager extends ZepetoScriptBehaviour {
    public static GetInstance(): UIManager
    {
        if (UIManager.instance == undefined)
        {
            UIManager.instance = GameObject.Find("UIManager").GetComponent<UIManager>();
        }

        return this.instance;
    }

    private static instance : UIManager;
    
    public goods1Value: TextMeshProUGUI;
    public goods2Value: TextMeshProUGUI;
    public goods3Value: TextMeshProUGUI;
    public goods4Value: TextMeshProUGUI;

    public cost1Value: TextMeshProUGUI;
    public cost2Value: TextMeshProUGUI;
    public cost3Value: TextMeshProUGUI;
    public cost4Value: TextMeshProUGUI;
    
    public buildingScrollContent: Transform;
    
    public buildButton: Button;

    Awake()
    {
        this.gameObject.name = "UIManager";
    }
    
    Start()
    {
        this.UpdateUI();
        this.Initialize();
    }
    
    public Initialize()
    {
        this.buildButton.onClick.AddListener(() => {BuildingManager.GetInstance().Build();})
        this.ShowPreview(false);
    }
    
    public AddBuilding(buildingInfo: BuildingInfo): Button //, clickEvent: UnityAction$1<string> //TODO: Figure out why UnityAction Doesn't work. Hardcode for now.
    {
        let icon: Button = GameObject.Instantiate<GameObject>(buildingInfo.prefabIcon).GetComponent<Button>();
        icon.transform.SetParent(this.buildingScrollContent);
        return icon;
    }
    
    public UpdateUI()
    {
        let gm = GoodsManager.GetInstance();
        this.goods1Value.text = gm.GetCollectedGoodValue(GoodsType.TYPE1).toString();
        this.goods2Value.text = gm.GetCollectedGoodValue(GoodsType.TYPE2).toString();
        this.goods3Value.text = gm.GetCollectedGoodValue(GoodsType.TYPE3).toString();
        this.goods4Value.text = gm.GetCollectedGoodValue(GoodsType.TYPE4).toString();
    }
    
    public ShowPreview(b: bool, costs?: number[])
    {
        let gm = GoodsManager.GetInstance();
        this.buildButton.gameObject.SetActive(b);
        this.cost1Value.gameObject.SetActive(b);
        this.cost2Value.gameObject.SetActive(b);
        this.cost3Value.gameObject.SetActive(b);
        this.cost4Value.gameObject.SetActive(b);

        if (b && costs != undefined)
        {
            this.cost1Value.text = costs[0].toString();
            this.cost2Value.text = costs[1].toString();
            this.cost3Value.text = costs[2].toString();
            this.cost4Value.text = costs[3].toString();
        }
        
    }

}