import {Collider, GameObject, Input, KeyCode, Renderer, Transform } from 'UnityEngine'
import { NavMeshAgent } from 'UnityEngine.AI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import genUniqueId from '../Utils/UniqueIDGenerator';
import Agent from './Agent';

export default class AgentManager extends ZepetoScriptBehaviour {
    public static GetInstance(): AgentManager
    {
        if (AgentManager.instance == undefined)
        {
            AgentManager.instance = GameObject.Find("AgentManager").GetComponent<AgentManager>();
        }
        
        return this.instance;
    }
    
    private spawnedAgents: Map<string, Agent> = new Map<string, Agent>();
    
    private static instance : AgentManager;
    
    Awake() {    
        this.gameObject.name = "AgentManager";
    }
    
    public AddAgent(agent: Agent)
    {
        agent.gameObject.name = genUniqueId();
        this.spawnedAgents.set(agent.name, agent);
        return agent;
    }

    public RemoveAgent(agent: Agent)
    {
        this.spawnedAgents.delete(agent.name);
        return agent;
    }
}