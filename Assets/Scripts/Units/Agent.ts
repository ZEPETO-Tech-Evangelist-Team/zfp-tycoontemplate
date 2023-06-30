import { Transform } from "UnityEngine";
import { NavMeshAgent, NavMeshPathStatus } from "UnityEngine.AI";
import { UnityEvent } from "UnityEngine.Events";
import {ZepetoScriptBehaviour} from "ZEPETO.Script";
import AgentManager from "./AgentManager";

export default class Agent extends ZepetoScriptBehaviour  {
    public moveSpeed: number = 1;
    
    @HideInInspector() public navigation: NavMeshAgent;
    @HideInInspector() public onDestinationReached : UnityEvent;
    
    private _isMoving : boolean = false;
    
    public get isMoving(): boolean
    {
        return this.navigation.remainingDistance <= this.navigation.stoppingDistance;
    }
    
    public Awake()
    {
        this.navigation = this.GetComponent<NavMeshAgent>();
        AgentManager.GetInstance().AddAgent(this);
    }
    
    public SetTarget(target: Transform)
    {
        this.navigation.SetDestination(target.position);
        this._isMoving = true;
    }
    
    public Update()
    {
        if (this._isMoving && this.navigation.remainingDistance <= this.navigation.stoppingDistance)
        {
            this._isMoving = false;
            this.onDestinationReached.Invoke();
        }
    }
}