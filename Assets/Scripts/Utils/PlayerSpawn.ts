import { Transform } from 'UnityEngine';
import {SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WorldService } from 'ZEPETO.World'

export default class PlayerSpawn extends ZepetoScriptBehaviour {
    Start() {    
        let spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawnInfo, true);
    }

}